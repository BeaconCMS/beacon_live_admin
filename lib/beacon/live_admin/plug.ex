defmodule Beacon.LiveAdmin.Plug do
  @behaviour Plug

  def init(opts), do: opts

  def call(conn, _opts) do
    Plug.Conn.put_session(
      conn,
      "beacon_live_admin_page_url",
      Phoenix.Controller.current_url(conn)
    )
  end
end
