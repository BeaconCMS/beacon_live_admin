defmodule Beacon.LiveAdmin.Components.Pagination do
  use Phoenix.LiveComponent

  def render(assigns) do
    ~H"""
    <div class="flex flex-row justify-center space-x-6 pt-8 text-xl font-semibold">
      <button phx-click="prev-page" disabled={@current_page == 1} class="px-2 font-medium disabled:text-gray-400">&#8592; prev</button>
      <button :for={page <- 1..@pages} phx-click="set-page" phx-value-page={page} class={if @current_page == page, do: "text-indigo-700", else: ""}>
        <%= page %>
      </button>
      <button phx-click="next-page" disabled={@current_page == @pages} class="px-2 font-medium disabled:text-gray-400">next &#8594;</button>
    </div>
    """
  end
end
