defmodule Beacon.LiveAdmin.Application do
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      {Phoenix.PubSub, name: Beacon.LiveAdmin.PubSub},
    ]

    opts = [strategy: :one_for_one, name: Beacon.LiveAdmin.Supervisor]
    Supervisor.start_link(children, opts)
  end

end
