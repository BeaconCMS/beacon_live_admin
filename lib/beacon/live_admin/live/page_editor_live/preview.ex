defmodule Beacon.LiveAdmin.PageEditorLive.Preview do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Client.Content

  @impl true
  def menu_link("/pages", :preview), do: {:submenu, "Pages"}
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(%{"id" => id}, _url, socket) do
    site = socket.assigns.beacon_page.site
    page = Content.get_page(site, id)

    # The published page is accessible at its path on the same origin
    live_url = page.path

    {:noreply,
     socket
     |> assign(:page, page)
     |> assign(:live_url, live_url)
     |> assign(:preview_tab, "draft")
     |> assign(page_title: "Preview")}
  end

  @impl true
  def handle_event("preview_tab", %{"tab" => tab}, socket) do
    {:noreply, assign(socket, :preview_tab, tab)}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <Beacon.LiveAdmin.AdminComponents.page_header socket={@socket} flash={@flash} page={@page} live_action={:preview} />

    <.preview
      site={@beacon_page.site}
      type="page"
      id={@page.id}
      live_url={@live_url}
      tab={@preview_tab}
    />
    """
  end
end
