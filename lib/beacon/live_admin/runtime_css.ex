defmodule Beacon.LiveAdmin.RuntimeCSS do
  import Beacon.LiveAdmin.Cluster, only: [call: 4]
  alias Beacon.LiveAdmin.Content
  alias Beacon.LiveAdmin.Layouts

  def compile(site, source) when is_atom(site) and is_binary(source) do
    call(site, Beacon.RuntimeCSS, :compile, [site, source])
  end

  def compile(site, source) when is_atom(site) and is_list(source) do
    call(site, Beacon.RuntimeCSS, :compile, [site, source])
  end

  def fetch(site, version) when is_atom(site) do
    call(site, Beacon.RuntimeCSS, :fetch, [site, version])
  end

  def current_site_hash(site) do
    site
    |> site_templates()
    |> IO.iodata_to_binary()
    |> Layouts.hash()
  end

  @doc """
  Site template includind layouts and components, no pages.
  """
  def site_templates(site) do
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

    List.flatten([components, "\n", layouts])
  end

  def fetch_for_site(site) do
    case compile(site, site_templates(site)) do
      {:ok, css} ->
        css

      _ ->
        {"/* failed to compile css /*", "text/css"}
    end
  end
end
