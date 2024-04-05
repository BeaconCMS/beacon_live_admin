defmodule Beacon.LiveAdmin.TestController do
  use Beacon.LiveAdmin.Web, :controller

  def setup(conn, _params) do
    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, ~S|{ "task": "setup" }|)
  end

  def teardown(conn, _params) do
    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, ~S|{ "task": "teardown" }|)
  end
end
