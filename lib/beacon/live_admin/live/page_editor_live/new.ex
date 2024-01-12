defmodule Beacon.LiveAdmin.PageEditorLive.New do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Content
  alias Beacon.LiveAdmin.WebAPI
  require Logger

  @impl true
  @spec menu_link(any(), any()) :: :skip | {:submenu, <<_::40>>}
  def menu_link("/pages", :new), do: {:submenu, "Pages"}
  def menu_link(_, _), do: :skip

  def mount(params, session, socket) do
    component_records = Content.list_components(socket.assigns.beacon_page.site, per_page: :infinity)
    %{data: components} = BeaconWeb.API.ComponentJSON.index(%{components: component_records})

    socket = assign(socket,
      page_title: "Create New Page",
      visual_mode: params["visual_mode"] === "true",
      components: components,
      page: %Beacon.Content.Page{
        path: "",
        site: socket.assigns.beacon_page.site,
        layout: %Beacon.Content.Layout{
          template: "<%= @inner_content %>",
          site: socket.assigns.beacon_page.site
        }
      }
    )

    {:ok, socket}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply, assign(socket, visual_mode: params["visual_mode"] === "true")}
  end

  @impl true
  def handle_event("set_template", %{"value" => value}, socket) do
    send_update(Beacon.LiveAdmin.PageEditorLive.FormComponent,
      id: "page-editor-form-new",
      template: value
    )

    {:noreply, socket}
  end

  @impl true
  def handle_event("enable_visual_mode", _args, socket) do
    path = Beacon.LiveAdmin.Router.beacon_live_admin_path(socket, socket.assigns.beacon_page.site, "/pages/new", %{visual_mode: "true"})
    {:noreply, push_patch(socket, to: path)}
  end

  @impl true
  def handle_event("disable_visual_mode", _args, socket) do
    path = Beacon.LiveAdmin.Router.beacon_live_admin_path(socket, socket.assigns.beacon_page.site, "/pages/new")
    {:noreply, push_patch(socket, to: path)}
  end


  @impl true
  def handle_event(
        "render_component_in_page",
        %{"component_id" => component_id},
        socket
      ) do
    component = Content.get_component(socket.assigns.beacon_page.site, component_id)

    %{data: %{ast: ast}} =
      WebAPI.Component.show_ast(socket.assigns.beacon_page.site, component, socket.assigns.page)

    {:reply, %{"ast" => ast}, socket}
  end

  def handle_event("update_page_ast", %{"ast" => ast}, socket) do
    send_update(Beacon.LiveAdmin.PageEditorLive.FormComponent,
      id: "page-editor-form-new",
      ast: ast
    )

    {:noreply, socket}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.live_component
      module={Beacon.LiveAdmin.PageEditorLive.FormComponent}
      id="page-editor-form-new"
      site={@beacon_page.site}
      page_title={@page_title}
      components={@components}
      live_action={@live_action}
      page={@page}
      patch="/pages"
    />
    """
  end
end
