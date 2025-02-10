defmodule Beacon.LiveAdmin.VisualEditor do
  @moduledoc false

  @type page :: [element()]
  @type element :: map()

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
    element_class(element)
    |> String.split(" ", trim: true)
  end

  def find_utility_class(element, class) when is_map(element) and is_binary(class) do
    classes = get_in(element, ["attrs", "class"]) || ""
    class = class <> "-"

    classes
    |> String.split(" ", trim: true)
    |> Enum.find(&String.starts_with?(&1, class))
  end

  def find_utility_class(_element, _class), do: nil

  def extract_utility_class_value(element, class, default \\ nil) do
    found = find_utility_class(element, class) || ""

    case String.split(found, "-") do
      [_class, ""] -> default
      [^class, value] -> value
      _ -> default
    end
  end

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
end
