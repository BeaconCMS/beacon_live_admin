defmodule Beacon.LiveAdmin.VisualEditor.BorderControl do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_component
  import Beacon.LiveAdmin.VisualEditor.Components.InputWithUnits
  import Beacon.LiveAdmin.VisualEditor.Components.ToggleGroup
  alias Beacon.LiveAdmin.VisualEditor
  alias Beacon.LiveAdmin.VisualEditor.Components.ControlSection
  alias Beacon.LiveAdmin.VisualEditor.Css.Border

  @border_styles [{"none", ""}, {"solid", "—"}, {"dashed", "--"}, {"dotted", "..."}]

  @border_colors ~w(Default gray-200 red-200 blue-200 green-200 yellow-200 purple-200)

  # Define Tailwind border radius sizes in order
  @border_radius_sizes ~w(none sm base md lg xl 2xl 3xl full)
  @border_width_sizes ~w(0 1 2 4 8)

  # Units for custom sizes
  @border_radius_units ~w(px rem em %)
  @border_width_units ~w(px rem em %)

  def mount(socket) do
    {:ok,
     assign(socket,
       expanded_width_controls: false,
       expanded_radius_controls: false,
       border_width_sizes: @border_width_sizes,
       border_width_units: @border_width_units,
       border_radius_sizes: @border_radius_sizes,
       border_radius_units: @border_radius_units
     )}
  end

  def update(%{element: element} = assigns, socket) do
    values = Border.extract_border_properties(element)

    {:ok,
     socket
     |> assign(assigns)
     |> assign(:border_styles, @border_styles)
     |> assign(:border_colors, @border_colors)
     |> maybe_expand_controls(values)
     |> assign_form(values)}
  end

  def render(assigns) do
    assigns =
      assigns
      |> assign(:style, assigns.form.params["style"] || "none")
      |> assign(:border_style_options, Enum.map(@border_styles, fn {value, label} -> %{value: value, label: label} end))

    ~H"""
    <div id={@id}>
      <.live_component module={ControlSection} id={@id <> "-section"} label="Border">
        <form phx-change="update_border" phx-target={@myself} class="space-y-2">
          <div class="flex gap-2">
            <div class="w-1/3">
              <label class="text-xs">Style</label>
            </div>
            <div class="w-2/3">
              <.toggle_group name="style" options={@border_style_options} selected={@style}>
                <:label :let={style}>
                  <%= style.label %>
                </:label>
              </.toggle_group>
            </div>
          </div>

          <div class="flex gap-2">
            <div class="w-1/3">
              <label class="text-xs">Color</label>
            </div>
            <div class="w-2/3 flex">
              <.live_component module={Beacon.LiveAdmin.VisualEditor.Components.ColorPicker} id="border-color-picker" name="color" value={@form.params["color"]} />
            </div>
          </div>

          <div class="flex gap-2">
            <div class="w-1/3">
              <label class="text-xs">Width</label>
            </div>
            <div class="w-2/3 flex justify-end">
              <div class={["grow flex", @expanded_width_controls && "hidden"]}>
                <.input_with_units name="width" value={@form.params["width"]} value_unit={@form.params["width_unit"]} sizes={@border_width_sizes} units={@border_width_units} size="sm" />
              </div>
              <.toggle_expand control="width" expanded={@expanded_width_controls} />
            </div>
          </div>
          <div id="border-width-expanded-inputs" class={["w-full grid grid-cols-2 gap-1", not @expanded_width_controls && "hidden"]}>
            <div class="flex items-center gap-1">
              <span><.icon name="hero-arrow-long-up" /></span>
              <.input_with_units name="top_width" value={@form.params["top_width"]} value_unit={@form.params["top_width_unit"]} sizes={@border_width_sizes} units={@border_width_units} size="sm" />
            </div>
            <div class="flex items-center gap-1">
              <span><.icon name="hero-arrow-long-right" /></span>
              <.input_with_units name="right_width" value={@form.params["right_width"]} value_unit={@form.params["right_width_unit"]} sizes={@border_width_sizes} units={@border_width_units} size="sm" />
            </div>
            <div class="flex items-center gap-1">
              <span><.icon name="hero-arrow-long-down" /></span>
              <.input_with_units name="bottom_width" value={@form.params["bottom_width"]} value_unit={@form.params["bottom_width_unit"]} sizes={@border_width_sizes} units={@border_width_units} size="sm" />
            </div>
            <div class="flex items-center gap-1">
              <span><.icon name="hero-arrow-long-left" /></span>
              <.input_with_units name="left_width" value={@form.params["left_width"]} value_unit={@form.params["left_width_unit"]} sizes={@border_width_sizes} units={@border_width_units} size="sm" />
            </div>
          </div>

          <div class="flex gap-2">
            <div class="w-1/3">
              <label class="text-xs">Radius</label>
            </div>
            <div class="w-2/3 flex justify-end">
              <div class={["grow flex", @expanded_radius_controls && "hidden"]}>
                <.input_with_units name="radius" value={@form.params["radius"]} value_unit={@form.params["radius_unit"]} sizes={@border_radius_sizes} units={@border_radius_units} size="sm" />
              </div>
              <.toggle_expand control="radius" expanded={@expanded_radius_controls} />
            </div>
          </div>
          <div id="border-radius-expanded-inputs" class={["w-full grid grid-cols-2 gap-1", not @expanded_radius_controls && "hidden"]}>
            <div class="flex items-center gap-1">
              <span><.icon name="hero-arrow-up-left" /></span>
              <.input_with_units
                name="top_left_radius"
                value={@form.params["top_left_radius"]}
                value_unit={@form.params["top_left_radius_unit"]}
                sizes={@border_radius_sizes}
                units={@border_radius_units}
                size="sm"
              />
            </div>
            <div class="flex items-center gap-1">
              <.input_with_units
                name="top_right_radius"
                value={@form.params["top_right_radius"]}
                value_unit={@form.params["top_right_radius_unit"]}
                sizes={@border_radius_sizes}
                units={@border_radius_units}
                size="sm"
              />
              <span><.icon name="hero-arrow-up-right" /></span>
            </div>
            <div class="flex items-center gap-1">
              <span><.icon name="hero-arrow-down-left" /></span>
              <.input_with_units
                name="bottom_left_radius"
                value={@form.params["bottom_left_radius"]}
                value_unit={@form.params["bottom_left_radius_unit"]}
                sizes={@border_radius_sizes}
                units={@border_radius_units}
                size="sm"
              />
            </div>
            <div class="flex items-center gap-1">
              <.input_with_units
                name="bottom_right_radius"
                value={@form.params["bottom_right_radius"]}
                value_unit={@form.params["bottom_right_radius_unit"]}
                sizes={@border_radius_sizes}
                units={@border_radius_units}
                size="sm"
              />
              <span><.icon name="hero-arrow-down-right" /></span>
            </div>
          </div>
        </form>
      </.live_component>
    </div>
    """
  end

  defp maybe_expand_controls(socket, values) do
    socket
    |> maybe_expand_width_controls(values)
    |> maybe_expand_radius_controls(values)
  end

  defp maybe_expand_width_controls(socket, values) do
    if !socket.assigns.expanded_width_controls && should_expand_width_controls?(values) do
      assign(socket, :expanded_width_controls, true)
    else
      socket
    end
  end

  defp maybe_expand_radius_controls(socket, values) do
    if !socket.assigns.expanded_radius_controls && should_expand_radius_controls?(values) do
      assign(socket, :expanded_radius_controls, true)
    else
      socket
    end
  end

  defp should_expand_radius_controls?(values) do
    corners = ["top_left", "top_right", "bottom_right", "bottom_left"]
    [first_radius | other_radiuses] = Enum.map(corners, &values["#{&1}_radius"])
    [first_unit | other_units] = Enum.map(corners, &values["#{&1}_radius_unit"])

    Enum.any?(other_radiuses, &(&1 != first_radius)) or
      Enum.any?(other_units, &(&1 != first_unit))
  end

  defp should_expand_width_controls?(values) do
    sides = ["top", "right", "bottom", "left"]
    [first_width | other_widths] = Enum.map(sides, &values["#{&1}_width"])
    [first_unit | other_units] = Enum.map(sides, &values["#{&1}_width_unit"])

    Enum.any?(other_widths, &(&1 != first_width)) or
      Enum.any?(other_units, &(&1 != first_unit))
  end

  def handle_event("update_border", params, socket) do
    update_classes(socket, params)
  end

  def handle_event("toggle_expand", %{"control" => control}, socket) do
    socket =
      case control do
        "width" -> assign(socket, :expanded_width_controls, !socket.assigns.expanded_width_controls)
        "radius" -> assign(socket, :expanded_radius_controls, !socket.assigns.expanded_radius_controls)
      end

    update_classes(socket, socket.assigns.form.params)
  end

  defp update_classes(socket, params) do
    new_classes = generate_classes(params, socket)

    classes =
      socket.assigns.element
      |> VisualEditor.delete_classes(~r/^border-(solid|dashed|dotted|double|none)$/)
      |> VisualEditor.delete_classes(
        ~r/^border-(transparent|current|black|white|(?:red|blue|green|yellow|purple|gray|black|white|current|transparent)(?:-\d+)?(?:\/\d+)?)$/
      )
      |> VisualEditor.delete_classes(~r/^border(-[xytrbl])?(-\[[^\]]*[a-z%]+\]|-[0-9]+)?$/)
      |> VisualEditor.delete_classes(~r/^rounded(-(?:[tlbr][tlbr]|[tlbr])?)?(-(?:none|sm|md|lg|xl|2xl|3xl|full|\[.+?\]))?$/)
      |> VisualEditor.delete_classes(~r/^border-(\[[#][0-9A-Fa-f]{6}\])$/)
      |> VisualEditor.merge_class(Enum.join(new_classes, " "))

    socket.assigns.on_element_change.(socket.assigns.element["path"], %{updated: %{"attrs" => %{"class" => classes}}})

    {:noreply, socket}
  end

  defp generate_classes(params, socket) do
    classes =
      if params["style"] != "default" do
        Border.generate_border_classes(params, socket.assigns.expanded_width_controls) ++
          Border.generate_border_style_classes(params) ++
          Border.generate_border_color_classes(params)
      else
        []
      end

    classes ++ Border.generate_border_radius_classes(params, socket.assigns.expanded_radius_controls)
  end

  defp assign_form(socket, values) do
    form = to_form(values)
    assign(socket, form: form)
  end

  defp toggle_expand(assigns) do
    ~H"""
    <button type="button" class="sui-secondary !px-2" phx-click="toggle_expand" phx-target="#control-border" phx-value-control={@control}>
      <.icon name={if(@expanded, do: "hero-arrows-pointing-in", else: "hero-arrows-pointing-out")} class="w-4 h-4" />
    </button>
    """
  end
end
