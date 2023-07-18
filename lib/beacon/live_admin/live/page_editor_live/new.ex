defmodule Beacon.LiveAdmin.PageEditorLive.New do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.Content

  @impl true
  def menu_link(_), do: :skip

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assigns(socket)}
  end

  @impl true
  def handle_params(_params, _url, socket) do
    {:noreply, assigns(socket)}
  end

  defp assigns(socket) do
    assign(socket, page_title: "Create New Page", page: %Content.Page{})
  end

  @impl true
  def handle_event("template_editor_lost_focus", %{"value" => value}, socket) do
    send_update(Beacon.LiveAdmin.PageEditorLive.FormComponent,
      id: "page-editor-form-new",
      changed_template: value
    )

    {:noreply, socket}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.live_component
      module={Beacon.LiveAdmin.PageEditorLive.FormComponent}
      id="page-editor-form-new"
      site={@beacon_page.site}
      page_title={@page_title}
      live_action={@live_action}
      page={@page}
      patch="/pages"
    />
    """
  end
end
