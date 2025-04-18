defmodule Beacon.LiveAdmin.VisualEditor.HEEx.JSONEncoder do
  @moduledoc false

  require Logger

  @type token :: map()

  @doc """
  Encodes a HEEx `template` into a format that can be encoded into JSON.

  The returned data structure can be serialized and sent over the wire to any client that uses a JSON API,
  and it aims to retain all the information we need to reconstruct back the original template from it.

  ## Data Structure

  The encoded data structured emitted at the end is a list of tokens composed of either a `heex_node` or a `eex_node`,
  as specified below:

      tokens = [heex_node() | eex_node() | eex_block_node()]

      heex_node = %{
        "tag" => String.t(),
        "attrs" => %{String.t() => String.t()},
        "content" => content(),
        "rendered_html" => String.t()
      }

      eex_node = %{
        "tag" => "eex",
        "metadata" => %{opt: list()},
        "attrs" => %{String.t() => String.t()},
        "content" => content(),
        "rendered_html" => String.t(),
      }

      eex_block_node = %{
        "tag" => "eex_block",
        "arg" => String.t(),
        "ast" => [eex_node()]
      }

      content = [heex_node() | eex_node() | eex_block_node() | String.t()]

  Note that:

    * `rendered_html` key is optional

  ## Example

      iex> encode(~S|
      <header>
        <.link patch="/">
          <h1 class="bg-red">My Site</h1>
        </.link>
      </header>
      |, :my_site)
      [
        %{
          "attrs" => %{},
          "content" => [
            %{
              "attrs" => %{"patch" => "/"},
              "content" => [
                %{
                  "attrs" => %{"class" => "bg-red"},
                  "content" => ["My Site"],
                  "tag" => "h1"
                }
              ],
              "rendered_html" => "<a href=\"/\" data-phx-link=\"patch\" data-phx-link-state=\"push\">\n    <h1 class=\"bg-red\">My Site</h1>\n  </a>",
              "tag" => ".link"
            }
          ],
          "tag" => "header"
        }
      ]

  """
  @spec encode(String.t(), fun()) :: {:ok, [token()]} | {:error, String.t()}
  def encode(template, render_node_fun)

  def encode(nil = _template, render_node_fun) when is_function(render_node_fun, 1) do
    encode("", render_node_fun)
  end

  def encode(template, render_node_fun) when is_binary(template) and is_function(render_node_fun, 1) do
    case Beacon.LiveAdmin.VisualEditor.HEEx.Tokenizer.tokenize(template) do
      {:ok, tokens} -> {:ok, encode_tokens(tokens, render_node_fun)}
      error -> error
    end
  rescue
    exception ->
      {:error, Exception.message(exception)}
  end

  def maybe_encode(template, render_node_fun) do
    case encode(template, render_node_fun) do
      {:ok, ast} -> ast
      _ -> []
    end
  end

  defp encode_tokens(ast, render_node_fun) do
    transform(ast, [], render_node_fun)
  end

  defp transform([head], acc, render_node_fun) do
    case transform_entry(head, render_node_fun) do
      nil ->
        acc

      entry ->
        [entry | acc]
    end
  end

  defp transform([head | tail], acc, render_node_fun) do
    case transform_entry(head, render_node_fun) do
      nil ->
        transform(tail, acc, render_node_fun)

      entry ->
        [entry | transform(tail, acc, render_node_fun)]
    end
  end

  defp transform([], acc, _render_node_fun), do: acc

  # strips out blank text nodes and insignificant whitespace before or after text.
  defp transform_entry({:text, text, _metadata}, _render_node_fun) do
    text =
      text
      |> cleanup_extra_spaces_leading()
      |> cleanup_extra_spaces_trailing()

    if String.trim(text) != "", do: text
  end

  defp transform_entry({:eex, expr, %{opt: opt}} = node, render_node_fun) do
    entry = %{
      "tag" => "eex",
      "metadata" => %{"opt" => opt},
      "attrs" => %{},
      "content" => [expr]
    }

    case maybe_render_heex(node, render_node_fun) do
      nil -> entry
      html -> Map.put(entry, "rendered_html", html)
    end
  end

  defp transform_entry({:eex_block, arg, _content} = entry, render_node_fun) do
    arg = String.trim(arg)

    %{
      "tag" => "eex_block",
      "arg" => arg,
      "rendered_html" => render_eex_block(render_node_fun, entry),
      "ast" => entry |> encode_eex_block() |> Jason.encode!()
    }
  end

  defp transform_entry({:eex_comment, text}, _render_node_fun) do
    %{
      "tag" => "eex_comment",
      "attrs" => %{},
      "content" => List.wrap(text)
    }
  end

  defp transform_entry({:html_comment, [{:text, text, _}]}, _render_node_fun) do
    text =
      text
      |> String.replace("<!--", "")
      |> String.replace("-->", "")

    %{
      "tag" => "html_comment",
      "attrs" => %{},
      "content" => List.wrap(text)
    }
  end

  defp transform_entry({:tag_block, tag, attrs, content, _} = node, render_node_fun) do
    entry = %{
      "tag" => tag,
      "attrs" => transform_attrs(attrs),
      "content" => encode_tokens(content, render_node_fun)
    }

    maybe_add_rendered_html(render_node_fun, node, entry)
  end

  defp transform_entry({:tag_self_close, tag, attrs} = node, render_node_fun) do
    entry = %{
      "tag" => tag,
      "attrs" => transform_attrs(attrs, true),
      "content" => []
    }

    maybe_add_rendered_html(render_node_fun, node, entry)
  end

  # https://github.com/phoenixframework/phoenix_live_view/blob/c87f12d7cc7d74b98183b5fe9f3a6a910c21ce1b/lib/phoenix_live_view/html_formatter.ex#L631
  defp cleanup_extra_spaces_leading(text) do
    if :binary.first(text) in ~c"\s\t\n" do
      " " <> String.trim_leading(text)
    else
      text
    end
  end

  # https://github.com/phoenixframework/phoenix_live_view/blob/c87f12d7cc7d74b98183b5fe9f3a6a910c21ce1b/lib/phoenix_live_view/html_formatter.ex#L639
  defp cleanup_extra_spaces_trailing(text) do
    if :binary.last(text) in ~c"\s\t\n" do
      String.trim_trailing(text) <> " "
    else
      text
    end
  end

  defp maybe_render_heex(node, render_node_fun) do
    heex = Beacon.LiveAdmin.VisualEditor.HEEx.HEExDecoder.decode(node)
    render_node_fun.(heex)
    # TODO: let it raise
    # For context, we rescue it for now so we avoid crashing when rendering nexted :eex expressions,
    # for example take this template:
    #
    #  <.table id="users" rows={[%{iusername: "foo"}]}>
    #    <:col :let={user} label="username"><%= user.username %></:col>
    #  </.table>
    #
    # When HEEx.render gets called to resolve <%= user.username %> we don't have the assign `user` available,
    # since that's introduced in the child element/slot by `:let` and defined in the outer scope in the parent element `table`.
  rescue
    e ->
      Logger.debug("""
      failed to render node to heex template

      Got:

        #{inspect(e)}

      Context:

        node:

          #{inspect(node)}

        render_node_fun:

          #{inspect(render_node_fun)}

      """)

      nil
  end

  defp maybe_add_rendered_html(render_node_fun, node, entry) do
    tag = elem(node, 1)
    attrs = elem(node, 2)

    add_rendered_html = fn ->
      case maybe_render_heex(node, render_node_fun) do
        nil -> entry
        html -> Map.put(entry, "rendered_html", html)
      end
    end

    has_eex_in_attrs? =
      Enum.reduce_while(attrs, false, fn
        {_, {:expr, _, _}, _}, _acc -> {:halt, true}
        _attr, _acc -> {:cont, false}
      end)

    cond do
      # start with '.' or a capital letter, we consider it a component call
      String.match?(tag, ~r/^[A-Z]|\./) -> add_rendered_html.()
      tag == "svg" -> add_rendered_html.()
      has_eex_in_attrs? -> add_rendered_html.()
      :else -> entry
    end
  end

  defp transform_attrs([]), do: %{}

  defp transform_attrs(attrs) do
    attrs
    |> Enum.map(&transform_attr/1)
    |> Enum.reduce(%{}, fn {attr_name, value}, acc ->
      Map.put(acc, attr_name, value)
    end)
  end

  defp transform_attrs(attrs, true) do
    attrs
    |> transform_attrs()
    |> Map.put("self_close", true)
  end

  defp transform_attr({attr_name, {:string, value, _}, _}) do
    {attr_name, value}
  end

  defp transform_attr({attr_name, {:expr, value, _}, _}) do
    {attr_name, "{" <> value <> "}"}
  end

  defp transform_attr({attr_name, nil, _}) do
    {attr_name, true}
  end

  defp render_eex_block(render_node_fun, {:eex_block, arg, nodes}) do
    arg = ["<%= ", arg, " %>", "\n"]

    template =
      Enum.reduce(nodes, [arg], fn node, acc ->
        [[extract_node_text(node), " \n "] | acc]
      end)
      |> Enum.reverse()
      |> List.to_string()

    render_node_fun.(template)
  end

  defp extract_node_text({nodes, text} = value) when is_list(nodes) and is_binary(text) do
    value
    |> Tuple.to_list()
    |> Enum.reduce([], fn node, acc -> [extract_node_text(node) | acc] end)
    |> Enum.reverse()
  end

  defp extract_node_text(value) when is_list(value) do
    value
    |> Enum.reduce([], fn node, acc -> [extract_node_text(node) | acc] end)
    |> Enum.reverse()
  end

  # TODO: augment tokenizer to mark these nodes as elixir expressions (eex block clauses) currently it's marked as text
  defp extract_node_text(value) when is_binary(value) do
    cond do
      value in ["else", "end"] -> ["<% ", value, " %>"]
      # ends with ' ->'
      String.match?(value, ~r/.* ->$/) -> ["<% ", value, " %>"]
      :default -> value
    end
  end

  defp extract_node_text({:text, text, _}), do: text

  defp extract_node_text({:html_comment, children}), do: [extract_node_text(children), "\n"]

  # TODO: eex comments are stripped out of rendered html by the heex engine
  defp extract_node_text({:eex_comment, _content}), do: []

  defp extract_node_text({:eex, expr, %{opt: ~c"="}}), do: ["<%= ", expr, " %>"]

  defp extract_node_text({:eex, expr, _}), do: ["<% ", expr, " %>"]

  defp extract_node_text({:eex_block, expr, children}), do: ["<%= ", expr, " %>", extract_node_text(children)]

  defp extract_node_text({:tag_self_close, tag, attrs}) do
    attrs =
      Enum.reduce(attrs, [], fn attr, acc ->
        [extract_node_attr(attr) | acc]
      end)

    [?<, tag, " ", attrs, "/>"]
  end

  defp extract_node_text({:tag_block, tag, _, children, _}) do
    [?<, tag, ?>, extract_node_text(children), "</", tag, ">"]
  end

  defp extract_node_attr({attr, {:string, text, _}, _}), do: [attr, ?=, ?", text, ?", " "]
  defp extract_node_attr({attr, {:expr, expr, _}, _}), do: [attr, ?=, ?{, expr, ?}, " "]

  def encode_eex_block({:eex_block, arg, children}) do
    children = encode_eex_block_node(children, [])
    %{type: :eex_block, content: arg, children: children}
  end

  def encode_eex_block_node([head | tail], acc) do
    head = encode_eex_block_node(head)
    encode_eex_block_node(tail, acc ++ [head])
  end

  def encode_eex_block_node([], acc), do: acc

  def encode_eex_block_node({type, children}) when type in [:html_comment] do
    children = encode_eex_block_node(children, [])
    %{type: type, children: children}
  end

  def encode_eex_block_node({type, content}) when type in [:eex_comment] and is_binary(content) do
    %{type: type, content: content}
  end

  def encode_eex_block_node({children, clause}) do
    children = encode_eex_block_node(children, [])
    %{type: :eex_block_clause, content: clause, children: children}
  end

  def encode_eex_block_node({:eex_block, content, children}) do
    children = encode_eex_block_node(children, [])
    %{type: :eex_block, content: content, children: children}
  end

  def encode_eex_block_node({type, content, metadata}) when is_binary(content) and is_map(metadata) do
    %{type: type, content: content, metadata: metadata}
  end

  def encode_eex_block_node({type, tag, attrs}) when is_list(attrs) do
    attrs = transform_attrs(attrs)
    %{type: type, tag: tag, attrs: attrs}
  end

  def encode_eex_block_node({type, tag, attrs, children, metadata}) do
    children = encode_eex_block_node(children, [])
    attrs = transform_attrs(attrs)
    %{type: type, tag: tag, attrs: attrs, metadata: metadata, children: children}
  end
end
