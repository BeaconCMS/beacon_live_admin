defmodule Beacon.LiveAdmin.Components.Pagination do
  use Phoenix.LiveComponent

  def render(assigns) do
    ~H"""
    <div>
      <span>prev</span>
      <span :for={page <- 1..@pages} phx-click="set-page" phx-value-page={page}>
        <%= page %>
      </span>
      <span>next</span>
    </div>
    """
  end
end
