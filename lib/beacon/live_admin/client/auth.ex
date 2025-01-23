defmodule Beacon.LiveAdmin.Client.Auth do
  @moduledoc false

  import Beacon.LiveAdmin.Cluster, only: [call: 4]

  def get_actor(site, session) do
    call(site, Beacon.Auth, :get_actor, [site, session])
  end
end
