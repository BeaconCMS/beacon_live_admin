defmodule Beacon.LiveAdmin.InstanceSupervisor do
  @moduledoc false

  use Supervisor

  def start_link(config) do
    Supervisor.start_link(__MODULE__, config, name: Beacon.LiveAdmin.Registry.via({:instance, config.name}))
  end

  @impl true
  def init(config) do
    children = [
      {Beacon.LiveAdmin.Config, config}
    ]

    Supervisor.init(children, strategy: :one_for_one)
  end
end
