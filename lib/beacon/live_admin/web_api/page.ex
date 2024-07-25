defmodule Beacon.LiveAdmin.WebAPI.Page do
  @moduledoc """
  Calls Beacon Web API through the cluster.
  """

  import Beacon.LiveAdmin.Cluster, only: [call: 4]

  def show(site, page) do
    call(site, Beacon.Web.API.PageJSON, :show, [%{page: page}])
  end
end
