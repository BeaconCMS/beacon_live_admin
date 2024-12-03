defmodule Beacon.LiveAdmin.VisualEditor.ControlSection do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_component

  def render(assigns) do
    ~H"""
      <section id={@id} class="p-4 border-b border-b-gray-100 border-solid">
        <%= if @label do%>
        <div class="mb-2 flex items-center justify-between group">
          <label class="block font-medium capitalize text-sm/5"><%= @label %></label>
          <div>
            <%= if assigns[:header_buttons] do %>
              <%= render_slot(@header_buttons) %>
            <% end %>
              <%= if @name do %>
                <button
                  type="button"
                  class="rounded-full inline-block hover:text-red-400 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  phx-click="delete"
                  phx-target={@myself}>
                  <span class="sr-only">Delete attribute</span>
                  <.icon name="hero-trash" class="w-5 h-5" />
                </button>
              <% end %>
            </div>
          </div>
        <% end %>
        <%= render_slot(@inner_block) %>
      </section>
    """
  end

  def update(assigns, socket) do
    {:ok,
      assign(socket, assigns)
      |> assign_new(:name, fn -> nil end)}
  end

  def handle_event("delete", _, socket) do
    send(
      self(),
      {
        :element_changed,
        {socket.assigns.path, %{deleted: [socket.assigns.name]}}
      }
    )
    {:noreply, socket}
  end
end
