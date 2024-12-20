defmodule Beacon.LiveAdmin.Client.BeaconAssigns do
  @moduledoc false

  import Beacon.LiveAdmin.Cluster, only: [call: 4]

  def new(site, page, metadata \\ []) do
    call(site, Beacon.Web.BeaconAssigns, :new, [page, metadata])
  end
end
