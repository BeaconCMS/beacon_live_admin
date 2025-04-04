defmodule Beacon.LiveAdmin.VisualEditor.Css.Size do
  @moduledoc false

  alias Beacon.LiveAdmin.VisualEditor

  @units ~w(px % em rem svw svh lvw lvh ch)
  # Ambiguous sizes: lvw lvh svh svw
  @sizes ~w(2xs 3xs xs sm md lg xl 2xl 3xl 4xl 5xl 6xl 7xl) ++ ~w(auto full screen dvw dvh min max fit)
  @aspect_ratio_values ~w(square video auto)

  def extract_size_properties(element) do
    # Extract all units first
    width_unit = extract_size_unit(element, "w")
    height_unit = extract_size_unit(element, "h")
    min_width_unit = extract_size_unit(element, "min-w")
    min_height_unit = extract_size_unit(element, "min-h")
    max_width_unit = extract_size_unit(element, "max-w")
    max_height_unit = extract_size_unit(element, "max-h")
    aspect_ratio_unit = extract_size_unit(element, "aspect")

    %{
      "width" => extract_size_value(element, "w", width_unit),
      "width_unit" => width_unit,
      "height" => extract_size_value(element, "h", height_unit),
      "height_unit" => height_unit,
      "min_width" => extract_size_value(element, "min-w", min_width_unit),
      "min_width_unit" => min_width_unit,
      "min_height" => extract_size_value(element, "min-h", min_height_unit),
      "min_height_unit" => min_height_unit,
      "max_width" => extract_size_value(element, "max-w", max_width_unit),
      "max_width_unit" => max_width_unit,
      "max_height" => extract_size_value(element, "max-h", max_height_unit),
      "max_height_unit" => max_height_unit,
      "aspect_ratio" => extract_size_value(element, "aspect", aspect_ratio_unit),
      "aspect_ratio_unit" => aspect_ratio_unit
    }
  end

  require Logger
  def generate_size_classes(params) do
    [
      maybe_add_size_class("w", params["width"], params["width_unit"]),
      maybe_add_size_class("h", params["height"], params["height_unit"]),
      maybe_add_size_class("min-w", params["min_width"], params["min_width_unit"]),
      maybe_add_size_class("min-h", params["min_height"], params["min_height_unit"]),
      maybe_add_size_class("max-w", params["max_width"], params["max_width_unit"]),
      maybe_add_size_class("max-h", params["max_height"], params["max_height_unit"]),
      maybe_add_size_class("aspect", params["aspect_ratio"], params["aspect_ratio_unit"])
    ]
    |> Enum.reject(&is_nil/1)
  end

  defp extract_size_value(_element, _prefix, unit) when unit not in @units, do: nil

  defp extract_size_value(element, prefix, _unit) do
    classes = VisualEditor.element_classes(element)

    case Enum.find(classes, &String.starts_with?(&1, "#{prefix}-")) do
      nil -> nil
      class ->
        case Regex.run(~r/\[(.+?)(px|%|em|rem|svw|svh|lvw|lvh|ch)?\]$/, class) do
          [_, value, _] -> value
          _ ->
            case Regex.run(~r/^#{prefix}-(.+)$/, class) do
              [_, value] -> value
              _ -> nil
            end
        end
    end
  end

  defp extract_size_unit(element, prefix) do
    classes = VisualEditor.element_classes(element)

    case Enum.find(classes, &String.starts_with?(&1, "#{prefix}-")) do
      nil -> nil
      class ->
        case Regex.run(~r/\[(.+?)(px|%|em|rem|svw|svh|lvw|lvh|ch)?\]$/, class) do
          [_, _, unit] -> unit
          _ ->
            case Regex.run(~r/^#{prefix}-(.+)$/, class) do
              [_, value] when value in @sizes -> value
              _ -> nil
            end
        end
    end
  end

  defp maybe_add_size_class(prefix, _value, unit) when unit in @sizes or unit in @aspect_ratio_values, do: "#{prefix}-#{unit}"
  defp maybe_add_size_class(prefix, nil, unit) when unit in @units, do: maybe_add_size_class(prefix, "1", unit)
  defp maybe_add_size_class(_prefix, nil, unit), do: nil
  defp maybe_add_size_class(_prefix, "", _unit), do: nil
  defp maybe_add_size_class(prefix, value, "") do
    case String.split(value, "/") do
      [_, ""] -> nil # Incomplete fraction like "1/"
      ["" | _] -> nil # Incomplete fraction like "/2"
      [_numerator, _denominator] -> "#{prefix}-#{value}" # Complete fraction like "1/2"
      _ -> "#{prefix}-#{value}" # Not a fraction
    end
  end
  defp maybe_add_size_class("aspect", value, "") do
    case String.split(value, "/") do
      [_, ""] -> nil # Incomplete fraction like "1/"
      ["" | _] -> nil # Incomplete fraction like "/2"
      [numerator, denominator] ->
        case {Integer.parse(numerator), Integer.parse(denominator)} do
          {{n, ""}, {d, ""}} -> "aspect-[#{n}/#{d}]" # Both parts are valid integers
          _ -> nil # Not valid integers
        end
      _ -> nil # Only fractions are allowed
    end
  end
  defp maybe_add_size_class(prefix, value, unit), do: "#{prefix}-[#{value}#{unit}]"
end
