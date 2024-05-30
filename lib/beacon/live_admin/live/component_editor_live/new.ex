defmodule Beacon.LiveAdmin.ComponentEditorLive.New do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.Content

  @impl true
  def menu_link("/components", :new), do: {:submenu, "Components"}
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(_params, _url, socket) do
    {:noreply, assigns(socket)}
  end

  defp assigns(socket) do
    assign(socket, page_title: "Create New Component", component: %Content.Component{})
  end

  @impl true
  def handle_event("set_template", %{"value" => value}, socket) do
    send_update(Beacon.LiveAdmin.ComponentEditorLive.FormComponent,
      id: "components-editor-form-new",
      template: value
    )

    {:noreply, socket}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.live_component
      module={Beacon.LiveAdmin.ComponentEditorLive.FormComponent}
      id="components-editor-form-new"
      site={@beacon_page.site}
      page_title={@page_title}
      live_action={@live_action}
      component={@component}
      patch="/components"
    />
    """
  end
end
