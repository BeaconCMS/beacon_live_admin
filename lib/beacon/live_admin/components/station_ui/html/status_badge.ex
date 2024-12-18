defmodule Beacon.LiveAdmin.StationUI.HTML.StatusBadge do
  use Phoenix.Component

  @status_badge_base_classes "aspect-square flex items-center justify-center rounded-full"
  defp status_badge_base_classes, do: @status_badge_base_classes

  @doc """
  The status badge component renders different-colored circles to represent different statuses.

  Suggested classes for various sizes:
    - xs -> "w-2 [&>span]:w-0.5"
    - sm -> "w-2.5 [&>span]:w-0.5"
    - md -> "w-3 [&>span]:w-0.5" (default)
    - lg -> "w-4 [&>span]:w-0.5"
    - xl -> "w-5 [&>span]:w-1"

  """
  attr(:status, :string, default: "active")
  attr(:class, :any, default: "w-3 [&>span]:w-0.5")

  def status_badge(assigns) do
    ~H"""
    <div class={[
      status_badge_base_classes(),
      status_classes(@status)
      | List.wrap(@class)
    ]}>
      <span class="aspect-square rounded-full bg-slate-50"></span>
    </div>
    """
  end

  defp status_classes("active"), do: "bg-emerald-500"
  defp status_classes("inactive"), do: "bg-slate-300"
  defp status_classes("deactivated"), do: "bg-rose-500"
  defp status_classes("pending"), do: "bg-orange-500"
  defp status_classes("other"), do: ""
end
