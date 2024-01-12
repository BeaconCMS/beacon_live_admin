defmodule Beacon.LiveAdmin.PageEditorLive.Edit do
  @moduledoc false

  require IEx
  require Logger
  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Content
  alias Beacon.LiveAdmin.WebAPI

  @impl true
  def menu_link("/pages", :edit), do: {:submenu, "Pages"}
  def menu_link(_, _), do: :skip

  @impl true
  def mount(params, _session, socket) do
    component_records =
      Content.list_components(socket.assigns.beacon_page.site, per_page: :infinity)

    {:ok,
     assign(socket,
       page: nil,
       visual_mode: params["visual_mode"] === "true",
       components: component_records
     )}
  end

  @impl true
  def handle_params(%{"id" => id} = params, _url, socket) do
    page = Content.get_page(socket.assigns.beacon_page.site, id, preloads: [:layout])

    component_records =
      Content.list_components(socket.assigns.beacon_page.site, per_page: :infinity)

    %{data: components} = BeaconWeb.API.ComponentJSON.index(%{components: component_records})
    Logger.debug("##################### handle_params: params: #{inspect(params)}")
    {:noreply,
     assign(socket,
       page_title: "Edit Page",
       page: page,
       visual_mode: params["visual_mode"] === "true",
       components: components
     )}
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
  def handle_event("enable_visual_mode", _args, socket) do
    path = Beacon.LiveAdmin.Router.beacon_live_admin_path(socket, socket.assigns.beacon_page.site, "/pages/#{socket.assigns.page.id}", %{visual_mode: "true"})
    {:noreply, push_patch(socket, to: path)}
  end

  @impl true
  def handle_event("disable_visual_mode", _args, socket) do
    path = Beacon.LiveAdmin.Router.beacon_live_admin_path(socket, socket.assigns.beacon_page.site, "/pages/#{socket.assigns.page.id}")
    {:noreply, push_patch(socket, to: path)}
  end

  @impl true
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
      visual_mode={@visual_mode}
      components={@components}
      page={@page}
      patch="/pages"
    />
    """
  end
end
