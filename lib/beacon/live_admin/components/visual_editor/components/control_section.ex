defmodule Beacon.LiveAdmin.VisualEditor.Components.ControlSection do
  use Beacon.LiveAdmin.Web, :live_component

  attr :label, :string, required: false, default: nil
  slot :inner_block, required: true
  slot :header, required: false

  def mount(socket) do
    {:ok, assign(socket, expanded: true)}
  end

  def render(assigns) do
    ~H"""
    <section class="p-4 border-b border-b-gray-100 border-solid group">
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

  def handle_event("toggle", _params, socket) do
    {:noreply, update(socket, :expanded, &(!&1))}
  end
end
