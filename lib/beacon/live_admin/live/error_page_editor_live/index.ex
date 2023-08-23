defmodule Beacon.LiveAdmin.ErrorPageEditorLive.Index do
  @moduledoc false
  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Content

  on_mount {Beacon.LiveAdmin.Hooks.Authorized, {:error_pages, :index}}

  def menu_link(_, :index), do: {:root, "Error Pages"}

  def handle_params(_params, _uri, socket) do
    error_pages = Content.list_error_pages(socket.assigns.beacon_page.site)

    {:noreply, assign(socket, error_pages: error_pages)}
  end

  def render(assigns) do
    ~H"""
    <div>Test</div>
    """
  end
end
