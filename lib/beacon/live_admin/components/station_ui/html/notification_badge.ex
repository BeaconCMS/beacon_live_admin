defmodule Beacon.LiveAdmin.StationUI.HTML.NotificationBadge do
  @moduledoc false
  use Phoenix.Component

  attr :class, :any, default: "h-6 w-6 text-sm"
  attr :dot_class, :any, default: "h-1 w-1 group-hover/notification-badge:scale-[2]"
  attr :count, :integer, default: nil
  slot :inner_block

  def notification_badge(assigns) do
    ~H"""
    <div class={[
      @class,
      "font-sans group/notification-badge flex items-center justify-center rounded-full bg-rose-600 font-bold text-white hover:bg-rose-500"
    ]}>
      <%= render_slot(@inner_block) || default_content(assigns) %>
    </div>
    """
  end

  defp default_content(%{count: nil} = assigns) do
    ~H"""
    <span class={[@dot_class, "transition-transform"]}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" fill="currentColor" class="pointer-events-none" aria-hidden="true">
        <circle cx="5" cy="5" r="5" />
      </svg>
    </span>
    """
  end

  defp default_content(assigns) do
    ~H"""
    <span class="pointer-events-none"><%= @count %></span>
    """
  end
end
