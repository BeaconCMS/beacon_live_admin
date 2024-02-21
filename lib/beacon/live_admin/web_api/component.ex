defmodule Beacon.LiveAdmin.WebAPI.Component do
  @moduledoc """
  Calls Beacon Web API through the cluster.
  """

  import Beacon.LiveAdmin.Cluster, only: [call: 4]

  def show_ast(site, component, page) do
    path = for segment <- String.split(page.path, "/"), segment != "", do: segment
    beacon_live_data = call(site, BeaconWeb.DataSource, :live_data, [site, path])

    call(site, BeaconWeb.API.ComponentJSON, :show_ast, [
      %{component: component, assigns: %{beacon_live_data: beacon_live_data}}
    ])
  end
end
