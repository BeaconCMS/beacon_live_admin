defmodule Beacon.LiveAdmin.VisualEditor do
  @moduledoc false

  @type page :: [element()]
  @type element :: map()

  @units ~w(px rem em %)

  def find_element(page, "root" = _path) when is_list(page) do
    %{"tag" => "root", "attrs" => %{}, "content" => page}
  end

  def find_element(page, path) when is_list(page) and is_binary(path) do
    find_ast_element(page, path)
  end

  def find_element(_page, _path), do: nil

  defp find_ast_element(nodes, path) do
    case resolve_path(path) do
      [] ->
        nil

      parts ->
        find_ast_element_recursive(nodes, parts)
    end
  end

  defp resolve_path(path) when is_binary(path) do
    case String.split(path, ".") do
      [] ->
        []

      parts ->
        parts
        |> Enum.reduce([], fn
          "", acc ->
            acc

          part, acc ->
            [String.to_integer(part) | acc]
        end)
        |> Enum.reverse()
    end
  rescue
    _ -> []
  end

  defp find_ast_element_recursive(nodes, [index | []]), do: Enum.at(nodes, index)

  defp find_ast_element_recursive(nodes, [index | rest]) do
    case Enum.at(nodes, index) do
      nil -> nil
      node -> find_ast_element_recursive(node["content"], rest)
    end
  end

  def replace_node(nodes, path, new_node) do
    path = resolve_path(path)
    replace_node_recursive(nodes, path, new_node)
  end

  defp replace_node_recursive(nodes, [index], new_node) do
    List.update_at(nodes, index, fn _ -> new_node end)
  end

  defp replace_node_recursive(nodes, [index | rest], new_node) do
    List.update_at(nodes, index, fn node ->
      %{node | "content" => replace_node_recursive(node["content"], rest, new_node)}
    end)
  end

  # FIXME: update "root" node - it will crash if any property is updated on the root node (choose Up one level up to root)
  def update_node(nodes, path, attrs, deleted_attrs) do
    path = resolve_path(path)
    update_node_recursive(nodes, path, attrs, deleted_attrs)
  end

  defp update_node(node, attrs, deleted_attrs) do
    new_attrs =
      node["attrs"]
      |> Map.merge(attrs)
      |> Map.drop(deleted_attrs)

    %{node | "attrs" => new_attrs}
  end

  defp update_node_recursive(nodes, [index], attrs, deleted_attrs) do
    List.update_at(nodes, index, fn node -> update_node(node, attrs, deleted_attrs) end)
  end

  defp update_node_recursive(nodes, [index | rest], attrs, deleted_attrs) do
    List.update_at(nodes, index, fn node ->
      %{node | "content" => update_node_recursive(node["content"], rest, attrs, deleted_attrs)}
    end)
  end

  def element_editable?(%{"tag" => tag}) when not is_nil(tag) do
    tag not in ["eex", "eex_block", "root"]
  end

  def element_editable?(_element), do: false

  def element_class(element, default \\ "") do
    get_in(element, ["attrs", "class"]) || default
  end

  def element_classes(element) do
    element
    |> element_class()
    |> String.split(" ", trim: true)
  end

  @doc """
  Returns the first utility class in `element` that starts with `class`.

  ## Examples

      iex> find_utility_class(%{"attrs" => %{"class" => "opacity-100"}}, "opacity")
      "opacity-100"

      iex> find_utility_class(%{"attrs" => %{"class" => "opacity-50 opacity-100"}}, "opacity")
      "opacity-50"

      iex> find_utility_class(%{"attrs" => %{"class" => "text-red-500 rounded-tl-[20px]"}}, "rounded-")
      "rounded-tl-[20px]"

      iex> find_utility_class(%{"attrs" => %{"class" => "text-red-500 rounded-tl-[20px]"}}, "border")
      nil

  """
  @spec find_utility_class(map(), String.t()) :: String.t() | nil
  def find_utility_class(element, class) when is_map(element) and is_binary(class) do
    classes = get_in(element, ["attrs", "class"]) || ""
    class = class <> "-"

    classes
    |> String.split(" ", trim: true)
    |> Enum.find(&String.starts_with?(&1, class))
  end

  def find_utility_class(_element, _class), do: nil

  @doc """
  Returns the value of an utility `class` in `element`. 

  Use `find_utility_class/2` to find the element by class.

  ## Examples

      iex> extract_utility_class_value(%{"attrs" => %{"class" => "opacity-100"}}, "opacity")
      "100"

  """
  @spec extract_utility_class_value(map(), String.t(), default :: String.t() | nil) :: String.t() | nil
  def extract_utility_class_value(element, class, default \\ nil)

  def extract_utility_class_value(element, class, default) when is_map(element) and is_binary(class) do
    found = find_utility_class(element, class) || ""

    strip_square_bracket = fn value ->
      value
      |> String.replace_prefix("[", "")
      |> String.replace_suffix("]", "")
    end

    case String.split(found, "-") do
      [_class, ""] -> default
      [^class, value] -> strip_square_bracket.(value)
      [_class, _position, value] -> strip_square_bracket.(value)
      _ -> default
    end
  end

  def extract_utility_class_value(_element, _class, default), do: default

  @doc """
  Returns the unit and value of an utility `class` in `element`. 

  Use `extract_utility_class_value/3` to find and extract the value.

  ## Examples

      iex> extract_utility_class_unit_value(%{"attrs" => %{"class" => "opacity-100"}}, "opacity")
      {"base", "100"}

      iex> extract_utility_class_unit_value(%{"attrs" => %{"class" => "rounded-tl-[20px]"}}, "rounded")
      {"px", "20"}

      iex> extract_utility_class_unit_value(%{"attrs" => %{"class" => "rounded-tl-[20px]"}}, "text-red-")
      nil

  """
  @spec extract_utility_class_unit_value(map(), String.t()) :: {unit :: String.t(), value :: String.t()} | nil
  def extract_utility_class_unit_value(element, class) when is_map(element) and is_binary(class) do
    case extract_utility_class_value(element, class) do
      nil ->
        nil

      value ->
        Enum.reduce_while(@units, nil, fn unit, acc ->
          case String.split(value, unit) do
            [value] -> {:halt, {"base", value}}
            [value, ""] -> {:halt, {unit, value}}
            _ -> {:cont, acc}
          end
        end)
    end
  end

  def extract_utility_class_unit_value(_element, _class), do: nil

  def merge_class(element, new) do
    current = get_in(element, ["attrs", "class"]) || ""

    if Enum.member?(String.split(current, " "), new) do
      current
    else
      Turboprop.Merge.merge([current, new])
    end
  end

  def delete_classes(element, class_regex) do
    current = get_in(element, ["attrs", "class"]) || ""

    new_classes =
      current
      |> String.split(" ", trim: true)
      |> Enum.reject(&Regex.match?(class_regex, &1))
      |> Enum.join(" ")

    put_in(element, ["attrs", "class"], new_classes)
  end

  def parse_number_and_unit(string) do
    # Regex to match integers or floats at the start of the string
    regex = ~r/^\s*(-?\d+(\.\d+)?)/

    case Regex.run(regex, string, return: :index) do
      [{start, length} | _] ->
        # Extract the numeric part and the remaining text
        numeric_part = String.slice(string, start, length)
        remaining_text = String.slice(string, (start + length)..-1)

        # Try parsing as integer first
        case Integer.parse(numeric_part) do
          {int, ""} ->
            {:ok, int, remaining_text}

          _ ->
            # If not an integer, parse as float
            case Float.parse(numeric_part) do
              {float, ""} -> {:ok, float, remaining_text}
              _ -> {:error, :not_a_number}
            end
        end

      _ ->
        {:error, :not_a_number}
    end
  end

  def parse_integer_or_float(number) when is_number(number) do
    {:ok, number}
  end

  def parse_integer_or_float(string) do
    case Integer.parse(string) do
      {int, ""} ->
        {:ok, int}

      _ ->
        case Float.parse(string) do
          {float, ""} -> {:ok, float}
          _ -> :error
        end
    end
  end
end
