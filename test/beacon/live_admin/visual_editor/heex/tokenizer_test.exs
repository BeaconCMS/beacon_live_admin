defmodule Beacon.LiveAdmin.VisualEditor.HEEx.TokenizerTest do
  use ExUnit.Case, async: false
  alias Beacon.LiveAdmin.VisualEditor.HEEx.Tokenizer

  test "inline expression" do
    assert Tokenizer.tokenize(~S|
      <%= user.name %>
    |) == [{:eex, :expr, "user.name", %{line: 2, opt: ~c"=", column: 7}}]
  end

  test "block expression" do
    assert Tokenizer.tokenize(~S|
      <%= if true do %>
        <p>this</p>
      <% else %>
        <p>that</p>
      <% end %>
    |) ==
             [
               {:eex, :start_expr, "if true do", %{line: 2, opt: ~c"=", column: 7}},
               {:text, "\n        ", %{column_end: 9, line_end: 3}},
               {:tag, "p", [], %{line: 3, column: 9, tag_name: "p", inner_location: {3, 12}}},
               {:text, "this", %{column_end: 16, line_end: 3}},
               {:close, :tag, "p", %{line: 3, column: 16, tag_name: "p", inner_location: {3, 16}}},
               {:text, "\n      ", %{column_end: 7, line_end: 4}},
               {:eex, :middle_expr, "else", %{line: 4, opt: [], column: 7}},
               {:text, "\n        ", %{column_end: 9, line_end: 5}},
               {:tag, "p", [], %{line: 5, column: 9, tag_name: "p", inner_location: {5, 12}}},
               {:text, "that", %{column_end: 16, line_end: 5}},
               {:close, :tag, "p", %{line: 5, column: 16, tag_name: "p", inner_location: {5, 16}}},
               {:text, "\n      ", %{column_end: 7, line_end: 6}},
               {:eex, :end_expr, "end", %{line: 6, opt: [], column: 7}}
             ]
  end

  test "comprehension" do
    assert Tokenizer.tokenize(~S|
      <%= for employee <- @employees do %>
        <!-- regular <!-- comment --> -->
        <%= employee.position %>
        <div>
          <%= for person <- @persons do %>
            <%= if person.id == employee.id do %>
              <span><%= person.name %></span>
              <img src={if person.picture , do: person.picture, else: "default.jpg"} width="200" />
            <% end %>
          <% end %>
        </div>
      <% end %>
    |) ==
             [
               {:eex, :start_expr, "for employee <- @employees do", %{line: 2, opt: ~c"=", column: 7}},
               {:text, "\n        <!-- regular <!-- comment --> -->\n        ",
                %{context: [:comment_start, :comment_end], column_end: 9, line_end: 4}},
               {:eex, :expr, "employee.position", %{line: 4, opt: ~c"=", column: 9}},
               {:text, "\n        ", %{column_end: 9, line_end: 5}},
               {:tag, "div", [], %{line: 5, column: 9, tag_name: "div", inner_location: {5, 14}}},
               {:text, "\n          ", %{column_end: 11, line_end: 6}},
               {:eex, :start_expr, "for person <- @persons do", %{line: 6, opt: ~c"=", column: 11}},
               {:text, "\n            ", %{column_end: 13, line_end: 7}},
               {:eex, :start_expr, "if person.id == employee.id do", %{line: 7, opt: ~c"=", column: 13}},
               {:text, "\n              ", %{column_end: 15, line_end: 8}},
               {:tag, "span", [], %{line: 8, column: 15, tag_name: "span", inner_location: {8, 21}}},
               {:eex, :expr, "person.name", %{line: 8, opt: ~c"=", column: 21}},
               {:close, :tag, "span", %{line: 8, column: 39, tag_name: "span", inner_location: {8, 39}}},
               {:text, "\n              ", %{column_end: 15, line_end: 9}},
               {:tag, "img",
                [
                  {"src", {:expr, "if person.picture , do: person.picture, else: \"default.jpg\"", %{line: 9, column: 25}}, %{line: 9, column: 20}},
                  {"width", {:string, "200", %{delimiter: 34}}, %{line: 9, column: 86}}
                ], %{line: 9, closing: :void, column: 15, tag_name: "img", inner_location: {9, 100}}},
               {:text, "\n            ", %{column_end: 13, line_end: 10}},
               {:eex, :end_expr, "end", %{line: 10, opt: [], column: 13}},
               {:text, "\n          ", %{column_end: 11, line_end: 11}},
               {:eex, :end_expr, "end", %{line: 11, opt: [], column: 11}},
               {:text, "\n        ", %{column_end: 9, line_end: 12}},
               {:close, :tag, "div", %{line: 12, column: 9, tag_name: "div", inner_location: {12, 9}}},
               {:text, "\n      ", %{column_end: 7, line_end: 13}},
               {:eex, :end_expr, "end", %{line: 13, opt: [], column: 7}}
             ]
  end
end
