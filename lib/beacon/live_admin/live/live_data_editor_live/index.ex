defmodule Beacon.LiveAdmin.LiveDataEditorLive.Index do
  @moduledoc false
  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Content

  on_mount {Beacon.LiveAdmin.Hooks.Authorized, {:live_data, :index}}

  def menu_link(_, :index), do: {:root, "Live Data"}

  def mount(_params, _session, socket) do
    {:ok, assign(socket, live_data_paths: [])}
  end

  def handle_params(%{"query" => query}, _uri, socket) do
    %{beacon_page: %{site: site}} = socket.assigns
    live_data_paths = Content.live_data_paths_for_site(site, query: query)

    {:noreply, assign(socket, live_data_paths: live_data_paths)}
  end

  def handle_params(_params, _uri, socket) do
    %{beacon_page: %{site: site}} = socket.assigns
    live_data_paths = Content.live_data_paths_for_site(site)

    {:noreply, assign(socket, live_data_paths: live_data_paths)}
  end

  def handle_event("search", %{"search" => %{"query" => query}}, socket) do
    %{beacon_page: %{site: site}} = socket.assigns
    path = beacon_live_admin_path(socket, site, "/live_data?query=#{query}")

    {:noreply, push_patch(socket, to: path)}
  end

  def handle_event("submit_path", %{"path" => path}, socket) do
    %{beacon_page: %{site: site}} = socket.assigns
    attrs = %{path: path, assign: "foo", code: "bar", format: :text, site: site}
    {:ok, _} = Content.create_live_data(site, attrs)
    live_data_paths = Content.live_data_paths_for_site(site)

    {:noreply, assign(socket, live_data_paths: live_data_paths)}
  end

  def render(assigns) do
    ~H"""
    <.header>
      Live Data
      <:actions>
        <.button class="uppercase" phx-click={show_modal("new-path-modal")}>New Path</.button>
      </:actions>
    </.header>

    <.simple_form :let={f} for={%{}} as={:search} phx-change="search">
      <.input field={f[:query]} type="search" autofocus={true} placeholder="Search by path (showing up to 20 results)" />
    </.simple_form>

    <.main_content class="h-[calc(100vh_-_210px)]">
      <.table id="live_data" rows={@live_data_paths} row_click={fn live_data_path -> JS.navigate(beacon_live_admin_path(@socket, @beacon_page.site, "/live_data/#{sanitize_path(live_data_path)}")) end}>
        <:col :let={live_data_path} label="Path"><%= live_data_path %></:col>
        <:action :let={live_data_path}>
          <div class="sr-only">
            <.link navigate={beacon_live_admin_path(@socket, @beacon_page.site, "/live_data/#{sanitize_path(live_data_path)}/edit")}>Edit</.link>
          </div>
          <.link
            patch={beacon_live_admin_path(@socket, @beacon_page.site, "/live_data/#{sanitize_path(live_data_path)}/edit")}
            title="Edit live data"
            aria-label="Edit live data"
            class="flex items-center justify-center w-10 h-10 group"
          >
            <.icon name="hero-pencil-square text-[#61758A] hover:text-[#304254]" />
          </.link>
        </:action>
      </.table>
    </.main_content>

    <.modal id="new-path-modal">
      <p class="text-2xl font-bold mb-12">New Path</p>
      <.form for={%{}} phx-submit="submit_path">
        <.input type="text" name="path" placeholder="project/:project_id/comments" value="" />
        <div class="flex mt-8 gap-x-[20px]">
          <.button type="submit" phx-click={hide_modal("new-path-modal")}>Create</.button>
          <.button type="button" phx-click={hide_modal("new-path-modal")}>Cancel</.button>
        </div>
      </.form>
    </.modal>
    """
  end

  defp sanitize_path(path) do
    URI.encode_www_form(path)
  end
end
