defmodule Beacon.LiveAdmin.PageEditorLive.Index do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder, table: [sort_by: "path"]

  alias Beacon.LiveAdmin.Client.Content

  @impl true
  def menu_link(_, :index), do: {:root, "Pages"}

  @impl true
  def mount(_params, _session, socket) do
    {:ok, stream_configure(socket, :pages, dom_id: &"#{Ecto.UUID.generate()}-#{&1.id}")}
  end

  @impl true
  def handle_params(params, _uri, socket) do
    socket =
      Table.handle_params(socket, params, &Content.count_pages(&1.site, query: params["query"]))

    %{site: site, table: %{per_page: per_page, current_page: page, query: query, sort_by: sort_by}} = socket.assigns.beacon_page

    pages =
      list_pages(site,
        per_page: per_page,
        page: page,
        query: query,
        sort: sort_by
      )

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

    <div class="flex justify-between">
      <div class="basis-8/12">
        <.table_search table={@beacon_page.table} placeholder="Search by path or title (showing up to 15 results)" />
      </div>
      <div class="basis-2/12">
        <.table_sort table={@beacon_page.table} options={[{"Title", "title"}, {"Path", "path"}]} />
      </div>
    </div>

    <.main_content>
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

      <.table_pagination socket={@socket} page={@beacon_page} />
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

  defp display_status(:unpublished), do: "Unpublished"
  defp display_status(:published), do: "Published"
  defp display_status(:created), do: "Draft"
end
