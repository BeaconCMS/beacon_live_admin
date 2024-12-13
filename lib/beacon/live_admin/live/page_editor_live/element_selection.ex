defmodule Beacon.LiveAdmin.PageEditorLive.ElementSelection do
  @moduledoc false
  defmacro __using__(opts) do
    quote location: :keep, bind_quoted: [opts: opts] do
      def handle_event("select_element", %{"path" => path}, socket) do
        {:noreply, assign(socket, selected_element_path: path)}
      end

      @impl true
      def handle_info({:element_changed, {path, payload}}, socket) do
        send_update(Beacon.LiveAdmin.PageEditorLive.FormComponent, id: "page-editor-form", path: path, payload: payload)
        {:noreply, socket}
      end
    end
  end
end
