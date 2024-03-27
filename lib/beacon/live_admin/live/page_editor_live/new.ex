defmodule Beacon.LiveAdmin.PageEditorLive.New do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Content
  alias Beacon.LiveAdmin.WebAPI

  @impl true
  def menu_link("/pages", :new), do: {:submenu, "Pages"}
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(params, _url, socket) do
    editor = Map.get(params, "editor", "code")
    %{site: site} = socket.assigns.beacon_page

    socket =
      socket
      |> assign_new(:layouts, fn -> Content.list_layouts(site) end)
      |> assign_new(:components, fn ->
        components = Content.list_components(site, per_page: :infinity)
        %{data: components} = BeaconWeb.API.ComponentJSON.index(%{components: components})
        components
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
      path: "",
      site: site,
      layout_id: layout.id,
      layout: layout
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
  def handle_event("set_template", %{"value" => value}, socket) do
    send_update(Beacon.LiveAdmin.PageEditorLive.FormComponent,
      id: "page-editor-form-new",
      template: value
    )

    {:noreply, socket}
  end

  def handle_event("enable_editor", %{"editor" => editor}, socket) do
    path =
      Beacon.LiveAdmin.Router.beacon_live_admin_path(
        socket,
        socket.assigns.beacon_page.site,
        "/pages/new",
        %{editor: editor}
      )

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
      live_action={@live_action}
      page_title={@page_title}
      site={@beacon_page.site}
      layouts={@layouts}
      page={@page}
      components={@components}
      editor={@editor}
      patch="/pages"
    />
    """
  end
end
