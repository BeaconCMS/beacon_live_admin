defmodule Beacon.LiveAdmin.Cluster do
  use GenServer
  require Logger
  alias Beacon.LiveAdmin.PubSub

  @name __MODULE__
  @one_minute :timer.minutes(1)
  @ets_table :beacon_live_admin_sites

  def start_link(opts) do
    GenServer.start_link(__MODULE__, opts, name: @name)
  end

  @impl true
  def init(opts) do
    :ok = :net_kernel.monitor_nodes(true, node_type: :all)
    {:ok, opts}
  end

  def discover_sites do
    GenServer.call(@name, :discover_sites, @one_minute)
  end

  def maybe_discover_sites() do
    case running_sites() do
      [] -> discover_sites()
      _ -> :skip
    end
  end

  @doc false
  def nodes do
    [Node.self()] ++ Node.list()
  end

  @doc false
  def running_sites do
    @ets_table
    |> :ets.match({:"$1", :_})
    |> List.flatten()
  end

  @doc """
  Calls a function for a running `site` in the cluster.

  It will call the function in only one of the available nodes to avoid double execution of `fun`.

    ## Examples

        iex> Beacon.LiveAdmin.Cluster.call(:my_site, Beacon, :reload_site, [:my_site])
        :ok

  """
  def call(site, mod, fun, args)
      when is_atom(site) and is_atom(mod) and is_atom(fun) and is_list(args) do
    case find_node(site) do
      nil ->
        message = "no running node found for site #{inspect(site)}"
        raise Beacon.LiveAdmin.ClusterError, message: message

      node ->
        do_call(node, mod, fun, args)
    end
  rescue
    exception ->
      Logger.debug(
        "failed to call #{Exception.format_mfa(mod, fun, args)} for site #{inspect(site)}"
      )

      message = """
      failed to call #{Exception.format_mfa(mod, fun, args)} for site #{inspect(site)}

      Got:

        #{Exception.message(exception)}

      """

      reraise Beacon.LiveAdmin.ClusterError, [message: message], __STACKTRACE__
  end

  defp do_call(node, mod, fun, args) do
    if node == Node.self() do
      apply(mod, fun, args)
    else
      :erpc.call(node, mod, fun, args)
    end
  end

  if Code.ensure_loaded?(Mix.Project) and Mix.env() == :test do
    defp find_node(site) when is_atom(site) do
      case :ets.match(@ets_table, {site, :"$1"}) do
        [[nodes]] -> List.first(nodes)
        _ -> nil
      end
    end
  else
    defp find_node(site) when is_atom(site) do
      case :ets.match(@ets_table, {site, :"$1"}) do
        # TODO: load balance and retry
        [[nodes]] -> Enum.random(nodes)
        _ -> nil
      end
    end
  end

  ## Callbacks

  @impl true
  def handle_call(:discover_sites, _from, state) do
    sites = do_discover_sites()
    {:reply, sites, state}
  end

  defp do_discover_sites do
    # TODO: add or remove nodes from ets state when nodes changes instead of recreating everything
    :ets.delete_all_objects(@ets_table)

    sites =
      nodes()
      |> Map.new(fn node ->
        try do
          sites = :erpc.call(node, Beacon.Registry, :running_sites, [], :timer.seconds(10))
          {node, sites}
        rescue
          _exception ->
            {node, []}
        end
      end)
      |> group_sites()
      |> Map.new(fn site ->
        true = :ets.insert(@ets_table, site)
        site
      end)

    PubSub.notify_sites_changed(__MODULE__)

    sites
  end

  @doc false
  def group_sites(mapping) do
    Enum.reduce(mapping, %{}, fn {node, sites}, acc ->
      new = :maps.from_list(:lists.map(&{&1, [node]}, sites))

      Map.merge(acc, new, fn _k, v1, v2 ->
        Enum.dedup(v1 ++ v2)
      end)
    end)
  end

  @doc false
  @impl true
  def handle_info({:nodeup, _, _}, state) do
    do_discover_sites()
    {:noreply, state}
  end

  @doc false
  def handle_info({:nodedown, _, _}, state) do
    do_discover_sites()
    {:noreply, state}
  end
end
