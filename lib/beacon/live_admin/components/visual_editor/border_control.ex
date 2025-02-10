defmodule Beacon.LiveAdmin.VisualEditor.BorderControl do
  @moduledoc false
  require Logger
  use Beacon.LiveAdmin.Web, :live_component
  import Beacon.LiveAdmin.VisualEditor.Components
  alias Beacon.LiveAdmin.VisualEditor
  alias Beacon.LiveAdmin.VisualEditor.Css.Border

  @border_styles [{"none", ""}, {"solid", "—"}, {"dashed", "--"}, {"dotted", "..."}]
  @border_colors ~w(gray-500 red-500 blue-500 green-500 yellow-500 purple-500)

  # Define Tailwind border radius sizes in order
  @border_radius_sizes [
    {"none", "none"},
    {"sm", "sm"},
    {"-", "DEFAULT"},
    {"md", "md"},
    {"lg", "lg"},
    {"xl", "xl"},
    {"2xl", "2xl"},
    {"3xl", "3xl"},
    {"full", "full"}
  ]
  @border_width_sizes []
  # Units for custom sizes
  @border_radius_units ~w(px rem em %)
  @border_width_units ~w(px rem em %)

  @type border_params :: %{
    required(String.t()) => String.t(),
    optional(:top_width) => String.t(),
    optional(:top_width_unit) => String.t(),
    optional(:right_width) => String.t(),
    optional(:right_width_unit) => String.t(),
    optional(:bottom_width) => String.t(),
    optional(:bottom_width_unit) => String.t(),
    optional(:left_width) => String.t(),
    optional(:left_width_unit) => String.t(),
    optional(:top_left_radius) => String.t(),
    optional(:top_left_radius_unit) => String.t(),
    optional(:top_right_radius) => String.t(),
    optional(:top_right_radius_unit) => String.t(),
    optional(:bottom_right_radius) => String.t(),
    optional(:bottom_right_radius_unit) => String.t(),
    optional(:bottom_left_radius) => String.t(),
    optional(:bottom_left_radius_unit) => String.t(),
    style: String.t(),
    color: String.t(),
    width: String.t(),
    width_unit: String.t(),
    radius: String.t(),
    radius_unit: String.t()
  }


  def mount(socket) do
    {:ok, assign(socket,
      expanded_width_controls: false,
      expanded_radius_controls: false,
      border_width_sizes: @border_width_sizes,
      border_width_units: @border_width_units,
      border_radius_sizes: @border_radius_sizes,
      border_radius_units: @border_radius_units
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
                <.input_with_units name="width" value={@form.params["width"]} value_unit={@form.params["width_unit"]} sizes={@border_width_sizes} units={@border_width_units}/>
              </div>
              <.toggle_expand control="width" expanded={@expanded_width_controls} />
            </div>
          </div>
          <div id="border-width-expanded-inputs" class={["w-full grid grid-cols-2 gap-1", not @expanded_width_controls && "hidden"]}>
            <div class="flex items-center gap-1">
              <span><.icon name="hero-arrow-long-up"/></span>
              <.input_with_units name="top_width" value={@form.params["top_width"]} value_unit={@form.params["top_width_unit"]} sizes={@border_width_sizes} units={@border_width_units}/>
            </div>
            <div class="flex items-center gap-1">
              <span><.icon name="hero-arrow-long-right"/></span>
              <.input_with_units name="right_width" value={@form.params["right_width"]} value_unit={@form.params["right_width_unit"]} sizes={@border_width_sizes} units={@border_width_units}/>
            </div>
            <div class="flex items-center gap-1">
              <span><.icon name="hero-arrow-long-down"/></span>
              <.input_with_units name="bottom_width" value={@form.params["bottom_width"]} value_unit={@form.params["bottom_width_unit"]} sizes={@border_width_sizes} units={@border_width_units}/>
            </div>
            <div class="flex items-center gap-1">
              <span><.icon name="hero-arrow-long-left"/></span>
              <.input_with_units name="left_width" value={@form.params["left_width"]} value_unit={@form.params["left_width_unit"]} sizes={@border_width_sizes} units={@border_width_units}/>
            </div>
          </div>

          <div class="flex gap-2">
            <div class="w-1/3">
              <label class="text-xs">Radius</label>
            </div>
            <div class="w-2/3 flex justify-end">
              <div class={["grow flex", @expanded_radius_controls && "hidden"]}>
                <.input_with_units name="radius" value={@form.params["radius"]} value_unit={@form.params["radius_unit"]} sizes={@border_radius_sizes} units={@border_radius_units}/>
              </div>
              <.toggle_expand control="radius" expanded={@expanded_radius_controls} />
            </div>
          </div>
          <div id="border-radius-expanded-inputs" class={["w-full grid grid-cols-2 gap-1", not @expanded_radius_controls && "hidden"]}>
            <div class="flex items-center gap-1">
              <span><.icon name="hero-arrow-up-left"/></span>
              <.input_with_units name="top_left_radius" value={@form.params["top_left_radius"]} value_unit={@form.params["top_left_radius_unit"]} sizes={@border_radius_sizes} units={@border_radius_units}/>
            </div>
            <div class="flex items-center gap-1">
              <span><.icon name="hero-arrow-up-right"/></span>
              <.input_with_units name="top_right_radius" value={@form.params["top_right_radius"]} value_unit={@form.params["top_right_radius_unit"]} sizes={@border_radius_sizes} units={@border_radius_units}/>
            </div>
            <div class="flex items-center gap-1">
              <span><.icon name="hero-arrow-down-right"/></span>
              <.input_with_units name="bottom_right_radius" value={@form.params["bottom_right_radius"]} value_unit={@form.params["bottom_right_radius_unit"]} sizes={@border_radius_sizes} units={@border_radius_units}/>
            </div>
            <div class="flex items-center gap-1">
              <span><.icon name="hero-arrow-down-left"/></span>
              <.input_with_units name="bottom_left_radius" value={@form.params["bottom_left_radius"]} value_unit={@form.params["bottom_left_radius_unit"]} sizes={@border_radius_sizes} units={@border_radius_units}/>
            </div>
          </div>
        </form>
      </.control_section>
    </div>
    """
  end

  def update(%{element: element} = assigns, socket) do
    values = Border.extract_border_properties(element)

    {:ok,
     socket
     |> assign(assigns)
     |> assign(:border_styles, @border_styles)
     |> assign(:border_colors, @border_colors)
     |> assign(:expanded_radius_controls, should_expand_radius_controls?(values))
     |> assign_form(values)}
  end

  def handle_event("update_border", params, socket) do
    # TODO: Individual radius classes for corners should remove the global radius class
    new_classes = generate_classes(params, socket)
    classes = socket.assigns.element
    |> VisualEditor.delete_classes(~r/^border(-[xytrbl])?(-\[[\d.]+[a-z%]+\]|-[0-9]+)?$/)
    |> VisualEditor.delete_classes(~r/^rounded(-[tlbr])?(-(?:none|sm|md|lg|xl|2xl|3xl|full))?$/)
    |> VisualEditor.merge_class(Enum.join(new_classes, " "))
    send(self(), {:element_changed, {socket.assigns.element["path"], %{updated: %{"attrs" => %{"class" => classes}}}}})

    {:noreply, socket}
    # {:noreply, assign_form(socket, values)}
  end

  def handle_event("toggle_expand", %{"control" => control}, socket) do
    case control do
      "width" -> {:noreply, update(socket, :expanded_width_controls, &(!&1))}
      "radius" -> {:noreply, update(socket, :expanded_radius_controls, &(!&1))}
    end
  end

  defp generate_classes(params, socket) do
    Border.generate_border_classes(params, socket.assigns.expanded_width_controls) ++ Border.generate_border_radius_classes(params, socket.assigns.expanded_radius_controls)
  end

  defp assign_form(socket, values) do
    form = to_form(values)
    assign(socket, form: form)
  end

  defp input_with_units(assigns) do
    assigns = assigns
      |> assign(:is_radius?, String.contains?(assigns.name, "radius"))
      |> assign(:is_custom_unit?, Enum.member?(assigns.units, assigns.value_unit))

    ~H"""
    <div class="relative w-full flex bg-gray-100 border rounded focus-within:ring-2 focus-within:ring-blue-500">
      <input
        type="text"
        name={@name}
        value={@value}
        disabled={!@is_custom_unit?}
        class={[
          "w-full px-2 py-1 text-sm text-left outline-none focus:outline-none bg-transparent border-none focus:ring-0",
          !@is_custom_unit? && "text-gray-500"
        ]}
      />
      <select name={@name <> "_unit"} class="appearance-none bg-none bg-transparent border-none pr-1 pl-2 text-sm focus:ring-0">
        <%= if length(@sizes) > 0 do %>
          <optgroup label="Sizes">
            <option :for={{label, value} <- @sizes} value={value} selected={@value_unit == value}>
              <%= label %>
            </option>
          </optgroup>
        <% end %>
        <%= if length(@units) > 0 do %>
          <optgroup label="Units">
            <option :for={unit <- @units} value={unit} selected={@value_unit == unit}>
              <%= unit %>
            </option>
          </optgroup>
        <% end %>
      </select>
    </div>
    """
  end

  defp toggle_expand(assigns) do
    ~H"""
    <button type="button" class="sui-secondary !px-2" phx-click="toggle_expand" phx-target="#control-border" phx-value-control={@control}>
      <.icon name={if(@expanded, do: "hero-arrows-pointing-in", else: "hero-arrows-pointing-out")} class="w-4 h-4" />
    </button>
    """
  end

  defp should_expand_radius_controls?(values) do
    corners = ["top_left", "top_right", "bottom_right", "bottom_left"]
    [first_radius | other_radiuses] = Enum.map(corners, &values["#{&1}_radius"])
    [first_unit | other_units] = Enum.map(corners, &values["#{&1}_radius_unit"])
    Enum.any?(other_radiuses, &(&1 != first_radius)) or
    Enum.any?(other_units, &(&1 != first_unit))
  end

  # defp update_border_classes(socket, changes) do
  #   current_values = %{
  #     style: socket.assigns.form[:style].value,
  #     color: socket.assigns.form[:color].value,
  #     width: socket.assigns.form[:width].value,
  #     radius: socket.assigns.form[:radius].value
  #   }

  #   values = Map.merge(current_values, changes)

  #   classes = []
  #   classes = if values.style != "none", do: ["border-#{values.style}" | classes], else: classes
  #   classes = if values.style != "none", do: ["border-#{values.color}" | classes], else: classes
  #   classes = if values.width != "0", do: ["border-#{values.width}" | classes], else: classes
  #   classes = if values.radius != "0", do: ["rounded-#{values.radius}" | classes], else: classes

  #   class = VisualEditor.merge_class(socket.assigns.element, Enum.join(classes, " "))
  #   send(self(), {:element_changed, {socket.assigns.element["path"], %{updated: %{"attrs" => %{"class" => class}}}}})

  #   {:noreply, assign_form(socket, values)}
  # end

end
