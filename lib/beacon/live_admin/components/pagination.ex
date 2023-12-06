defmodule Beacon.LiveAdmin.Components.Pagination do
  use Phoenix.LiveComponent

  def render(assigns) do
    ~H"""
    <div class="flex flex-row justify-center space-x-6 pt-8 text-xl font-semibold">
      <button class="px-2 font-medium">&#8592; prev</button>
      <button :for={page <- 1..@pages} phx-click="set-page" phx-value-page={page}><%= page %></button>
      <button class="px-2 font-medium">next &#8594;</button>
    </div>
    """
  end
end
