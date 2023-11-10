defmodule Beacon.LiveAdmin.PageEditorLive.New do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.Content
  alias Beacon.LiveAdmin.WebAPI

  @impl true
  @spec menu_link(any(), any()) :: :skip | {:submenu, <<_::40>>}
  def menu_link("/pages", :new), do: {:submenu, "Pages"}
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(_params, _url, socket) do
    {:noreply, assigns(socket)}
  end

  defp assigns(socket) do
    %{data: components} =
      BeaconWeb.API.ComponentJSON.index(%{
        components: [] # Content.list_components(socket.assigns.beacon_page.site, per_page: :infinity)
      })

    assign(socket,
      page_title: "Create New Page",
      visual_mode: true,
      components: components,
      page: %Content.Page{
        path: "",
        site: socket.assigns.beacon_page.site,
        layout: %Content.Layout{
          template: "",
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
  def handle_event("enable_visual_mode", _args, socket) do
    {:noreply, assign(socket, visual_mode: true)}
  end

  @impl true
  def handle_event("disable_visual_mode", _args, socket) do
    {:noreply, assign(socket, visual_mode: false)}
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
