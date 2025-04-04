defmodule Beacon.LiveAdmin.VisualEditor.PropertiesSidebarComponent do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_component
  alias Beacon.LiveAdmin.VisualEditor

  def update(%{selected_element_path: nil} = assigns, socket) do
    {:ok,
     socket
     |> assign(assigns)
     |> assign(selected_element: nil, other_attributes: [], editing: false)
     |> assign_new(:add_new_attribute, fn -> false end)}
  end

  def update(%{ast: ast, selected_element_path: selected_element_path} = assigns, socket) do
    selected_element =
      case VisualEditor.find_element(ast, selected_element_path) do
        nil ->
          nil

        element ->
          {_, selected_element} = Map.pop(element, "content")
          Map.put(selected_element, "path", selected_element_path)
      end

    {:ok,
     socket
     |> assign(assigns)
     |> assign(
       selected_element: selected_element,
       other_attributes: build_other_attributes(selected_element),
       editing: false
     )}
  end

  def update(%{edit_attribute: attribute}, socket) do
    other_attributes = update_other_attribute(socket.assigns.other_attributes, attribute.id, fn attr -> Map.put(attr, :editing, true) end)
    {:ok, assign(socket, editing: true, other_attributes: other_attributes)}
  end

  # new attributes are completely discarded while existing attributes just cancel the editing
  def update(%{discard_attribute: %{id: id, new: true}}, socket) do
    {_, other_attributes} = pop_in(socket.assigns.other_attributes, [Access.filter(fn %{id: attr_id} -> attr_id == id end)])
    {:ok, assign(socket, editing: false, other_attributes: other_attributes)}
  end

  def update(%{discard_attribute: attribute}, socket) do
    other_attributes = update_other_attribute(socket.assigns.other_attributes, attribute.id, fn attr -> Map.put(attr, :editing, false) end)
    {:ok, assign(socket, editing: false, other_attributes: other_attributes)}
  end

  def update(assigns, socket) do
    {:ok, assign(socket, assigns)}
  end

  def handle_event("add_attribute", _, socket) do
    %{selected_element: selected_element, other_attributes: other_attributes} = socket.assigns

    # stop editing any other attribute
    other_attributes = Enum.map(other_attributes, fn attr -> Map.put(attr, :editing, false) end)

    id = "control-name-value-#{selected_element["path"]}-new"
    attr = %{id: id, name: "", value: "", editing: true, new: true}

    other_attributes = other_attributes ++ [attr]

    {:noreply, assign(socket, editing: true, other_attributes: other_attributes)}
  end

  # all editable attrs except id and class that have their own control component
  defp build_other_attributes(selected_element) when is_map(selected_element) do
    Enum.reduce(selected_element["attrs"] || [], [], fn
      {"id", _v}, acc ->
        acc

      {"class", _v}, acc ->
        acc

      {name, value}, acc ->
        id = "control-name-value-#{selected_element["path"]}-#{name}"
        # :new flags if the attr is new, ie: added by the "Add Attribute" button
        attr = %{id: id, name: name, value: value, editing: false, new: false}
        [attr | acc]
    end)
  end

  defp build_other_attributes(_selected_element), do: []

  defp update_other_attribute(other_attributes, id, fun) do
    update_in(other_attributes, [Access.filter(fn %{id: attr_id} -> attr_id == id end)], fun)
  end

  def render(assigns) do
    ~H"""
    <div id={@id} class="mt-4 w-64 bg-white" data-testid="right-sidebar">
      <div :if={@selected_element} class="sticky top-0 h-screen">
        <div class="border-b text-lg font-medium leading-5 p-4 relative">
          <%= @selected_element["tag"] %>
          <.svelte :if={@selected_element["path"] !== "root"} name="components/GoToParentButton" class="contents" socket={@socket} />
          <.svelte name="components/ResetSelectionButton" />
        </div>

        <%= if VisualEditor.element_editable?(@selected_element) do %>
          <.live_component module={VisualEditor.LayoutControl} id="control-layout" element={@selected_element} on_element_change={fn path, payload -> element_changed(@heex_editor, path, payload) end} />

          <.live_component
            module={VisualEditor.TypographyControl}
            id="control-typography"
            element={@selected_element}
            on_element_change={fn path, payload -> element_changed(@heex_editor, path, payload) end}
          />

          <.live_component module={VisualEditor.SpaceControl} id="control-space" element={@selected_element} on_element_change={fn path, payload -> element_changed(@heex_editor, path, payload) end} />

          <.live_component module={VisualEditor.BorderControl} id="control-border" element={@selected_element} on_element_change={fn path, payload -> element_changed(@heex_editor, path, payload) end} />

          <.live_component module={VisualEditor.OpacityControl} id="control-opacity" element={@selected_element} on_element_change={fn path, payload -> element_changed(@heex_editor, path, payload) end} />

          <.live_component module={VisualEditor.IdControl} id="control-id" element={@selected_element} on_element_change={fn path, payload -> element_changed(@heex_editor, path, payload) end} />

          <.live_component module={VisualEditor.ClassControl} id="control-class" element={@selected_element} on_element_change={fn path, payload -> element_changed(@heex_editor, path, payload) end} />

          <%= for attribute <- @other_attributes do %>
            <.live_component module={VisualEditor.NameValueControl} id={attribute.id} path={@selected_element["path"]} parent={@myself} attribute={attribute} />
          <% end %>

          <div class="p-4">
            <button
              :if={!@editing}
              type="button"
              class="bg-blue-500 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-2 px-4 rounded outline-2 w-full"
              phx-click="add_attribute"
              phx-target={@myself}
            >
              + Add attribute
            </button>
          </div>
        <% end %>
      </div>
    </div>
    """
  end

  # bubbles up the element attrs changes to the parent HEExEditor
  defp element_changed(heex_editor, path, payload) do
    event = {:element_changed, %{path: path, payload: payload}}
    send_update(heex_editor, %{event: event})
  end
end
