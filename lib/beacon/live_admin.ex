defmodule Beacon.LiveAdmin do
  @moduledoc """
  TODO
  """

  alias Beacon.LiveAdmin.Cluster

  defdelegate call(site, module, fun, args), to: Beacon.LiveAdmin.Cluster

  def config!(site) do
    Cluster.call(site, Beacon.Config, :fetch!, [site])
  end
end
