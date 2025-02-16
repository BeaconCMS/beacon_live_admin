defmodule Beacon.LiveAdmin.VisualEditor.Components.ControlSection do
  require Logger
  use Beacon.LiveAdmin.Web, :live_component

  attr :label, :string, required: false, default: nil
  attr :id, :string, required: true
  slot :inner_block, required: true
  slot :header, required: false

  def mount(socket) do
    {:ok, assign(socket, expanded: true)}
  end

  def render(assigns) do
    ~H"""
    <section class="p-4 border-b border-b-gray-100 border-solid group" id={@id} phx-hook="ControlSectionSaveExpandedState" data-section-id={@id}>
      <div class="mb-2 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <button :if={@label} type="button" class="text-gray-400" phx-click="toggle" phx-target={@myself}>
            <.icon name={if(@expanded, do: "hero-chevron-down", else: "hero-chevron-right")} class="w-4 h-4" />
          </button>
          <label :if={@label} class="block font-bold text-sm/5 cursor-pointer" phx-click="toggle" phx-target={@myself}>
            <%= @label %>
          </label>
        </div>
        <div :if={Map.get(assigns, :header, []) != []} class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <%= render_slot(@header) %>
        </div>
      </div>
      <div class={!@expanded && "hidden"}>
        <%= render_slot(@inner_block) %>
      </div>
    </section>
    """
  end

  def handle_event("set_expanded", %{"expanded" => expanded}, socket) do
    {:noreply, assign(socket, :expanded, expanded)}
  end

  def handle_event("toggle", _params, socket) do
    expanded = !socket.assigns.expanded
    socket = push_event(socket, "expanded_changed", %{expanded: expanded, sectionId: socket.assigns.id})
    {:noreply, assign(socket, :expanded, expanded)}
  end
end
