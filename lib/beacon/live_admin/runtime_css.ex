defmodule Beacon.LiveAdmin.RuntimeCSS do
  import Beacon.LiveAdmin.Cluster, only: [call: 4]

  def compile(site, template) when is_atom(site) and is_binary(template) do
    call(site, Beacon.RuntimeCSS, :compile, [site, template])
  end

  def fetch(site, version) when is_binary(site) do
    site = String.to_existing_atom(site)
    fetch(site, version)
  end

  def fetch(site, version) when is_atom(site) do
    call(site, Beacon.RuntimeCSS, :fetch, [site, version])
  end

  def fetch_for_page(view_id) do
    view_id
    |> Beacon.LiveAdmin.PageEditorLive.FormComponent.whereis()
    |> GenServer.call(:fetch_page_css, :timer.minutes(1))
  end
end
