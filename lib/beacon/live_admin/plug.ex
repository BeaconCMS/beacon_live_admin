defmodule Beacon.LiveAdmin.Plug do
  @moduledoc """
  Required plug to load Admin pages allow navigation.

  Must be added in the pipeline, see the [Installation guide](file:///Users/apb/dev/beacon_live_admin/doc/installation.html#mount-admin-in-the-router) for more details.
  """

  @doc false
  use Plug.Builder, init_mode: Phoenix.plug_init_mode()

  @doc false
  def call(conn, opts), do: super(conn, opts)

  plug Plug.Static,
    at: "__beacon_live_admin_static__/",
    from: :beacon_live_admin,
    only: ["images"]

  plug :fetch_session
  plug :page_url

  @doc false
  def page_url(%{path_info: ["__beacon_live_admin__", "assets" | _]} = conn, _opts), do: conn

  def page_url(conn, _opts) do
    Plug.Conn.put_session(
      conn,
      "beacon_live_admin_page_url",
      Phoenix.Controller.current_url(conn)
    )
  end
end
