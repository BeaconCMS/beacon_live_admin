defmodule Beacon.LiveAdmin.PageEditorLive.Edit do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Content

  @impl true
  def menu_link(_), do: :skip

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign(socket, page_title: "Edit Page", page: nil)}
  end

  @impl true
  def handle_params(%{"id" => id}, _url, socket) do
    page = Content.get_page(socket.assigns.beacon_page.site, id)
    {:noreply, assign(socket, page_title: "Edit Page", page: page)}
  end

  @impl true
  def handle_event("template_editor_lost_focus", %{"value" => value}, socket) do
    send_update(Beacon.LiveAdmin.PageEditorLive.FormComponent,
      id: "page-editor-form-edit",
      changed_template: value
    )

    {:noreply, socket}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.live_component
      module={Beacon.LiveAdmin.PageEditorLive.FormComponent}
      id="page-editor-form-edit"
      site={@beacon_page.site}
      page_title={@page_title}
      live_action={@live_action}
      page={@page}
      patch="/pages"
    />
    """
  end
end
