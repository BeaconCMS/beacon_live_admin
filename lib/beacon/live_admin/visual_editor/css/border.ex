defmodule Beacon.LiveAdmin.VisualEditor.Css.Border do
  alias Beacon.LiveAdmin.VisualEditor
  alias Beacon.LiveAdmin.VisualEditor.Utils

  @border_colors ~w(gray-500 red-500 blue-500 green-500 yellow-500 purple-500)
  @tailwind_border_radius_rems %{
    "0" => "none",
    "none" => 0,
    "0.125" => "sm",
    "sm" => 0.125,
    "0.25" => "DEFAULT",
    "DEFAULT" => 0.25,
    "0.375" => "md",
    "md" => 0.375,
    "0.5" => "lg",
    "lg" => 0.5,
    "0.75" => "xl",
    "xl" => 0.75,
    "1" => "2xl",
    "2xl" => 1,
    "1.5" => "3xl",
    "3xl" => 1.5,
    "9999" => "full"
  }
  @tailwind_border_radius_pixels %{
    "0" => "none",
    "none" => 0,
    "2" => "sm",
    "sm" => 2,
    "4" => "DEFAULT",
    "DEFAULT" => 4,
    "6" => "md",
    "md" => 6,
    "8" => "lg",
    "lg" => 8,
    "12" => "xl",
    "xl" => 12,
    "16" => "2xl",
    "2xl" => 16,
    "24" => "3xl",
    "full" => 9999,
    "9999" => "full"
  }

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

  #
  # Extract border properties from tailwind classes
  #

  def extract_border_properties(element) do
    %{
      "style" => extract_border_style(element),
      "color" => extract_border_color(element),
      "width" => extract_border_width(element),
      "width_unit" => extract_border_width_unit(element),
      "radius" => extract_border_radius(element),
      "radius_unit" => extract_border_radius_unit(element),
      "top_width" => extract_border_width(element, "top"),
      "top_width_unit" => extract_border_width_unit(element, "top"),
      "right_width" => extract_border_width(element, "right"),
      "right_width_unit" => extract_border_width_unit(element, "right"),
      "bottom_width" => extract_border_width(element, "bottom"),
      "bottom_width_unit" => extract_border_width_unit(element, "bottom"),
      "left_width" => extract_border_width(element, "left"),
      "left_width_unit" => extract_border_width_unit(element, "left"),
      "top_left_radius" => extract_border_radius(element, "top-left"),
      "top_left_radius_unit" => extract_border_radius_unit(element, "top-left"),
      "top_right_radius" => extract_border_radius(element, "top-right"),
      "top_right_radius_unit" => extract_border_radius_unit(element, "top-right"),
      "bottom_right_radius" => extract_border_radius(element, "bottom-right"),
      "bottom_right_radius_unit" => extract_border_radius_unit(element, "bottom-right"),
      "bottom_left_radius" => extract_border_radius(element, "bottom-left"),
      "bottom_left_radius_unit" => extract_border_radius_unit(element, "bottom-left")
    }
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

  defp extract_border_width(element, _side \\ nil) do
    # TODO: Implement this for when side is provided

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

  defp extract_border_radius(element, _corner \\ nil) do
    # TODO: Implement this for when corner is provided
    radius_class =
      VisualEditor.element_classes(element)
      |> Enum.find(fn class -> String.contains?(class, "rounded") end)

    case radius_class do
      "rounded" ->
        @tailwind_border_radius_rems["DEFAULT"]

      class when is_binary(class) ->
        case Regex.run(~r/^rounded-\[(.+)\]$/, class) do
          [_, name] ->
            Utils.parse_number_and_unit(name) |> elem(0)
          _ ->
            case Regex.run(~r/^rounded-(.+)$/, class) do
              [_, name] -> @tailwind_border_radius_rems[name]
              _ -> nil
            end
        end

      _ ->
        nil
    end
  end

  defp extract_border_radius_unit(element, _corner \\ nil) do
    # TODO: Implement this for when corner is provided
    radius_class =
      VisualEditor.element_classes(element)
      |> Enum.find(fn class -> String.contains?(class, "rounded") end)


    case radius_class do
      nil -> "rem"
      "rounded" -> "rem"
      "rounded-none" -> "px"
      "rounded-full" -> "px"
      class when is_binary(class) ->
        case Regex.run(~r/^rounded-\[(.+)\]$/, class) do
          [_, name] ->
            Utils.parse_number_and_unit(name) |> elem(1)
          _ -> "rem"
        end
      _ ->
        nil
    end
  end

  defp extract_border_width_unit(element, _side \\ nil) do
    # TODO: Implement this
    "px"
  end


  #
  # Generate tailwind classes from css properties
  #
  @spec generate_border_classes(border_params()) :: [String.t()]
  def generate_border_classes(_params) do
    []
  end

  def generate_border_radius_classes(params, expanded_radius_controls) do
    case {expanded_radius_controls, params} do
      {true, %{"top_left_radius" => tlr, "top_left_radius_unit" => tlr_unit, "top_right_radius" => trr, "top_right_radius_unit" => trr_unit, "bottom_right_radius" => brr, "bottom_right_radius_unit" => brr_unit, "bottom_left_radius" => blr, "bottom_left_radius_unit" => blr_unit }} ->
        []
      {_, %{ "radius" => radius, "radius_unit" => radius_unit } } ->
        [generate_simple_border_radius_class(radius, radius_unit)]
    end
  end

  defp generate_simple_border_radius_class(radius, radius_unit) do
    case radius_unit do
      "rem" ->
        case @tailwind_border_radius_rems[radius] do
          nil -> "rounded-[#{radius}rem]"
          "DEFAULT" -> "rounded"
          value -> "rounded-#{value}"
        end
      "px" ->
        case @tailwind_border_radius_pixels[radius] do
          nil -> "rounded-[#{radius}px]"
          "DEFAULT" -> "rounded"
          value -> "rounded-#{value}"
        end
      _ -> "rounded-[#{radius}#{radius_unit}]"
    end
  end
end
