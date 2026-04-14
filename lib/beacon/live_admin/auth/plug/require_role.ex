defmodule Beacon.LiveAdmin.Auth.Plug.RequireRole do
  @moduledoc """
  Plug that enforces role-based authorization.

  Uses the configured `auth_provider` to get the current user from the
  connection, matches against `beacon_users` by email, then checks roles.

  ## Options

    * `:role` — a single required role (atom or string)
    * `:roles` — a list of roles, any of which is sufficient
    * `:site` — the site to scope the check. Use `:from_params` to read
      from `conn.params["site"]`.

  ## Examples

      plug Beacon.LiveAdmin.Auth.Plug.RequireRole, role: :super_admin
      plug Beacon.LiveAdmin.Auth.Plug.RequireRole, roles: [:site_admin, :site_editor], site: :from_params
  """

  @behaviour Plug

  import Plug.Conn

  alias Beacon.LiveAdmin.Auth

  @impl true
  def init(opts), do: opts

  @impl true
  def call(conn, opts) do
    user = Auth.get_current_user(conn)
    roles = roles_from_opts(opts)
    site = site_from_opts(conn, opts)

    if user && authorized?(user, roles, site) do
      assign(conn, :beacon_admin_user, user)
    else
      conn
      |> send_resp(403, "Forbidden")
      |> halt()
    end
  end

  defp roles_from_opts(opts) do
    case {Keyword.get(opts, :role), Keyword.get(opts, :roles)} do
      {nil, nil} -> []
      {role, nil} -> [to_string(role)]
      {nil, roles} -> Enum.map(roles, &to_string/1)
      {role, roles} -> [to_string(role) | Enum.map(roles, &to_string/1)]
    end
  end

  defp site_from_opts(conn, opts) do
    case Keyword.get(opts, :site) do
      :from_params -> conn.params["site"]
      site -> site
    end
  end

  defp authorized?(user, roles, site) do
    Auth.is_super_admin?(user) ||
      Enum.any?(roles, fn role -> Auth.has_role?(user, role, site) end)
  end
end
