Application.put_env(:beacon_live_admin, Beacon.LiveAdminTest.Endpoint,
  url: [host: "localhost", port: 4000],
  secret_key_base: "TrXbWpjZWxk0GXclXOHFCoufQh1oRK0N5rev5GcpbPCsuf2C/kbYlMgeEEAXPayF",
  live_view: [signing_salt: "nXvN+c8y"],
  check_origin: false
)

defmodule Beacon.LiveAdminTest.Router do
  use Phoenix.Router
  use Beacon.LiveAdmin.Router

  pipeline :browser do
    plug :fetch_session
  end

  scope "/" do
    pipe_through :browser
    beacon_live_admin("/admin")
  end
end

defmodule Beacon.LiveAdminTest.Endpoint do
  use Phoenix.Endpoint, otp_app: :beacon_live_admin

  plug Plug.Session,
    store: :cookie,
    key: "_live_view_key",
    signing_salt: "/VEDsdfsffMnp5"

  plug Beacon.LiveAdminTest.Router
end

Supervisor.start_link(
  [
    Beacon.LiveAdminTest.Endpoint
  ],
  strategy: :one_for_one
)

Beacon.LiveAdminTest.Cluster.spawn([:"node1@127.0.0.1"])
Beacon.LiveAdmin.Cluster.discover_sites()

ExUnit.start()
