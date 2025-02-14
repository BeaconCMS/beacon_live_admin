defmodule Beacon.LiveAdmin.Application do
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      Beacon.LiveAdmin.Registry,
      {Phoenix.PubSub, name: Beacon.LiveAdmin.PubSub},
      %{id: :pg, start: {:pg, :start_link, [Beacon.LiveAdmin.Cluster.scope()]}},
      Beacon.LiveAdmin.Cluster,
      Turboprop.Cache
    ]

    Supervisor.start_link(children, strategy: :one_for_one, name: Beacon.LiveAdmin.Supervisor)
  end
end
