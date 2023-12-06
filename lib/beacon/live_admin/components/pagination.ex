defmodule Beacon.LiveAdmin.Components.Pagination do
  use Phoenix.LiveComponent

  def render(assigns) do
    ~H"""
    <div class="flex flex-row justify-center space-x-6 pt-8 text-xl font-semibold">
      <button phx-click="prev-page" class={"px-2 font-medium #{active_prev(@current_page)}"}>&#8592; prev</button>
      <button :for={page <- 1..@pages} phx-click="set-page" phx-value-page={page} class={active_page(page, @current_page)}><%= page %></button>
      <button phx-click="next-page" class={"px-2 font-medium #{active_next(@current_page, @pages)}"}>next &#8594;</button>
    </div>
    """
  end

  defp active_page(page, page), do: "text-indigo-700"
  defp active_page(_, _), do: ""

  defp active_prev(1), do: "text-gray-400 disabled"
  defp active_prev(_), do: ""

  defp active_next(page, page), do: "text-gray-400 disabled"
  defp active_next(_, _), do: ""
end
