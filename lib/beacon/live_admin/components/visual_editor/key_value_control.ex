defmodule Beacon.LiveAdmin.VisualEditor.KeyValueControl do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_component
  alias Beacon.LiveAdmin.VisualEditor.ControlSection
  require Logger

  def render(assigns) do
    ~H"""
    <div id={@id}>
      <.live_component module={ControlSection} label={if !@editing && @name !== "", do: @name} name={@name} path={@element["path"]} id={"#{@id}-section"}>
        <:header_buttons>
          <button
            type="button"
            class="rounded-full inline-block hover:text-blue-400 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            phx-click="start_edit"
            phx-target={@myself}
          >
            <span class="sr-only">Edit attribute</span>
            <.icon name="hero-pencil-square" class="w-5 h-5" />
          </button>
        </:header_buttons>
        <%= if @editing do %>
          <form phx-submit="save" phx-change="handle_change" phx-target={@myself}>
            <input class="w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm" placeholder="Name" name="name" value={@name} />
            <input class="mt-3 w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm" placeholder="Value" name="value" value={@value} />
            <div class="mt-3 grid grid-cols-2 gap-x-2">
              <button type="submit" class="bg-blue-500 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-2 px-4 rounded outline-2">Save</button>
              <button type="reset" name="cancel" class="bg-red-500 hover:bg-red-700 active:bg-red-800 text-white font-bold py-2 px-4 rounded outline-2">Cancel</button>
            </div>
          </form>
        <% else %>
          <%= if @name != "" do %>
            <input class="w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm cursor-not-allowed" placeholder="Value" name="value" disabled value={@value} />
          <% end %>
          <%= if @name == "" and @value == "" do %>
            <button type="button" class="bg-blue-500 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-2 px-4 rounded outline-2 w-full" phx-click="add_new_attribute" phx-target={@myself}>
              + Add attribute
            </button>
          <% end %>
        <% end %>
      </.live_component>
    </div>
    """
  end

  def mount(socket) do
    {:ok, assign(socket, editing: false)}
  end

  def update(assigns, socket) do
    name = Map.get(assigns, :name, "")
    value = Map.get(assigns, :value, "")

    {:ok,
     assign(socket, assigns)
     |> assign(name: name, value: value)}
  end

  def handle_event("add_new_attribute", _params, socket) do
    {:noreply, assign(socket, :editing, true)}
  end

  def handle_event("start_edit", _params, socket) do
    {:noreply, assign(socket, :editing, true)}
  end

  def handle_event("handle_change", %{"_target" => ["cancel"]}, socket) do
    {:noreply, assign(socket, :editing, false)}
  end

  def handle_event("handle_change", _attrs, socket) do
    {:noreply, socket}
  end

  def handle_event("save", %{"name" => name, "value" => value}, socket) do
    if can_save(name) do
      send(self(), {:element_changed, {socket.assigns.element["path"], %{updated: %{"attrs" => %{name => value}}}}})
      {:noreply, socket |> assign(:editing, false)}
    else
      {:noreply, socket}
    end
  end

  defp can_save(name), do: name != ""
end
