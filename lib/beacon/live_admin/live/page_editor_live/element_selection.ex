defmodule Beacon.LiveAdmin.PageEditorLive.ElementSelection do
  @moduledoc false
  import Phoenix.Component, only: [assign: 2]
  import Phoenix.LiveView, only: [send_update: 3]

  def select_element(path, socket) do
    {:noreply, assign(socket, selected_element_path: path)}
  end

  def handle_element_changed({path, payload}, socket) do
    send_update(Beacon.LiveAdmin.PageEditorLive.FormComponent, id: "page-editor-form", path: path, payload: payload)
    {:noreply, socket}
  end
end
