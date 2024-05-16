defmodule Beacon.LiveAdmin.LayoutEditorLive.Index do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Content

  on_mount {Beacon.LiveAdmin.Hooks.Authorized, {:layout_editor, :index}}

  @impl true
  def menu_link(_, :index), do: {:root, "Layouts"}

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign(socket, :beacon_layouts, [])}
  end

  @impl true
  def handle_params(%{"query" => query}, _uri, socket) do
    layouts = list_layouts(socket.assigns.beacon_page.site, query: query)
    {:noreply, assign(socket, :beacon_layouts, layouts)}
  end

  def handle_params(_params, _uri, socket) do
    layouts = list_layouts(socket.assigns.beacon_page.site)
    {:noreply, assign(socket, :beacon_layouts, layouts)}
  end

  @impl true
  def handle_event("search", %{"search" => %{"query" => query}}, socket) do
    path =
      beacon_live_admin_path(
        socket,
        socket.assigns.beacon_page.site,
        "/layouts?query=#{query}"
      )

    {:noreply, push_patch(socket, to: path)}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.header>
      Layouts
      <:actions>
        <.link patch={beacon_live_admin_path(@socket, @beacon_page.site, "/layouts/new")} phx-click={JS.push_focus()}>
          <.button class="uppercase">Create New Layout</.button>
        </.link>
      </:actions>
    </.header>

    <.simple_form :let={f} id="search-form" for={%{}} as={:search} phx-change="search">
      <.input field={f[:query]} type="search" autofocus={true} placeholder="Search by title (showing up to 20 results)" />
    </.simple_form>

    <.main_content>
      <.table id="layouts" rows={@beacon_layouts} row_click={fn layout -> JS.navigate(beacon_live_admin_path(@socket, @beacon_page.site, "/layouts/#{layout.id}")) end}>
        <:col :let={layout} label="Title"><%= layout.title %></:col>
        <:col :let={layout} label="Status"><%= display_status(layout.status) %></:col>
        <:action :let={layout}>
          <div class="sr-only">
            <.link navigate={beacon_live_admin_path(@socket, @beacon_page.site, "/layouts/#{layout.id}")}>Edit</.link>
          </div>
          <.link patch={beacon_live_admin_path(@socket, @beacon_page.site, "/layouts/#{layout.id}")} title="Edit layout" aria-label="Edit layout" class="flex items-center justify-center w-10 h-10 group">
            <.icon name="hero-pencil-square text-[#61758A] hover:text-[#304254]" />
          </.link>
        </:action>
      </.table>
    </.main_content>
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
