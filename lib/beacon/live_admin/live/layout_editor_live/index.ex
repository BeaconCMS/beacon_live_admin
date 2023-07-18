defmodule Beacon.LiveAdmin.LayoutEditorLive.Index do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Content

  on_mount {Beacon.LiveAdmin.Hooks.Authorized, {:layout_editor, :index}}

  @impl true
  def menu_link(:index), do: {:ok, "Layouts"}
  def menu_link(_), do: :skip

  @impl true
  def mount(_params, _session, socket) do
    layouts = list_layouts(socket.assigns.beacon_page.site)
    {:ok, stream(socket, :layouts, layouts)}
  end

  @impl true
  def handle_params(%{"query" => query}, _uri, socket) do
    layouts = list_layouts(socket.assigns.beacon_page.site, query: query)
    {:noreply, stream(socket, :layouts, layouts, reset: true)}
  end

  def handle_params(_params, _uri, socket) do
    {:noreply, socket}
  end

  @impl true
  def handle_event("search", %{"search" => %{"query" => query}}, socket) do
    path =
      beacon_live_admin_path(socket, socket.assigns.beacon_page.site, "/layouts?query=#{query}")

    {:noreply, push_patch(socket, to: path, replace: true)}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.header>
      Listing Layouts
      <:actions>
        <.link patch={beacon_live_admin_path(@socket, @beacon_page.site, "/layouts/new")} phx-click={JS.push_focus()}>
          <.button>Create New Layout</.button>
        </.link>
      </:actions>
    </.header>

    <div class="my-4">
      <.simple_form :let={f} for={%{}} as={:search} phx-change="search">
        <div class="flex gap-4 items-center">
          <div class="flex-grow">
            <.input field={f[:query]} type="search" autofocus={true} placeholder="Search by title (showing up to 20 results)" />
          </div>
        </div>
      </.simple_form>
    </div>

    <.table id="layouts" rows={@streams.layouts} row_click={fn {_id, layout} -> JS.navigate(beacon_live_admin_path(@socket, @beacon_page.site, "/layouts/#{layout.id}")) end}>
      <:col :let={{_id, layout}} label="Title"><%= layout.title %></:col>
      <:col :let={{_id, layout}} label="Status"><%= display_status(layout.status) %></:col>
      <:action :let={{_id, layout}}>
        <div class="sr-only">
          <.link navigate={beacon_live_admin_path(@socket, @beacon_page.site, "/layouts/#{layout.id}")}>Edit</.link>
        </div>
        <.link patch={beacon_live_admin_path(@socket, @beacon_page.site, "/layouts/#{layout.id}")}>
          <.icon name="hero-pencil-square" />
        </.link>
      </:action>
    </.table>
    """
  end

  defp list_layouts(site, opts \\ []) do
    site
    |> Content.list_layouts(opts)
    |> Enum.map(fn layout ->
      Map.put(layout, :status, Content.get_latest_layout_event(layout.site, layout.id).event)
    end)
  end

  defp display_status(:published), do: "Published"
  defp display_status(:created), do: "Draft"
end
