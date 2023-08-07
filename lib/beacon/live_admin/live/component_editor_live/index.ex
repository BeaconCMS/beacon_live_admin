defmodule Beacon.LiveAdmin.ComponentEditorLive.Index do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Content

  on_mount {Beacon.LiveAdmin.Hooks.Authorized, {:components, :index}}

  @impl true
  def menu_link(_, :index), do: {:root, "Components"}

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign(socket, :components, Content.list_components(socket.assigns.beacon_page.site))}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.header>
      Listing Components
      <:actions>
        <.link patch={beacon_live_admin_path(@socket, @beacon_page.site, "/components/new")} phx-click={JS.push_focus()}>
          <.button class="uppercase">Create New Component</.button>
        </.link>
      </:actions>
    </.header>

    <.table id="components" rows={@components} row_click={fn component -> JS.navigate(beacon_live_admin_path(@socket, @beacon_page.site, "/components/#{component.id}")) end}>
      <:col :let={component} label="Name"><%= component.name %></:col>
      <:col :let={component} label="Category"><%= component.category %></:col>
      <:col :let={component} label="Body"><%= body_excerpt(component.body) %></:col>
      <:action :let={component}>
        <div class="sr-only">
          <.link navigate={beacon_live_admin_path(@socket, @beacon_page.site, "/components/#{component.id}")}>Show</.link>
        </div>
        <.link patch={beacon_live_admin_path(@socket, @beacon_page.site, "/components/#{component.id}")}>
          <.icon name="hero-pencil-square" />
        </.link>
      </:action>
    </.table>
    """
  end

  defp body_excerpt(body) do
    case String.split_at(body, 100) do
      {excerpt, ""} -> excerpt
      {excerpt, _} -> [excerpt, " ..."]
    end
  end
end
