defmodule Beacon.LiveAdmin.StationUI.HTML.Toast do
  use Phoenix.Component

  @base_classes ~w{
    py-[0.625em]
    ps-[0.875em]
    pe-[0.625em]
    flex
    items-center
    justify-between
    gap-x-3
    max-w-prose
    text-[--sui-brand-primary-text]
    w-full
    rounded-lg
    shadow-[0_4px_24px_0_rgba(0,0,0,0.35)]
    border
  }
  defp base_classes, do: @base_classes

  @doc """
  A toast message component.
  The primary (left) paragraph content goes into the main inner_block slot.
  The optional secondary (right) content goes into the secondary slot.

  ## Examples

  Toast with left icon and right button:

    <.toast>
      <.icon name="hero-information-circle-solid" class="size-7 text-rose-700" />
      This is the toast content
      <:secondary>
        <.button class="sui-primary">
          Button
        </.button>
      </:secondary>
    </.toast>

  Toast without border:

    <.toast class="text-lg border-transparent">
      ...
    </.toast>

  Suggested classes for various text sizes and the default border styling:
    - xs -> "text-sm border-[--sui-brand-primary-border]"
    - sm -> "text-base border-[--sui-brand-primary-border]"
    - md -> "text-lg border-[--sui-brand-primary-border]" (default)
    - lg -> "text-2xl border-[--sui-brand-primary-border]"
    - xl -> "text-3xl border-[--sui-brand-primary-border]"
  """
  slot :inner_block, required: true
  slot :secondary

  attr :class, :any, default: "text-lg border-[--sui-brand-primary-border]"

  def toast(assigns) do
    ~H"""
    <div class={[base_classes(), @class]} role="status">
      <p class="flex items-center gap-x-3 *:shrink-0">
        <%= render_slot(@inner_block) %>
      </p>
      <%= render_slot(@secondary) %>
    </div>
    """
  end
end
