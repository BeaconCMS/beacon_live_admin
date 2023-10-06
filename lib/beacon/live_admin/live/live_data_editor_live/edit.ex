defmodule Beacon.LiveAdmin.LiveDataEditorLive.Edit do
  @moduledoc false
  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.LiveDataEditorLive.FormComponent
  alias Beacon.LiveAdmin.Content

  def menu_link("/live_data", :edit), do: {:submenu, "Live Data"}
  def menu_link(_, _), do: :skip

  def mount(_params, _session, socket) do
    {:ok, assign(socket, live_data: nil)}
  end

  def handle_params(%{"id" => id}, _url, socket) do
    live_data = Content.get_live_data(socket.assigns.beacon_page.site, id)
    {:noreply, assign(socket, page_title: "Edit Live Data Assign", live_data: live_data)}
  end

  def handle_event("body_editor_lost_focus", %{"value" => value}, socket) do
    send_update(FormComponent, id: "live-data-form-edit", changed_code: value)

    {:noreply, socket}
  end

  def render(assigns) do
    ~H"""
    <.live_component
      module={FormComponent}
      id="live-data-form-edit"
      site={@beacon_page.site}
      page_title={@page_title}
      live_action={@live_action}
      component={@live_data}
      patch="/live_data"
    />
    """
  end
end
