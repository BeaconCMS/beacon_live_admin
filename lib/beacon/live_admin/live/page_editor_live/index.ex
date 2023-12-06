defmodule Beacon.LiveAdmin.PageEditorLive.Index do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Content
  alias Beacon.LiveAdmin.Components.Pagination

  on_mount {Beacon.LiveAdmin.Hooks.Authorized, {:page_editor, :index}}

  @per_page 20

  @impl true
  def menu_link(_, :index), do: {:root, "Pages"}

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign(socket, pages: number_of_pages(socket.assigns.beacon_page.site))}
  end

  @impl true
  def handle_params(%{"query" => query}, _uri, socket) do
    pages = list_pages(socket.assigns.beacon_page.site, query: query)
    {:noreply, stream(socket, :pages, pages, reset: true)}
  end

  def handle_params(_params, _uri, socket) do
    pages = list_pages(socket.assigns.beacon_page.site, per_page: @per_page)
    {:noreply, stream(socket, :pages, pages, reset: true)}
  end

  @impl true
  def handle_event("search", %{"search" => %{"query" => query}}, socket) do
    path =
      beacon_live_admin_path(
        socket,
        socket.assigns.beacon_page.site,
        "/pages?query=#{query}"
      )

    {:noreply, push_patch(socket, to: path)}
  end

  def handle_event("set-page", %{"page" => page}, socket) do
    page = String.to_integer(page)
    offset = set_offset(page)
    pages = list_pages(socket.assigns.beacon_page.site, offset: offset, per_page: @per_page)

    {:noreply, stream(socket, :pages, pages, reset: true)}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.header>
      Pages
      <:actions>
        <.link patch={beacon_live_admin_path(@socket, @beacon_page.site, "/pages/new")} phx-click={JS.push_focus()}>
          <.button class="uppercase">Create New Page</.button>
        </.link>
      </:actions>
    </.header>

    <.simple_form :let={f} for={%{}} as={:search} phx-change="search">
      <.input field={f[:query]} type="search" autofocus={true} placeholder="Search by path or title (showing up to 20 results)" />
    </.simple_form>

    <.main_content class="h-[calc(100vh_-_210px)]">
      <.table id="pages" rows={@streams.pages} row_click={fn {_id, page} -> JS.navigate(beacon_live_admin_path(@socket, @beacon_page.site, "/pages/#{page.id}")) end}>
        <:col :let={{_, page}} label="Title"><%= page.title %></:col>
        <:col :let={{_, page}} label="Path"><%= page.path %></:col>
        <:col :let={{_, page}} label="Status"><%= display_status(page.status) %></:col>
        <:action :let={{_, page}}>
          <div class="sr-only">
            <.link navigate={beacon_live_admin_path(@socket, @beacon_page.site, "/pages/#{page.id}")}>Show</.link>
          </div>
          <.link patch={beacon_live_admin_path(@socket, @beacon_page.site, "/pages/#{page.id}")} title="Edit page" aria-label="Edit page" class="flex items-center justify-center w-10 h-10 group">
            <.icon name="hero-pencil-square text-[#61758A] hover:text-[#304254]" />
          </.link>
        </:action>
      </.table>

      <.live_component module={Pagination} id="pagination" pages={@pages} />
    </.main_content>
    """
  end

  defp list_pages(site, opts) do
    site
    |> Content.list_pages(opts)
    |> Enum.map(fn page ->
      Map.put(page, :status, Content.get_latest_page_event(page.site, page.id).event)
    end)
  end

  defp number_of_pages(site) do
    site
    |> Content.count_pages()
    |> Kernel./(@per_page)
    |> ceil()
  end

  defp set_offset(page), do: page * @per_page - @per_page

  defp display_status(:unpublished), do: "Unpublished"
  defp display_status(:published), do: "Published"
  defp display_status(:created), do: "Draft"
end
