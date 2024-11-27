defmodule Beacon.LiveAdmin.Cluster do
  @moduledoc """
  Cluster management. Discover all sites running in the cluster and executes functions globally.
  """

  @doc false
  use GenServer

  require Logger

  @scope :beacon_cluster

  @doc false
  def start_link(opts) do
    GenServer.start_link(__MODULE__, opts, name: __MODULE__)
  end

  @doc false
  @impl true
  def init(opts) do
    {:ok, _} = :pg.start_link(@scope)
    :pg.monitor_scope(@scope)
    :ok = :net_kernel.monitor_nodes(true, node_type: :all)
    {:ok, opts}
  end

  @doc false
  def nodes, do: [Node.self()] ++ Node.list()

  @doc """
  Returns a list of sites running in all connected nodes in the cluster.

  It doesn't try to refresh the list of running sites,
  it only returns the results cached when calling `discover_sites/0`.
  """
  def running_sites do
    :pg.which_groups(@scope)
  end

  @doc """
  Calls a function for a running `site` in the cluster.

  It will call the function in only one of the available nodes to avoid double execution of `fun`.

  ## Examples

      iex> Beacon.LiveAdmin.Cluster.call(:my_site, Beacon, :boot, [:my_site])
      :ok

  """
  @spec call(atom(), module(), fun :: (-> any()), [any()]) :: any()
  def call(site, mod, fun, args) when is_binary(site) do
    site
    |> String.to_existing_atom()
    |> call(mod, fun, args)
  end

  def call(site, mod, fun, args)
      when is_atom(site) and is_atom(mod) and is_atom(fun) and is_list(args) do
    nodes = find_nodes(site)

    if nodes == [] do
      message =
        "no nodes available to call #{Exception.format_mfa(mod, fun, args)} for site #{inspect(site)}"

      Logger.debug(message)
      raise Beacon.LiveAdmin.ClusterError, message: message
    end

    node = pick_node(nodes)
    enable_beacon_autoload(site, node)
    do_call(site, node, mod, fun, args)
  end

  # Before a function call is made to the remote node,
  # we need to enable Beacon's ErrorHandler (module autoload)
  # because that call might depend on modules that have not been loaded yet.
  defp enable_beacon_autoload(site, node) do
    do_call(site, node, Beacon.ErrorHandler, :enable, [site])
  end

  defp do_call(site, node, mod, fun, args) do
    if node == Node.self() do
      apply(mod, fun, args)
    else
      :erpc.call(node, mod, fun, args)
    end
  rescue
    exception ->
      Logger.debug("failed to call #{Exception.format_mfa(mod, fun, args)} for site #{inspect(site)} on node #{inspect(node)}")

      message = """
      failed to call #{Exception.format_mfa(mod, fun, args)} for site #{inspect(site)} on node #{inspect(node)}

      Got:

        #{Exception.message(exception)}

      """

      reraise Beacon.LiveAdmin.ClusterError, [message: message], __STACKTRACE__
  end

  @doc false
  def find_nodes(site) when is_atom(site) do
    Enum.map(:pg.get_members(@scope, site), &GenServer.call(&1, :current_node))
  end

  @doc false
  defp pick_node(nodes) do
    Enum.random(nodes)
  end

  ## Callbacks

  @doc false
  @impl true
  def handle_info({:nodeup, _, _}, state) do
    Beacon.LiveAdmin.PubSub.notify_sites_changed(__MODULE__)
    {:noreply, state}
  end

  @doc false
  def handle_info({:nodedown, _, _}, state) do
    Beacon.LiveAdmin.PubSub.notify_sites_changed(__MODULE__)
    {:noreply, state}
  end

  def handle_info({_ref, :join, _site, _members}, state) do
    Beacon.LiveAdmin.PubSub.notify_sites_changed(__MODULE__)
    {:noreply, state}
  end

  def handle_info({_ref, :leave, _site, _members}, state) do
    Beacon.LiveAdmin.PubSub.notify_sites_changed(__MODULE__)
    {:noreply, state}
  end
end
