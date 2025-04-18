defmodule Beacon.LiveAdmin.VisualEditor.HEEx.JSONEncoderTest do
  use Beacon.LiveAdmin.ConnCase, async: false
  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]
  alias Beacon.LiveAdmin.VisualEditor.HEEx.JSONEncoder

  @node :"node1@127.0.0.1"
  @site :site_a

  setup do
    on_exit(fn ->
      rpc(@node, MyApp.Repo, :delete_all, [Beacon.Content.Component, [log: false]])
    end)

    :ok
  end

  defp beacon_component_fixture(attrs) do
    attrs =
      Enum.into(attrs, %{
        site: @site,
        name: "sample_component",
        category: "element",
        attrs: [%{name: "project", type: "any", opts: [required: true]}],
        slots: [],
        template: ~S|<span id={"project-#{@project.id}"}><%= @project.name %></span>|,
        example: ~S|<.sample_component project={%{id: 1, name: "Beacon"}} />|
      })

    component = rpc(@node, Beacon.Content, :create_component!, [attrs])
    # FIXME: autoload
    rpc(@node, Beacon.Loader, :load_components_module, [@site])
    component
  end

  defp render_node(template, assigns) do
    Beacon.LiveAdmin.Client.HEEx.render(@site, template, assigns)
  end

  defp assert_output(template, expected, assigns \\ %{}) do
    render_node_fun = fn node -> render_node(node, assigns) end
    assert {:ok, encoded} = JSONEncoder.encode(template, render_node_fun)
    assert encoded == expected
  end

  defp encode(template, assigns \\ %{}) do
    JSONEncoder.encode(template, fn node -> render_node(node, assigns) end)
  end

  test "nil template cast to empty string" do
    assert_output(nil, [])
  end

  test "html elements with attrs" do
    assert_output(~S|<div>content</div>|, [%{"attrs" => %{}, "content" => ["content"], "tag" => "div"}])
    assert_output(~S|<a href="/contact">contact</a>|, [%{"attrs" => %{"href" => "/contact"}, "content" => ["contact"], "tag" => "a"}])

    assert_output(~S|<span class="bg-red text-sm">warning</span>|, [
      %{"attrs" => %{"class" => "bg-red text-sm"}, "content" => ["warning"], "tag" => "span"}
    ])
  end

  test "nested elements" do
    assert_output(
      ~S|<div><span>content</span></div>|,
      [
        %{
          "attrs" => %{},
          "content" => [%{"attrs" => %{}, "content" => ["content"], "tag" => "span"}],
          "tag" => "div"
        }
      ]
    )
  end

  test "comments" do
    assert_output(~S|<!-- comment -->|, [%{"attrs" => %{}, "content" => [" comment "], "tag" => "html_comment"}])

    if Version.match?(System.version(), ">= 1.15.0") do
      assert_output(~S|<%!-- comment --%>|, [%{"attrs" => %{}, "content" => [" comment "], "tag" => "eex_comment"}])
      assert_output(~S|<%!-- <%= :expr %> --%>|, [%{"attrs" => %{}, "content" => [" <%= :expr %> "], "tag" => "eex_comment"}])
    end
  end

  test "links with sigil_p" do
    # FIXME: autoload
    rpc(@node, Beacon.Loader, :load_components_module, [@site])
    rpc(@node, Beacon.Loader, :load_routes_module, [@site])

    assert_output(
      ~S|<.link patch={~p"/details"}>view details</.link>|,
      [
        %{
          "attrs" => %{"patch" => "{~p\"/details\"}"},
          "content" => ["view details"],
          "tag" => ".link",
          "rendered_html" => "<a href=\"/site_a/details\" data-phx-link=\"patch\" data-phx-link-state=\"push\">view details</a>"
        }
      ]
    )
  end

  test "eex expressions" do
    assert_output(
      ~S|<% _name = "Beacon" %>|,
      [%{"attrs" => %{}, "content" => ["_name = \"Beacon\""], "metadata" => %{"opt" => []}, "rendered_html" => "", "tag" => "eex"}]
    )

    assert_output(
      ~S|value: <%= 1 %>|,
      ["value: ", %{"attrs" => %{}, "content" => ["1"], "metadata" => %{"opt" => ~c"="}, "rendered_html" => "1", "tag" => "eex"}]
    )
  end

  test "eex expressions in attrs" do
    assert_output(
      ~S|
      <img
        alt={@person.bio}
        src={@person.picture}
        class="w-full h-auto max-w-full"
      />
      |,
      [
        %{
          "attrs" => %{
            "alt" => "{@person.bio}",
            "class" => "w-full h-auto max-w-full",
            "self_close" => true,
            "src" => "{@person.picture}"
          },
          "content" => [],
          "rendered_html" => "<img alt=\"person bio\" src=\"profile.jpg\" class=\"w-full h-auto max-w-full\">",
          "tag" => "img"
        }
      ],
      %{person: %{bio: "person bio", picture: "profile.jpg"}}
    )
  end

  test "block expressions" do
    if_template = ~S|
    <%= if @completed do %>
      <span><%= @completed_message %></span>
    <% else %>
      keep working
    <% end %>
    |

    assert {:ok,
            [
              %{
                "arg" => "if @completed do",
                "tag" => "eex_block",
                "rendered_html" => "\n      <span>congrats</span>\n",
                "ast" => ast
              }
            ]} = encode(if_template, %{completed: true, completed_message: "congrats"})

    assert %{
             "children" => [
               %{
                 "children" => [
                   %{
                     "content" => "\n      ",
                     "metadata" => %{"newlines" => 1},
                     "type" => "text"
                   },
                   %{
                     "attrs" => %{},
                     "children" => [
                       %{
                         "content" => "@completed_message",
                         "metadata" => %{"column" => 13, "line" => 3, "opt" => ~c"="},
                         "type" => "eex"
                       }
                     ],
                     "metadata" => %{"mode" => "inline"},
                     "tag" => "span",
                     "type" => "tag_block"
                   },
                   %{
                     "content" => "\n    ",
                     "metadata" => %{"newlines" => 1},
                     "type" => "text"
                   }
                 ],
                 "content" => "else",
                 "type" => "eex_block_clause"
               },
               %{
                 "children" => [
                   %{
                     "content" => "\n      keep working\n    ",
                     "metadata" => %{"newlines" => 1},
                     "type" => "text"
                   }
                 ],
                 "content" => "end",
                 "type" => "eex_block_clause"
               }
             ],
             "content" => "if @completed do",
             "type" => "eex_block"
           } = Jason.decode!(ast)

    assert {:ok,
            [
              %{
                "arg" => "if @completed do",
                "tag" => "eex_block",
                "rendered_html" => "\n      keep working\n",
                "ast" => ast
              }
            ]} = encode(if_template, %{completed: false, completed_message: "congrats"})

    assert %{
             "children" => [
               %{
                 "children" => [
                   %{"content" => "\n      ", "metadata" => %{"newlines" => 1}, "type" => "text"},
                   %{
                     "attrs" => %{},
                     "children" => [
                       %{"content" => "@completed_message", "metadata" => %{"column" => 13, "line" => 3, "opt" => ~c"="}, "type" => "eex"}
                     ],
                     "metadata" => %{"mode" => "inline"},
                     "tag" => "span",
                     "type" => "tag_block"
                   },
                   %{"content" => "\n    ", "metadata" => %{"newlines" => 1}, "type" => "text"}
                 ],
                 "content" => "else",
                 "type" => "eex_block_clause"
               },
               %{
                 "children" => [%{"content" => "\n      keep working\n    ", "metadata" => %{"newlines" => 1}, "type" => "text"}],
                 "content" => "end",
                 "type" => "eex_block_clause"
               }
             ],
             "content" => "if @completed do",
             "type" => "eex_block"
           } = Jason.decode!(ast)
  end

  test "comprehensions" do
    template = ~S|
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
        |

    assert {:ok,
            [
              %{
                "arg" => "for employee <- @employees do",
                "tag" => "eex_block",
                "rendered_html" =>
                  "\n<!-- regular <!-- comment --> -->\nCEO\n          <div>\n\n\n                <span>José</span>\n                <img width=\"200\" src=\"profile.jpg\">\n\n\n\n\n          </div>\n\n<!-- regular <!-- comment --> -->\nManager\n          <div>\n\n\n\n\n                <span>Chris</span>\n                <img width=\"200\" src=\"default.jpg\">\n\n\n          </div>\n",
                "ast" => ast
              }
            ]} =
             encode(template, %{
               employees: [%{id: 1, position: "CEO"}, %{id: 2, position: "Manager"}],
               persons: [%{id: 1, name: "José", picture: "profile.jpg"}, %{id: 2, name: "Chris", picture: nil}]
             })

    assert is_binary(ast)
  end

  test "live data" do
    assert_output(
      "<%= inspect(@vals) %>",
      [
        %{
          "attrs" => %{},
          "content" => ["inspect(@vals)"],
          "metadata" => %{"opt" => ~c"="},
          "rendered_html" => "[1, 2, 3]",
          "tag" => "eex"
        }
      ],
      %{vals: [1, 2, 3]}
    )
  end

  test "phoenix components" do
    assert_output(
      ~S|<.link path="/contact" replace={true}>Book meeting</.link>|,
      [
        %{
          "attrs" => %{"path" => "/contact", "replace" => "{true}"},
          "content" => ["Book meeting"],
          "tag" => ".link",
          "rendered_html" => "<a href=\"#\" path=\"/contact\">Book meeting</a>"
        }
      ]
    )

    assert_output(
      ~S|<Phoenix.Component.link path="/contact" replace={true}>Book meeting</Phoenix.Component.link>|,
      [
        %{
          "attrs" => %{"path" => "/contact", "replace" => "{true}"},
          "content" => ["Book meeting"],
          "tag" => "Phoenix.Component.link",
          "rendered_html" => "<a href=\"#\" path=\"/contact\">Book meeting</a>"
        }
      ]
    )
  end

  describe "components" do
    test "beacon components" do
      beacon_component_fixture(name: "json_test")

      assert_output(
        ~S|<.json_test class="w-4" project={@project} />|,
        [
          %{
            "attrs" => %{"class" => "w-4", "project" => "{@project}", "self_close" => true},
            "content" => [],
            "rendered_html" => "<span id=\"project-1\">Beacon</span>",
            "tag" => ".json_test"
          }
        ],
        %{project: %{id: 1, name: "Beacon"}}
      )
    end

    test "with special attribute :let" do
      template = ~S|
      <Phoenix.Component.form :let={f} for={%{}} as={:newsletter} phx-submit="join">
        <input
          id={Phoenix.HTML.Form.input_id(f, :email)}
          name={Phoenix.HTML.Form.input_name(f, :email)}
          class="text-sm"
          placeholder="Enter your email"
          type="email"
        />
        <button type="submit">Join</button>
      </Phoenix.Component.form>
      |

      assert_output(
        template,
        [
          %{
            "attrs" => %{":let" => "{f}", "as" => "{:newsletter}", "for" => "{%{}}", "phx-submit" => "join"},
            "content" => [
              %{
                "attrs" => %{
                  "class" => "text-sm",
                  "id" => "{Phoenix.HTML.Form.input_id(f, :email)}",
                  "name" => "{Phoenix.HTML.Form.input_name(f, :email)}",
                  "placeholder" => "Enter your email",
                  "self_close" => true,
                  "type" => "email"
                },
                "content" => [],
                "tag" => "input"
              },
              %{"attrs" => %{"type" => "submit"}, "content" => ["Join"], "tag" => "button"}
            ],
            "rendered_html" =>
              "<form phx-submit=\"join\">\n  \n  \n  \n  <input id=\"newsletter_email\" name=\"newsletter[email]\" class=\"text-sm\" placeholder=\"Enter your email\" type=\"email\">\n  <button type=\"submit\">Join</button>\n\n</form>",
            "tag" => "Phoenix.Component.form"
          }
        ]
      )
    end

    test "with :slot" do
      beacon_component_fixture(
        name: "table",
        attrs: [
          %{name: "id", type: "string", opts: [required: true]},
          %{name: "rows", type: "list", opts: [required: true]},
          %{name: "row_id", type: "any", opts: [default: nil]},
          %{name: "row_item", type: "any", opts: [default: &Function.identity/1]}
        ],
        slots: [
          %{
            name: "col",
            opts: [required: true],
            attrs: [%{name: "label", type: "string"}]
          }
        ],
        template: """
        <div>
          <table>
            <thead>
              <tr>
                <th :for={col <- @col}><%= col[:label] %></th>
              </tr>
            </thead>
            <tbody id={@id}>
              <tr :for={row <- @rows} id={@row_id && @row_id.(row)}>
                <td :for={col <- @col}>
                  <div>
                    <span>
                      <%= render_slot(col, @row_item.(row)) %>
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        """
      )

      template = ~S|
      <.table id="users" rows={[%{id: 1, username: "foo"}]}>
        <:col :let={user} label="id"><%= user.id %></:col>
        <:col :let={user} label="username"><%= user.username %></:col>
      </.table>
      |

      assert_output(
        template,
        [
          %{
            "tag" => ".table",
            "attrs" => %{"id" => "users", "rows" => "{[%{id: 1, username: \"foo\"}]}"},
            "content" => [
              %{
                "attrs" => %{":let" => "{user}", "label" => "id"},
                "content" => [%{"attrs" => %{}, "content" => ["user.id"], "metadata" => %{"opt" => ~c"="}, "tag" => "eex"}],
                "tag" => ":col"
              },
              %{
                "attrs" => %{":let" => "{user}", "label" => "username"},
                "content" => [
                  %{"attrs" => %{}, "content" => ["user.username"], "metadata" => %{"opt" => ~c"="}, "tag" => "eex"}
                ],
                "tag" => ":col"
              }
            ],
            "rendered_html" =>
              "<div>\n  <table>\n    <thead>\n      <tr>\n        <th>id</th><th>username</th>\n      </tr>\n    </thead>\n    <tbody id=\"users\">\n      <tr>\n        <td>\n          <div>\n            <span>\n1\n            </span>\n          </div>\n        </td><td>\n          <div>\n            <span>\nfoo\n            </span>\n          </div>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n</div>"
          }
        ]
      )
    end

    test "nested in slot" do
      beacon_component_fixture(
        name: "label",
        attrs: [
          %{name: "for", type: "string", opts: [required: true]}
        ],
        slots: [
          %{name: "inner_block", opts: [required: true]}
        ],
        template:
          ~S"""
          <label for={@for}><%= render_slot(@inner_block) %></label>
          """
          |> String.trim(),
        example:
          ~S"""
          <.label for={"newsletter_email"}>Email</.label>
          """
          |> String.trim()
      )

      assert_output(
        ~S"""
        <.label for={"label_1"}>
          <.label for={"label_2"}>
            nested
          </.label>
        </.label>
        """,
        [
          %{
            "tag" => ".label",
            "attrs" => %{"for" => "{\"label_1\"}"},
            "rendered_html" => "<label for=\"label_1\">\n  <label for=\"label_2\">\n    nested\n  </label>\n</label>",
            "content" => [
              %{
                "tag" => ".label",
                "attrs" => %{"for" => "{\"label_2\"}"},
                "rendered_html" => "<label for=\"label_2\">\n  nested\n</label>",
                "content" => [" nested "]
              }
            ]
          }
        ]
      )
    end
  end

  test "assigns" do
    assert_output(
      ~S|<%= @project.name %>|,
      [%{"attrs" => %{}, "content" => ["@project.name"], "metadata" => %{"opt" => ~c"="}, "rendered_html" => "Beacon", "tag" => "eex"}],
      %{project: %{name: "Beacon"}}
    )
  end

  test "layout inner_content" do
    layout_template = ~S|
    <header>my_header</header>
    <%= @inner_content %>
    |

    page_template = ~S|
    <div>page</div>
    |

    assert_output(
      layout_template,
      [
        %{"attrs" => %{}, "content" => ["my_header"], "tag" => "header"},
        %{
          "attrs" => %{},
          "content" => ["@inner_content"],
          "metadata" => %{"opt" => ~c"="},
          "rendered_html" => "\n    &lt;div&gt;page&lt;/div&gt;\n    ",
          "tag" => "eex"
        }
      ],
      %{inner_content: page_template}
    )
  end

  test "invalid template" do
    assert {:error, _} = encode(~S|<%= :error|)
  end

  describe "encode_eex_block" do
    test "components" do
      template = ~S"""
      <%= if true do %>
        <.link path="/contact" replace={true}>Book meeting</.link>
        <Phoenix.Component.link path="/contact" replace={true}>Book meeting</Phoenix.Component.link>
        <Beacon.Web.Components.image name="logo.jpg" width="200px" />
      <% end %>
      """

      {:ok, [eex_block]} = Beacon.LiveAdmin.VisualEditor.HEEx.Tokenizer.tokenize(template)

      assert JSONEncoder.encode_eex_block(eex_block) == %{
               type: :eex_block,
               children: [
                 %{
                   type: :eex_block_clause,
                   children: [
                     %{type: :text, metadata: %{newlines: 1}, content: "\n  "},
                     %{
                       tag: ".link",
                       type: :tag_block,
                       metadata: %{mode: :inline},
                       children: [%{type: :text, metadata: %{mode: :normal, newlines: 0}, content: "Book meeting"}],
                       attrs: %{"path" => "/contact", "replace" => "{true}"}
                     },
                     %{type: :text, metadata: %{newlines: 1}, content: "\n  "},
                     %{
                       tag: "Phoenix.Component.link",
                       type: :tag_block,
                       metadata: %{mode: :block},
                       children: [%{type: :text, metadata: %{newlines: 0}, content: "Book meeting"}],
                       attrs: %{"path" => "/contact", "replace" => "{true}"}
                     },
                     %{type: :text, metadata: %{newlines: 1}, content: "\n  "},
                     %{tag: "Beacon.Web.Components.image", type: :tag_self_close, attrs: %{"name" => "logo.jpg", "width" => "200px"}},
                     %{type: :text, metadata: %{newlines: 1}, content: "\n"}
                   ],
                   content: "end"
                 }
               ],
               content: "if true do"
             }
    end

    test "complex template" do
      template = ~S"""
      <%= if @display do %>
        <%= cond do %>
          <% !is_nil(@users) and length(@users) > 1 -> %>
            <% [user | _] = @users %>
            <%= case user do %>
              <% {:ok, user} -> %>
                <span class="text-xl" phx-click={JS.exec("data-cancel", to: "#{user.id}")}>
                  <%= user.name %>
                  <img src={if user.picture , do: user.picture, else: "default.jpg"} width="200" />
                </span>
              <% _ -> %>
                <span>invalid user</span>
            <% end %>
          <% :default -> %>
            <span>no users found</span>
        <% end %>
      <% else %>
        <span>something went wrong</span>
      <% end %>
      """

      {:ok, [eex_block]} = Beacon.LiveAdmin.VisualEditor.HEEx.Tokenizer.tokenize(template)

      assert JSONEncoder.encode_eex_block(eex_block) == %{
               children: [
                 %{
                   type: :eex_block_clause,
                   children: [
                     %{type: :text, metadata: %{newlines: 1}, content: "\n  "},
                     %{
                       type: :eex_block,
                       children: [
                         %{
                           type: :eex_block_clause,
                           children: [%{type: :text, metadata: %{newlines: 1}, content: "\n    "}],
                           content: "!is_nil(@users) and length(@users) > 1 ->"
                         },
                         %{
                           type: :eex_block_clause,
                           children: [
                             %{type: :text, metadata: %{newlines: 1}, content: "\n      "},
                             %{type: :eex, metadata: %{line: 4, opt: [], column: 7}, content: "[user | _] = @users"},
                             %{type: :text, metadata: %{newlines: 1}, content: "\n      "},
                             %{
                               type: :eex_block,
                               children: [
                                 %{
                                   type: :eex_block_clause,
                                   children: [%{type: :text, metadata: %{newlines: 1}, content: "\n        "}],
                                   content: "{:ok, user} ->"
                                 },
                                 %{
                                   type: :eex_block_clause,
                                   children: [
                                     %{type: :text, metadata: %{newlines: 1}, content: "\n          "},
                                     %{
                                       tag: "span",
                                       type: :tag_block,
                                       metadata: %{mode: :inline},
                                       children: [
                                         %{type: :text, metadata: %{newlines: 1}, content: "\n            "},
                                         %{type: :eex, metadata: %{line: 8, opt: ~c"=", column: 13}, content: "user.name"},
                                         %{type: :text, metadata: %{newlines: 1}, content: "\n            "},
                                         %{
                                           tag: "img",
                                           type: :tag_self_close,
                                           attrs: %{"src" => "{if user.picture , do: user.picture, else: \"default.jpg\"}", "width" => "200"}
                                         },
                                         %{type: :text, metadata: %{newlines: 1}, content: "\n          "}
                                       ],
                                       attrs: %{"class" => "text-xl", "phx-click" => "{JS.exec(\"data-cancel\", to: \"\#{user.id}\")}"}
                                     },
                                     %{type: :text, metadata: %{newlines: 1}, content: "\n        "}
                                   ],
                                   content: "_ ->"
                                 },
                                 %{
                                   type: :eex_block_clause,
                                   children: [
                                     %{type: :text, metadata: %{newlines: 1}, content: "\n          "},
                                     %{
                                       tag: "span",
                                       type: :tag_block,
                                       metadata: %{mode: :inline},
                                       children: [%{type: :text, metadata: %{mode: :normal, newlines: 0}, content: "invalid user"}],
                                       attrs: %{}
                                     },
                                     %{type: :text, metadata: %{newlines: 1}, content: "\n      "}
                                   ],
                                   content: "end"
                                 }
                               ],
                               content: "case user do"
                             },
                             %{type: :text, metadata: %{newlines: 1}, content: "\n    "}
                           ],
                           content: ":default ->"
                         },
                         %{
                           type: :eex_block_clause,
                           children: [
                             %{type: :text, metadata: %{newlines: 1}, content: "\n      "},
                             %{
                               tag: "span",
                               type: :tag_block,
                               metadata: %{mode: :inline},
                               children: [%{type: :text, metadata: %{mode: :normal, newlines: 0}, content: "no users found"}],
                               attrs: %{}
                             },
                             %{type: :text, metadata: %{newlines: 1}, content: "\n  "}
                           ],
                           content: "end"
                         }
                       ],
                       content: "cond do"
                     },
                     %{type: :text, metadata: %{newlines: 1}, content: "\n"}
                   ],
                   content: "else"
                 },
                 %{
                   type: :eex_block_clause,
                   children: [
                     %{type: :text, metadata: %{newlines: 1}, content: "\n  "},
                     %{
                       tag: "span",
                       type: :tag_block,
                       metadata: %{mode: :inline},
                       children: [%{type: :text, metadata: %{mode: :normal, newlines: 0}, content: "something went wrong"}],
                       attrs: %{}
                     },
                     %{type: :text, metadata: %{newlines: 1}, content: "\n"}
                   ],
                   content: "end"
                 }
               ],
               content: "if @display do",
               type: :eex_block
             }
    end
  end
end
