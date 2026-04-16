defmodule Beacon.LiveAdmin.LayoutEditorLive.Preview do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Client.Content

  @impl true
  def menu_link("/layouts", :preview), do: {:submenu, "Layouts"}
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(%{"id" => id}, _url, socket) do
    site = socket.assigns.beacon_page.site
    layout = Content.get_layout(site, id)

    {:noreply,
     socket
     |> assign(:layout, layout)
     |> assign(:preview_tab, "draft")
     |> assign(page_title: "Layout Preview")}
  end

  @impl true
  def handle_event("preview_tab", %{"tab" => tab}, socket) do
    {:noreply, assign(socket, :preview_tab, tab)}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <Beacon.LiveAdmin.AdminComponents.layout_header socket={@socket} flash={@flash} beacon_layout={@layout} live_action={:preview} />

    <.preview
      site={@beacon_page.site}
      type="layout"
      id={@layout.id}
      tab={@preview_tab}
    />
    """
  end
end
