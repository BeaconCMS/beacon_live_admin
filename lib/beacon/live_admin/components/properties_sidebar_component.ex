# FIXME: move to Beacon.LiveAdmin.VisualEditor.PropertiesSidebarComponent
defmodule Beacon.LiveAdmin.PropertiesSidebarComponent do
  use Beacon.LiveAdmin.Web, :live_component
  alias Beacon.LiveAdmin.VisualEditor
  alias Beacon.LiveAdmin.VisualEditor.ClassControl
  alias Beacon.LiveAdmin.VisualEditor.OpacityControl
  alias Beacon.LiveAdmin.VisualEditor.KeyValueControl

  def update(%{selected_element_path: nil} = assigns, socket) do
    {:ok,
     socket
     |> assign(assigns)
     |> assign_new(:new_attributes, fn -> [] end)
     |> assign(selected_element: nil)}
  end

  def update(assigns, socket) do
    %{page: %{ast: page}, selected_element_path: selected_element_path} = assigns

    selected_element =
      case VisualEditor.find_element(page, selected_element_path) do
        nil ->
          nil

        element ->
          {_, selected_element} = Map.pop(element, "content")
          Map.put(selected_element, "path", selected_element_path)
      end

    {:ok,
     socket
     |> assign(assigns)
     |> assign_new(:new_attributes, fn -> [] end)
     |> assign(selected_element: selected_element)}
  end

  def handle_event("add_attribute", _params, socket) do
    new_attributes =
      case List.last(socket.assigns.new_attributes) do
        nil -> [0]
        last -> socket.assigns.new_attributes ++ [last + 1]
      end

    {:noreply, assign(socket, :new_attributes, new_attributes)}
  end

  # def handle_event("delete_attribute", %{"index" => index}, socket) do
  #   new_attributes = List.delete_at(socket.assigns.new_attributes, String.to_integer(index))
  #   {:noreply, assign(socket, :new_attributes, new_attributes)}
  # end

  def render(assigns) do
    ~H"""
    <div class="mt-4 w-64 bg-white" data-testid="right-sidebar">
      <div :if={@selected_element} class="sticky top-0 overflow-y-auto h-screen">
        <div class="border-b text-lg font-medium leading-5 p-4 relative">
          <%= @selected_element["tag"] %>
          <.svelte :if={@selected_element["path"] !== "root"} name="components/GoToParentButton" class="contents" socket={@socket} />
          <%!-- <.close_button /> --%>
        </div>

        <%= if VisualEditor.element_editable?(@selected_element) do %>
          <.live_component module={ClassControl} id="control-class" element={@selected_element} />
          <.live_component module={OpacityControl} id="control-opacity" element={@selected_element} />
          <%= for index <- @new_attributes do %>
            <.live_component module={KeyValueControl} id={"control-key-value-#{@selected_element["path"]}-idx-#{index}"} element={@selected_element} index={index} />
          <% end %>
        <% end %>
        <div class="p-4">
          <button type="button" class="bg-blue-500 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-2 px-4 rounded outline-2 w-full" phx-click="add_attribute" phx-target={@myself}>
            + Add attribute
          </button>
        </div>
      </div>
    </div>
    """
  end

  # FIXME: implement event "reset_selection"
  # FIXME: use heroicons instead of <svg>
  defp close_button(assigns) do
    ~H"""
    <button type="button" class="absolute p-2 top-2 right-1" phx-click="reset_selection">
      <span class="sr-only">Close</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 hover:text-blue-700 active:text-blue-900">
        <path
          fill-rule="evenodd"
          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    """
  end
end
