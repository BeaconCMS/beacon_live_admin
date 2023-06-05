defmodule Beacon.LiveAdmin.HomeController do
  use Beacon.LiveAdmin.Web, :controller

  def index(conn, _params) do
    running_sites = Beacon.LiveAdmin.Cluster.running_sites()
    render(conn, :index, running_sites: running_sites, layout: {Beacon.LiveAdmin.Layouts, :home})
  end
end
