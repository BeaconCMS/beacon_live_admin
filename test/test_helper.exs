Application.put_env(:beacon_live_admin, Beacon.LiveAdminTest.Endpoint,
  url: [host: "localhost", port: 4000],
  secret_key_base: "TrXbWpjZWxk0GXclXOHFCoufQh1oRK0N5rev5GcpbPCsuf2C/kbYlMgeEEAXPayF",
  live_view: [signing_salt: "nXvN+c8y"],
  render_errors: [view: Beacon.LiveAdminTest.ErrorView],
  check_origin: false
)

defmodule Beacon.LiveAdminTest.ErrorView do
  def render(template, _assigns) do
    Phoenix.Controller.status_message_from_template(template)
  end
end

defmodule Beacon.LiveAdminTest.Router do
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

# start site
import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

node = :"node1@127.0.0.1"

rpc(node, Application, :put_env, [
  :my_app,
  MyApp.Endpoint,
  url: [host: "localhost", port: 4010],
  secret_key_base: "TrXbWpjZWxk0GXclXOHFCoufQh1oRK0N5rev5GcpbPCsuf2C/kbYlMgeEEAXPayF",
  live_view: [signing_salt: "nXvN+c8y"],
  render_errors: [view: MyApp.ErrorView],
  check_origin: false
])

rpc(node, Application, :put_env, [
  :beacon,
  Beacon.Repo,
  [
    database: "beacon_live_admin_test",
    password: "postgres",
    pool: Ecto.Adapters.SQL.Sandbox,
    username: "postgres",
    ownership_timeout: 1_000_000_000,
    stacktrace: true,
    show_sensitive_data_on_connection_error: true
  ]
])

rpc(node, Ecto.Adapters.Postgres, :storage_down, [Beacon.Repo.config()])
rpc(node, Ecto.Adapters.Postgres, :storage_up, [Beacon.Repo.config()])

rpc(node, Application, :ensure_all_started, [:beacon])

rpc(node, Supervisor, :start_link, [
  Beacon,
  [sites: [[site: :my_site]]],
  [name: Beacon]
])

rpc(node, Ecto.Migrator, :run, [Beacon.Repo, :down, [all: true]])
rpc(node, Ecto.Migrator, :run, [Beacon.Repo, :up, [all: true]])

%{id: layout_id} =
  rpc(node, Beacon.Layouts, :create_layout!, [
    %{
      site: "my_site",
      title: "Sample Home Page",
      stylesheet_urls: [],
      body: """
      <header>
        Header
      </header>
      <%= @inner_content %>
      """
    }
  ])

rpc(node, Beacon.Pages, :create_page!, [
  %{
    skip_reload: true,
    path: "home",
    site: "my_site",
    title: "test_home_page",
    description: "test_home_page",
    status: :published,
    layout_id: layout_id,
    template: """
    <main>
      <h1>Home</h1>
    </main>
    """
  }
])

Beacon.LiveAdmin.Cluster.discover_sites()

ExUnit.start()
