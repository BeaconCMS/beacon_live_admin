defmodule Beacon.LiveAdmin.PageEditorLive.Edit do
  @moduledoc false

  require IEx
  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Content
  alias Beacon.LiveAdmin.WebAPI

  @impl true
  def menu_link("/pages", :edit), do: {:submenu, "Pages"}
  def menu_link(_, _), do: :skip

  @impl true
  def mount(%{"id" => id} = params, _session, socket) do
    page = Content.get_page(socket.assigns.beacon_page.site, id, preloads: [:layout])
    components = Content.list_components(socket.assigns.beacon_page.site, per_page: :infinity)
    %{data: components} = BeaconWeb.API.ComponentJSON.index(%{components: components})
    editor = Map.get(params, "editor", "code")

    {:ok,
     assign(socket,
       page: page,
       components: components,
       editor: editor
     )}
  end

  @impl true
  def handle_params(params, _url, socket) do
    editor = Map.get(params, "editor", "code")
    {:noreply, assign(socket, page_title: "Edit Page", editor: editor)}
  end

  @impl true
  def handle_event("set_template", %{"value" => value}, socket) do
    send_update(Beacon.LiveAdmin.PageEditorLive.FormComponent,
      id: "page-editor-form-edit",
      template: value
    )

    {:noreply, socket}
  end

  @impl true
  def handle_event("enable_editor", %{"editor" => editor}, socket) do
    path =
      Beacon.LiveAdmin.Router.beacon_live_admin_path(
        socket,
        socket.assigns.beacon_page.site,
        "/pages/#{socket.assigns.page.id}",
        %{editor: editor}
      )

    {:noreply, push_patch(socket, to: path)}
  end

  def handle_event(
        "render_component_in_page",
        %{"component_id" => component_id, "page_id" => page_id},
        socket
      ) do
    page = Content.get_page(socket.assigns.beacon_page.site, page_id)
    component = Content.get_component(socket.assigns.beacon_page.site, component_id)

    %{data: %{ast: ast}} =
      WebAPI.Component.show_ast(socket.assigns.beacon_page.site, component, page)

    {:reply, %{"ast" => ast}, socket}
  end

  def handle_event("update_page_ast", %{"ast" => ast}, socket) do
    send_update(Beacon.LiveAdmin.PageEditorLive.FormComponent,
      id: "page-editor-form-edit",
      ast: ast
    )

    {:noreply, socket}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.live_component
      module={Beacon.LiveAdmin.PageEditorLive.FormComponent}
      id="page-editor-form-edit"
      site={@beacon_page.site}
      page_title={@page_title}
      live_action={@live_action}
      editor={@editor}
      components={@components}
      page={@page}
      patch="/pages"
    />
    """
  end
end
