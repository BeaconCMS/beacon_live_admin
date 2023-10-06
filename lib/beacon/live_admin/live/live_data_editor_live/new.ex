defmodule Beacon.LiveAdmin.LiveDataEditorLive.New do
  @moduledoc false
  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.Content.LiveData
  alias Beacon.LiveAdmin.LiveDataEditorLive.FormComponent

  def menu_link("/live_data", :new), do: {:submenu, "Live Data"}
  def menu_link(_, _), do: :skip

  def handle_params(_params, _url, socket) do
    {:noreply, assign(socket, page_title: "Create New Live Data Assign", live_data: %LiveData{})}
  end

  def handle_event("code_editor_lost_focus", %{"value" => value}, socket) do
    send_update(FormComponent, id: "live-data-editor-form-new", changed_code: value)

    {:noreply, socket}
  end

  def render(assigns) do
    ~H"""
    <.live_component module={FormComponent} id="live-data-editor-form-new" site={@beacon_page.site} page_title={@page_title} live_action={@live_action} live_data={@live_data} patch="/live_data" />
    """
  end
end
