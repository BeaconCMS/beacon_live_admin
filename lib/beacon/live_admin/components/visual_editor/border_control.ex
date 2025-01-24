defmodule Beacon.LiveAdmin.VisualEditor.BorderControl do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_component
  import Beacon.LiveAdmin.VisualEditor.Components
  alias Beacon.LiveAdmin.VisualEditor

  @border_styles [{:none, ""}, {:solid, "—"}, {:dashed, "---"}, {:dotted, "..."}]
  @border_colors ~w(gray-500 red-500 blue-500 green-500 yellow-500 purple-500)

  def render(assigns) do
    ~H"""
    <div id={@id}>
      <.control_section label="Border">
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <label class="block text-sm font-medium text-gray-700 w-24">Style</label>
            <div class="flex gap-1 flex-1">
              <label
                :for={{style, label} <- @border_styles}
                class={[
                  "flex-1 text-center px-2 py-1 text-sm rounded cursor-pointer",
                  @form[:style].value == style && "bg-blue-500 text-white",
                  @form[:style].value != style && "bg-gray-100 hover:bg-gray-200"
                ]}
              >
                <input
                  type="radio"
                  name="border_style"
                  value={style}
                  class="hidden"
                  checked={@form[:style].value == style}
                  phx-click="update_style"
                  phx-value-style={style}
                  phx-target={@myself}
                />
                <%= label %>
              </label>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <label class="block text-sm font-medium text-gray-700 w-24">Color</label>
            <select
              class="flex-1 py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm"
              phx-change="update_color"
              phx-target={@myself}
            >
              <option :for={color <- @border_colors} value={color} selected={@form[:color].value == color}>
                <%= String.replace(color, "-", " ") |> String.capitalize() %>
              </option>
            </select>
          </div>

          <div class="flex items-center gap-4">
            <label class="block text-sm font-medium text-gray-700 w-24">Width (px)</label>
            <input
              type="number"
              value={@form[:width].value}
              class="flex-1 py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm"
              min="0"
              max="16"
              phx-blur="update_width"
              phx-target={@myself}
            />
          </div>

          <div class="flex items-center gap-4">
            <label class="block text-sm font-medium text-gray-700 w-24">Radius (px)</label>
            <input
              type="number"
              value={@form[:radius].value}
              class="flex-1 py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm"
              min="0"
              max="32"
              phx-blur="update_radius"
              phx-target={@myself}
            />
          </div>
        </div>
      </.control_section>
    </div>
    """
  end

  def mount(socket) do
    {:ok, assign_form(socket, %{
      style: "none",
      color: "gray-500",
      width: "0",
      radius: "0"
    })}
  end

  def update(%{element: element} = assigns, socket) do
    values = %{
      style: extract_border_style(element),
      color: extract_border_color(element),
      width: extract_border_width(element),
      radius: extract_border_radius(element)
    }

    {:ok,
     socket
     |> assign(assigns)
     |> assign(:border_styles, @border_styles)
     |> assign(:border_colors, @border_colors)
     |> assign_form(values)}
  end

  def handle_event("update_style", %{"style" => style}, socket) do
    update_border_classes(socket, %{style: style})
  end

  def handle_event("update_color", %{"value" => color}, socket) do
    update_border_classes(socket, %{color: color})
  end

  def handle_event("update_width", %{"value" => width}, socket) do
    update_border_classes(socket, %{width: width})
  end

  def handle_event("update_radius", %{"value" => radius}, socket) do
    update_border_classes(socket, %{radius: radius})
  end

  defp update_border_classes(socket, changes) do
    current_values = %{
      style: socket.assigns.form[:style].value,
      color: socket.assigns.form[:color].value,
      width: socket.assigns.form[:width].value,
      radius: socket.assigns.form[:radius].value
    }
    
    values = Map.merge(current_values, changes)
    
    classes = []
    classes = if values.style != "none", do: ["border-#{values.style}" | classes], else: classes
    classes = if values.style != "none", do: ["border-#{values.color}" | classes], else: classes
    classes = if values.width != "0", do: ["border-#{values.width}" | classes], else: classes
    classes = if values.radius != "0", do: ["rounded-#{values.radius}" | classes], else: classes

    class = VisualEditor.merge_class(socket.assigns.element, Enum.join(classes, " "))
    send(self(), {:element_changed, {socket.assigns.element["path"], %{updated: %{"attrs" => %{"class" => class}}}}})

    {:noreply, assign_form(socket, values)}
  end

  defp extract_border_style(element) do
    classes = VisualEditor.element_class(element)
    cond do
      String.contains?(classes, "border-solid") -> "solid"
      String.contains?(classes, "border-dashed") -> "dashed"
      String.contains?(classes, "border-dotted") -> "dotted"
      String.contains?(classes, "border-double") -> "double"
      true -> "none"
    end
  end

  defp extract_border_color(element) do
    classes = VisualEditor.element_class(element)
    Enum.find(@border_colors, "gray-500", fn color ->
      String.contains?(classes, "border-#{color}")
    end)
  end

  defp extract_border_width(element) do
    classes = VisualEditor.element_class(element)
    Enum.find_value(0..16, "0", fn width ->
      if String.contains?(classes, "border-#{width}"), do: "#{width}"
    end)
  end

  defp extract_border_radius(element) do
    classes = VisualEditor.element_class(element)
    Enum.find_value(0..32, "0", fn radius ->
      if String.contains?(classes, "rounded-#{radius}"), do: "#{radius}"
    end)
  end

  defp assign_form(socket, values) do
    form = to_form(values)
    assign(socket, form: form)
  end
end 