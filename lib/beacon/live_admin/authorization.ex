defmodule Beacon.LiveAdmin.Authorization do
  @moduledoc """
  Calls Beacon Authorization API through the cluster.

  The function call is made on the first available node for a site,
  which may be running in multiple nodes.
  """

  import Beacon.LiveAdmin.Cluster, only: [call: 4]

  def get_agent(site, session) do
    call(site, Beacon.Authorization, :get_agent, [site, session])
  end

  def authorized?(site, agent, operation, context) do
    call(site, Beacon.Authorization, :authorized?, [site, agent, operation, context])
  end
end
