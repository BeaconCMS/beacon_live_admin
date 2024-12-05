defmodule Beacon.LiveAdmin.MediaLibraryLive.Index do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder, table: [sort_by: "file_name"]

  alias Beacon.LiveAdmin.Client.MediaLibrary
  alias Beacon.MediaLibrary.Asset

  @impl true
  def menu_link(_, action) when action in [:index, :upload, :show], do: {:root, "Media Library"}

  @impl true
  def mount(_params, _session, socket) do
    {:ok,
     socket
     |> assign(:authn_context, %{mod: :media_library})
     |> stream_configure(:assets, dom_id: &"#{Ecto.UUID.generate()}-#{&1.id}")}
  end

  @impl true
  def handle_params(params, _url, %{assigns: assigns} = socket) do
    socket =
      Table.handle_params(
        socket,
        params,
        &MediaLibrary.count_assets(&1.site, query: params["query"])
      )

    %{per_page: per_page, current_page: page, query: query, sort_by: sort_by} =
      socket.assigns.beacon_page.table

    assets =
      MediaLibrary.list_assets(assigns.beacon_page.site,
        per_page: per_page,
        page: page,
        query: query,
        sort: sort_by
      )

    {:noreply,
     socket
     |> stream(:assets, assets, reset: true)
     |> apply_action(assigns.live_action, params)}
  end

  defp apply_action(socket, :index, %{"search" => search}) when search not in ["", nil] do
    assets = MediaLibrary.search(socket.assigns.beacon_page.site, search)

    socket
    |> assign(assets: assets, search: search, page_title: search)
    |> assign(:asset, nil)
  end

  defp apply_action(socket, :index, _params) do
    socket
    |> assign(:assets, MediaLibrary.list_assets(socket.assigns.beacon_page.site))
    |> assign(:page_title, "Media Library")
    |> assign(:asset, nil)
  end

  defp apply_action(socket, :upload, _params) do
    socket
    |> assign(:page_title, "Upload")
    |> assign(:asset, %Asset{})
  end

  defp apply_action(socket, :show, %{"id" => id}) do
    asset = MediaLibrary.get_asset_by(socket.assigns.beacon_page.site, id: id)

    socket
    |> assign(:page_title, "Upload")
    |> assign(:asset, asset)
  end

  @impl true
  def handle_event("delete", %{"id" => id}, socket) do
    site = socket.assigns.beacon_page.site

    asset = MediaLibrary.get_asset_by(site, id: id)
    {:ok, _} = MediaLibrary.soft_delete(site, asset)

    path = beacon_live_admin_path(socket, site, "/media_library", search: socket.assigns.search)
    socket = push_patch(socket, to: path)

    {:noreply, socket}
  end

  def handle_event("search", %{"search" => search}, %{assigns: assigns} = socket) do
    path =
      beacon_live_admin_path(socket, assigns.beacon_page.site, "/media_library", search: search)

    socket = push_patch(socket, to: path)
    {:noreply, socket}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.header>
      Media Library
      <:actions>
        <.link patch={beacon_live_admin_path(@socket, @beacon_page.site, "/media_library/upload")}>
          <.button class="uppercase">Upload new media</.button>
        </.link>
      </:actions>
    </.header>

    <div class="flex justify-between">
      <div class="basis-8/12">
        <.table_search table={@beacon_page.table} placeholder="Search by file name (showing up to 15 results)" />
      </div>
      <div class="basis-2/12">
        <.table_sort table={@beacon_page.table} options={[{"File Name", "file_name"}, {"Type", "media_type"}]} />
      </div>
    </div>

    <.main_content>
      <.table id="assets" rows={@streams.assets} row_click={fn {_dom_id, asset} -> JS.navigate(beacon_live_admin_path(@socket, @beacon_page.site, "/media_library/#{asset.id}")) end}>
        <:col :let={{_, asset}} label=""><Beacon.LiveAdmin.AdminComponents.thumbnail source={MediaLibrary.url_for(asset.site, asset.thumbnail)} /></:col>
        <:col :let={{_, asset}} label="File Name">{asset.file_name}</:col>
        <:col :let={{_, asset}} label="type">{asset.media_type}</:col>
        <:action :let={{_, asset}}>
          <.link aria-label="View asset" title="View asset" class="flex items-center justify-center w-10 h-10" patch={beacon_live_admin_path(@socket, @beacon_page.site, "/media_library/#{asset.id}")}>
            <.icon name="hero-eye text-[#61758A] hover:text-[#304254]" />
          </.link>
        </:action>

        <:action :let={{_, asset}}>
          <.link
            patch={beacon_live_admin_path(@socket, @beacon_page.site, "/media_library/#{asset.id}")}
            title="Edit asset"
            aria-label="Edit asset"
            class="flex items-center justify-center w-10 h-10 group"
          >
            <.icon name="hero-pencil-square text-[#61758A] hover:text-[#304254]" />
          </.link>
        </:action>

        <:action :let={{_, asset}}>
          <.link
            phx-click={JS.push("delete", value: %{id: asset.id})}
            aria-label="Delete asset"
            title="Delete asset"
            class="flex items-center justify-center w-10 h-10"
            data-confirm="The asset will be marked as deleted but it will not be actually removed from the storage. Are you sure?"
          >
            <.icon name="hero-trash text-[#F23630] hover:text-[#AE182D]" />
          </.link>
        </:action>
      </.table>
      <.modal :if={@live_action in [:upload]} id="asset-modal" show on_cancel={JS.navigate(beacon_live_admin_path(@socket, @beacon_page.site, "/media_library"))}>
        <.live_component
          module={Beacon.LiveAdmin.MediaLibraryLive.UploadFormComponent}
          site={@beacon_page.site}
          id={@asset.id || :upload}
          title={@page_title}
          live_action={@live_action}
          asset={@asset}
          navigate={beacon_live_admin_path(@socket, @beacon_page.site, "/media_library")}
        />
      </.modal>

      <.modal :if={@live_action in [:show]} id="asset-modal" show on_cancel={JS.navigate(beacon_live_admin_path(@socket, @beacon_page.site, "/media_library"))}>
        <.live_component
          module={Beacon.LiveAdmin.MediaLibraryLive.ShowComponent}
          id={@asset.id}
          title={@page_title}
          live_action={@live_action}
          asset={@asset}
          navigate={beacon_live_admin_path(@socket, @beacon_page.site, "/media_library")}
        />
      </.modal>
      <.table_pagination socket={@socket} page={@beacon_page} />
    </.main_content>
    """
  end
end
