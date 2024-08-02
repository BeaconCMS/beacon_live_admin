defmodule Beacon.LiveAdmin.Config do
  @moduledoc false

  import Beacon.LiveAdmin.Cluster, only: [call: 4]

  defp fetch!(site), do: call(site, Beacon.Config, :fetch!, [site])

  def template_formats(site) do
    fetch!(site).template_formats
  end

  def allowed_media_accept_types(site) do
    fetch!(site).allowed_media_accept_types
  end

  def extra_page_fields(site) do
    fetch!(site).extra_page_fields
  end
end
