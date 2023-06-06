defmodule Beacon.LiveAdmin.PageEditorLive.Index do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin

  @impl true
  def menu_link(:index), do: {:ok, "Pages"}
  def menu_link(_), do: :skip

  @impl true
  def mount(_params, _session, socket) do
    site = socket.assigns.beacon_page.site
    pages = LiveAdmin.call(site, Beacon.Content, :list_pages_for_site, [site])
    {:ok, stream(socket, :pages, pages)}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.header>
      <:actions>
        <.link patch="/pages/new">
          <.button>Create New Page</.button>
        </.link>
      </:actions>
    </.header>

    <.table id="pages" rows={@streams.pages} row_click={fn {_id, page} -> JS.navigate(beacon_live_admin_path(@socket, @beacon_page.site, "/pages/1")) end}>
      <:col :let={{_id, page}} label="Title"><%= page.title %></:col>
      <:col :let={{_id, page}} label="Description"><%= page.description %></:col>
      <:action :let={{_id, page}}>
        <div class="sr-only">
          <.link navigate="/pages/{todo}">Show</.link>
        </div>
        <.link patch="/pages/{todo}/edit">Edit</.link>
      </:action>
      <:action :let={{id, page}}>
        <.link phx-click={JS.push("delete", value: %{id: page.id}) |> hide("##{id}")} data-confirm="Are you sure?">
          Delete
        </.link>
      </:action>
    </.table>
    """
  end
end
