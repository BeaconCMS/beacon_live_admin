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
    case size_class(element, prefix) do
      nil -> nil
      class -> size_value(class, prefix)
    end
  end

  defp extract_size_unit(element, prefix) do
    case size_class(element, prefix) do
      nil -> nil
      class -> size_unit(class, prefix)
    end
  end

  # A size class carries either an arbitrary value in brackets — `w-[32px]` —
  # or a name from Tailwind's scale — `w-full`. Value and unit read the same
  # class the same two ways, so the shapes live here rather than inline twice.
  defp size_class(element, prefix) do
    element
    |> VisualEditor.element_classes()
    |> Enum.find(&String.starts_with?(&1, "#{prefix}-"))
  end

  defp arbitrary_size(class) do
    Regex.run(~r/\[(.+?)(px|%|em|rem|svw|svh|lvw|lvh|ch)?\]$/, class)
  end

  defp named_size(class, prefix) do
    case Regex.run(~r/^#{prefix}-(.+)$/, class) do
      [_, value] -> value
      _ -> nil
    end
  end

  defp size_value(class, prefix) do
    case arbitrary_size(class) do
      [_, value, _] -> value
      _ -> named_size(class, prefix)
    end
  end

  defp size_unit(class, prefix) do
    case arbitrary_size(class) do
      [_, _, unit] -> unit
      _ -> named_size_unit(class, prefix)
    end
  end

  defp named_size_unit(class, prefix) do
    case named_size(class, prefix) do
      value when value in @sizes -> value
      _ -> nil
    end
  end

  defp maybe_add_size_class(prefix, _value, unit) when unit in @sizes or unit in @aspect_ratio_values, do: "#{prefix}-#{unit}"
  defp maybe_add_size_class(prefix, nil, unit) when unit in @units, do: maybe_add_size_class(prefix, "1", unit)
  defp maybe_add_size_class(_prefix, nil, _unit), do: nil
  defp maybe_add_size_class(_prefix, "", _unit), do: nil

  defp maybe_add_size_class(prefix, value, "") do
    case String.split(value, "/") do
      # Incomplete fraction like "1/"
      [_, ""] -> nil
      # Incomplete fraction like "/2"
      ["" | _] -> nil
      # Complete fraction like "1/2"
      [_numerator, _denominator] -> "#{prefix}-#{value}"
      # Not a fraction
      _ -> "#{prefix}-#{value}"
    end
  end

  defp maybe_add_size_class("aspect", value, "") do
    case String.split(value, "/") do
      # Incomplete fraction like "1/"
      [_, ""] ->
        nil

      # Incomplete fraction like "/2"
      ["" | _] ->
        nil

      [numerator, denominator] ->
        case {Integer.parse(numerator), Integer.parse(denominator)} do
          # Both parts are valid integers
          {{n, ""}, {d, ""}} -> "aspect-[#{n}/#{d}]"
          # Not valid integers
          _ -> nil
        end

      # Only fractions are allowed
      _ ->
        nil
    end
  end

  defp maybe_add_size_class(prefix, value, unit), do: "#{prefix}-[#{value}#{unit}]"
end
