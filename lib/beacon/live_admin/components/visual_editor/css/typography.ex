defmodule Beacon.LiveAdmin.VisualEditor.Css.Typography do
  @moduledoc false

  alias Beacon.LiveAdmin.VisualEditor

  def extract_typography_properties(element) do
    classes = VisualEditor.element_classes(element)

    %{
      "font_family" => extract_font_family(classes),
      "font_weight" => extract_font_weight(classes),
      "text_color" => extract_text_color(classes),
      "font_size" => extract_font_size(classes),
      "line_height" => extract_line_height(classes),
      "letter_spacing" => extract_letter_spacing(classes),
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
    |> maybe_add_class("text", params["font_size"])
    |> maybe_add_class("leading", params["line_height"])
    |> maybe_add_class("tracking", params["letter_spacing"])
    |> maybe_add_class("text", params["text_align"])
    |> maybe_add_decoration(params["text_decoration"])
    |> maybe_add_transform(params["text_transform"])
    |> maybe_add_style(params["font_style"])
  end

  defp maybe_add_class(classes, _prefix, "default"), do: classes
  defp maybe_add_class(classes, _prefix, ""), do: classes  # Handle empty string case
  defp maybe_add_class(classes, prefix, value) when is_binary(value), do: classes ++ ["#{prefix}-#{value}"]
  defp maybe_add_class(classes, _prefix, _value), do: classes  # Handle any other case

  defp maybe_add_decoration(classes, "default"), do: classes
  defp maybe_add_decoration(classes, value), do: classes ++ [value]

  defp maybe_add_transform(classes, "default"), do: classes
  defp maybe_add_transform(classes, value), do: classes ++ [value]

  defp maybe_add_style(classes, "default"), do: classes
  defp maybe_add_style(classes, value), do: classes ++ [value]

  defp extract_font_family(classes) do
    case Enum.find(classes, &String.starts_with?(&1, "font-")) do
      "font-sans" -> "sans"
      "font-serif" -> "serif"
      "font-mono" -> "mono"
      _ -> nil
    end
  end

  defp extract_font_weight(classes) do
    case Enum.find(classes, &String.starts_with?(&1, "font-")) do
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
  end

  defp extract_text_color(classes) do
    case Enum.find(classes, &String.starts_with?(&1, "text-")) do
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
  end

  defp extract_font_size(classes) do
    case Enum.find(classes, &String.starts_with?(&1, "text-")) do
      "text-xs" -> "xs"
      "text-sm" -> "sm"
      "text-base" -> "base"
      "text-lg" -> "lg"
      "text-xl" -> "xl"
      "text-2xl" -> "2xl"
      "text-3xl" -> "3xl"
      "text-4xl" -> "4xl"
      "text-5xl" -> "5xl"
      "text-6xl" -> "6xl"
      _ -> nil
    end
  end

  defp extract_line_height(classes) do
    case Enum.find(classes, &String.starts_with?(&1, "leading-")) do
      "leading-none" -> "none"
      "leading-tight" -> "tight"
      "leading-snug" -> "snug"
      "leading-normal" -> "normal"
      "leading-relaxed" -> "relaxed"
      "leading-loose" -> "loose"
      size when is_binary(size) -> String.replace(size, "leading-", "")
      _ -> nil
    end
  end

  defp extract_letter_spacing(classes) do
    case Enum.find(classes, &String.starts_with?(&1, "tracking-")) do
      "tracking-tighter" -> "tighter"
      "tracking-tight" -> "tight"
      "tracking-normal" -> "normal"
      "tracking-wide" -> "wide"
      "tracking-wider" -> "wider"
      "tracking-widest" -> "widest"
      size when is_binary(size) -> String.replace(size, "tracking-", "")
      _ -> nil
    end
  end

  defp extract_text_align(classes) do
    case Enum.find(classes, &String.starts_with?(&1, "text-")) do
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
