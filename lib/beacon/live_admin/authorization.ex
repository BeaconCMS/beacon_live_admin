defmodule Beacon.LiveAdmin.Authorization do
  @moduledoc false

  import Beacon.LiveAdmin.Cluster, only: [call: 4]

  def get_agent(site, session) do
    call(site, Beacon.Authorization, :get_agent, [site, session])
  end

  def authorized?(site, agent, operation, context) do
    call(site, Beacon.Authorization, :authorized?, [site, agent, operation, context])
  end
end
