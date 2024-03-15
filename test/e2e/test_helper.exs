Application.put_env(:beacon_live_admin, Beacon.LiveAdminTest.E2E.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4004],
  server: true,
  live_view: [signing_salt: "aaaaaaaa"],
  secret_key_base: String.duplicate("a", 64),
  render_errors: [
    formats: [
      html: Beacon.LiveAdminTest.E2E.ErrorHTML
    ],
    layout: false
  ],
  pubsub_server: Beacon.LiveAdminTest.E2E.PubSub,
  debug_errors: false
)

defmodule Beacon.LiveAdminTest.E2E.ErrorHTML do
  def render(template, _), do: Phoenix.Controller.status_message_from_template(template)
end

defmodule Beacon.LiveAdminTest.E2E.Router do
  use Phoenix.Router
  use Beacon.LiveAdmin.Router

  pipeline :browser do
    plug :fetch_session
    plug Beacon.LiveAdmin.Plug
  end

  scope "/" do
    pipe_through :browser
    beacon_live_admin("/admin")
  end
end

defmodule Beacon.LiveAdminTest.E2E.Endpoint do
  use Phoenix.Endpoint, otp_app: :beacon_live_admin

  @session_options [
    store: :cookie,
    key: "_beacon_live_admin_e2e_key",
    signing_salt: "/VEDsdfsffMnp5",
    same_site: "Lax"
  ]

  socket "/live", Phoenix.LiveView.Socket, websocket: [connect_info: [session: @session_options]]

  plug Plug.Static, from: {:phoenix, "priv/static"}, at: "/assets/phoenix"
  plug Plug.Static, from: {:phoenix_live_view, "priv/static"}, at: "/assets/phoenix_live_view"
  plug Plug.Static, from: System.tmp_dir!(), at: "/tmp"

  plug :health_check

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Phoenix.json_library()

  plug Plug.Session, @session_options
  plug Beacon.LiveAdminTest.E2E.Router

  defp health_check(%{request_path: "/health"} = conn, _opts) do
    conn |> Plug.Conn.send_resp(200, "OK") |> Plug.Conn.halt()
  end

  defp health_check(conn, _opts), do: conn
end

{:ok, _} =
  Supervisor.start_link(
    [
      Beacon.LiveAdminTest.E2E.Endpoint,
      {Phoenix.PubSub, name: Beacon.LiveAdminTest.E2E.PubSub}
    ],
    strategy: :one_for_one
  )

Beacon.LiveAdminTest.Cluster.spawn([:"node1@127.0.0.1"])

cluster =
  Beacon.LiveAdminTest.Cluster.start_beacon(:"node1@127.0.0.1",
    sites: [
      [
        site: :site_a,
        endpoint: MyApp.Endpoint,
        authorization_source: MyApp.AuthorizationSource
      ]
    ]
  )

{site, nodes} = Enum.at(cluster, 0)

IO.puts("Starting beacon site #{site} on nodes #{inspect(nodes)}")
IO.puts("Starting e2e server on port #{Beacon.LiveAdminTest.E2E.Endpoint.config(:http)[:port]}")

Process.sleep(:infinity)
