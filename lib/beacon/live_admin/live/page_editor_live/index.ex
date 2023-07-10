defmodule Beacon.LiveAdmin.PageEditorLive.Index do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Content

  on_mount {Beacon.LiveAdmin.Hooks.Authorized, {:page_editor, :index}}

  @impl true
  def menu_link(:index), do: {:ok, "Pages"}
  def menu_link(_), do: :skip

  @impl true
  def mount(_params, _session, socket) do
    pages = Content.list_pages(socket.assigns.beacon_page.site)
    {:ok, stream(socket, :pages, pages)}
  end

  @impl true
  def handle_params(%{"query" => query}, _uri, socket) do
    pages = Content.list_pages(socket.assigns.beacon_page.site, query: query)
    {:noreply, stream(socket, :pages, pages, reset: true)}
  end

  def handle_params(_params, _uri, socket) do
    {:noreply, socket}
  end

  @impl true
  def handle_event("search", %{"search" => %{"query" => query}}, socket) do
    path =
      beacon_live_admin_path(socket, socket.assigns.beacon_page.site, "/pages?query=#{query}")

    {:noreply, push_patch(socket, to: path, replace: true)}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.header>
      Listing Pages
      <:actions>
        <.link patch={beacon_live_admin_path(@socket, @beacon_page.site, "/pages/new")} phx-click={JS.push_focus()}>
          <.button>Create New Page</.button>
        </.link>
      </:actions>
    </.header>

    <div class="my-4">
      <.simple_form :let={f} for={%{}} as={:search} phx-change="search">
        <div class="flex gap-4 items-center">
          <div class="flex-grow">
            <.input field={f[:query]} type="search" autofocus={true} placeholder="Search by path or title (showing up to 20 results)" />
          </div>
        </div>
      </.simple_form>
    </div>

    <.table id="pages" rows={@streams.pages} row_click={fn {_id, page} -> JS.navigate(beacon_live_admin_path(@socket, @beacon_page.site, "/pages/#{page.id}")) end}>
      <:col :let={{_id, page}} label="Title"><%= page.title %></:col>
      <:col :let={{_id, page}} label="Path"><%= page.path %></:col>
      <:action :let={{_id, page}}>
        <div class="sr-only">
          <.link navigate={beacon_live_admin_path(@socket, @beacon_page.site, "/pages/#{page.id}")}>Show</.link>
        </div>
        <.link patch={beacon_live_admin_path(@socket, @beacon_page.site, "/pages/#{page.id}")}>
          <.icon name="hero-pencil-square" />
        </.link>
      </:action>
    </.table>
    """
  end
end
