defmodule Beacon.LiveAdmin.StationUI.HTML.Banner do
  use Phoenix.Component

  import Beacon.LiveAdmin.StationUI.HTML.Icon, only: [icon: 1]
  import Beacon.LiveAdmin.StationUI.HTML.Button

  alias Phoenix.LiveView.JS

  @base_classes "max-w-[800px] text-[--sui-brand-primary-text] w-full rounded-lg border py-2.5 pl-3"
  defp base_classes, do: @base_classes

  @doc """
  The banner component renders an enclosed title, description, and close button.
  The title content goes into the main inner_block slot.
  The optional secondary (lower) content goes into the secondary slot.

  ## Examples

  Default banner with left icon, title, and secondary text:

    <.banner id="icon-title-and-secondary">
      <.icon name="hero-information-circle-solid" class="text-[--sui-brand-primary] shrink-0" />
      <h2 class="font-medium text-xl pl-2">Default Banner with Icon and Secondary</h2>
      <:secondary>
        Secondary text.
      </:secondary>
    </.banner>

  Banner of default size but without border:

    <.banner id="no-border" class="border-transparent [&_span]:h-6 [&_span]:w-6 text-base">
      ...
    </.banner>

  Suggested classes for various text sizes and the default border styling:

    - xs -> "border-[--sui-brand-primary-border] [&_span]:h-3.5 [&_span]:w-3.5 text-xs"
    - sm -> "border-[--sui-brand-primary-border] [&_span]:h-4.5 [&_span]:w-4.5 text-sm"
    - md -> "border-[--sui-brand-primary-border] [&_span]:h-6 [&_span]:w-6 text-base" (the default)
    - lg -> "border-[--sui-brand-primary-border] [&_span]:h-9 [&_span]:w-9 text-xl"
    - xl -> "border-[--sui-brand-primary-border] [&_span]:h-12 [&_span]:w-12 text-3xl"
  """

  slot :inner_block, required: true
  slot :secondary

  attr :id, :string, required: true
  attr :class, :any, default: "border-[--sui-brand-primary-border] [&_span]:h-6 [&_span]:w-6 text-base"
  attr :on_cancel, JS, default: %JS{}

  def banner(assigns) do
    ~H"""
    <div id={@id} class={[base_classes(), @class]} role="status">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <%= render_slot(@inner_block) %>
        </div>
        <.button class="sui-secondary min-h-11 border-0 bg-white" aria-label="Dismiss" phx-click={hide_banner(@on_cancel, @id)}>
          <.icon name="hero-x-mark" />
        </.button>
      </div>
      <p class="pb-2 empty:hidden"><%= render_slot(@secondary) %></p>
    </div>
    """
  end

  defp hide_banner(js, id) do
    js
    |> JS.hide(to: "##{id}")
    |> JS.pop_focus()
  end
end
