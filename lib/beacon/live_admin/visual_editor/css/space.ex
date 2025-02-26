defmodule Beacon.LiveAdmin.VisualEditor.Css.Space do
  @moduledoc false

  require Logger
  alias Beacon.LiveAdmin.VisualEditor

  @tailwind_sizes ~w(0 1 2 3 4 5 6 8 10 12 16 20 24 32 40 48 56 64)

  def extract_space_properties(element) do
    # Extract all units first
    margin_top_unit = extract_space_unit(element, "margin", "top")
    margin_right_unit = extract_space_unit(element, "margin", "right")
    margin_bottom_unit = extract_space_unit(element, "margin", "bottom")
    margin_left_unit = extract_space_unit(element, "margin", "left")
    padding_top_unit = extract_space_unit(element, "padding", "top")
    padding_right_unit = extract_space_unit(element, "padding", "right")
    padding_bottom_unit = extract_space_unit(element, "padding", "bottom")
    padding_left_unit = extract_space_unit(element, "padding", "left")

    %{
      "margin_top" => extract_space_value(element, "margin", "top", margin_top_unit),
      "margin_top_unit" => margin_top_unit,
      "margin_right" => extract_space_value(element, "margin", "right", margin_right_unit),
      "margin_right_unit" => margin_right_unit,
      "margin_bottom" => extract_space_value(element, "margin", "bottom", margin_bottom_unit),
      "margin_bottom_unit" => margin_bottom_unit,
      "margin_left" => extract_space_value(element, "margin", "left", margin_left_unit),
      "margin_left_unit" => margin_left_unit,
      "padding_top" => extract_space_value(element, "padding", "top", padding_top_unit),
      "padding_top_unit" => padding_top_unit,
      "padding_right" => extract_space_value(element, "padding", "right", padding_right_unit),
      "padding_right_unit" => padding_right_unit,
      "padding_bottom" => extract_space_value(element, "padding", "bottom", padding_bottom_unit),
      "padding_bottom_unit" => padding_bottom_unit,
      "padding_left" => extract_space_value(element, "padding", "left", padding_left_unit),
      "padding_left_unit" => padding_left_unit
    }
  end

  def generate_space_classes(params, type) do
    sides = ["top", "right", "bottom", "left"]
    type_abbrev = String.first(type)

    # Get all values and units for the given type (padding or margin)
    values_and_units =
      Enum.map(sides, fn side ->
        value = params["#{type}_#{side}"]
        unit = params["#{type}_#{side}_unit"]
        {side, value, unit}
      end)

    simplify_classes(values_and_units, type, type_abbrev)
  end

  defp simplify_classes(values_and_units, type, type_abbrev) do
    # Group by value and unit to check if we can coalesce
    grouped = Enum.group_by(values_and_units, fn {_side, value, unit} -> {value, unit} end)

    cond do
      # All sides are the same
      map_size(grouped) == 1 ->
        [{_side, value, unit} | _] = hd(Map.values(grouped))
        [generate_space_class(value, unit, type, nil)]

      # Check if we can use axis-based classes
      map_size(grouped) in 2..3 ->
        {x_axis, y_axis} = axis_values(values_and_units)

        []
        |> maybe_add_axis_class(x_axis, type_abbrev, "x")
        |> maybe_add_axis_class(y_axis, type_abbrev, "y")
        |> then(fn classes ->
          remaining =
            values_and_units
            |> Enum.reject(fn {side, value, unit} ->
              axis_covered?(side, value, unit, x_axis, y_axis)
            end)
            |> Enum.map(fn {side, value, unit} ->
              generate_space_class(value, unit, type, side)
            end)

          classes ++ remaining
        end)
        |> Enum.reject(&is_nil/1)

      # Default to individual sides
      true ->
        Logger.info("DEFAULT condition")

        values_and_units
        |> Enum.map(fn {side, value, unit} ->
          generate_space_class(value, unit, type, side)
        end)
        |> Enum.reject(&is_nil/1)
    end
  end

  defp axis_values(values_and_units) do
    {left, right} = get_axis_pair(values_and_units, ["left", "right"])
    {top, bottom} = get_axis_pair(values_and_units, ["top", "bottom"])

    {
      if(left == right, do: left, else: nil),
      if(top == bottom, do: top, else: nil)
    }
  end

  defp get_axis_pair(values_and_units, [side1, side2]) do
    side1_data = Enum.find(values_and_units, fn {side, _, _} -> side == side1 end)
    side2_data = Enum.find(values_and_units, fn {side, _, _} -> side == side2 end)

    {
      if(side1_data, do: {elem(side1_data, 1), elem(side1_data, 2)}),
      if(side2_data, do: {elem(side2_data, 1), elem(side2_data, 2)})
    }
  end

  defp maybe_add_axis_class(classes, nil, _type_abbrev, _axis), do: classes

  defp maybe_add_axis_class(classes, {value, unit}, type_abbrev, axis) do
    case generate_space_class(value, unit, type_abbrev, axis) do
      nil -> classes
      class -> [class | classes]
    end
  end

  defp axis_covered?(side, value, unit, x_axis, y_axis) do
    case side do
      "left" -> x_axis == {value, unit}
      "right" -> x_axis == {value, unit}
      "top" -> y_axis == {value, unit}
      "bottom" -> y_axis == {value, unit}
    end
  end

  defp extract_space_value(_element, _type, _side, unit) when unit not in ["px", "rem", "em", "%"], do: nil

  defp extract_space_value(element, type, side, _unit) do
    classes = VisualEditor.element_classes(element)
    side_abbrev = String.first(side)
    type_str = String.first(type)

    # Try to find the most specific class first (e.g., pt-2, pr-2)
    specific_class =
      Enum.find(classes, fn class ->
        String.starts_with?(class, "#{type_str}#{side_abbrev}-")
      end)

    # Try to find axis-based class (e.g., px-2, py-2)
    axis_class =
      case side do
        "left" -> Enum.find(classes, &String.starts_with?(&1, "#{type_str}x-"))
        "right" -> Enum.find(classes, &String.starts_with?(&1, "#{type_str}x-"))
        "top" -> Enum.find(classes, &String.starts_with?(&1, "#{type_str}y-"))
        "bottom" -> Enum.find(classes, &String.starts_with?(&1, "#{type_str}y-"))
      end

    # Try to find all-sides class (e.g., p-2)
    all_sides_class = Enum.find(classes, &String.starts_with?(&1, "#{type_str}-"))

    # Use the most specific class available
    case {specific_class, axis_class, all_sides_class} do
      {nil, nil, nil} -> 0
      {specific, _, _} when not is_nil(specific) -> extract_value_from_class(specific)
      {_, axis, _} when not is_nil(axis) -> extract_value_from_class(axis)
      {_, _, all} when not is_nil(all) -> extract_value_from_class(all)
    end
  end

  defp extract_space_unit(element, type, side) do
    classes = VisualEditor.element_classes(element)
    side_abbrev = String.first(side)
    type_str = String.first(type)

    # Try to find the most specific class first (e.g., pt-2, pr-[1rem])
    specific_class =
      Enum.find(classes, fn class ->
        String.starts_with?(class, "#{type_str}#{side_abbrev}-")
      end)

    # Try to find axis-based class (e.g., px-2, py-[1rem])
    axis_class =
      case side do
        "left" -> Enum.find(classes, &String.starts_with?(&1, "#{type_str}x-"))
        "right" -> Enum.find(classes, &String.starts_with?(&1, "#{type_str}x-"))
        "top" -> Enum.find(classes, &String.starts_with?(&1, "#{type_str}y-"))
        "bottom" -> Enum.find(classes, &String.starts_with?(&1, "#{type_str}y-"))
      end

    # Try to find all-sides class (e.g., p-2, p-[1rem])
    all_sides_class = Enum.find(classes, &String.starts_with?(&1, "#{type_str}-"))

    # Use the most specific class available to determine the unit
    case {specific_class, axis_class, all_sides_class} do
      {nil, nil, nil} -> nil
      {specific, _, _} when not is_nil(specific) -> extract_unit_from_class(specific)
      {_, axis, _} when not is_nil(axis) -> extract_unit_from_class(axis)
      {_, _, all} when not is_nil(all) -> extract_unit_from_class(all)
    end
  end

  defp extract_unit_from_class(class) do
    cond do
      # For classes with arbitrary values like p-[2rem] or py-[1px]
      String.contains?(class, "[") ->
        case Regex.run(~r/\[(.+)\]$/, class) do
          [_, value] ->
            case VisualEditor.parse_number_and_unit(value) do
              {:ok, _, unit} -> unit
              _ -> "px"
            end

          _ ->
            "px"
        end

      # For standard classes like pb-2, py-2, p-2
      Regex.match?(~r/-\d+$/, class) ->
        [_, value] = Regex.run(~r/-(\d+)$/, class)
        value

      true ->
        "px"
    end
  end

  defp generate_space_class(_value, nil, _type, _side), do: nil
  defp generate_space_class(nil, unit, type, side) do
    type_abbrev = String.first(type)
    side_abbrev = case side do
      nil -> ""
      s -> String.first(s)
    end
    prefix = "#{type_abbrev}#{side_abbrev}"

    case unit do
      nil -> nil
      unit when unit == "0" -> nil
      unit when unit in @tailwind_sizes -> "#{prefix}-#{unit}"
      unit -> "#{prefix}-[0#{unit}]"
    end
  end

  defp generate_space_class(value, unit, type, side) do
    type_abbrev = String.first(type)
    side_abbrev = String.first(side)

    case VisualEditor.parse_integer_or_float(value) do
      {:ok, 0} ->
        nil

      {:ok, number} ->
        if unit == "px" and to_string(number) in @tailwind_sizes do
          "#{type_abbrev}#{side_abbrev}-#{number}"
        else
          "#{type_abbrev}#{side_abbrev}-[#{number}#{unit}]"
        end

      :error ->
        nil
    end
  end

  defp extract_value_from_class(class) do
    # Handle arbitrary values like [1rem] or [17px]
    case Regex.run(~r/\[(.+)\]$/, class) do
      [_, value] ->
        case VisualEditor.parse_number_and_unit(value) do
          {:ok, number, _} -> to_string(number)
          _ -> nil
        end

      nil ->
        # Handle standard values like p-2, px-2, etc.
        case Regex.run(~r/-(\d+)$/, class) do
          [_, value] -> value
          _ -> nil
        end
    end
  end
end
