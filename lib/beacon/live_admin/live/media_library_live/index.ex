defmodule Beacon.LiveAdmin.MediaLibraryLive.Index do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.MediaLibrary
  alias Beacon.LiveAdmin.Authorization
  alias Beacon.MediaLibrary.Asset

  on_mount {Beacon.LiveAdmin.Hooks.Authorized, {:page_editor, :index}}

  @impl true
  def menu_link(_, action) when action in [:index, :upload, :show], do: {:root, "Media Library"}

  @impl true
  def mount(_params, _session, socket) do
    socket =
      socket
      |> assign(:authn_context, %{mod: :media_library})
      |> assign(assets: list_assets(socket.assigns.beacon_page.site), search: "")

    {:ok, socket}
  end

  @impl true
  def handle_params(params, _url, %{assigns: assigns} = socket) do
    if Authorization.authorized?(
         assigns.beacon_page.site,
         assigns.agent,
         assigns.live_action,
         assigns.authn_context
       ) do
      search = Map.get(params, "search", "")

      socket =
        socket
        |> assign(:search, search)
        |> apply_action(assigns.live_action, params)

      {:noreply, socket}
    else
      {:noreply, socket}
    end
  end

  defp apply_action(socket, :index, %{"search" => search}) when search not in ["", nil] do
    assets = MediaLibrary.search(socket.assigns.beacon_page.site, search)

    socket
    |> assign(assets: assets, search: search, page_title: search)
    |> assign(:asset, nil)
  end

  defp apply_action(socket, :index, _params) do
    socket
    |> assign(:assets, list_assets(socket.assigns.beacon_page.site))
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
  def handle_event("search", %{"search" => search}, %{assigns: assigns} = socket) do
    if Authorization.authorized?(
         assigns.beacon_page.site,
         assigns.agent,
         :search,
         assigns.authn_context
       ) do
      path =
        beacon_live_admin_path(socket, assigns.beacon_page.site, "/media_library", search: search)

      socket = push_patch(socket, to: path)
      {:noreply, socket}
    else
      {:noreply, socket}
    end
  end

  defp list_assets(site) do
    MediaLibrary.list_assets(site)
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.header>
      Media Library
      <:actions>
        <.link :if={Authorization.authorized?(@beacon_page.site, @agent, :upload, @authn_context)} patch={beacon_live_admin_path(@socket, @beacon_page.site, "/media_library/upload")}>
          <.button>Upload</.button>
        </.link>
      </:actions>
    </.header>

    <form id="search-form" phx-change="search">
      <input name="search" value={@search} placeholder="Search assets" type="search" />
    </form>

    <.table id="assets" rows={@assets} row_id={fn asset -> asset.id end}>
      <:col :let={asset} label="Name"><%= asset.file_name %></:col>
      <:col :let={asset} label="Type"><%= asset.media_type %></:col>
      <:col :let={asset} label="Site"><%= asset.site %></:col>
      <:action :let={asset}>
        <.link :if={Authorization.authorized?(@beacon_page.site, @agent, :upload, @authn_context)} patch={beacon_live_admin_path(@socket, @beacon_page.site, "/media_library/#{asset.id}")}>
          View
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
        agent={@agent}
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
        agent={@agent}
      />
    </.modal>
    """
  end
end
