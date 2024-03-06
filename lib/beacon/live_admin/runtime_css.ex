defmodule Beacon.LiveAdmin.RuntimeCSS do
  import Beacon.LiveAdmin.Cluster, only: [call: 4]
  alias Beacon.LiveAdmin.Content

  def compile(site, template) when is_binary(site) and is_binary(template) do
    site = String.to_existing_atom(site)
    compile(site, template)
  end

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

  def current_hash(site, version) when is_atom(site) do
    call(site, Beacon.RuntimeCSS, :current_hash, [site, version])
  end

  def fetch_for_site(site) do
    components =
      site
      |> Content.list_components(per_page: :infinity)
      |> Enum.reduce([], fn component, acc ->
        [component.body | acc]
      end)

    layouts =
      site
      |> Content.list_layouts(per_page: :infinity)
      |> Enum.reduce([], fn layout, acc ->
        [layout.template | acc]
      end)

    template = IO.iodata_to_binary([components, "\n", layouts])

    case compile(site, template) do
      {:ok, css} ->
        css

      _ ->
        {"/* failed to compile css /*", "text/css"}
    end
  end

  def fetch_for_page(view_id) do
    {site, page_template} =
      view_id
      |> Beacon.LiveAdmin.PageEditorLive.FormComponent.whereis()
      |> GenServer.call(:fetch_page_template, :timer.minutes(1))

    case compile(site, page_template) do
      {:ok, css} ->
        css

      _ ->
        {"/* failed to compile css /*", "text/css"}
    end
  end
end
