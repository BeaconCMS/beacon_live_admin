defmodule Beacon.LiveAdmin.VisualEditor.Css.Layout do
  @moduledoc false

  alias Beacon.LiveAdmin.VisualEditor

  def extract_layout_properties(element) do
    classes = VisualEditor.element_classes(element)

    %{
      "display" => extract_display(classes),
      "flex_direction" => extract_flex_property(classes, "flex", ["row", "row-reverse", "col", "col-reverse"]),
      "flex_wrap" => extract_flex_property(classes, "flex", ["wrap", "wrap-reverse", "nowrap"]),
      "align_items" => extract_flex_property(classes, "items", ["start", "end", "center", "baseline", "stretch"]),
      "justify_content" => extract_flex_property(classes, "justify", ["start", "end", "center", "between", "around", "evenly"]),
      "align_content" => extract_flex_property(classes, "content", ["start", "end", "center", "between", "around", "evenly"]),
      "row_gap" => extract_gap_value(classes, "row"),
      "row_gap_unit" => extract_gap_unit(classes, "row"),
      "column_gap" => extract_gap_value(classes, "col"),
      "column_gap_unit" => extract_gap_unit(classes, "col")
    }
  end

  defp extract_display(classes) do
    display_classes = ~w(block inline inline-block hidden flex inline-flex)
    Enum.find(display_classes, fn class -> class in classes end) || ""
  end

  defp extract_flex_property(classes, prefix, values) do
    Enum.find_value(values, fn value ->
      if "#{prefix}-#{value}" in classes, do: value
    end)
  end

  defp extract_gap_value(classes, type) do
    case gap_class(classes, type) do
      nil -> nil
      class -> gap_value(class, type)
    end
  end

  defp extract_gap_unit(classes, type) do
    case gap_class(classes, type) do
      nil -> "px"
      class -> gap_unit(class)
    end
  end

  # A gap class carries either an arbitrary value in brackets — `x-gap-[12px]` —
  # or a number from Tailwind's scale — `x-gap-4`. Value and unit read the same
  # class, so the shapes live here rather than inline in both readers.
  defp gap_class(classes, type) do
    Enum.find(classes, &String.starts_with?(&1, "#{type}-gap-"))
  end

  defp arbitrary_gap(class) do
    Regex.run(~r/\[(.+)\]$/, class)
  end

  defp gap_value(class, type) do
    case arbitrary_gap(class) do
      [_, value] -> arbitrary_gap_number(value)
      _ -> scale_gap_number(class, type)
    end
  end

  defp arbitrary_gap_number(value) do
    case VisualEditor.parse_number_and_unit(value) do
      {:ok, number, _} -> to_string(number)
      _ -> nil
    end
  end

  defp scale_gap_number(class, type) do
    case Regex.run(~r/#{type}-gap-(\d+)/, class) do
      [_, value] -> value
      _ -> nil
    end
  end

  defp gap_unit(class) do
    case arbitrary_gap(class) do
      [_, value] -> arbitrary_gap_unit(value)
      _ -> "px"
    end
  end

  defp arbitrary_gap_unit(value) do
    case VisualEditor.parse_number_and_unit(value) do
      {:ok, _, unit} -> unit
      _ -> "px"
    end
  end

  def generate_layout_classes(params) do
    display_class = generate_display_class(params["display"])

    flex_classes =
      if params["display"] in ["flex", "inline-flex"] do
        [
          generate_flex_class("flex", params["flex_direction"]),
          generate_flex_class("flex", params["flex_wrap"]),
          generate_flex_class("items", params["align_items"]),
          generate_flex_class("justify", params["justify_content"]),
          generate_flex_class("content", params["align_content"]),
          generate_gap_class(params["row_gap"], params["row_gap_unit"], "row"),
          generate_gap_class(params["column_gap"], params["column_gap_unit"], "col")
        ]
      else
        []
      end

    [display_class | flex_classes]
    |> Enum.reject(&is_nil/1)
  end

  defp generate_display_class("hidden"), do: "hidden"
  defp generate_display_class(display) when is_binary(display), do: display
  defp generate_display_class(_), do: "block"

  defp generate_flex_class(_prefix, value) when value in [nil, ""], do: nil
  defp generate_flex_class(prefix, value), do: "#{prefix}-#{value}"

  defp generate_gap_class(nil, _unit, _type), do: nil
  defp generate_gap_class(_value, nil, _type), do: nil

  defp generate_gap_class(value, unit, type) do
    case VisualEditor.parse_integer_or_float(value) do
      {:ok, 0} ->
        nil

      {:ok, number} ->
        if unit == "px" and to_string(number) in ~w(0 1 2 3 4 5 6 8 10 12 16 20 24 32 40 48 56 64) do
          "#{type}-gap-#{number}"
        else
          "#{type}-gap-[#{number}#{unit}]"
        end

      :error ->
        nil
    end
  end
end
