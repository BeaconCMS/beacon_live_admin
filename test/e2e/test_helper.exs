Application.put_env(:beacon_live_admin, Beacon.LiveAdminTest.E2E.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4004],
  adapter: Bandit.PhoenixAdapter,
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

Process.register(self(), :e2e_helper)

defmodule Beacon.LiveAdminTest.E2E.ErrorHTML do
  def render(template, _), do: Phoenix.Controller.status_message_from_template(template)
end

defmodule Beacon.LiveAdminTest.E2E.Layout do
  use Phoenix.Component

  def render("live.html", assigns) do
    ~H"""
    <meta name="csrf-token" content={Plug.CSRFProtection.get_csrf_token()} />
    <style>
      * { font-size: 1.1em; }
    </style>
    <%= @inner_content %>
    """
  end
end

defmodule Beacon.LiveAdminTest.E2E.Router do
  use Phoenix.Router
  use Beacon.LiveAdmin.Router
  import Phoenix.LiveView.Router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :protect_from_forgery
    plug Beacon.LiveAdmin.Plug
  end

  pipeline :beacon_admin do
    plug Beacon.LiveAdmin.Plug
  end

  scope "/" do
    pipe_through [:browser, :beacon_admin]
    beacon_live_admin("/")
  end
end

defmodule Beacon.LiveAdminTest.E2E.Endpoint do
  use Phoenix.Endpoint, otp_app: :beacon_live_admin

  @session_options [
    store: :cookie,
    key: "_bla_e2e_key",
    signing_salt: "1gk/d8ms",
    same_site: "Lax"
  ]

  socket "/live", Phoenix.LiveView.Socket, websocket: [connect_info: [session: @session_options]]

  plug Plug.Static, from: {:phoenix, "priv/static"}, at: "/assets/phoenix"
  plug Plug.Static, from: {:phoenix_live_view, "priv/static"}, at: "/assets/phoenix_live_view"
  plug Plug.Static, from: {:beacon_live_admin, "priv/static"}, at: "/assets/beacon_live_admin"
  plug Plug.Static, from: System.tmp_dir!(), at: "/tmp"

  plug :health_check
  plug :halt

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

  defp halt(%{request_path: "/halt"}, _opts) do
    send(:e2e_helper, :halt)
    # this ensure playwright waits until the server force stops
    Process.sleep(:infinity)
  end

  defp halt(conn, _opts), do: conn
end

{:ok, _} =
  Supervisor.start_link(
    [
      Beacon.LiveAdminTest.E2E.Endpoint,
      {Phoenix.PubSub, name: Beacon.LiveAdminTest.E2E.PubSub}
    ],
    strategy: :one_for_one
  )

node1 = :"node1@127.0.0.1"

Beacon.LiveAdminTest.Cluster.spawn([node1])

:ok =
  Beacon.LiveAdminTest.Cluster.start_beacon(node1,
    sites: [
      [
        site: :site_a,
        skip_boot?: true,
        repo: MyApp.Repo,
        endpoint: MyAppWeb.Endpoint,
        router: MyApp.Router
      ]
    ]
  )

IO.puts("Starting admin at #{Beacon.LiveAdminTest.E2E.Endpoint.url()}")

unless IEx.started?() do
  # when running the test server manually, we halt after
  # reading from stdin
  spawn(fn ->
    IO.read(:stdio, :line)
    send(:e2e_helper, :halt)
  end)

  receive do
    :halt -> :ok
  end
end
