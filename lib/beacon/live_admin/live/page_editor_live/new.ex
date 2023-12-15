defmodule Beacon.LiveAdmin.PageEditorLive.New do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Content
  alias Beacon.LiveAdmin.WebAPI

  @impl true
  @spec menu_link(any(), any()) :: :skip | {:submenu, <<_::40>>}
  def menu_link("/pages", :new), do: {:submenu, "Pages"}
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply, assigns(socket, params)}
  end

  defp assigns(socket, params \\ %{}) do
    component_records = Content.list_components(socket.assigns.beacon_page.site, per_page: :infinity)
    %{data: components} = BeaconWeb.API.ComponentJSON.index(%{components: component_records})

    assign(socket,
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


  def handle_event("update_page_ast", %{"id" => id, "ast" => ast}, socket) do
    page = Content.set_page_ast(socket.assigns.beacon_page.site, socket.assigns.page, ast)
    {:noreply, assign(socket, :page, page)}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.live_component
      module={Beacon.LiveAdmin.PageEditorLive.FormComponent}
      id="page-editor-form-new"
      site={@beacon_page.site}
      page_title={@page_title}
      visual_mode={@visual_mode}
      components={@components}
      live_action={@live_action}
      page={@page}
      patch="/pages"
    />
    """
  end
end
