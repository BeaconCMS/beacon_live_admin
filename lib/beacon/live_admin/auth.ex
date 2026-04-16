defmodule Beacon.LiveAdmin.Auth do
  @moduledoc """
  Authorization context for Beacon LiveAdmin.

  Provides user management and permission-based access control via groups
  and individual grants. Authentication is delegated to the host application
  via a callback behaviour.

  ## Authentication Callback

  The host app must implement the `current_user/1` callback and configure it:

      config :beacon_live_admin,
        auth_provider: MyApp.BeaconAuth

      defmodule MyApp.BeaconAuth do
        @behaviour Beacon.LiveAdmin.Auth

        @impl true
        def current_user(conn) do
          case conn.assigns[:current_user] do
            nil -> nil
            user -> %{email: user.email, name: user.name}
          end
        end
      end

  LiveAdmin matches the returned email against `beacon_users` for permission lookup.
  If no `auth_provider` is configured, LiveAdmin runs without authentication
  (all access granted — suitable for development only).

  ## Permission Model

    * **Owner** — Single platform-wide account with unrestricted access.
    * **Groups** — Site-scoped permission bundles. Users inherit all group permissions.
    * **Individual grants** — Per-user permissions for fine-grained control.
    * **Group templates** — Owner-defined defaults copied into new sites.
  """

  import Ecto.Query

  alias Beacon.LiveAdmin.Auth.Group
  alias Beacon.LiveAdmin.Auth.GroupPermission
  alias Beacon.LiveAdmin.Auth.Owner
  alias Beacon.LiveAdmin.Auth.Permissions
  alias Beacon.LiveAdmin.Auth.User
  alias Beacon.LiveAdmin.Auth.UserGroup
  alias Beacon.LiveAdmin.Auth.UserPermission

  # ---------------------------------------------------------------------------
  # Behaviour
  # ---------------------------------------------------------------------------

  @doc """
  Returns the current authenticated user from the connection.

  Must return a map with at least `:email` (used to match against
  `beacon_users`), or `nil` if not authenticated.

  Optional fields: `:name`, `:avatar_url`.
  """
  @callback current_user(Plug.Conn.t()) :: %{email: String.t()} | nil

  @doc """
  Returns the configured auth provider module, or nil if none configured.
  """
  def auth_provider do
    Application.get_env(:beacon_live_admin, :auth_provider)
  end

  @doc """
  Gets the current Beacon user from a connection using the configured auth provider.

  Returns the `Beacon.LiveAdmin.Auth.User` struct if the
  authenticated email matches a pre-provisioned user, or `nil`.
  """
  def get_current_user(conn) do
    case auth_provider() do
      nil ->
        nil

      provider ->
        case provider.current_user(conn) do
          %{email: email} when is_binary(email) ->
            get_user_by_email(email)

          _ ->
            nil
        end
    end
  end

  # ---------------------------------------------------------------------------
  # Repo Helper
  # ---------------------------------------------------------------------------

  defp repo do
    site = Beacon.Registry.running_sites() |> List.first()
    Beacon.Config.fetch!(site).repo
  end

  # ---------------------------------------------------------------------------
  # User CRUD
  # ---------------------------------------------------------------------------

  @doc "Creates a new pre-provisioned user."
  def create_user(attrs) do
    %User{}
    |> User.changeset(attrs)
    |> repo().insert()
  end

  @doc "Updates an existing user."
  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> repo().update()
  end

  @doc "Deletes a user and all associated data (via cascading delete)."
  def delete_user(%User{} = user) do
    repo().delete(user)
  end

  @doc "Lists users with optional pagination."
  def list_users(opts \\ []) do
    page = Keyword.get(opts, :page, 1)
    per_page = Keyword.get(opts, :per_page, 20)

    User
    |> order_by([u], asc: u.email)
    |> limit(^per_page)
    |> offset(^((page - 1) * per_page))
    |> repo().all()
  end

  @doc "Gets a user by ID."
  def get_user(id) do
    repo().get(User, id)
  end

  @doc "Gets a user by email."
  def get_user_by_email(email) when is_binary(email) do
    repo().get_by(User, email: email)
  end

  @doc "Returns a changeset for tracking user changes."
  def change_user(%User{} = user, attrs \\ %{}) do
    User.changeset(user, attrs)
  end

  @doc """
  Records a login event for a user.

  Call this from your auth provider after successful authentication to
  track when and how users last logged in.
  """
  def record_login(%User{} = user, provider \\ "unknown") do
    user
    |> User.changeset(%{
      last_login_at: DateTime.utc_now() |> DateTime.truncate(:microsecond),
      last_login_provider: to_string(provider)
    })
    |> repo().update()
  end

  # ---------------------------------------------------------------------------
  # Owner
  # ---------------------------------------------------------------------------

  @doc "Returns true if the user is the platform owner."
  def is_owner?(user), do: Permissions.is_owner?(user)

  @doc "Returns the owner user, or nil if no owner is set."
  def get_owner do
    case repo().one(from(o in Owner, preload: :user)) do
      nil -> nil
      owner -> owner.user
    end
  end

  @doc "Sets the given user as the platform owner, replacing any existing owner."
  def set_owner(%User{} = user) do
    repo().transaction(fn ->
      repo().delete_all(Owner)

      %Owner{}
      |> Owner.changeset(%{user_id: user.id})
      |> repo().insert!()
    end)
  end

  @doc "Transfers ownership from the current owner to a new user."
  def transfer_ownership(%User{} = new_owner) do
    set_owner(new_owner)
  end

  # ---------------------------------------------------------------------------
  # Groups
  # ---------------------------------------------------------------------------

  @doc "Creates a new group."
  def create_group(attrs) do
    %Group{}
    |> Group.changeset(attrs)
    |> repo().insert()
  end

  @doc "Updates an existing group."
  def update_group(%Group{} = group, attrs) do
    group
    |> Group.changeset(attrs)
    |> repo().update()
  end

  @doc "Deletes a group and all associated permissions and memberships."
  def delete_group(%Group{} = group) do
    repo().delete(group)
  end

  @doc """
  Lists groups with filtering options.

  ## Options

    * `:site` — filter by site (required for site-scoped groups)
    * `:templates_only` — if true, only return template groups (site=nil, is_template=true)
  """
  def list_groups(opts \\ []) do
    query =
      cond do
        opts[:templates_only] ->
          from(g in Group, where: g.is_template == true and is_nil(g.site))

        site = opts[:site] ->
          site_string = to_string(site)
          from(g in Group, where: g.site == ^site_string and g.is_template == false)

        true ->
          from(g in Group)
      end

    query
    |> order_by([g], asc: g.name)
    |> repo().all()
  end

  @doc "Gets a group by ID."
  def get_group(id) do
    repo().get(Group, id)
  end

  @doc "Gets a group by ID with preloaded permissions."
  def get_group_with_permissions(id) do
    repo().get(Group, id)
    |> repo().preload(:permissions)
  end

  # ---------------------------------------------------------------------------
  # Group Membership
  # ---------------------------------------------------------------------------

  @doc "Adds a user to a group."
  def add_user_to_group(user_id, group_id) do
    %UserGroup{}
    |> UserGroup.changeset(%{user_id: user_id, group_id: group_id})
    |> repo().insert()
  end

  @doc "Removes a user from a group."
  def remove_user_from_group(user_id, group_id) do
    from(ug in UserGroup, where: ug.user_id == ^user_id and ug.group_id == ^group_id)
    |> repo().delete_all()

    :ok
  end

  @doc "Lists all members of a group."
  def list_group_members(group_id) do
    from(u in User,
      join: ug in UserGroup, on: ug.user_id == u.id,
      where: ug.group_id == ^group_id,
      order_by: [asc: u.email]
    )
    |> repo().all()
  end

  @doc "Lists all groups a user belongs to for a given site."
  def list_user_groups(user_id, site) do
    site_string = to_string(site)

    from(g in Group,
      join: ug in UserGroup, on: ug.group_id == g.id,
      where: ug.user_id == ^user_id,
      where: g.site == ^site_string,
      where: g.is_template == false,
      order_by: [asc: g.name]
    )
    |> repo().all()
  end

  # ---------------------------------------------------------------------------
  # Group Permissions
  # ---------------------------------------------------------------------------

  @doc """
  Replaces all permissions for a group with the given list.

  Each permission is a map with keys: `:feature`, `:sub_feature`,
  and optionally `:scope_type` (default "all") and `:scope_id`.
  """
  def set_group_permissions(%Group{} = group, permissions) when is_list(permissions) do
    repo().transaction(fn ->
      from(gp in GroupPermission, where: gp.group_id == ^group.id)
      |> repo().delete_all()

      Enum.each(permissions, fn perm ->
        %GroupPermission{}
        |> GroupPermission.changeset(Map.put(perm, :group_id, group.id))
        |> repo().insert!()
      end)
    end)
  end

  @doc "Adds a single permission to a group."
  def add_group_permission(%Group{} = group, attrs) do
    %GroupPermission{}
    |> GroupPermission.changeset(Map.put(attrs, :group_id, group.id))
    |> repo().insert()
  end

  @doc "Removes a permission by ID."
  def remove_group_permission(permission_id) do
    case repo().get(GroupPermission, permission_id) do
      nil -> {:error, :not_found}
      perm -> repo().delete(perm)
    end
  end

  @doc "Lists all permissions for a group."
  def list_group_permissions(group_id) do
    from(gp in GroupPermission,
      where: gp.group_id == ^group_id,
      order_by: [asc: gp.feature, asc: gp.sub_feature]
    )
    |> repo().all()
  end

  # ---------------------------------------------------------------------------
  # User Permissions (individual grants)
  # ---------------------------------------------------------------------------

  @doc "Grants a permission directly to a user."
  def grant_user_permission(attrs) do
    %UserPermission{}
    |> UserPermission.changeset(attrs)
    |> repo().insert()
  end

  @doc "Revokes an individual permission by ID."
  def revoke_user_permission(permission_id) do
    case repo().get(UserPermission, permission_id) do
      nil -> {:error, :not_found}
      perm -> repo().delete(perm)
    end
  end

  @doc "Lists all individual permissions for a user on a site."
  def list_user_permissions(user_id, site) do
    site_string = to_string(site)

    from(up in UserPermission,
      where: up.user_id == ^user_id,
      where: up.site == ^site_string,
      order_by: [asc: up.feature, asc: up.sub_feature]
    )
    |> repo().all()
  end

  # ---------------------------------------------------------------------------
  # Permission Checking (delegates to Permissions module)
  # ---------------------------------------------------------------------------

  @doc "Checks if a user can perform sub_feature on feature for the given site."
  defdelegate can?(user, site, feature, sub_feature), to: Permissions

  @doc "Checks if a user can perform sub_feature on feature with resource scoping."
  defdelegate can?(user, site, feature, sub_feature, opts), to: Permissions

  @doc "Checks if a user can access the given site at all."
  defdelegate can_access_site?(user, site), to: Permissions

  @doc "Checks if a user has view access to a feature on a site."
  defdelegate can_access_feature?(user, site, feature), to: Permissions

  # ---------------------------------------------------------------------------
  # Group Templates
  # ---------------------------------------------------------------------------

  @doc """
  Copies all global group templates into a site as real groups.

  Creates a copy of each template group (with all its permissions)
  as a site-scoped, non-template group. Skips groups where a group
  with the same name already exists for the site.
  """
  def copy_templates_to_site(site) do
    templates = list_groups(templates_only: true)
    site_string = to_string(site)

    repo().transaction(fn ->
      Enum.each(templates, fn template ->
        # Check if a group with this name already exists for the site
        existing =
          from(g in Group, where: g.site == ^site_string and g.name == ^template.name)
          |> repo().one()

        unless existing do
          {:ok, new_group} =
            create_group(%{
              site: site,
              name: template.name,
              description: template.description,
              is_template: false
            })

          # Copy permissions
          template_perms = list_group_permissions(template.id)

          Enum.each(template_perms, fn perm ->
            add_group_permission(new_group, %{
              feature: perm.feature,
              sub_feature: perm.sub_feature,
              scope_type: perm.scope_type,
              scope_id: perm.scope_id
            })
          end)
        end
      end)
    end)
  end
end
