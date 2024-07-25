defmodule Beacon.LiveAdmin.Beacon.Web do
  @moduledoc false

  import Beacon.LiveAdmin.Cluster, only: [call: 4]

  def beacon_assigns(site, page, live_data, path_info, query_params) do
    call(site, Beacon.Web.BeaconAssigns, :new, [site, page, live_data, path_info, query_params])
  end
end
