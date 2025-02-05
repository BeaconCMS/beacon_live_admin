# https://github.com/phoenixframework/phoenix_pubsub/blob/43ab10bfcec56f82e915c246c2dd9dba438fe8da/test/support/cluster.ex
# https://github.com/cabol/nebulex/blob/974f54e53ac91bf4906c35fcbd8b67166a86895b/test/support/cluster.ex

defmodule Beacon.LiveAdminTest.Cluster do
  @moduledoc false

  def spawn(nodes) do
    # Turn node into a distributed node with the given long name
    :net_kernel.start([:"primary@127.0.0.1"])

    # Allow spawned nodes to fetch all code from this node
    :erl_boot_server.start([])
    allow_boot(to_charlist("127.0.0.1"))

    nodes
    |> Enum.map(&Task.async(fn -> spawn_node(&1) end))
    |> Enum.map(&Task.await(&1, 30_000))
  end

  defp spawn_node(node_host) do
    {:ok, node} = start_peer(node_host)
    add_code_paths(node)
    transfer_configuration(node)
    ensure_applications_started(node)
    {:ok, node}
  end

  if Code.ensure_loaded?(:peer) do
    defp start_peer(node_host) do
      {:ok, _pid, node} =
        :peer.start(%{
          name: node_name(node_host),
          host: to_charlist("127.0.0.1"),
          args: [inet_loader_args()]
        })

      {:ok, node}
    end
  else
    defp start_peer(node_host) do
      :slave.start(to_charlist("127.0.0.1"), node_name(node_host), inet_loader_args())
    end
  end

  def rpc(node, module, function, args) do
    :rpc.block_call(node, module, function, args)
  end

  defp inet_loader_args do
    to_charlist("-loader inet -hosts 127.0.0.1 -setcookie #{:erlang.get_cookie()}")
  end

  defp allow_boot(host) do
    {:ok, ipv4} = :inet.parse_ipv4_address(host)
    :erl_boot_server.add_slave(ipv4)
  end

  defp add_code_paths(node) do
    rpc(node, :code, :add_paths, [:code.get_path()])
  end

  defp transfer_configuration(node) do
    for {app_name, _, _} <- Application.loaded_applications() do
      for {key, val} <- Application.get_all_env(app_name) do
        rpc(node, Application, :put_env, [app_name, key, val])
      end
    end
  end

  defp ensure_applications_started(node) do
    rpc(node, Application, :ensure_all_started, [:mix])
    rpc(node, Mix, :env, [Mix.env()])

    for {app_name, _, _} <- Application.loaded_applications(), app_name not in [:beacon, :ecto] do
      rpc(node, Application, :ensure_all_started, [app_name])
    end
  end

  defp node_name(node_host) do
    node_host
    |> to_string
    |> String.split("@")
    |> Enum.at(0)
    |> String.to_atom()
  end

  def start_beacon(node, beacon_config) do
    rpc(node, Application, :put_env, [:my_app, :ecto_repos, [MyApp.Repo]])

    rpc(node, Application, :put_env, [
      :my_app,
      MyApp.Repo,
      [
        url: System.get_env("DATABASE_URL") || "postgres://localhost:5432/beacon_live_admin_test",
        pool: Ecto.Adapters.SQL.Sandbox,
        stacktrace: true,
        show_sensitive_data_on_connection_error: true
      ]
    ])

    {:ok, _} = rpc(node, Application, :ensure_all_started, [:postgrex])

    ecto_adapter = rpc(node, MyApp.Repo, :__adapter__, [])
    repo_config = rpc(node, MyApp.Repo, :config, [])

    case rpc(node, ecto_adapter, :storage_up, [repo_config]) do
      :ok -> :ok
      {:error, :already_up} -> :ok
      error -> raise inspect(error)
    end

    {:ok, _} = rpc(node, MyApp.Repo, :start_link, [])

    path = Path.join(Path.dirname(__ENV__.file), "migrations")
    rpc(node, Ecto.Migrator, :run, [MyApp.Repo, path, :down, [all: true]])
    rpc(node, Ecto.Migrator, :run, [MyApp.Repo, path, :up, [all: true]])

    rpc(node, MyApp.Repo, :stop, [])

    rpc(node, Application, :put_env, [
      :my_app,
      MyAppWeb.ProxyEndpoint,
      http: [ip: {127, 0, 0, 1}, port: Enum.random(4030..4050)],
      # adapter: Bandit.PhoenixAdapter,
      server: true,
      live_view: [signing_salt: "aaaaaaaa"],
      secret_key_base: String.duplicate("a", 64),
      render_errors: [
        formats: [
          html: Beacon.Web.ErrorHTML
        ],
        layout: false
      ],
      pubsub_server: MyApp.PubSub,
      debug_errors: false
    ])

    rpc(node, Application, :put_env, [
      :my_app,
      MyAppWeb.Endpoint,
      http: [ip: {127, 0, 0, 1}, port: Enum.random(4051..4099)],
      # adapter: Bandit.PhoenixAdapter,
      server: true,
      live_view: [signing_salt: "aaaaaaaa"],
      secret_key_base: String.duplicate("a", 64),
      render_errors: [
        formats: [
          html: Beacon.Web.ErrorHTML
        ],
        layout: false
      ],
      pubsub_server: MyApp.PubSub,
      debug_errors: false
    ])

    {:ok, _} = rpc(node, Application, :ensure_all_started, [:beacon])

    children = [
      MyApp.Repo,
      MyAppWeb.ProxyEndpoint,
      MyAppWeb.Endpoint,
      {Phoenix.PubSub, name: MyApp.PubSub},
      {Beacon, beacon_config}
    ]

    case rpc(node, Supervisor, :start_link, [children, [strategy: :one_for_one]]) do
      {:ok, _} ->
        :ok

      {:error, error} ->
        raise """
        failed to start Beacon on node #{inspect(node)}

        Got:

          #{inspect(error)}

        """
    end
  end
end
