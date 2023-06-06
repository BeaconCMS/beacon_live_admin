defmodule Beacon.LiveAdmin do
  @moduledoc """
  TODO
  """

  defdelegate call(site, module, fun, args), to: Beacon.LiveAdmin.Cluster
end
