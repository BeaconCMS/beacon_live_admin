defmodule Beacon.LiveAdmin.Auth.Permissions do
  @moduledoc """
  Permission resolution engine.

  Evaluates whether a user can perform a specific action on a specific
  resource by combining group permissions and individual grants.

  ## Resolution Algorithm

  1. Owner → always allowed
  2. No auth provider → always allowed (dev mode)
  3. Collect group permissions for the user's groups on the site
  4. Collect individual permissions for the user on the site
  5. Union all permissions
  6. Check if the requested action + resource is covered
  """

  import Ecto.Query

  alias Beacon.LiveAdmin.Auth
  alias Beacon.LiveAdmin.Auth.Group
  alias Beacon.LiveAdmin.Auth.GroupPermission
  alias Beacon.LiveAdmin.Auth.Owner
  alias Beacon.LiveAdmin.Auth.UserGroup
  alias Beacon.LiveAdmin.Auth.UserPermission

  @doc """
  Returns true if the user can perform `sub_feature` on `feature` for the given site.

  ## Options

    * `:resource` — optional resource map for scope checking.
      `%{type: :page, id: page_id}` or `%{type: :collection, id: collection_id}`
      When a page resource includes `:collection_id`, permissions scoped to that
      collection will also match.
  """
  @spec can?(Auth.User.t(), atom(), String.t(), String.t(), keyword()) :: boolean()
  def can?(user, site, feature, sub_feature, opts \\ []) do
    cond do
      is_nil(Auth.auth_provider()) -> true
      is_nil(user) -> false
      is_owner?(user) -> true
      true -> check_permissions(user, site, feature, sub_feature, opts)
    end
  end

  @doc "Returns true if the user is the platform owner."
  @spec is_owner?(Auth.User.t()) :: boolean()
  def is_owner?(nil), do: false

  def is_owner?(%{id: user_id}) do
    repo()
    |> apply(:exists?, [from(o in Owner, where: o.user_id == ^user_id)])
  end

  @doc """
  Returns true if the user can access the given site.

  A user can access a site if they are the owner, or have any group
  membership or individual permission for the site.
  """
  @spec can_access_site?(Auth.User.t(), atom()) :: boolean()
  def can_access_site?(user, site) do
    cond do
      is_nil(Auth.auth_provider()) -> true
      is_nil(user) -> false
      is_owner?(user) -> true
      true -> has_any_site_access?(user, site)
    end
  end

  @doc """
  Returns true if the user has at least "view" access to the given feature on the site.
  """
  @spec can_access_feature?(Auth.User.t(), atom(), String.t()) :: boolean()
  def can_access_feature?(user, site, feature) do
    can?(user, site, feature, "view")
  end

  @doc """
  Returns the full list of effective permissions for a user on a site.

  Returns a list of `{feature, sub_feature, scope_type, scope_id}` tuples.
  """
  @spec effective_permissions(Auth.User.t(), atom()) :: [{String.t(), String.t(), String.t(), binary() | nil}]
  def effective_permissions(user, site) do
    group_perms = fetch_group_permissions(user, site)
    individual_perms = fetch_individual_permissions(user, site)

    (group_perms ++ individual_perms)
    |> Enum.uniq()
  end

  # ---------------------------------------------------------------------------
  # Private
  # ---------------------------------------------------------------------------

  defp check_permissions(user, site, feature, sub_feature, opts) do
    resource = Keyword.get(opts, :resource)

    group_perms = fetch_group_permissions(user, site, feature, sub_feature)
    individual_perms = fetch_individual_permissions(user, site, feature, sub_feature)

    permissions = group_perms ++ individual_perms

    Enum.any?(permissions, fn {scope_type, scope_id} ->
      scope_covers?(scope_type, scope_id, resource)
    end)
  end

  defp fetch_group_permissions(user, site) do
    site_string = to_string(site)

    from(gp in GroupPermission,
      join: g in Group, on: g.id == gp.group_id,
      join: ug in UserGroup, on: ug.group_id == g.id,
      where: ug.user_id == ^user.id,
      where: g.site == ^site_string,
      where: g.is_template == false,
      select: {gp.feature, gp.sub_feature, gp.scope_type, gp.scope_id}
    )
    |> repo().all()
  end

  defp fetch_group_permissions(user, site, feature, sub_feature) do
    site_string = to_string(site)

    from(gp in GroupPermission,
      join: g in Group, on: g.id == gp.group_id,
      join: ug in UserGroup, on: ug.group_id == g.id,
      where: ug.user_id == ^user.id,
      where: g.site == ^site_string,
      where: g.is_template == false,
      where: gp.feature == ^feature,
      where: gp.sub_feature == ^sub_feature,
      select: {gp.scope_type, gp.scope_id}
    )
    |> repo().all()
  end

  defp fetch_individual_permissions(user, site) do
    site_string = to_string(site)

    from(up in UserPermission,
      where: up.user_id == ^user.id,
      where: up.site == ^site_string,
      select: {up.feature, up.sub_feature, up.scope_type, up.scope_id}
    )
    |> repo().all()
  end

  defp fetch_individual_permissions(user, site, feature, sub_feature) do
    site_string = to_string(site)

    from(up in UserPermission,
      where: up.user_id == ^user.id,
      where: up.site == ^site_string,
      where: up.feature == ^feature,
      where: up.sub_feature == ^sub_feature,
      select: {up.scope_type, up.scope_id}
    )
    |> repo().all()
  end

  defp scope_covers?("all", _scope_id, _resource), do: true

  defp scope_covers?("collection", scope_id, %{type: :page, collection_id: tt_id}) do
    scope_id == tt_id
  end

  defp scope_covers?("page", scope_id, %{type: :page, id: page_id}) do
    scope_id == page_id
  end

  defp scope_covers?(_scope_type, _scope_id, nil), do: true
  defp scope_covers?(_scope_type, _scope_id, _resource), do: false

  defp has_any_site_access?(user, site) do
    site_string = to_string(site)

    has_group =
      from(ug in UserGroup,
        join: g in Group, on: g.id == ug.group_id,
        where: ug.user_id == ^user.id,
        where: g.site == ^site_string,
        where: g.is_template == false
      )
      |> repo().exists?()

    has_group ||
      from(up in UserPermission,
        where: up.user_id == ^user.id,
        where: up.site == ^site_string
      )
      |> repo().exists?()
  end

  defp repo do
    site = Beacon.Registry.running_sites() |> List.first()
    Beacon.Config.fetch!(site).repo
  end
end
