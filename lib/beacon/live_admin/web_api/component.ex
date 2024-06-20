defmodule Beacon.LiveAdmin.WebAPI.Component do
  @moduledoc """
  Calls Beacon Web API through the cluster.
  """

  import Beacon.LiveAdmin.Cluster, only: [call: 4]

  def show_ast(site, component, page) do
    path_info = for segment <- String.split(page.path, "/"), segment != "", do: segment
    live_data = call(site, BeaconWeb.DataSource, :live_data, [site, path_info])
    beacon = Beacon.LiveAdmin.BeaconWeb.beacon_assigns(site, page, live_data, path_info, %{})

    call(site, BeaconWeb.API.ComponentJSON, :show_ast, [
      %{component: component, assigns: %{beacon: beacon, beacon_live_data: live_data}}
    ])
  end
end