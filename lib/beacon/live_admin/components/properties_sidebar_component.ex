defmodule Beacon.LiveAdmin.PropertiesSidebarComponent do
  # In Phoenix apps, the line is typically: use MyAppWeb, :live_component
  use Phoenix.LiveComponent
  require Logger

  def find_ast_element(_nodes, nil), do: nil
  def find_ast_element(nodes, xpath) do
    Logger.debug("########################")
    Logger.debug("########################")
    Logger.debug("######### XPATH #########")
    Logger.debug("########################")
    Logger.debug("########################")
    Logger.debug(xpath)
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
        parent_node_id: parent_node_id
      )

    ~H"""
      <div class="w-64 bg-white" data-testid="right-sidebar">
        <div class="sticky top-0 overflow-y-auto h-screen">
          <%= if @selected_ast_element do %>
            <div class="border-b text-lg font-medium leading-5 p-4 relative">
              <%= @selected_ast_element["tag"] %>
              <%= if assigns.selected_ast_element_id !== "root" do %>
                <button type="button" class="absolute p-2 top-2 right-9 group" phx-click="select_ast_element" phx-value-id={@parent_node_id}>
                  <span class="sr-only">Up one level</span>
                  <span
                    class="absolute opacity-0 invisible right-9 min-w-[100px] bg-amber-100 py-1 px-1.5 rounded text-xs text-medium transition group-hover:opacity-100 group-hover:visible"
                    >
                    Up one level
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6 hover:text-blue-700 active:text-blue-900"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12"
                    />
                  </svg>
                </button>
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
          <% end %>
        </div>
      </div>
    """
  end
end
