defmodule Beacon.LiveAdmin.PageEditorLive.Edit do
  @moduledoc false
  require Logger
  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.PageEditorLive.ElementSelection
  alias Beacon.LiveAdmin.Client.Content
  alias Beacon.LiveAdmin.WebAPI

  @impl true
  def menu_link("/pages", :edit), do: {:submenu, "Pages"}
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
        components = Content.list_components(site, per_page: :infinity)
        %{data: components} = Beacon.Web.API.ComponentJSON.index(%{components: components})
        components
      end)
      |> assign_new(:page, fn -> Content.get_page(site, params["id"], preloads: [:layout]) end)

    socket =
      socket
      |> assign(
        page_title: "Edit Page",
        editor: editor
      )

    {:noreply, socket}
  end

  @impl true
  def handle_event("set_template", %{"value" => value}, socket) do
    send_update(Beacon.LiveAdmin.PageEditorLive.FormComponent,
      id: "page-editor-form",
      template: value
    )

    {:noreply, socket}
  end

  # def handle_event("update_page_ast", %{"ast" => ast}, socket) do
  #   send_update(Beacon.LiveAdmin.PageEditorLive.FormComponent,
  #     id: "page-editor-form",
  #     ast: ast
  #   )
  #
  #   {:noreply, socket}
  # end
  #
  # def handle_event(
  #       "render_component_in_page",
  #       %{"component_id" => component_id, "page_id" => page_id},
  #       socket
  #     ) do
  #   page = Content.get_page(socket.assigns.beacon_page.site, page_id)
  #   component = Content.get_component(socket.assigns.beacon_page.site, component_id)
  #
  #   %{data: %{ast: ast}} =
  #     WebAPI.Component.show_ast(socket.assigns.beacon_page.site, component, page)
  #
  #   {:reply, %{"ast" => ast}, socket}
  # end

  # def handle_event("select_element", %{"path" => path}, socket) do
  #   ElementSelection.select_element(path, socket)
  # end
  #
  # @impl true
  # def handle_info({:element_changed, {path, payload}}, socket) do
  #   ElementSelection.handle_element_changed({path, payload}, socket)
  # end

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
