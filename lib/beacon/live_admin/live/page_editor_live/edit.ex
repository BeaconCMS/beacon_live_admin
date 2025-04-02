defmodule Beacon.LiveAdmin.PageEditorLive.Edit do
  @moduledoc false
  require Logger
  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Client.Content

  @impl true
  def menu_link("/pages", :edit), do: {:submenu, "Pages"}
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(params, _url, socket) do
    editor = Map.get(params, "editor", "code")
    %{site: site} = socket.assigns.beacon_page

    page = Content.get_page(site, params["id"], preloads: [:layout])

    socket =
      socket
      |> assign_new(:selected_element_path, fn -> nil end)
      |> assign_new(:layouts, fn -> Content.list_layouts(site) end)
      |> assign_new(:components, fn ->
        components = Content.list_components(site, per_page: :infinity)
        %{data: components} = Beacon.Web.API.ComponentJSON.index(%{components: components})
        components
      end)
      |> assign_new(:page, fn -> page end)
      |> assign_new(:page_assigns, fn -> Beacon.LiveAdmin.Client.HEEx.assigns(site, page) end)

    socket =
      socket
      |> assign(
        page_title: "Edit Page",
        editor: editor
      )

    {:noreply, socket}
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
      page_assigns={@page_assigns}
      selected_element_path={@selected_element_path}
      components={@components}
      editor={@editor}
      patch="/pages"
    />
    """
  end
end
