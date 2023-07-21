defmodule Beacon.LiveAdmin.LayoutEditorLive.Edit do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Content

  @impl true
  def menu_link("/layouts", :edit), do: {:submenu, "Layouts"}
  def menu_link(_, _), do: :skip

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign(socket, page_title: "Edit Layout", beacon_layout: nil)}
  end

  @impl true
  def handle_params(%{"id" => id}, _url, socket) do
    beacon_layout = Content.get_layout(socket.assigns.beacon_page.site, id)
    {:noreply, assign(socket, page_title: "Edit Layout", beacon_layout: beacon_layout)}
  end

  @impl true
  def handle_event("body_editor_lost_focus", %{"value" => value}, socket) do
    send_update(Beacon.LiveAdmin.LayoutEditorLive.FormComponent,
      id: "layout-editor-form-edit",
      changed_body: value
    )

    {:noreply, socket}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.live_component
      module={Beacon.LiveAdmin.LayoutEditorLive.FormComponent}
      id="layout-editor-form-edit"
      site={@beacon_page.site}
      page_title={@page_title}
      live_action={@live_action}
      beacon_layout={@beacon_layout}
      patch="/layouts"
    />
    """
  end
end
