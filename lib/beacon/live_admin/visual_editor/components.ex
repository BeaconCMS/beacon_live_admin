defmodule Beacon.LiveAdmin.VisualEditor.Components do
  @moduledoc false

  use Phoenix.Component

  attr :label, :string, required: false
  slot :inner_block, required: true

  def control_section(assigns) do
    ~H"""
    <section class="p-4 border-b border-b-gray-100 border-solid group">
      <div class="mb-2 flex items-center justify-between">
        <label :if={assigns[:label]} class="block font-medium text-sm/5"><%= @label %></label>
        <%= if assigns[:header] do %>
          <div class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <%= render_slot(@header) %>
          </div>
        <% end %>
      </div>
      <%= render_slot(@inner_block) %>
    </section>
    """
  end
end
