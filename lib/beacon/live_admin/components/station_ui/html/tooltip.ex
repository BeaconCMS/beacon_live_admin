defmodule Beacon.LiveAdmin.StationUI.HTML.Tooltip do
  use Phoenix.Component

  import Beacon.LiveAdmin.StationUI.HTML.Icon

  @doc """
  The tooltip component renders a small unit of informational content that is hidden until a user hovers over the activating content.

  """

  attr :id, :string, required: true
  attr :direction, :string, default: "bottom", values: ["top", "bottom"]

  slot :inner_block

  def tooltip(assigns) do
    ~H"""
    <div class={direction_classes(@direction)} id={@id} role="tooltip">
      <.icon name="hero-information-circle" class="h-6 w-6 text-blue-100" />
      <span class="z-10 text-base font-medium leading-6 text-white">
        <%= render_slot(@inner_block) %>
      </span>
    </div>
    """
  end

  defp direction_classes("top") do
    "gap-x-1.5 p-2.5 pl-1.5 z-50 hidden peer-focus-within/target:inline-flex peer-hover/target:inline-flex absolute bottom-full mb-[calc(var(--tooltip-arrow-size)/1.5)] items-center min-w-max rounded-lg bg-slate-900 left-0 after:absolute after:content-[''] after:top-full after:left-1/2 after:-translate-x-1/2 after:bg-inherit after:rounded-sm after:h-[var(--tooltip-arrow-size)] after:w-[var(--tooltip-arrow-size)] after:-translate-y-1/2 after:-mt-1 after:-rotate-45"
  end

  defp direction_classes("bottom") do
    "gap-x-1.5 p-2.5 pl-1.5 z-50 hidden items-center peer-focus-within/target:inline-flex peer-hover/target:inline-flex absolute top-full mt-[calc(var(--tooltip-arrow-size)/1.5)] min-w-max rounded-lg bg-slate-900 left-0 after:absolute after:content-[''] after:bottom-full after:left-1/2 after:-translate-x-1/2 after:bg-inherit after:rounded-sm after:h-[var(--tooltip-arrow-size)] after:w-[var(--tooltip-arrow-size)] after:translate-y-1/2 after:-mb-1 after:-rotate-45"
  end
end
