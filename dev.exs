# Development Server for Beacon LiveAdmin
#
# Usage:
#
#     $ iex -S mix dev
#
# Refs:
#
# https://github.com/phoenixframework/phoenix_live_dashboard/blob/e87bbe03203f67947643f0574bb272b681951fa8/dev.exs

Logger.configure(level: :debug)

Application.put_env(:beacon_live_admin, DemoWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "TrXbWpjZWxk0GXclXOHFCoufQh1oRK0N5rev5GcpbPCsuf2C/kbYlMgeEEAXPayF",
  live_view: [signing_salt: "nXvN+c8y"],
  http: [port: System.get_env("PORT") || 4002],
  debug_errors: true,
  check_origin: false,
  pubsub_server: Demo.PubSub,
  watchers: [
    esbuild: {Esbuild, :install_and_run, [:cdn_min, ~w(--watch)]},
    tailwind: {Tailwind, :install_and_run, [:default, ~w(--watch)]}
  ],
  live_reload: [
    patterns: [
      ~r"dist/.*(js|css|png|jpeg|jpg|gif|svg)$",
      ~r"lib/beacon/live_admin/.*(ex)$",
      ~r"lib/beacon/live_admin/(components|controllers|pages)/.*(ex)$"
    ]
  ]
)

defmodule DemoWeb.CustomPage do
  use Beacon.LiveAdmin.PageBuilder

  @impl true
  def init(opts) do
    {:ok, opts}
  end

  @impl true
  def menu_link(_prefix, _live_action), do: {:root, "Custom"}

  @impl true
  def mount(_params, session, socket) do
    {:ok, assign(socket, :val, session.val)}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div>Custom</div>
    <span>Val: <%= @val %></span>
    """
  end
end

defmodule DemoWeb.Router do
  use Phoenix.Router, helpers: false
  use Beacon.LiveAdmin.Router
  import Plug.Conn
  import Phoenix.Controller
  import Phoenix.LiveView.Router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  scope "/" do
    pipe_through :browser

    beacon_live_admin("/admin",
      additional_pages: [{"/custom", DemoWeb.CustomPage, :show, %{val: 1}}]
    )
  end
end

defmodule DemoWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :beacon_live_admin

  @session_options [
    store: :cookie,
    key: "_live_view_key",
    signing_salt: "d7B1x7Tu",
    same_site: "Lax"
  ]

  socket "/live", Phoenix.LiveView.Socket, websocket: [connect_info: [session: @session_options]]
  socket "/phoenix/live_reload/socket", Phoenix.LiveReloader.Socket

  plug Phoenix.LiveReloader
  plug Phoenix.CodeReloader
  plug Plug.Session, @session_options
  plug Plug.RequestId
  plug Beacon.LiveAdmin.Plug
  plug DemoWeb.Router
end

Application.put_env(:phoenix, :serve_endpoints, true)

Task.start(fn ->
  children = [
    {Phoenix.PubSub, [name: Demo.PubSub, adapter: Phoenix.PubSub.PG2]},
    DemoWeb.Endpoint
  ]

  {:ok, _} = Supervisor.start_link(children, strategy: :one_for_one)
  Process.sleep(:infinity)
end)
