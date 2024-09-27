if Mix.env() == :test do
  Application.put_env(:beacon_live_admin, Beacon.LiveAdminTest.Endpoint,
    url: [host: "localhost", port: 4000],
    adapter: Bandit.PhoenixAdapter,
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

  # Load config and Endpoints for testing that plug Beacon.LiveAdmin.Plug is missing from the Router :browser pipeline
  Application.put_env(:beacon_live_admin_plugless, Beacon.LiveAdminTest.PluglessEndpoint,
    url: [host: "localhost", port: 4010],
    secret_key_base: "TrXbWpjZWxk0GXclXOHFCoufQh1oRK0N5rev5GcpbPCsuf2C/kbYlMgeEEAXPayF",
    live_view: [signing_salt: "nXvN+c8y"],
    render_errors: [view: Beacon.LiveAdminTest.ErrorView],
    check_origin: false
  )

  defmodule Beacon.LiveAdminTest.PluglessRouter do
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

  defmodule Beacon.LiveAdminTest.PluglessEndpoint do
    use Phoenix.Endpoint, otp_app: :beacon_live_admin_plugless

    plug Plug.Session,
      store: :cookie,
      key: "_live_view_key",
      signing_salt: "/VEDsdfsffMnp5"

    plug Beacon.LiveAdminTest.PluglessRouter
  end

  Supervisor.start_link(
    [
      Beacon.LiveAdminTest.Endpoint,
      Beacon.LiveAdminTest.PluglessEndpoint
    ],
    strategy: :one_for_one
  )

  Beacon.LiveAdminTest.Cluster.spawn([:"node1@127.0.0.1", :"node2@127.0.0.1"])

  Beacon.LiveAdminTest.Cluster.start_beacon(:"node1@127.0.0.1",
    sites: [
      [
        site: :site_a,
        skip_boot?: true,
        repo: MyApp.Repo,
        endpoint: MyAppWeb.Endpoint,
        router: MyApp.Router,
        extra_page_fields: [
          MyApp.PageField.Type
        ]
      ]
    ]
  )

  Beacon.LiveAdminTest.Cluster.start_beacon(:"node2@127.0.0.1",
    sites: [
      [
        site: :site_b,
        skip_boot?: true,
        repo: MyApp.Repo,
        endpoint: MyAppWeb.Endpoint,
        router: MyApp.Router
      ],
      [
        site: :site_c,
        skip_boot?: true,
        repo: MyApp.Repo,
        endpoint: MyAppWeb.Endpoint,
        router: MyApp.Router
      ]
    ]
  )
end

ExUnit.start()
