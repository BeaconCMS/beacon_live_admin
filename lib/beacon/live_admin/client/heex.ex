defmodule Beacon.LiveAdmin.Client.HEEx do
  @moduledoc false

  import Beacon.LiveAdmin.Cluster, only: [call: 4]

  def assigns(site, page) do
    call(site, Beacon.Template, :assigns, [page])
  end

  def render(site, template, assigns \\ %{}) do
    call(site, Beacon.Template.HEEx, :render, [site, template, assigns])
  end
end
