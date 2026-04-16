defmodule Beacon.LiveAdmin.Auth.Plug.RequirePermission do
  @moduledoc """
  Plug that enforces permission-based authorization.

  Uses the configured `auth_provider` to get the current user from the
  connection, then checks permissions via the groups/permissions system.

  ## Options

    * `:feature` — required feature key (e.g., `"pages"`)
    * `:sub_feature` — required sub-feature key (defaults to `"view"`)
    * `:site` — the site to scope the check. Use `:from_params` to read
      from `conn.params["site"]`.
    * `:owner_only` — if true, only the platform owner passes

  ## Examples

      plug Beacon.LiveAdmin.Auth.Plug.RequirePermission, owner_only: true
      plug Beacon.LiveAdmin.Auth.Plug.RequirePermission, feature: "pages", sub_feature: "edit", site: :from_params
  """

  @behaviour Plug

  import Plug.Conn

  alias Beacon.LiveAdmin.Auth
  alias Beacon.LiveAdmin.Auth.Permissions

  @impl true
  def init(opts), do: opts

  @impl true
  def call(conn, opts) do
    cond do
      is_nil(Auth.auth_provider()) ->
        assign(conn, :beacon_admin_user, nil)

      true ->
        user = Auth.get_current_user(conn)
        check_permission(conn, user, opts)
    end
  end

  defp check_permission(conn, nil, _opts) do
    conn
    |> send_resp(403, "Forbidden")
    |> halt()
  end

  defp check_permission(conn, user, opts) do
    if authorized?(conn, user, opts) do
      assign(conn, :beacon_admin_user, user)
    else
      conn
      |> send_resp(403, "Forbidden")
      |> halt()
    end
  end

  defp authorized?(conn, user, opts) do
    if opts[:owner_only] do
      Permissions.is_owner?(user)
    else
      site = site_from_opts(conn, opts)
      feature = Keyword.get(opts, :feature)
      sub_feature = Keyword.get(opts, :sub_feature, "view")

      Permissions.can?(user, site, feature, sub_feature)
    end
  end

  defp site_from_opts(conn, opts) do
    case Keyword.get(opts, :site) do
      :from_params -> conn.params["site"]
      site -> site
    end
  end
end
