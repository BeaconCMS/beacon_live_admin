defmodule Beacon.LiveAdmin.StationUI.HTML.Button do
  use Phoenix.Component

  @moduledoc """
  The button component renders a <button> element with options for text-only, icon-only, or a combination of both.

  Use the default slot to pass in text or large icons for buttons.

  Buttons classes remain the same regardless of the button theme, but the value of variables applied to those classes will be scoped using
  a specifier or modifier class:

    - sui-primary
    - sui-secondary
    - sui-tertiary
    - sui-primary-destructive
    - sui-secondary-destructive

  These classes are not utiltiy classes, as they are not actually applying or changing
  any CSS properties. The classes serve merely to scope the variables based on the theme of the button.

    ## Example

  <.button>
    Button text
    <.icon name="hero-chevron-down" class="w-4 h-4 lg:w-5 lg:h-5" />
  </.button>

  Suggested size classes:
    xl: text-3xl lg:text-4xl
    lg: text-2xl lg:text-3xl
    sm: text-sm lg:text-base
  """
  attr :class, :string, default: "sui-primary"
  attr :rest, :global, include: ~w(disabled form formaction formmethod)

  slot :inner_block

  def button(assigns) do
    ~H"""
    <button class={[@class, base_classes()]} {@rest}>
      <%= render_slot(@inner_block) %>
    </button>
    """
  end

  defp base_classes do
    ~w"
      [:where(&)]:rounded-lg
      [:where(&)]:text-base

      py-[7px]
      bg-[--sui-bg-btn]
      border-[--sui-border-btn]
      text-[--sui-text-btn]
      inline-flex
      items-center
      justify-center
      gap-x-1.5
      whitespace-nowrap
      border
      px-4
      font-bold

      hover:bg-[--sui-bg-btn-hover]
      hover:border-[--sui-border-btn-hover]
      hover:text-[--sui-text-btn-hover]

      focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-purple-500
      focus-visible:ring-offset-4

      active:bg-[--sui-bg-btn-active]
      active:border-[--sui-border-btn-active]
      active:text-[--sui-text-btn-active]

      disabled:bg-[--sui-bg-btn-disabled]
      disabled:border-[--sui-border-btn-disabled]
      disabled:text-[--sui-text-btn-disabled]

      lg:gap-x-2
   "
  end
end
