defmodule Beacon.LiveAdmin.VisualEditor.Css.Typography do
  @moduledoc false

  alias Beacon.LiveAdmin.VisualEditor

  @css_units ~w(px rem em %)

  def extract_typography_properties(element) do
    classes = VisualEditor.element_classes(element)
    {font_size, font_size_unit} = extract_font_size(classes)
    {line_height, line_height_unit} = extract_line_height(classes)
    {letter_spacing, letter_spacing_unit} = extract_letter_spacing(classes)

    %{
      "font_family" => extract_font_family(classes),
      "font_weight" => extract_font_weight(classes),
      "text_color" => extract_text_color(classes),
      "font_size" => font_size,
      "font_size_unit" => font_size_unit,
      "line_height" => line_height,
      "line_height_unit" => line_height_unit,
      "letter_spacing" => letter_spacing,
      "letter_spacing_unit" => letter_spacing_unit,
      "text_align" => extract_text_align(classes),
      "text_decoration" => extract_text_decoration(classes),
      "text_transform" => extract_text_transform(classes),
      "font_style" => extract_font_style(classes)
    }
  end

  def generate_typography_classes(params) do
    []
    |> maybe_add_class("font", params["font_family"])
    |> maybe_add_class("font", params["font_weight"])
    |> maybe_add_class("text", params["text_color"])
    |> maybe_add_font_size(params["font_size"], params["font_size_unit"])
    |> maybe_add_line_height(params["line_height"], params["line_height_unit"])
    |> maybe_add_letter_spacing(params["letter_spacing"], params["letter_spacing_unit"])
    |> maybe_add_class("text", params["text_align"])
    |> maybe_add_decoration(params["text_decoration"])
    |> maybe_add_transform(params["text_transform"])
    |> maybe_add_style(params["font_style"])
  end

  defp maybe_add_class(classes, _prefix, nil), do: classes
  defp maybe_add_class(classes, _prefix, "default"), do: classes
  defp maybe_add_class(classes, _prefix, ""), do: classes
  defp maybe_add_class(classes, prefix, value) when is_binary(value), do: classes ++ ["#{prefix}-#{value}"]

  defp maybe_add_decoration(classes, "default"), do: classes
  defp maybe_add_decoration(classes, value), do: classes ++ [value]

  defp maybe_add_transform(classes, "default"), do: classes
  defp maybe_add_transform(classes, value), do: classes ++ [value]

  defp maybe_add_style(classes, "default"), do: classes
  defp maybe_add_style(classes, value), do: classes ++ [value]

  # Special case for px, all other units default to 1
  defp maybe_add_font_size(classes, value, "px") do
    classes ++ ["text-[#{value || "16"}px]"]
  end

  defp maybe_add_font_size(classes, value, unit) when is_binary(unit) and unit in @css_units do
    classes ++ ["text-[#{value || "1"}#{unit}]"]
  end

  defp maybe_add_font_size(classes, _value, unit) when unit in ~w(xs sm base lg xl 2xl 3xl 4xl 5xl 6xl) do
    classes ++ ["text-#{unit}"]
  end

  defp maybe_add_font_size(classes, value, _unit) when is_binary(value) do
    classes ++ ["text-#{value}"]
  end

  defp maybe_add_font_size(classes, "", _unit), do: classes
  defp maybe_add_font_size(classes, nil, _unit), do: classes
  defp maybe_add_font_size(classes, "default", _unit), do: classes

  defp maybe_add_line_height(classes, value, "px") do
    classes ++ ["leading-[#{value || "16"}px]"]
  end

  defp maybe_add_line_height(classes, value, unit) when is_binary(unit) and unit in @css_units do
    classes ++ ["leading-[#{value || "1"}#{unit}]"]
  end

  defp maybe_add_line_height(classes, nil, unit) when unit in ~w(none tight snug normal relaxed loose) do
    classes ++ ["leading-#{unit}"]
  end

  defp maybe_add_line_height(classes, _, ""), do: classes
  defp maybe_add_line_height(classes, _, nil), do: classes
  defp maybe_add_line_height(classes, _, "default"), do: classes

  defp extract_font_family(classes) do
    font_classes = Enum.filter(classes, &String.starts_with?(&1, "font-"))
    Enum.find_value(font_classes, fn class ->
      case class do
        "font-sans" -> "sans"
        "font-serif" -> "serif"
        "font-mono" -> "mono"
        _ -> nil
      end
    end)
  end

  defp extract_font_weight(classes) do
    font_classes = Enum.filter(classes, &String.starts_with?(&1, "font-"))
    Enum.find_value(font_classes, fn class ->
      case class do
        "font-thin" -> "thin"
        "font-extralight" -> "extralight"
        "font-light" -> "light"
        "font-normal" -> "normal"
        "font-medium" -> "medium"
        "font-semibold" -> "semibold"
        "font-bold" -> "bold"
        "font-extrabold" -> "extrabold"
        "font-black" -> "black"
        _ -> nil
      end
    end)
  end

  defp extract_text_color(classes) do
    text_classes = Enum.filter(classes, &String.starts_with?(&1, "text-"))
    Enum.find_value(text_classes, fn class ->
      case class do
        "text-black" -> "black"
        "text-white" -> "white"
        "text-gray-50" -> "gray-50"
        "text-gray-100" -> "gray-100"
        "text-gray-200" -> "gray-200"
        "text-gray-300" -> "gray-300"
        "text-gray-400" -> "gray-400"
        "text-gray-500" -> "gray-500"
        "text-gray-600" -> "gray-600"
        "text-gray-700" -> "gray-700"
        "text-gray-800" -> "gray-800"
        "text-gray-900" -> "gray-900"
        _ -> nil
      end
    end)
  end

  defp extract_font_size(classes) do
    tailwind_sizes = ~w(text-xs text-sm text-base text-lg text-xl text-2xl text-3xl text-4xl text-5xl text-6xl)

    case Enum.find(classes, fn class ->
           class in tailwind_sizes or String.starts_with?(class, "text-[")
         end) do
      # Tailwind preset sizes
      "text-xs" ->
        {"xs", "xs"}

      "text-sm" ->
        {"sm", "sm"}

      "text-base" ->
        {"base", "base"}

      "text-lg" ->
        {"lg", "lg"}

      "text-xl" ->
        {"xl", "xl"}

      "text-2xl" ->
        {"2xl", "2xl"}

      "text-3xl" ->
        {"3xl", "3xl"}

      "text-4xl" ->
        {"4xl", "4xl"}

      "text-5xl" ->
        {"5xl", "5xl"}

      "text-6xl" ->
        {"6xl", "6xl"}

      # Custom sizes with units
      <<"text-[", size::binary>> ->
        size = String.trim_trailing(size, "]")

        case Regex.run(~r/^(\d+(?:\.\d+)?)(px|rem|em|%)$/, size) do
          [_, value, unit] -> {value, unit}
          _ -> {nil, "default"}
        end

      # Default case
      _ ->
        {nil, "default"}
    end
  end

  defp extract_line_height(classes) do
    case Enum.find(classes, &String.starts_with?(&1, "leading-")) do
      # Tailwind preset values
      "leading-none" ->
        {"none", "none"}

      "leading-tight" ->
        {"tight", "tight"}

      "leading-snug" ->
        {"snug", "snug"}

      "leading-normal" ->
        {"normal", "normal"}

      "leading-relaxed" ->
        {"relaxed", "relaxed"}

      "leading-loose" ->
        {"loose", "loose"}

      # Custom sizes with units
      <<"leading-[", size::binary>> ->
        size = String.trim_trailing(size, "]")

        case Regex.run(~r/^(\d+(?:\.\d+)?)(px|rem|em|%)$/, size) do
          [_, value, unit] -> {value, unit}
          _ -> {nil, "default"}
        end

      # Default case
      _ ->
        {nil, "default"}
    end
  end

  defp extract_letter_spacing(classes) do
    case Enum.find(classes, &String.starts_with?(&1, "tracking-")) do
      # Tailwind preset values - value is nil, unit is the preset
      "tracking-tighter" ->
        {nil, "tighter"}

      "tracking-tight" ->
        {nil, "tight"}

      "tracking-normal" ->
        {nil, "normal"}

      "tracking-wide" ->
        {nil, "wide"}

      "tracking-wider" ->
        {nil, "wider"}

      "tracking-widest" ->
        {nil, "widest"}

      # Custom sizes with units - value is the number, unit is the CSS unit
      <<"tracking-[", size::binary>> ->
        size = String.trim_trailing(size, "]")

        case Regex.run(~r/^(\d+(?:\.\d+)?)(px|rem|em|%)$/, size) do
          [_, value, unit] -> {value, unit}
          _ -> {nil, "default"}
        end

      # Default case
      _ ->
        {nil, "default"}
    end
  end

  defp maybe_add_letter_spacing(classes, _value, unit) when unit in ~w(tighter tight normal wide wider widest) do
    classes ++ ["tracking-#{unit}"]
  end

  defp maybe_add_letter_spacing(classes, value, "px") do
    classes ++ ["tracking-[#{value || "1"}px]"]
  end

  defp maybe_add_letter_spacing(classes, value, unit) when is_binary(unit) and unit in @css_units do
    classes ++ ["tracking-[#{value || "1"}#{unit}]"]
  end

  defp maybe_add_letter_spacing(classes, _, ""), do: classes
  defp maybe_add_letter_spacing(classes, _, nil), do: classes
  defp maybe_add_letter_spacing(classes, _, "default"), do: classes

  defp extract_text_align(classes) do
    case Enum.find(classes, &(&1 in ["text-start", "text-center", "text-end", "text-justify"])) do
      "text-start" -> "start"
      "text-center" -> "center"
      "text-end" -> "end"
      "text-justify" -> "justify"
      _ -> nil
    end
  end

  defp extract_text_decoration(classes) do
    case Enum.find(classes, &(&1 in ["underline", "line-through", "no-underline"])) do
      "underline" -> "underline"
      "line-through" -> "line-through"
      "no-underline" -> "no-underline"
      _ -> nil
    end
  end

  defp extract_text_transform(classes) do
    case Enum.find(classes, &(&1 in ["uppercase", "lowercase", "capitalize", "normal-case"])) do
      "uppercase" -> "uppercase"
      "lowercase" -> "lowercase"
      "capitalize" -> "capitalize"
      "normal-case" -> "normal-case"
      _ -> nil
    end
  end

  defp extract_font_style(classes) do
    case Enum.find(classes, &(&1 in ["italic", "not-italic"])) do
      "italic" -> "italic"
      "not-italic" -> "not-italic"
      _ -> nil
    end
  end
end
