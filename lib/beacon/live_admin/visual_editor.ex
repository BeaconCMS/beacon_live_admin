defmodule Beacon.LiveAdmin.VisualEditor do
  @type page :: [element()]

  # %{
  #  "attrs" => %{},
  #  "content" => [" Verify, contribute, and adapt to your needs. A\n            project for the community. "],
  #  "path" => "0.0.0.1.3.1",
  #  "tag" => "p"
  # }

  @type element :: map()
  #   "attrs" => map(),
  #   "content" => list(),
  #   "path" => binary(),
  #   "tag" => binary()
  # }

  def find_element(page, "root" = _path) do
    %{"tag" => "root", "attrs" => %{}, "content" => page}
  end

  def find_element(page, path) do
    find_ast_element(page, path) || %{}
  end

  def find_ast_element(_nodes, nil), do: nil

  def find_ast_element(nodes, xpath) do
    parts = String.split(xpath, ".") |> Enum.map(&String.to_integer/1)
    find_ast_element_recursive(nodes, parts)
  end

  defp find_ast_element_recursive(nodes, [index | []]), do: Enum.at(nodes, index)

  defp find_ast_element_recursive(nodes, [index | rest]) do
    case Enum.at(nodes, index) do
      nil -> nil
      node -> find_ast_element_recursive(node["content"], rest)
    end
  end

  def update_node(nodes, path, attrs) do
    indices = String.split(path, ".") |> Enum.map(&String.to_integer/1)
    update_node_recursive(nodes, indices, attrs)
  end

  defp update_node(node, attrs) do
    %{node | "attrs" => Map.merge(node["attrs"], attrs)}
  end

  defp update_node_recursive(nodes, [index], attrs) do
    nodes
    |> List.update_at(index, fn node -> update_node(node, attrs) end)
  end

  defp update_node_recursive(nodes, [index | rest], attrs) do
    nodes
    |> List.update_at(index, fn node ->
      %{node | "content" => update_node_recursive(node["content"], rest, attrs)}
    end)
  end

  def element_editable?(%{"tag" => tag}) when not is_nil(tag) do
    tag not in ["eex", "eex_block"]
  end

  def element_editable?(_element), do: false

  def element_class(element, default \\ "") do
    get_in(element, ["attrs", "class"]) || default
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
    Twix.tw([current, new])
  end
end
