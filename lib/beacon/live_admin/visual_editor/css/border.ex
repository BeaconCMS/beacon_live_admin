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
  @tailwind_sizes ~w(0 1 2 4 8)
  @css_units ~w(px rem em %)

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
    radius_unit = extract_border_radius_unit(element)
    radius = extract_border_radius(element, nil, radius_unit)
    top_left_radius_unit = extract_border_radius_unit(element, "top-left")
    top_left_radius = extract_border_radius(element, "top-left", top_left_radius_unit)
    top_right_radius_unit = extract_border_radius_unit(element, "top-right")
    top_right_radius = extract_border_radius(element, "top-right", top_right_radius_unit)
    bottom_right_radius_unit = extract_border_radius_unit(element, "bottom-right")
    bottom_right_radius = extract_border_radius(element, "bottom-right", bottom_right_radius_unit)
    bottom_left_radius_unit = extract_border_radius_unit(element, "bottom-left")
    bottom_left_radius = extract_border_radius(element, "bottom-left", bottom_left_radius_unit)

    width_unit = extract_border_width_unit(element, nil)
    width = extract_border_width(element, nil, width_unit)
    top_width_unit = extract_border_width_unit(element, "top") || width_unit
    top_width = extract_border_width(element, "top", top_width_unit)
    right_width_unit = extract_border_width_unit(element, "right") || width_unit
    right_width = extract_border_width(element, "right", right_width_unit)
    bottom_width_unit = extract_border_width_unit(element, "bottom") || width_unit
    bottom_width = extract_border_width(element, "bottom", bottom_width_unit)
    left_width_unit = extract_border_width_unit(element, "left") || width_unit
    left_width = extract_border_width(element, "left", left_width_unit)

    %{
      "style" => extract_border_style(element),
      "color" => extract_border_color(element),
      "width" => width,
      "width_unit" => width_unit,
      "radius" => radius,
      "radius_unit" => radius_unit,
      "top_width" => top_width,
      "top_width_unit" => top_width_unit,
      "right_width" => right_width,
      "right_width_unit" => right_width_unit,
      "bottom_width" => bottom_width,
      "bottom_width_unit" => bottom_width_unit,
      "left_width" => left_width,
      "left_width_unit" => left_width_unit,
      "top_left_radius" => top_left_radius,
      "top_left_radius_unit" => top_left_radius_unit,
      "top_right_radius" => top_right_radius,
      "top_right_radius_unit" => top_right_radius_unit,
      "bottom_right_radius" => bottom_right_radius,
      "bottom_right_radius_unit" => bottom_right_radius_unit,
      "bottom_left_radius" => bottom_left_radius,
      "bottom_left_radius_unit" => bottom_left_radius_unit
    }
  end

  defp extract_border_style(element) do
    classes = VisualEditor.element_classes(element)

    # First check for explicit border style classes
    specific_styles = %{
      "border-dashed" => "dashed",
      "border-dotted" => "dotted",
      "border-double" => "double",
      "border-none" => "none"
    }

    # Check for any class that sets a border width
    has_border_width? =
      Enum.any?(classes, fn class ->
        # Match basic border classes like "border", "border-2", "border-t", etc.
        String.starts_with?(class, "border") and not String.contains?(class, "style") and
          (class == "border" or String.contains?(class, "-") or String.contains?(class, "["))
      end)

    cond do
      # First priority: explicit border style
      class = Enum.find(Map.keys(specific_styles), &(&1 in classes)) ->
        specific_styles[class]

      # Second priority: if any border width is set, style is implicitly "solid"
      has_border_width? ->
        "solid"

      # Default: no border
      true ->
        nil
    end
  end

  defp extract_border_color(element) do
    classes = VisualEditor.element_class(element)

    Enum.find(@border_colors, "Default", fn color ->
      String.contains?(classes, "border-#{color}")
    end)
  end

  defp extract_border_width(_element, _side, width_unit) when width_unit in @tailwind_sizes, do: nil
  defp extract_border_width(_element, _side, nil), do: nil

  defp extract_border_width(element, nil, _width_unit) do
    classes = VisualEditor.element_classes(element)

    # First check for arbitrary values like border-[3px]
    arbitrary_width =
      Enum.find_value(classes, fn class ->
        case Regex.run(~r/^border-\[(\d+)(?:px|rem|em|%)?\]$/, class) do
          [_, value] -> value
          _ -> nil
        end
      end)

    # Then check for specific width classes (0-16)
    specific_width =
      Enum.find_value(@tailwind_sizes, fn width ->
        if "border-#{width}" in classes, do: width
      end)

    # Then check for shorthand classes that imply width=1
    shorthand_borders = ["border", "border-t", "border-r", "border-b", "border-l"]

    cond do
      # First priority: arbitrary width
      arbitrary_width ->
        arbitrary_width

      # Second priority: specific width
      specific_width ->
        specific_width

      # Third priority: shorthand implies width=1
      Enum.any?(shorthand_borders, &(&1 in classes)) ->
        "1"

      # Default: no border
      true ->
        "0"
    end
  end

  defp extract_border_width(element, side, width_unit) when side in ~w(top right bottom left) do
    classes = VisualEditor.element_classes(element)
    side_abbrev = String.first(side)

    # First check for arbitrary values with the specific unit
    arbitrary_width =
      Enum.find_value(classes, fn class ->
        pattern = ~r/^border-(?:#{side_abbrev}|[xy])-\[(\d+(?:\.\d+)?#{width_unit})\]$/

        case Regex.run(pattern, class) do
          [_, value] -> Utils.parse_number_and_unit(value) |> elem(1)
          _ -> nil
        end
      end)

    # Then check for specific width classes (0-8)
    specific_width =
      Enum.find_value(0..8, fn width ->
        if "border-#{side_abbrev}-#{width}" in classes, do: width
      end)

    # Then check for combined classes (border-x, border-y)
    combined_class =
      case side do
        side when side in ~w(left right) -> "border-x"
        side when side in ~w(top bottom) -> "border-y"
      end

    # Then check for shorthand classes that imply width=1
    shorthand_borders = ["border", "border-#{side_abbrev}", combined_class]

    cond do
      # First priority: arbitrary width with units
      arbitrary_width ->
        arbitrary_width

      # Second priority: specific width
      specific_width ->
        specific_width

      # Third priority: shorthand implies width=1
      Enum.any?(shorthand_borders, &(&1 in classes)) ->
        "1"

      # Default: fallback to global border width
      true ->
        extract_border_width(element, nil, width_unit)
    end
  end

  # For global border radius
  defp extract_border_radius(_element, _corner, radius_unit) when radius_unit in ~w(px rem em %), do: nil

  defp extract_border_radius(element, nil, _radius_unit) do
    radius_class =
      VisualEditor.element_classes(element)
      |> Enum.find(fn class -> String.starts_with?(class, "rounded-") end)

    case radius_class do
      class when is_binary(class) ->
        case Regex.run(~r/\[(.+)\]$/, class) do
          [_, value] -> Utils.parse_number_and_unit(value) |> elem(1)
          _ -> nil
        end

      _ ->
        nil
    end
  end

  # For corner-specific border radius
  defp extract_border_radius(element, corner, _radius_unit) do
    corner_abbrev = @corner_abbreviations[corner]

    corner_class =
      VisualEditor.element_classes(element)
      |> Enum.find(fn class -> String.starts_with?(class, "rounded-#{corner_abbrev}-") end)

    case corner_class do
      class when is_binary(class) ->
        case Regex.run(~r/\[(.+)\]$/, class) do
          [_, value] -> Utils.parse_number_and_unit(value) |> elem(1)
          _ -> nil
        end

      _ ->
        nil
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

      _ ->
        nil
    end
  end

  defp extract_border_radius_unit(element, corner) do
    # Convert corner format from "top-left" to "tl", etc.
    corner_abbrev = @corner_abbreviations[corner]

    classes = VisualEditor.element_classes(element)

    corner_class =
      classes
      |> Enum.find(fn class ->
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

      "rounded-" <> <<^corner_abbrev::binary>> ->
        "DEFAULT"

      _ ->
        extract_border_radius_unit(element)
    end
  end

  defp extract_border_width_unit(element, side) do
    classes = VisualEditor.element_classes(element)

    # Define which class prefixes to look for based on the side
    prefixes =
      case side do
        nil -> ["border-"]
        "top" -> ["border-t-", "border-y-"]
        "bottom" -> ["border-b-", "border-y-"]
        "left" -> ["border-l-", "border-x-"]
        "right" -> ["border-r-", "border-x-"]
      end

    # Find first matching class
    matching_class =
      Enum.find(classes, fn class ->
        Enum.any?(prefixes, &String.starts_with?(class, &1))
      end)

    case matching_class do
      # Default when no border class is found
      nil ->
        nil

      class ->
        cond do
          # For classes with arbitrary values like border-[2rem]
          String.contains?(class, "[") ->
            case Regex.run(~r/\[(.+)\]$/, class) do
              [_, value] ->
                case Utils.parse_number_and_unit(value) do
                  {:ok, _, unit} ->
                    unit

                  _ ->
                    "px"
                end

              _ ->
                "px"
            end

          # For standard classes like border-2, border-y-4, etc.
          Regex.match?(~r/-\d+$/, class) ->
            [_, value] = Regex.run(~r/-(\d+)$/, class)
            value

          true ->
            "px"
        end
    end
  end

  #
  # Generate tailwind classes from css properties
  #
  def generate_border_classes(params, false) do
    case {params["style"], params["width"]} do
      {style, "0"} when style != "none" ->
        # If the border is explicitly set to a value other than none, default to a width of 1
        generate_global_border_class("0", params["width_unit"])

      _ ->
        generate_global_border_class(params["width"], params["width_unit"])
    end
  end

  def generate_border_classes(params, true) do
    # Extract all corner widths and units
    widths = [
      {params["top_width"], params["top_width_unit"]},
      {params["right_width"], params["right_width_unit"]},
      {params["bottom_width"], params["bottom_width_unit"]},
      {params["left_width"], params["left_width_unit"]}
    ]

    # Check if all borders have the same width and unit
    all_nil? = Enum.all?(widths, fn {w, u} -> is_nil(w) and is_nil(u) end)

    all_same? =
      case widths do
        [{main_width, main_unit} | rest] ->
          Enum.all?(rest, fn
            {nil, _} -> true
            {w, u} -> w == main_width and u == main_unit
          end)

        _ ->
          false
      end

    cond do
      # Case 1: All directional borders are nil, use global border
      all_nil? ->
        generate_global_border_class(params["width"], params["width_unit"])

      # Case 2: All directional borders are the same width and unit
      all_same? ->
        tmp = generate_global_border_class(params["top_width"], params["top_width_unit"])
        tmp

      # Case 3: Different borders with expanded controls
      true ->
        [
          generate_border_class(params["top_width"], params["top_width_unit"], "top"),
          generate_border_class(params["right_width"], params["right_width_unit"], "right"),
          generate_border_class(params["bottom_width"], params["bottom_width_unit"], "bottom"),
          generate_border_class(params["left_width"], params["left_width_unit"], "left")
        ]
        |> Enum.reject(&is_nil/1)
    end
  end

  defp generate_global_border_class(width, unit) do
    case {width, unit} do
      {_, unit} when unit in @tailwind_sizes ->
        ["border-#{unit}"]

      {nil, unit} when unit in @css_units ->
        ["border-[0#{unit}]"]

      {"", _} ->
        []

      {_, nil} ->
        []

      {width, "px"} ->
        # For pixel units, use standard Tailwind classes when possible
        ["border-[#{width}px]"]

      {width, unit} ->
        # For other units, always use arbitrary values
        ["border-[#{width}#{unit}]"]
    end
  end

  # Handle nil cases
  defp generate_border_class(nil, _unit, _side), do: nil
  defp generate_border_class(_width, nil, _side), do: nil
  # Handle custom widths
  defp generate_border_class(width, unit, side) do
    case Utils.parse_integer_or_float(width) do
      {:ok, 0} ->
        nil

      {:ok, _} ->
        prefix = "border-#{String.first(side)}"

        case unit do
          u when u in @tailwind_sizes -> "#{prefix}-[#{unit}]"
          u -> "#{prefix}-[#{width}#{u}]"
        end

      :error ->
        nil
    end
  end

  def generate_border_radius_classes(params, expanded_radius_controls) do
    case {expanded_radius_controls, params} do
      {_,
       %{
         "top_left_radius" => radius,
         "top_left_radius_unit" => unit,
         "top_right_radius" => radius,
         "top_right_radius_unit" => unit,
         "bottom_right_radius" => radius,
         "bottom_right_radius_unit" => unit,
         "bottom_left_radius" => radius,
         "bottom_left_radius_unit" => unit
       }} ->
        # All corners have the same radius and unit, so we can use the global class
        [generate_custom_border_radius_class(radius, unit)]

      {true,
       %{
         "top_left_radius" => tlr,
         "top_left_radius_unit" => tlr_unit,
         "top_right_radius" => trr,
         "top_right_radius_unit" => trr_unit,
         "bottom_right_radius" => brr,
         "bottom_right_radius_unit" => brr_unit,
         "bottom_left_radius" => blr,
         "bottom_left_radius_unit" => blr_unit
       }} ->
        [
          generate_custom_border_radius_class(tlr, tlr_unit, "top-left"),
          generate_custom_border_radius_class(trr, trr_unit, "top-right"),
          generate_custom_border_radius_class(brr, brr_unit, "bottom-right"),
          generate_custom_border_radius_class(blr, blr_unit, "bottom-left")
        ]

      {true,
       %{
         "top_left_radius_unit" => tlr_unit,
         "top_right_radius_unit" => trr_unit,
         "bottom_right_radius_unit" => brr_unit,
         "bottom_left_radius_unit" => blr_unit
       }} ->
        [
          generate_simple_border_radius_class(tlr_unit, "top-left"),
          generate_simple_border_radius_class(trr_unit, "top-right"),
          generate_simple_border_radius_class(brr_unit, "bottom-right"),
          generate_simple_border_radius_class(blr_unit, "bottom-left")
        ]

      {_, %{"radius" => radius, "radius_unit" => radius_unit}} ->
        [generate_custom_border_radius_class(radius, radius_unit)]

      {_, %{"radius_unit" => radius_unit}} ->
        [generate_simple_border_radius_class(radius_unit)]
    end
    |> Enum.reject(&is_nil/1)
  end

  defp generate_custom_border_radius_class(nil, nil), do: nil
  defp generate_custom_border_radius_class(_, "DEFAULT"), do: "rounded"
  defp generate_custom_border_radius_class(radius, radius_unit, corner \\ nil)
  defp generate_custom_border_radius_class(_, "DEFAULT", corner), do: "rounded-#{@corner_abbreviations[corner]}"
  defp generate_custom_border_radius_class(_radius, radius_unit, nil), do: "rounded-#{radius_unit}"
  defp generate_custom_border_radius_class(_radius, radius_unit, corner), do: "rounded-#{@corner_abbreviations[corner]}-#{radius_unit}"

  defp generate_simple_border_radius_class(radius_unit) do
    case radius_unit do
      "DEFAULT" -> "rounded"
      radius_unit when radius_unit in ~w(px rem em %) -> generate_custom_border_radius_class(0, radius_unit)
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

  def generate_border_color_classes(params) do
    case params["color"] do
      nil -> []
      "Default" -> []
      color -> ["border-#{color}"]
    end
  end

  def generate_border_style_classes(params) do
    case params["style"] do
      nil -> []
      "solid" -> []
      style -> ["border-#{style}"]
    end
  end
end
