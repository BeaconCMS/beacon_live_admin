defmodule Beacon.LiveAdmin.Auth do
  @moduledoc """
  Authorization context for Beacon LiveAdmin.

  Provides user management and role-based access control. Authentication
  is delegated to the host application via a callback behaviour.

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

  LiveAdmin matches the returned email against `beacon_users` for role lookup.
  If no `auth_provider` is configured, LiveAdmin runs without authentication
  (all access granted — suitable for development only).

  ## Roles

    * `super_admin` — Platform-wide. Manages sites, global template types, users.
    * `site_admin` — Full control over assigned sites.
    * `site_editor` — Create/edit/publish content on assigned sites.
    * `site_viewer` — Read-only access to assigned sites.
  """

  import Ecto.Query

  alias Beacon.LiveAdmin.Auth.User
  alias Beacon.LiveAdmin.Auth.UserRole

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

  Returns the `Beacon.LiveAdmin.Auth.User` struct (with roles) if the
  authenticated email matches a pre-provisioned user, or `nil`.
  """
  def get_current_user(conn) do
    case auth_provider() do
      nil ->
        # No auth provider — development mode, no access control
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

  @doc "Deletes a user and all associated roles (via cascading delete)."
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

  # ---------------------------------------------------------------------------
  # Roles
  # ---------------------------------------------------------------------------

  @doc "Assigns a role to a user, optionally scoped to a site."
  def assign_role(%User{} = user, role, site \\ nil) do
    %UserRole{}
    |> UserRole.changeset(%{user_id: user.id, role: to_string(role), site: site})
    |> repo().insert()
  end

  @doc "Revokes a role from a user."
  def revoke_role(%User{} = user, role, site \\ nil) do
    query =
      UserRole
      |> where([r], r.user_id == ^user.id and r.role == ^to_string(role))

    query =
      if is_nil(site),
        do: where(query, [r], is_nil(r.site)),
        else: where(query, [r], r.site == ^site)

    repo().delete_all(query)
    :ok
  end

  @doc "Lists all roles for a user."
  def list_roles(%User{} = user) do
    UserRole
    |> where([r], r.user_id == ^user.id)
    |> repo().all()
  end

  @doc "Checks if a user has a specific role."
  def has_role?(%User{} = user, role, site \\ nil) do
    query =
      UserRole
      |> where([r], r.user_id == ^user.id and r.role == ^to_string(role))

    query =
      if is_nil(site),
        do: where(query, [r], is_nil(r.site)),
        else: where(query, [r], r.site == ^site)

    repo().exists?(query)
  end

  @doc "Returns true if the user is a super admin."
  def is_super_admin?(%User{} = user) do
    has_role?(user, "super_admin")
  end

  @doc "Returns true if the user can access the given site."
  def can_access_site?(%User{} = user, site) do
    is_super_admin?(user) ||
      UserRole
      |> where([r], r.user_id == ^user.id and r.site == ^site)
      |> repo().exists?()
  end

  @doc """
  Checks authorization. Raises `Beacon.LiveAdmin.Auth.UnauthorizedError` if denied.

  Actions:
    * `:manage` — requires super_admin or site_admin
    * `:edit` — requires super_admin, site_admin, or site_editor
    * `:view` — requires any role for the site or super_admin
  """
  def authorize!(%User{} = user, action, site) do
    authorized =
      case action do
        :manage ->
          is_super_admin?(user) || has_role?(user, "site_admin", site)

        :edit ->
          is_super_admin?(user) ||
            has_role?(user, "site_admin", site) ||
            has_role?(user, "site_editor", site)

        :view ->
          can_access_site?(user, site)

        _ ->
          false
      end

    unless authorized do
      raise Beacon.LiveAdmin.Auth.UnauthorizedError,
        message: "user #{user.email} is not authorized to #{action} on site #{inspect(site)}"
    end

    :ok
  end
end
