defmodule Beacon.LiveAdmin.ComponentEditorLive.Edit do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Content

  @impl true
  def menu_link("/components", :edit), do: {:submenu, "Components"}
  def menu_link(_, _), do: :skip

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign(socket, component: nil)}
  end

  @impl true
  def handle_params(%{"id" => id}, _url, socket) do
    component = Content.get_component(socket.assigns.beacon_page.site, id)
    {:noreply, assign(socket, page_title: "Edit Component", component: component)}
  end

  @impl true
  def handle_event("set_template", %{"value" => value}, socket) do
    send_update(Beacon.LiveAdmin.ComponentEditorLive.FormComponent,
      id: "components-form-edit",
      template: value
    )

    {:noreply, socket}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.live_component
      module={Beacon.LiveAdmin.ComponentEditorLive.FormComponent}
      id="components-form-edit"
      site={@beacon_page.site}
      page_title={@page_title}
      live_action={@live_action}
      component={@component}
      patch="/components"
    />
    """
  end
end
