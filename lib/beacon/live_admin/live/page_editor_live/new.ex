defmodule Beacon.LiveAdmin.PageEditorLive.New do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Client.Content

  @impl true
  def menu_link("/pages", :new), do: {:submenu, "Pages"}
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(params, _url, socket) do
    editor = Map.get(params, "editor", "code")
    %{site: site} = socket.assigns.beacon_page

    socket =
      socket
      |> assign_new(:selected_element_path, fn -> nil end)
      |> assign_new(:layouts, fn -> Content.list_layouts(site) end)
      |> assign_new(:components, fn ->
        site
        |> Content.list_components(per_page: :infinity)
        |> Enum.map(fn component ->
          %{
            id: component.id,
            name: component.name,
            category: component.category,
            thumbnail: component.thumbnail,
            template: component.template,
            example: component.example
          }
        end)
      end)

    socket =
      assign(socket,
        page_title: "Create New Page",
        editor: editor,
        page: build_new_page(site, socket.assigns.layouts)
      )

    {:noreply, socket}
  end

  defp build_new_page(site, [layout | _] = _layouts) do
    %Beacon.Content.Page{
      path: "/new-page-#{Date.utc_today()}",
      site: site,
      layout_id: layout.id,
      layout: layout,
      title: "New Page",
      template: "<div>Welcome to BeaconCMS!</div>"
    }
  end

  defp build_new_page(site, _layouts) do
    %Beacon.Content.Page{
      path: "",
      site: site,
      layout_id: nil,
      layout: nil
    }
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.live_component
      module={Beacon.LiveAdmin.PageEditorLive.FormComponent}
      id="page-editor-form"
      live_action={@live_action}
      page_title={@page_title}
      site={@beacon_page.site}
      layouts={@layouts}
      page={@page}
      selected_element_path={@selected_element_path}
      components={@components}
      editor={@editor}
      patch="/pages"
    />
    """
  end
end
