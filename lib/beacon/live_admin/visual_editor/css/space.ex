defmodule Beacon.LiveAdmin.VisualEditor.Css.Space do
  alias Beacon.LiveAdmin.VisualEditor
  alias Beacon.LiveAdmin.VisualEditor.Utils

  @type space_params :: %{
    required(String.t()) => String.t(),
    optional(:margin_top) => String.t(),
    optional(:margin_top_unit) => String.t(),
    optional(:margin_right) => String.t(),
    optional(:margin_right_unit) => String.t(),
    optional(:margin_bottom) => String.t(),
    optional(:margin_bottom_unit) => String.t(),
    optional(:margin_left) => String.t(),
    optional(:margin_left_unit) => String.t(),
    optional(:padding_top) => String.t(),
    optional(:padding_top_unit) => String.t(),
    optional(:padding_right) => String.t(),
    optional(:padding_right_unit) => String.t(),
    optional(:padding_bottom) => String.t(),
    optional(:padding_bottom_unit) => String.t(),
    optional(:padding_left) => String.t(),
    optional(:padding_left_unit) => String.t()
  }

  def extract_space_properties(element) do
    %{
      "margin_top" => extract_space_value(element, :margin, "top"),
      "margin_top_unit" => extract_space_unit(element, :margin, "top"),
      "margin_right" => extract_space_value(element, :margin, "right"),
      "margin_right_unit" => extract_space_unit(element, :margin, "right"),
      "margin_bottom" => extract_space_value(element, :margin, "bottom"),
      "margin_bottom_unit" => extract_space_unit(element, :margin, "bottom"),
      "margin_left" => extract_space_value(element, :margin, "left"),
      "margin_left_unit" => extract_space_unit(element, :margin, "left"),
      "padding_top" => extract_space_value(element, :padding, "top"),
      "padding_top_unit" => extract_space_unit(element, :padding, "top"),
      "padding_right" => extract_space_value(element, :padding, "right"),
      "padding_right_unit" => extract_space_unit(element, :padding, "right"),
      "padding_bottom" => extract_space_value(element, :padding, "bottom"),
      "padding_bottom_unit" => extract_space_unit(element, :padding, "bottom"),
      "padding_left" => extract_space_value(element, :padding, "left"),
      "padding_left_unit" => extract_space_unit(element, :padding, "left")
    }
  end

  def generate_space_classes(params, type) do
    sides = ["top", "right", "bottom", "left"]

    Enum.map(sides, fn side ->
      value = params["#{type}_#{side}"]
      unit = params["#{type}_#{side}_unit"]

      generate_space_class(value, unit, type, side)
    end)
    |> Enum.reject(&is_nil/1)
  end

  defp extract_space_value(element, type, side) do
    classes = VisualEditor.element_classes(element)
    side_abbrev = String.first(side)

    class = Enum.find(classes, fn class ->
      String.starts_with?(class, "#{type}-#{side_abbrev}-")
    end)

    case class do
      nil -> nil
      class ->
        case Regex.run(~r/\[(.+)\]$/, class) do
          [_, value] ->
            case Utils.parse_number_and_unit(value) do
              {:ok, number, _} -> to_string(number)
              _ -> nil
            end
          _ ->
            Regex.run(~r/#{type}-#{side_abbrev}-(\d+)/, class)
            |> case do
              [_, value] -> value
              _ -> nil
            end
        end
    end
  end

  defp extract_space_unit(element, type, side) do
    classes = VisualEditor.element_classes(element)
    side_abbrev = String.first(side)

    class = Enum.find(classes, fn class ->
      String.starts_with?(class, "#{type}-#{side_abbrev}-")
    end)

    case class do
      nil -> "px"
      class ->
        case Regex.run(~r/\[(.+)\]$/, class) do
          [_, value] ->
            case Utils.parse_number_and_unit(value) do
              {:ok, _, unit} -> unit
              _ -> "px"
            end
          _ -> "px"
        end
    end
  end

  defp generate_space_class(nil, _unit, _type, _side), do: nil
  defp generate_space_class(_value, nil, _type, _side), do: nil
  defp generate_space_class(value, unit, type, side) do
    side_abbrev = String.first(side)

    case Utils.parse_integer_or_float(value) do
      {:ok, 0} -> nil
      {:ok, number} ->
        if unit == "px" and to_string(number) in ~w(0 1 2 3 4 5 6 8 10 12 16 20 24 32 40 48 56 64) do
          "#{type}-#{side_abbrev}-#{number}"
        else
          "#{type}-#{side_abbrev}-[#{number}#{unit}]"
        end
      :error -> nil
    end
  end
end
