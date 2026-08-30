defmodule Beacon.LiveAdmin.VisualEditor.Css.Typography do
  @moduledoc false

  alias Beacon.LiveAdmin.VisualEditor

  @css_units ~w(px rem em %)

  @font_families ~w(sans serif mono)
  @font_weights ~w(thin extralight light normal medium semibold bold extrabold black)
  @font_sizes ~w(xs sm base lg xl 2xl 3xl 4xl 5xl 6xl)
  @font_size_classes Enum.map(@font_sizes, &"text-#{&1}")
  @line_heights ~w(none tight snug normal relaxed loose)
  @letter_spacings ~w(tighter tight normal wide wider widest)
  @keyword_text_colors ~w(text-inherit text-current text-transparent text-black text-white)
  @arbitrary_font_size_re ~r/^text-\[\d+(?:\.\d+)?(?:px|rem|em|%)?\]$/
  @hex_text_color_re ~r/^text-\[#[0-9A-Fa-f]{6}\]$/
  @palette_text_color_re ~r/^text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:[1-9]0{2}|950)$/
  @arbitrary_scale_re ~r/^(\d+(?:\.\d+)?)(px|rem|em|%)$/

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
    |> maybe_add_text_color(params["text_color"])
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

  defp maybe_add_text_color(classes, nil), do: classes
  defp maybe_add_text_color(classes, "default"), do: classes
  defp maybe_add_text_color(classes, ""), do: classes

  defp maybe_add_text_color(classes, value) when is_binary(value) do
    case value do
      "#" <> _ -> classes ++ ["text-[#{value}]"]
      _ -> classes ++ ["text-#{value}"]
    end
  end

  defp maybe_add_decoration(classes, "default"), do: classes
  defp maybe_add_decoration(classes, value), do: classes ++ [value]

  defp maybe_add_transform(classes, "default"), do: classes
  defp maybe_add_transform(classes, value), do: classes ++ [value]

  defp maybe_add_style(classes, "default"), do: classes
  defp maybe_add_style(classes, value), do: classes ++ [value]

  defp maybe_add_font_size(classes, _value, ""), do: classes
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

  defp extract_font_family(classes), do: find_suffix(classes, "font-", @font_families)

  defp extract_font_weight(classes), do: find_suffix(classes, "font-", @font_weights)

  # The first class whose suffix names one of `names`, or nil.
  defp find_suffix(classes, prefix, names) do
    classes
    |> Enum.filter(&String.starts_with?(&1, prefix))
    |> Enum.find_value(fn class ->
      suffix = String.replace_prefix(class, prefix, "")
      if suffix in names, do: suffix
    end)
  end

  defp extract_text_color(classes) do
    classes
    |> Enum.filter(&String.starts_with?(&1, "text-"))
    |> Enum.find_value(&text_color/1)
  end

  # `text-` prefixes the font size classes too, so a size is not a colour.
  defp text_color(class) do
    cond do
      class in @font_size_classes -> nil
      String.match?(class, @arbitrary_font_size_re) -> nil
      String.match?(class, @hex_text_color_re) -> hex_text_color(class)
      String.match?(class, @palette_text_color_re) -> String.replace_prefix(class, "text-", "")
      class in @keyword_text_colors -> String.replace_prefix(class, "text-", "")
      true -> nil
    end
  end

  defp hex_text_color(class) do
    [_, color] = Regex.run(~r/^text-\[(.+)\]$/, class)
    color
  end

  defp extract_font_size(classes) do
    classes
    |> Enum.find(&(&1 in @font_size_classes or String.starts_with?(&1, "text-[")))
    |> scale_value("text-", @font_sizes, &{&1, &1})
  end

  defp extract_line_height(classes) do
    classes
    |> Enum.find(&String.starts_with?(&1, "leading-"))
    |> scale_value("leading-", @line_heights, &{&1, &1})
  end

  defp extract_letter_spacing(classes) do
    classes
    |> Enum.find(&String.starts_with?(&1, "tracking-"))
    |> scale_value("tracking-", @letter_spacings, &{nil, &1})
  end

  # A typography class carries either a name from Tailwind's scale — `text-lg` —
  # or an arbitrary value in brackets — `text-[13px]`. `preset` says how a scale
  # name becomes the `{value, unit}` pair the form works with, which is the name
  # twice everywhere except letter spacing.
  defp scale_value(nil, _prefix, _names, _preset), do: {nil, "default"}

  defp scale_value(class, prefix, names, preset) do
    suffix = String.replace_prefix(class, prefix, "")

    cond do
      suffix in names -> preset.(suffix)
      String.starts_with?(suffix, "[") -> arbitrary_scale_value(suffix)
      true -> {nil, "default"}
    end
  end

  defp arbitrary_scale_value(suffix) do
    size = suffix |> String.trim_leading("[") |> String.trim_trailing("]")

    case Regex.run(@arbitrary_scale_re, size) do
      [_, value, unit] -> {value, unit}
      _ -> {nil, "default"}
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
