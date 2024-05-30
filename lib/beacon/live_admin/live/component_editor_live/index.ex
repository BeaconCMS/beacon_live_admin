defmodule Beacon.LiveAdmin.ComponentEditorLive.Index do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Content

  on_mount {Beacon.LiveAdmin.Hooks.Authorized, {:components, :index}}

  @impl true
  def menu_link(_, :index), do: {:root, "Components"}

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign(socket, :components, [])}
  end

  @impl true
  def handle_params(%{"query" => query}, _uri, socket) do
    components = Content.list_components(socket.assigns.beacon_page.site, query: query)
    {:noreply, assign(socket, :components, components)}
  end

  def handle_params(_params, _uri, socket) do
    components = Content.list_components(socket.assigns.beacon_page.site)
    {:noreply, assign(socket, :components, components)}
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
      <.input field={f[:query]} type="search" autofocus={true} placeholder="Search by name (showing up to 20 results)" />
    </.simple_form>

    <.main_content>
      <.table id="components" rows={@components} row_click={fn component -> JS.navigate(beacon_live_admin_path(@socket, @beacon_page.site, "/components/#{component.id}")) end}>
        <:col :let={component} label="Name"><%= component.name %></:col>
        <:col :let={component} label="Category"><%= component.category %></:col>
        <:col :let={component} label="Body"><%= excerpt(component.body) %></:col>
        <:col :let={component} label="Template"><%= excerpt(component.template) %></:col>
        <:action :let={component}>
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
