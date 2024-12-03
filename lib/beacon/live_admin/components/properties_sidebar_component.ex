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
     |> assign_new(:add_new_attribute, fn -> false end)
     |> assign(selected_element: nil)}
  end

  def update(%{page: %{ast: page}, selected_element_path: selected_element_path} = assigns, socket) do
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
     |> assign(selected_element: selected_element)}
  end

  def update(assigns, socket) do
    {:ok, assign(socket, assigns)}
  end

  defp other_attributes(selected_element) do
    Enum.filter(selected_element["attrs"], fn {k, _} -> k != "class" end)
  end

  def render(assigns) do
    ~H"""
    <div id={@id} class="mt-4 w-64 bg-white" data-testid="right-sidebar">
      <div :if={@selected_element} class="sticky top-0 overflow-y-auto h-screen">
        <div class="border-b text-lg font-medium leading-5 p-4 relative">
          <%= @selected_element["tag"] %>
          <.svelte :if={@selected_element["path"] !== "root"} name="components/GoToParentButton" class="contents" socket={@socket} />
          <.svelte name="components/ResetSelectionButton" />
        </div>

        <%= if VisualEditor.element_editable?(@selected_element) do %>
          <.live_component module={ClassControl} id="control-class" element={@selected_element} />
          <.live_component module={OpacityControl} id="control-opacity" element={@selected_element} />
          <%= for {name, value} <- other_attributes(@selected_element) do %>
            <.live_component module={KeyValueControl} id={"control-key-value-#{@selected_element["path"]}-#{name}"} element={@selected_element} name={name} value={value} />
          <% end %>
          <.live_component module={KeyValueControl} id={"control-key-value-#{@selected_element["path"]}-new"} element={@selected_element} />
        <% end %>
      </div>
    </div>
    """
  end
end
