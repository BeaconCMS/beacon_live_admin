Application.put_env(:beacon_live_admin, :ecto_repos, [Beacon.LiveAdminTest.E2E.Repo])

repo_url = System.get_env("DATABASE_URL") || "postgres://localhost:5432/beacon_live_admin_test"

Application.put_env(
  :beacon_live_admin,
  Beacon.LiveAdminTest.E2E.Repo,
  url: System.get_env("DATABASE_URL") || "postgres://localhost:5432/beacon_live_admin_test",
  pool: Ecto.Adapters.SQL.Sandbox,
  stacktrace: true,
  show_sensitive_data_on_connection_error: true
)

Application.put_env(:beacon_live_admin, Beacon.LiveAdminTest.E2E.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4020],
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

defmodule Beacon.LiveAdminTest.E2E.Repo do
  use Ecto.Repo, otp_app: :beacon_live_admin, adapter: Ecto.Adapters.Postgres
end

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
  use Beacon.Router
  use Beacon.LiveAdmin.Router
  import Phoenix.LiveView.Router

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :protect_from_forgery
    plug Beacon.LiveAdmin.Plug
  end

  pipeline :beacon_admin do
    plug Beacon.LiveAdmin.Plug
  end

  scope "/fixtures" do
    pipe_through :api
    post "/:scenario", Beacon.LiveAdminTest.E2E.FixturesController, :fixture
  end

  scope "/admin" do
    pipe_through [:browser, :beacon_admin]
    beacon_live_admin("/")
  end

  scope "/" do
    pipe_through :browser
    beacon_site "/site_a", site: :site_a
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

  socket "/live", Phoenix.LiveView.Socket, websocket: [connect_info: [:user_agent, session: @session_options]]

  # https://hexdocs.pm/phoenix_ecto/Phoenix.Ecto.SQL.Sandbox.html#module-acceptance-tests-with-liveviews
  plug Phoenix.Ecto.SQL.Sandbox,
    at: "/sandbox",
    repo: Beacon.LiveAdminTest.E2E.Repo,
    timeout: 15_000

  plug Plug.Static, from: {:phoenix, "priv/static"}, at: "/assets/phoenix"
  plug Plug.Static, from: {:phoenix_live_view, "priv/static"}, at: "/assets/phoenix_live_view"
  plug Plug.Static, from: {:beacon, "priv/static"}, at: "/assets/beacon"
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

defmodule Beacon.LiveAdminTest.E2E.FixturesController do
  use Phoenix.Controller, formats: [:html, :json]
  import Plug.Conn

  def fixture(conn, %{"scenario" => scenario}) do
    case Plug.Conn.get_req_header(conn, "user-agent") do
      [metadata | _] ->
        Phoenix.Ecto.SQL.Sandbox.allow(metadata, Ecto.Adapters.SQL.Sandbox)
    end

    Beacon.LiveAdminTest.E2E.Fixtures.scenario(scenario)

    send_resp(conn, 200, "")
  end
end

defmodule Beacon.LiveAdminTest.E2E.Migrations.AddBeaconTables do
  use Ecto.Migration
  def up, do: Beacon.Migration.up()
  def down, do: Beacon.Migration.up()
end

Beacon.LiveAdminTest.E2E.Repo.__adapter__()
Beacon.LiveAdminTest.E2E.Repo.config()

Beacon.LiveAdminTest.E2E.Repo.__adapter__().storage_down(Beacon.LiveAdminTest.E2E.Repo.config())
Beacon.LiveAdminTest.E2E.Repo.__adapter__().storage_up(Beacon.LiveAdminTest.E2E.Repo.config())
{:ok, _pid} = Beacon.LiveAdminTest.E2E.Repo.start_link()
:ok = Ecto.Migrator.up(Beacon.LiveAdminTest.E2E.Repo, 0, Beacon.LiveAdminTest.E2E.Migrations.AddBeaconTables)

{:ok, _} = Application.ensure_all_started(:beacon)

{:ok, _} =
  Supervisor.start_link(
    [
      # Beacon.LiveAdminTest.E2E.Repo,
      Beacon.LiveAdminTest.E2E.Endpoint,
      {Phoenix.PubSub, name: Beacon.LiveAdminTest.E2E.PubSub},
      {
        Beacon,
        sites: [
          [
            site: :site_a,
            mode: :testing,
            repo: Beacon.LiveAdminTest.E2E.Repo,
            endpoint: Beacon.LiveAdminTest.E2E.Endpoint,
            router: Beacon.LiveAdminTest.E2E.Router
          ]
        ]
      }
    ],
    strategy: :one_for_one
  )

IO.puts("Starting node at #{Beacon.LiveAdminTest.E2E.Endpoint.url()}")

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
