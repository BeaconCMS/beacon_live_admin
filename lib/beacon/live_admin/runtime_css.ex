defmodule Beacon.LiveAdmin.RuntimeCSS do
  @moduledoc false

  import Beacon.LiveAdmin.Cluster, only: [call: 4]

  def asset_url(site) when is_atom(site) do
    call(site, Beacon.RuntimeCSS, :asset_url, [site])
  end
end
