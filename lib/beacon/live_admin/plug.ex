defmodule Beacon.LiveAdmin.Plug do
  use Plug.Builder, init_mode: Phoenix.plug_init_mode()

  plug Plug.Static,
    at: "__beacon_live_admin_static/",
    from: :beacon_live_admin,
    only: ["images"]

  plug :fetch_session
  plug :page_url

  def page_url(conn, _opts) do
    Plug.Conn.put_session(
      conn,
      "beacon_live_admin_page_url",
      Phoenix.Controller.current_url(conn)
    )
  end
end
