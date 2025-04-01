defmodule Beacon.LiveAdmin.Client.HEEx do
  @moduledoc false

  import Beacon.LiveAdmin.Cluster, only: [call: 4]

  def render(site, template, opts \\ []) do
    call(site, Beacon.Template.HEEx, :render, [site, template, opts])
  end
end
