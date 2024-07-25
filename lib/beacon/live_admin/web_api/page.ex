defmodule Beacon.LiveAdmin.WebAPI.Page do
  @moduledoc false

  import Beacon.LiveAdmin.Cluster, only: [call: 4]

  def show(site, page) do
    call(site, Beacon.Web.API.PageJSON, :show, [%{page: page}])
  end
end
