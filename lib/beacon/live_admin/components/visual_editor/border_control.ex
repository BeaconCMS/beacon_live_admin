defmodule Beacon.LiveAdmin.VisualEditor.BorderControl do
  @moduledoc false
  require Logger
  use Beacon.LiveAdmin.Web, :live_component
  import Beacon.LiveAdmin.VisualEditor.Components
  alias Beacon.LiveAdmin.VisualEditor

  @border_styles [{"none", ""}, {"solid", "—"}, {"dashed", "--"}, {"dotted", "..."}]
  @border_colors ~w(gray-500 red-500 blue-500 green-500 yellow-500 purple-500)

  def mount(socket) do
    {:ok, assign(socket,
      expanded_width_controls: false,
      expanded_radius_controls: false
    )}
  end

  def render(assigns) do
    ~H"""
    <div id={@id}>
      <.control_section label="Border">
        <form phx-change="update_border" phx-target={@myself} class="space-y-2">
          <div class="flex gap-2">
            <div class="w-1/3">
              <label class="text-xs">Style</label>
            </div>
            <div class="w-2/3">
              <div class="flex h-fit">
                <label
                  :for={{style, label} <- @border_styles}
                  class={[
                    "text-center px-2 py-1 text-sm cursor-pointer flex-1",
                    "first:rounded-l last:rounded-r",
                    "border-y border-r border-gray-300 first:border-l",
                    @form.params["style"] == style && "bg-blue-500 text-white relative z-10",
                    @form.params["style"] != style && "bg-gray-100 hover:bg-gray-200"
                  ]}
                >
                  <input type="radio" name="style" value={style} class="hidden" checked={@form.params["style"] == style} />
                  <%= label %>
                </label>
              </div>
            </div>
          </div>

          <div class="flex gap-2">
            <div class="w-1/3">
              <label class="text-xs">Color</label>
            </div>
            <div class="w-2/3 flex">
              <select name="color" class="flex-1 py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm">
                <option :for={color <- @border_colors} value={color} selected={@form.params["color"] == color}>
                  <%= String.replace(color, "-", " ") |> String.capitalize() %>
                </option>
              </select>
            </div>
          </div>

          <div class="flex gap-2">
            <div class="w-1/3">
              <label class="text-xs">Width</label>
            </div>
            <div class="w-2/3 flex justify-end">
              <div class={["grow flex", @expanded_width_controls && "hidden"]}>
                <.input_with_units name="width" value={@form.params["width"]} />
              </div>
              <.toggle_expand control="width" />
            </div>
          </div>
            <div id="border-width-expanded-inputs" class={["w-full grid grid-cols-2 gap-1", not @expanded_width_controls && "hidden"]}>
              <div class="flex items-center gap-1">
                <span><.icon name="hero-arrow-long-up"/></span>
                <.input_with_units name="top_width" value={@form.params["top_width"]} />
              </div>
              <div class="flex items-center gap-1">
                <span><.icon name="hero-arrow-long-right"/></span>
                <.input_with_units name="right_width" value={@form.params["right_width"]} />
              </div>
              <div class="flex items-center gap-1">
                <span><.icon name="hero-arrow-long-down"/></span>
                <.input_with_units name="bottom_width" value={@form.params["bottom_width"]} />
              </div>
              <div class="flex items-center gap-1">
                <span><.icon name="hero-arrow-long-left"/></span>
                <.input_with_units name="left_width" value={@form.params["left_width"]} />
              </div>
            </div>

          <div class="flex gap-2">
            <div class="w-1/3">
              <label class="text-xs">Radius</label>
            </div>
            <div class="w-2/3 flex justify-end">
              <div class={["grow flex", @expanded_radius_controls && "hidden"]}>
                <.input_with_units name="radius" value={@form.params["radius"]} />
              </div>
              <.toggle_expand control="radius" />
            </div>
          </div>
            <div id="border-radius-expanded-inputs" class={["w-full grid grid-cols-2 gap-1", not @expanded_radius_controls && "hidden"]}>
              <div class="flex items-center gap-1">
                <span><.icon name="hero-arrow-up-left"/></span>
                <.input_with_units name="top_left_radius" value={@form.params["top_left_radius"]} />
              </div>
              <div class="flex items-center gap-1">
                <span><.icon name="hero-arrow-up-right"/></span>
                <.input_with_units name="top_right_radius" value={@form.params["top_right_radius"]} />
              </div>
              <div class="flex items-center gap-1">
                <span><.icon name="hero-arrow-down-right"/></span>
                <.input_with_units name="bottom_right_radius" value={@form.params["bottom_right_radius"]} />
              </div>
              <div class="flex items-center gap-1">
                <span><.icon name="hero-arrow-down-left"/></span>
                <.input_with_units name="bottom_left_radius" value={@form.params["bottom_left_radius"]} />
              </div>
            </div>
        </form>
      </.control_section>
    </div>
    """
  end

  def update(%{element: element} = assigns, socket) do
    values = %{
      "style" => extract_border_style(element),
      "color" => extract_border_color(element),
      "width" => extract_border_width(element),
      "radius" => extract_border_radius(element)
    }

    {:ok,
     socket
     |> assign(assigns)
     |> assign(:border_styles, @border_styles)
     |> assign(:border_colors, @border_colors)
     |> assign_form(values)}
  end

  def handle_event("update_border", %{"style" => style, "color" => color, "width" => width, "radius" => radius}, socket) do
    update_border_classes(socket, %{style: style, color: color, width: width, radius: radius})
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
    classes = VisualEditor.element_classes(element)

    # First check for specific border style classes
    specific_styles = %{
      "border-solid" => "solid",
      "border-dashed" => "dashed",
      "border-dotted" => "dotted",
      "border-double" => "double"
    }

    # Then check for shorthand border classes that imply "solid"
    shorthand_borders = ["border", "border-t", "border-r", "border-b", "border-l"]

    cond do
      # First priority: specific border style
      class = Enum.find(Map.keys(specific_styles), &(&1 in classes)) ->
        specific_styles[class]

      # Second priority: any shorthand border class implies "solid"
      Enum.any?(shorthand_borders, &(&1 in classes)) ->
        "solid"

      # Default: no border
      true ->
        "none"
    end
  end

  defp extract_border_color(element) do
    classes = VisualEditor.element_class(element)

    Enum.find(@border_colors, "gray-500", fn color ->
      String.contains?(classes, "border-#{color}")
    end)
  end

  defp extract_border_width(element) do
    classes = VisualEditor.element_classes(element)

    # First check for specific width classes (0-16)
    specific_width =
      Enum.find_value(0..16, fn width ->
        if "border-#{width}" in classes, do: "#{width}"
      end)

    # Then check for shorthand classes that imply width=1
    shorthand_borders = ["border", "border-t", "border-r", "border-b", "border-l"]

    cond do
      # First priority: specific width
      specific_width ->
        specific_width

      # Second priority: shorthand implies width=1
      Enum.any?(shorthand_borders, &(&1 in classes)) ->
        "1"

      # Default: no border
      true ->
        "0"
    end
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

  def handle_event("toggle_expand", %{"control" => control}, socket) do
    case control do
      "width" -> {:noreply, update(socket, :expanded_width_controls, &(!&1))}
      "radius" -> {:noreply, update(socket, :expanded_radius_controls, &(!&1))}
    end
  end

  defp input_with_units(assigns) do
    ~H"""
    <div class="relative w-full flex bg-gray-100 border rounded focus-within:ring-2 focus-within:ring-blue-500">
      <input type="text" name={@name} value={@value} class="w-full px-2 py-1 text-sm text-left outline-none focus:outline-none bg-transparent border-none focus:ring-0" />
      <select name={@name <> "_unit"} class="appearance-none bg-none bg-transparent border-none pr-1 pl-2 text-sm focus:ring-0">
        <option selected>px</option>
        <option>em</option>
        <option>rem</option>
        <option>%</option>
        <option>vh</option>
        <option>vw</option>
      </select>
    </div>
    """
  end

  defp toggle_expand(assigns) do
    ~H"""
    <button type="button" class="sui-secondary !px-2" phx-click="toggle_expand" phx-target="#control-border" phx-value-control={@control}>
      <.icon name="hero-arrows-pointing-out"  class="w-4 h-4" />
    </button>
    """
  end
end
