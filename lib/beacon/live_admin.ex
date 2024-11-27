defmodule Beacon.LiveAdmin do
  @moduledoc """
  Beacon LiveAdmin is a Phoenix LiveView web application to manage Beacon sites.
  """

  use Supervisor
  require Logger
  alias Beacon.LiveAdmin.Config

  @doc """
  Starts Beacon LiveAdmin's main supervisor and a supervisor for each instance.
  """
  def start_link(opts) when is_list(opts) do
    Supervisor.start_link(__MODULE__, opts, name: __MODULE__)
  end

  @doc false
  @impl true
  def init(opts) do
    instances = Keyword.get(opts, :instances, [])

    if instances == [] do
      Logger.warning("Beacon.LiveAdmin will start with no instances configured. See `Beacon.LiveAdmin.start_link/1` for more info.")
    end

    children =
      Enum.map(instances, fn opts ->
        opts
        |> Config.new()
        |> instance_child_spec()
      end)

    Supervisor.init(children, strategy: :one_for_one)
  end

  defp instance_child_spec(%Config{} = config) do
    Supervisor.child_spec({Beacon.LiveAdmin.InstanceSupervisor, config}, id: config.name)
  end
end
