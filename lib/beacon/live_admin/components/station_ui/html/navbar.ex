defmodule Beacon.LiveAdmin.StationUI.HTML.Navbar do
  @moduledoc false
  use Phoenix.Component

  @doc """
    Implements a navbar component.
    The navbar can consist of two sides left and right.
    Both can be implemented using the left and right components supplied by this module.

    Example use:
    <.navbar aria_label="Main navigation" class="sticky top-0 border-transparent bg-white">
      <span class="hidden text-lg font-light antialiased min-[1800px]:text-4xl lg:block xl:text-xl 2xl:text-3xl">
        Brand
      </span>
      <.navbar_left>
        <:item>
          <.button class="sui-secondary">Home</.button>
        </:item>
        <:item>
          <.button class="sui-secondary">Services</.button>
        </:item>
      </.navbar_left>
      <.navbar_right>
        <:item>
          <.button
            class="sui-secondary h-10 w-10 rounded-full"
          >
            <.icon name="hero-bars-3" class="h-6 w-6 shrink-0" />
          </.button>
        </:item>
      </.navbar_right>
    </.navbar>

  """

  attr :aria_label, :string, default: "Primary Menu"
  attr :class, :string, default: ""

  slot :inner_block, required: true

  def navbar(assigns) do
    ~H"""
    <nav
      aria-label={@aria_label}
      class={[
        base_classes(),
        @class
      ]}
    >
      <%= render_slot(@inner_block) %>
    </nav>
    """
  end

  attr :class, :string, default: ""
  slot :item

  def navbar_left(assigns) do
    ~H"""
    <div class={[
      navbar_left_base_classes(),
      @class
    ]}>
      <%= if @item do %>
        <ul class="flex shrink-0 items-center gap-x-1 sm:gap-x-2 md:gap-x-3 xl:gap-x-4 leading-none min-[1800px]:gap-x-2 [&>*]:hidden [&>*:first-child]:block [&>*:nth-child(2)]:block [&>*:nth-child(3)]:block [&>*:nth-child(4)]:block md:[&>*]:block">
          <%= for item <- @item do %>
            <li>
              <%= render_slot(item) %>
            </li>
          <% end %>
        </ul>
      <% end %>
    </div>
    """
  end

  attr :class, :string, default: ""
  slot :item

  def navbar_right(assigns) do
    ~H"""
    <div class={[
      @class
    ]}>
      <ul class="hidden shrink-0 gap-x-2 min-[1800px]:gap-x-2 md:flex md:items-center xl:gap-x-1 2xl:gap-x-1.5">
        <%= for item <- @item do %>
          <li>
            <%= render_slot(item) %>
          </li>
        <% end %>
      </ul>
    </div>
    """
  end

  defp base_classes do
    "left-0 flex w-full items-center justify-between gap-4 overflow-x-auto overscroll-x-contain px-1 py-1 min-[1800px]:px-4.5 sm:px-2 sm:py-2.5 lg:py-3 xl:py-4.5 xl:px-3.5"
  end

  defp navbar_left_base_classes do
    "flex shrink-0 grow items-center justify-between gap-x-3 sm:gap-x-6 md:gap-x-[34px] md:justify-start"
  end
end
