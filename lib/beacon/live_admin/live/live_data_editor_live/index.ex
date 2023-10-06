defmodule Beacon.LiveAdmin.LiveDataEditorLive.Index do
  @moduledoc false
  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Content

  on_mount {Beacon.LiveAdmin.Hooks.Authorized, {:live_data, :index}}

  def menu_link(_, :index), do: {:root, "Live Data"}

  def mount(_params, _session, socket) do
    {:ok, assign(socket, live_data: [])}
  end

  def handle_params(%{"query" => query}, _uri, socket) do
    %{beacon_page: %{site: site}} = socket.assigns
    live_data = Content.live_data_for_site(site, query: query)

    {:noreply, assign(socket, live_data: live_data)}
  end

  def handle_params(_params, _uri, socket) do
    %{beacon_page: %{site: site}} = socket.assigns
    live_data = Content.live_data_for_site(site)

    {:noreply, assign(socket, live_data: live_data)}
  end

  def handle_event("search", %{"search" => %{"query" => query}}, socket) do
    %{beacon_page: %{site: site}} = socket.assigns
    path = beacon_live_admin_path(socket, site, "/live_data?query=#{query}")

    {:noreply, push_patch(socket, to: path)}
  end

  def render(assigns) do
    ~H"""
    <.header>
      Live Data
      <:actions>
        <.link patch={beacon_live_admin_path(@socket, @beacon_page.site, "/live_data/new")} phx-click={JS.push_focus()}>
          <.button class="uppercase">Create New Live Data Assign</.button>
        </.link>
      </:actions>
    </.header>

    <.simple_form :let={f} for={%{}} as={:search} phx-change="search">
      <.input field={f[:query]} type="search" autofocus={true} placeholder="Search by path (showing up to 20 results)" />
    </.simple_form>

    <.main_content class="h-[calc(100vh_-_210px)]">
      <.table id="live_data" rows={@live_data} row_click={fn live_data -> JS.navigate(beacon_live_admin_path(@socket, @beacon_page.site, "/live_data/#{live_data.id}")) end}>
        <:col :let={live_data} label="Path"><%= live_data.path %></:col>
        <:action :let={live_data}>
          <div class="sr-only">
            <.link navigate={beacon_live_admin_path(@socket, @beacon_page.site, "/live_data/#{live_data.id}")}>Edit</.link>
          </div>
          <.link
            patch={beacon_live_admin_path(@socket, @beacon_page.site, "/live_data/#{live_data.id}")}
            title="Edit live data"
            aria-label="Edit live data"
            class="flex items-center justify-center w-10 h-10 group"
          >
            <.icon name="hero-pencil-square text-[#61758A] hover:text-[#304254]" />
          </.link>
        </:action>
      </.table>
    </.main_content>
    """
  end
end
