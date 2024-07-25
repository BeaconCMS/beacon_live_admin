defmodule Beacon.LiveAdmin.ComponentEditorLive.Index do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder, table: [sort_by: "name"]
  alias Beacon.LiveAdmin.Content


  @impl true
  def menu_link(_, :index), do: {:root, "Components"}

  @impl true
  def mount(_params, _session, socket) do
    {:ok, stream_configure(socket, :components, dom_id: &"#{Ecto.UUID.generate()}-#{&1.id}")}
  end

  @impl true
  def handle_params(params, _uri, socket) do
    socket =
      Table.handle_params(
        socket,
        params,
        &Content.count_components(&1.site, query: params["query"])
      )

    %{site: site} = socket.assigns.beacon_page

    %{per_page: per_page, current_page: page, query: query, sort_by: sort_by} =
      socket.assigns.beacon_page.table

    components =
      if connected?(socket),
        do:
          Content.list_components(site,
            per_page: per_page,
            page: page,
            query: query,
            sort: sort_by
          ),
        else: []

    {:noreply, stream(socket, :components, components, reset: true)}
  end

  @impl true
  def handle_event("search", %{"search" => %{"query" => query}}, socket) do
    path =
      beacon_live_admin_path(
        socket,
        socket.assigns.beacon_page.site,
        "/components?query=#{query}"
      )

    {:noreply, push_patch(socket, to: path)}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.header>
      Components
      <:actions>
        <.link patch={beacon_live_admin_path(@socket, @beacon_page.site, "/components/new")} phx-click={JS.push_focus()}>
          <.button class="uppercase">Create New Component</.button>
        </.link>
      </:actions>
    </.header>

    <.simple_form :let={f} id="search-form" for={%{}} as={:search} phx-change="search">
      <.input field={f[:query]} type="search" autofocus={true} placeholder="Search by name (showing up to 15 results)" />
    </.simple_form>

    <.main_content>
      <.table id="components" rows={@streams.components} row_click={fn {_dom_id, component} -> JS.navigate(beacon_live_admin_path(@socket, @beacon_page.site, "/components/#{component.id}")) end}>
        <:col :let={{_, component}} label="Name"><%= component.name %></:col>
        <:col :let={{_, component}} label="Category"><%= component.category %></:col>
        <:col :let={{_, component}} label="Body"><%= excerpt(component.body) %></:col>
        <:action :let={{_, component}}>
          <div class="sr-only">
            <.link navigate={beacon_live_admin_path(@socket, @beacon_page.site, "/components/#{component.id}")}>Show</.link>
          </div>
          <.link
            patch={beacon_live_admin_path(@socket, @beacon_page.site, "/components/#{component.id}")}
            title="Edit component"
            aria-label="Edit component"
            class="flex items-center justify-center w-10 h-10"
          >
            <.icon name="hero-pencil-square text-[#61758A] hover:text-[#304254]" />
          </.link>
        </:action>
      </.table>
      <.table_pagination socket={@socket} page={@beacon_page} />
    </.main_content>
    """
  end

  defp excerpt(content) when is_binary(content) do
    case String.split_at(content, 100) do
      {excerpt, ""} -> excerpt
      {excerpt, _} -> [excerpt, " ..."]
    end
  end

  defp excerpt(_content), do: ""
end
