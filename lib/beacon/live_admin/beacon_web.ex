defmodule Beacon.LiveAdmin.BeaconWeb do
  @moduledoc false
  import Beacon.LiveAdmin.Cluster, only: [call: 4]

  def beacon_assigns(site, path_info, query_params) do
    beacon = call(site, BeaconWeb.BeaconAssigns, :build, [site])
    call(site, BeaconWeb.BeaconAssigns, :build, [beacon, path_info, query_params])
  end
end
