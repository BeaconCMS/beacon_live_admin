defmodule Beacon.LiveAdmin.RuntimeCSS do
  import Beacon.LiveAdmin.Cluster, only: [call: 4]

  def config(site) when is_atom(site) do
    call(site, Beacon.RuntimeCSS, :config, [site])
  end
end
