defmodule Beacon.LiveAdmin.VisualEditor.Components.ColorPicker do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_component

  @tailwind_colors [
    {"gray-50", "#F9FAFB"},
    {"gray-100", "#F3F4F6"},
    {"gray-200", "#E5E7EB"},
    {"gray-300", "#D1D5DB"},
    {"gray-400", "#9CA3AF"},
    {"gray-500", "#6B7280"},
    {"gray-600", "#4B5563"},
    {"gray-700", "#374151"},
    {"gray-800", "#1F2937"},
    {"gray-900", "#111827"},
    {"red-50", "#FEF2F2"},
    {"red-100", "#FEE2E2"},
    {"red-200", "#FECACA"},
    {"red-300", "#FCA5A5"},
    {"red-400", "#F87171"},
    {"red-500", "#EF4444"},
    {"red-600", "#DC2626"},
    {"red-700", "#B91C1C"},
    {"red-800", "#991B1B"},
    {"red-900", "#7F1D1D"},
    {"blue-50", "#EFF6FF"},
    {"blue-100", "#DBEAFE"},
    {"blue-200", "#BFDBFE"},
    {"blue-300", "#93C5FD"},
    {"blue-400", "#60A5FA"},
    {"blue-500", "#3B82F6"},
    {"blue-600", "#2563EB"},
    {"blue-700", "#1D4ED8"},
    {"blue-800", "#1E40AF"},
    {"blue-900", "#1E3A8A"},
    {"green-50", "#F0FDF4"},
    {"green-100", "#DCFCE7"},
    {"green-200", "#BBF7D0"},
    {"green-300", "#86EFAC"},
    {"green-400", "#4ADE80"},
    {"green-500", "#22C55E"},
    {"green-600", "#16A34A"},
    {"green-700", "#15803D"},
    {"green-800", "#166534"},
    {"green-900", "#14532D"},
    {"yellow-50", "#FEFCE8"},
    {"yellow-100", "#FEF9C3"},
    {"yellow-200", "#FEF08A"},
    {"yellow-300", "#FDE047"},
    {"yellow-400", "#FACC15"},
    {"yellow-500", "#EAB308"},
    {"yellow-600", "#CA8A04"},
    {"yellow-700", "#A16207"},
    {"yellow-800", "#854D0E"},
    {"yellow-900", "#713F12"},
    {"purple-50", "#FAF5FF"},
    {"purple-100", "#F3E8FF"},
    {"purple-200", "#E9D5FF"},
    {"purple-300", "#D8B4FE"},
    {"purple-400", "#C084FC"},
    {"purple-500", "#A855F7"},
    {"purple-600", "#9333EA"},
    {"purple-700", "#7E22CE"},
    {"purple-800", "#6B21A8"},
    {"purple-900", "#581C87"}
  ]

  def mount(socket) do
    {:ok, assign(socket, show_picker: false, tailwind_colors: @tailwind_colors)}
  end

  defp get_color_value(value) do
    case value do
      nil -> "transparent"
      "Default" -> @tailwind_colors |> Enum.find(fn {n, _hex} -> n == "gray-200" end) |> elem(1)
      "#" <> _ -> value
      name -> Enum.find_value(@tailwind_colors, fn {n, hex} -> if n == name, do: hex end) || "transparent"
    end
  end

  defp get_color_name_or_value(value) do
    case value do
      nil -> "transparent"
      "#" <> _ -> value
      _ -> value
    end
  end

  def render(assigns) do
    ~H"""
    <div class="relative" id={"color-picker-#{@id}"} phx-click-away="close_picker" phx-hook="ColorPicker" phx-target={@myself}>
      <div
        class="relative flex bg-gray-100 border border-gray-100 rounded-md focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 cursor-pointer"
        phx-click="toggle_picker"
        phx-target={@myself}
      >
        <input
          type="text"
          name={@name}
          value={@value}
          data-value={@value}
          class="w-full py-0.5 px-2 bg-transparent outline-none border-none focus:border-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-transparent focus:ring-offset-transparent leading-5 text-sm"
          readonly
        />
        <div class="flex items-center pr-2">
          <div class="w-4 h-4 rounded border border-gray-200" style={"background-color: #{get_color_value(@value)}"} title={get_color_value(@value)} />
        </div>
      </div>

      <%= if @show_picker do %>
        <div class="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg p-2 z-50 w-[300px] border border-gray-200">
          <div class="flex items-center gap-2 mb-4">
            <input type="color" value={get_color_value(@value)} phx-change="select_custom_color" phx-target={@myself} name="color-hex" class="w-8 h-8 rounded cursor-pointer" />
            <input type="text" value={get_color_name_or_value(@value)} phx-change="update_custom_color" phx-target={@myself} name="color-hex-value" class="flex-1 text-sm border rounded px-2 py-1" />
          </div>

          <div class="flex flex-wrap gap-1">
            <%= for {name, hex} <- @tailwind_colors do %>
              <button
                type="button"
                class="w-6 h-6 rounded-full border border-gray-200 hover:border-gray-300 transition-colors"
                style={"background-color: #{hex}"}
                phx-click="select_tailwind_color"
                phx-value-color={name}
                phx-target={@myself}
                title={name}
              >
                <%= if @value == name do %>
                  <div class="w-full h-full flex items-center justify-center">
                    <.icon name="hero-check" class="w-3 h-3 text-white" />
                  </div>
                <% end %>
              </button>
            <% end %>
          </div>
        </div>
      <% end %>
    </div>
    """
  end

  def handle_event("select_tailwind_color", %{"color" => color}, socket) do
    {:noreply, assign(socket, value: color)}
  end

  def handle_event("select_custom_color", %{"color-hex" => color}, socket) do
    {:noreply, assign(socket, value: color)}
  end

  def handle_event("update_custom_color", %{"color-hex-value" => color}, socket) do
    if Regex.match?(~r/^#[0-9A-Fa-f]{6}$/, color) do
      {:noreply, assign(socket, value: color)}
    else
      {:noreply, socket}
    end
  end

  def handle_event("toggle_picker", _, socket) do
    {:noreply, assign(socket, show_picker: !socket.assigns.show_picker)}
  end

  def handle_event("close_picker", _, socket) do
    {:noreply, assign(socket, show_picker: false)}
  end
end
