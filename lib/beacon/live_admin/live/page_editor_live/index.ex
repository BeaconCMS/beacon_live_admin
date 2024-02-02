defmodule Beacon.LiveAdmin.PageEditorLive.Index do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Content

  on_mount {Beacon.LiveAdmin.Hooks.Authorized, {:page_editor, :index}}

  @per_page 20
  @default_sort :title

  @impl true
  def menu_link(_, :index), do: {:root, "Pages"}

  @impl true
  def mount(_params, _session, socket) do
    {:ok,
     socket
     |> assign(
       page: 1,
       pages: number_of_pages(socket.assigns.beacon_page.site),
       sort: @default_sort,
       query: ""
     )
     |> stream_configure(:pages, dom_id: &"#{Ecto.UUID.generate()}-#{&1.id}")}
  end

  @impl true
  def handle_params(params, _uri, socket) do
    query = params["query"]
    offset = set_offset(params["page"])
    sort = set_sort(params["sort"], socket)
    socket = set_page(offset, params["page"], socket)

    pages =
      list_pages(socket.assigns.beacon_page.site,
        per_page: @per_page,
        offset: offset,
        query: query,
        sort: sort
      )

    {:noreply,
     socket
     |> assign(sort: sort, query: query)
     |> stream(:pages, pages, reset: true)}
  end

  def handle_event("search", %{"search" => %{"query" => query, "sort" => sort}}, socket) do
    path =
      beacon_live_admin_path(
        socket,
        socket.assigns.beacon_page.site,
        "/pages?page=#{socket.assigns.page}&sort=#{sort}#{query_param(query)}"
      )

    {:noreply,
     socket
     |> assign(sort: set_sort(sort, socket))
     |> push_patch(to: path)}
  end

  def handle_event("set-page", %{"page" => page}, socket) do
    page
    |> String.to_integer()
    |> set_page(socket)
  end

  def handle_event("prev-page", _, %{assigns: %{page: 1}} = socket) do
    {:noreply, socket}
  end

  def handle_event("prev-page", _, socket) do
    set_page(socket.assigns.page - 1, socket)
  end

  def handle_event("next-page", _, %{assigns: %{page: page, pages: page}} = socket) do
    {:noreply, socket}
  end

  def handle_event("next-page", _, socket) do
    set_page(socket.assigns.page + 1, socket)
  end

  defp set_page(page, socket) do
    path =
      beacon_live_admin_path(
        socket,
        socket.assigns.beacon_page.site,
        "/pages?page=#{page}"
      )

    {:noreply,
     socket
     |> assign(page: page)
     |> push_patch(to: path)}
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
      <div class="flex justify-between">
        <div class="basis-10/12">
          <.input field={f[:query]} value={@query} type="search" autofocus={true} placeholder="Search by path or title (showing up to 20 results)" />
        </div>
        <div :if={@pages > 0} class="basis-1/12">
          <.input type="select" field={f[:sort]} value={@sort} options={[{"Title", "title"}, {"Path", "path"}]} />
        </div>
      </div>
    </.simple_form>

    <.main_content class="h-[calc(100vh_-_210px)]">
      <.table id="pages" rows={@streams.pages} row_click={fn {_dom_id, page} -> JS.navigate(beacon_live_admin_path(@socket, @beacon_page.site, "/pages/#{page.id}")) end}>
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

      <.pagination :if={@pages > 0} current_page={@page} pages={@pages} />
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

  defp set_offset(nil), do: 0
  defp set_offset(page) when is_binary(page), do: String.to_integer(page) * @per_page - @per_page
  defp set_offset(page), do: page * @per_page - @per_page

  defp set_page(0, _page, socket), do: socket
  defp set_page(_offset, page, socket), do: assign(socket, page: String.to_integer(page))

  defp set_sort(nil, socket), do: socket.assigns.sort
  defp set_sort("", socket), do: socket.assigns.sort
  defp set_sort(sort, _socket), do: String.to_atom(sort)

  defp display_status(:unpublished), do: "Unpublished"
  defp display_status(:published), do: "Published"
  defp display_status(:created), do: "Draft"

  defp query_param(""), do: ""
  defp query_param(query), do: "&query=#{query}"
end
