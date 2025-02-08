defmodule Beacon.LiveAdmin.VisualEditor.Css.Border do
  alias Beacon.LiveAdmin.VisualEditor
  alias Beacon.LiveAdmin.VisualEditor.Utils
  require Logger
  @border_colors ~w(gray-500 red-500 blue-500 green-500 yellow-500 purple-500)
  @corner_abbreviations %{
    "top-left" => "tl",
    "top-right" => "tr",
    "bottom-right" => "br",
    "bottom-left" => "bl"
  }
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
      class when is_binary(class) ->
        case Regex.run(~r/^rounded-\[(.+)\]$/, class) do
          [_, name] ->
            Utils.parse_number_and_unit(name) |> elem(1)
          _ ->
            nil
        end
      _ -> nil
    end
  end

  defp extract_border_radius_unit(element) do
    radius_class =
      VisualEditor.element_classes(element)
      |> Enum.find(fn class -> String.contains?(class, "rounded") end)

    case radius_class do
      # Case 1: basic "rounded" class
      "rounded" ->
        "DEFAULT"

      # Case 2: predefined sizes like "rounded-sm" or "rounded-2xl"
      "rounded-" <> size when size in ~w(none sm md lg xl 2xl 3xl full) ->
        size

      # Case 3: arbitrary values like "rounded-[10px]"
      class when is_binary(class) ->
        case Regex.run(~r/^rounded-\[(.+)\]$/, class) do
          [_, name] ->
            case Utils.parse_number_and_unit(name) do
              {:ok, _, unit} -> unit
              {:error, _} -> nil
            end
          _ ->
            nil
        end

      _ -> nil
    end
  end

  defp extract_border_radius_unit(element, corner) do
    # Convert corner format from "top-left" to "tl", etc.
    corner_abbrev = @corner_abbreviations[corner]

    classes = VisualEditor.element_classes(element)
    corner_class = classes |> Enum.find(fn class ->
      String.starts_with?(class, "rounded-#{corner_abbrev}")
    end)

    case corner_class do
      # Handle arbitrary values like rounded-tl-[10px]
      "rounded-" <> <<^corner_abbrev::binary, "-[", rest::binary>> ->
        case Regex.run(~r/^(.+)\]$/, rest) do
          [_, name] ->
            case Utils.parse_number_and_unit(name) do
              {:ok, _, unit} -> unit
              {:error, _} -> nil
            end
          _ ->
            extract_border_radius_unit(element)
        end
      # Handle predefined sizes like rounded-tl-md
      "rounded-" <> <<^corner_abbrev::binary, "-", size::binary>> ->
        size
      _ ->
        extract_border_radius_unit(element)
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
    Logger.debug("##################")
    Logger.debug("params: #{inspect(params)}")
    Logger.debug("expanded_radius_controls: #{inspect(expanded_radius_controls)}")
    case {expanded_radius_controls, params} do
      {true, %{"top_left_radius" => tlr, "top_left_radius_unit" => tlr_unit, "top_right_radius" => trr, "top_right_radius_unit" => trr_unit, "bottom_right_radius" => brr, "bottom_right_radius_unit" => brr_unit, "bottom_left_radius" => blr, "bottom_left_radius_unit" => blr_unit }} ->
        Logger.debug("################## branch A")
        [
          generate_custom_border_radius_class(tlr, tlr_unit),
          generate_custom_border_radius_class(trr, trr_unit),
          generate_custom_border_radius_class(brr, brr_unit),
          generate_custom_border_radius_class(blr, blr_unit)
        ]
      {true, %{"top_left_radius_unit" => tlr_unit, "top_right_radius_unit" => trr_unit, "bottom_right_radius_unit" => brr_unit, "bottom_left_radius_unit" => blr_unit }} ->
        Logger.debug("################## branch A2")
        [
          generate_simple_border_radius_class(tlr_unit, "top-left"),
          generate_simple_border_radius_class(trr_unit, "top-right"),
          generate_simple_border_radius_class(brr_unit, "bottom-right"),
          generate_simple_border_radius_class(blr_unit, "bottom-left")
        ]
      {_, %{ "radius" => radius, "radius_unit" => radius_unit } } ->
        Logger.debug("################## branch B #{inspect(params)}")
        [generate_custom_border_radius_class(radius, radius_unit)]
      {_, %{ "radius_unit" => radius_unit } } ->
        Logger.debug("################## branch C #{inspect(params)}")
        [generate_simple_border_radius_class(radius_unit)]
    end
  end

  defp generate_custom_border_radius_class("", radius_unit) when radius_unit in ~w(px rem em %) do
    nil
  end
  defp generate_custom_border_radius_class(radius, radius_unit) when radius_unit in ~w(px rem em %) and is_binary(radius) do
    case Utils.parse_integer_or_float(radius) do
      {:ok, radius_value} -> "rounded-[#{radius_value}#{radius_unit}]"
      :error -> nil
    end
  end

  defp generate_custom_border_radius_class(radius, radius_unit, corner \\ nil) when radius_unit in ~w(px rem em %) and is_integer(radius) do
    case corner do
      nil -> "rounded-[#{radius}#{radius_unit}]"
      corner -> "rounded-#{@corner_abbreviations[corner]}-[#{radius}#{radius_unit}]"
    end
  end

  defp generate_simple_border_radius_class(radius_unit) do
    case radius_unit do
      "DEFAULT" -> "rounded"
      radius_unit when radius_unit in ~w(px rem em %) ->generate_custom_border_radius_class(0, radius_unit)
      radius_unit -> "rounded-#{radius_unit}"
    end
  end

  defp generate_simple_border_radius_class(radius_unit, corner) do
    corner_abbrev = @corner_abbreviations[corner]
    case radius_unit do
      "DEFAULT" -> "rounded-#{corner_abbrev}"
      radius_unit when radius_unit in ~w(px rem em %) -> generate_custom_border_radius_class(0, radius_unit, corner)
      radius_unit -> "rounded-#{corner_abbrev}-#{radius_unit}"
    end
  end
end
