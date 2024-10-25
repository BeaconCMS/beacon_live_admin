defmodule Beacon.LiveAdmin.PropertiesSidebarComponent do
  # In Phoenix apps, the line is typically: use MyAppWeb, :live_component
  use Phoenix.LiveComponent
  use Beacon.LiveAdmin.Web, :live_component
  require Logger

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

  defp parent_xpath(nil), do: nil
  defp parent_xpath(xpath) do
    case String.split(xpath, ".") do
      [str] -> "root"
      parts -> parts |> Enum.drop(-1) |> Enum.join(".")
    end
  end

  def render(assigns) do
    selected_ast_element = case assigns.selected_ast_element_id do
      "root" -> %{ "tag" => "root", "attrs" => %{}, "content" => assigns.page.ast }
      xpath -> find_ast_element(assigns.page.ast, xpath)
    end

    parent_node_id = parent_xpath(assigns.selected_ast_element_id)

    assigns =
      assign(assigns,
        selected_ast_element: selected_ast_element,
        parent_node_id: parent_node_id,
        attributes_editable: selected_ast_element["tag"] not in ["eex", "eex_block"]
      )

    ~H"""
      <div class="mt-4 w-64 bg-white" data-testid="right-sidebar">
        <div class="sticky top-0 overflow-y-auto h-screen">
          <%= if @selected_ast_element do %>
            <div class="border-b text-lg font-medium leading-5 p-4 relative">
              <%= @selected_ast_element["tag"] %>
              <%= if assigns.selected_ast_element_id !== "root" do %>
                <.svelte name="components/GoToParentButton" class="contents" socket={@socket}/>
              <% end %>

              <button type="button" class="absolute p-2 top-2 right-1" phx-click="reset_selection">
                <span class="sr-only">Close</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-6 h-6 hover:text-blue-700 active:text-blue-900"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <%= if @attributes_editable do %>
              <.sidebar_section placeholder="Placeholder" name="Attr name" value="Attr value"></.sidebar_section>
              <.sidebar_section placeholder="Placeholder" name="Attr name 2" value="Attr value 2"></.sidebar_section>
            <% end %>
          <% end %>
        </div>
      </div>
    """
  end

  def sidebar_section(assigns) do
    ~H"""
    <section class="p-4 border-b border-b-gray-100 border-solid">
      <header class="flex items-center text-sm mb-2 font-medium">
          <%!-- on:click={() => (expanded = !expanded)} --%>
          <%!-- aria-expanded={expanded} --%>
        <button
          type="button"
          class="w-full flex items-center justify-between gap-x-1 p-1 font-semibold group"
        >
          <span>
            <span class="hover:text-blue-700 active:text-blue-900">
              <%= @name %>
            </span>
            <button type="button" class="ml-4" title="Delete attribute">
              <span class="hero-trash text-red hover:text-red"></span>
            </button>
          </span>
          <%!-- <span class={expanded ? "" : " [&_path]:origin-center [&_path]:rotate-180"}> --%>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-5 h-5 stroke-slate-500 fill-slate-500 group-hover:stroke-current group-hover:fill-current"
            >
              <path
                fill-rule="evenodd"
                d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
        </button>
        <!-- Classes -->
      </header>
      <input
        type="text"
        class="w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm"
        value={@value}
      />
    </section>
    """
  end
end
