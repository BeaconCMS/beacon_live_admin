defmodule Beacon.LiveAdmin.RuntimeCSS do
  import Beacon.LiveAdmin.Cluster, only: [call: 4]

  def compile(site, template) when is_atom(site) and is_binary(template) do
    call(site, Beacon.RuntimeCSS, :compile, [site, template])
  end

  def fetch(site, version) when is_atom(site) do
    call(site, Beacon.RuntimeCSS, :fetch, [site, version])
  end
end
