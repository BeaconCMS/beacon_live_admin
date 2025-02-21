defmodule Beacon.LiveAdmin.StationUI.HTML.Modal do
  @moduledoc false
  use Phoenix.Component

  import Beacon.LiveAdmin.StationUI.HTML.Button
  import Beacon.LiveAdmin.StationUI.HTML.Icon, only: [icon: 1]

  alias Phoenix.LiveView.JS

  @doc """
  The modals component renders a block of content that displays on top of the page. The modal can be dismissed by clicking on the close button or hitting ESC on the keyboard.

  """

  attr :id, :string, required: true
  attr :size, :string, default: "md", values: ["xs", "sm", "md", "lg", "xl"]
  attr :show, :boolean, default: false
  attr :show_backdrop, :boolean, default: true
  attr :on_cancel, JS, default: %JS{}

  slot :inner_block, required: true
  slot :title
  slot :subtitle

  slot :footer do
    attr :variant, :string, values: ["right", "justified", "full", "stacked"]
  end

  def modal(assigns) do
    ~H"""
    <div
      id={@id}
      phx-mounted={@show && show_modal(@id)}
      phx-remove={hide_modal(@id)}
      data-cancel={JS.exec(@on_cancel, "phx-remove")}
      class={[
        "fixed inset-0 z-50 hidden items-center justify-center p-4",
        @show_backdrop && "bg-gray-900/40"
      ]}
    >
      <.focus_wrap
        id={"#{@id}-focus-wrap"}
        class={[
          "font-sans w-full rounded-md bg-white text-slate-800",
          focus_wrap_size_classes(@size),
          focus_wrap_drop_shadow_classes(@size, @show_backdrop)
        ]}
        phx-window-keydown={JS.exec("data-cancel", to: "##{@id}")}
        phx-key="escape"
        phx-click-away={JS.exec("data-cancel", to: "##{@id}")}
      >
        <section
          role="dialog"
          class={[
            "flex w-full flex-col",
            container_size_classes(@size)
          ]}
          aria-modal="true"
          aria-labelledby={"##{@id}-title"}
        >
          <header class={["flex items-start gap-x-2", header_size_classes(@size)]}>
            <div class="grow text-center">
              <h1 :if={@title} id={"#{@id}-title"} class={["font-bold", title_size_classes(@size)]}>
                <%= render_slot(@title) %>
              </h1>
              <h2 :if={@subtitle} class={["font-medium", subtitle_size_classes(@size)]}>
                <%= render_slot(@subtitle) %>
              </h2>
            </div>

            <.button type="button" class="sui-secondary w-[42px] h-[42px] rounded-full" aria-label="Close" phx-click={@on_cancel}>
              <.icon name="hero-x-mark" class="h-6 w-6 shrink-0" />
            </.button>
          </header>

          <div id={"#{@id}-content"} class={["w-full overflow-y-auto", content_size_classes(@size)]}>
            <%= render_slot(@inner_block) %>
          </div>

          <div
            :for={footer <- @footer}
            class={[
              "flex",
              footer_size_classes(@size),
              footer_variant_classes(footer.variant)
            ]}
          >
            <%= render_slot(@footer) %>
          </div>
        </section>
      </.focus_wrap>
    </div>
    """
  end

  def show_modal(js \\ %JS{}, id) when is_binary(id) do
    js
    |> JS.show(to: "##{id}", display: "flex")
    |> JS.add_class("overflow-hidden", to: "body")
    |> JS.focus_first(to: "##{id}-content")
  end

  def hide_modal(js \\ %JS{}, id) do
    js
    |> JS.hide(to: "##{id}")
    |> JS.remove_class("overflow-hidden", to: "body")
    |> JS.pop_focus()
  end

  defp focus_wrap_size_classes("xs"), do: "min-w-[280px] max-w-screen-sm p-5"
  defp focus_wrap_size_classes("sm"), do: "min-w-[280px] max-w-screen-md p-[22px]"
  defp focus_wrap_size_classes("md"), do: "min-w-[320px] max-w-screen-md p-[28px]"
  defp focus_wrap_size_classes("lg"), do: "min-w-[400px] max-w-screen-lg p-8"
  defp focus_wrap_size_classes("xl"), do: "min-w-[400px] max-w-screen-xl p-8"

  defp focus_wrap_drop_shadow_classes(_, true), do: nil
  defp focus_wrap_drop_shadow_classes("xs", false), do: "drop-shadow-xl"
  defp focus_wrap_drop_shadow_classes("sm", false), do: "drop-shadow-xl"
  defp focus_wrap_drop_shadow_classes("md", false), do: "drop-shadow-xl"
  defp focus_wrap_drop_shadow_classes("lg", false), do: "drop-shadow-2xl"
  defp focus_wrap_drop_shadow_classes("xl", false), do: "drop-shadow-2xl"

  defp container_size_classes("xs"), do: "gap-y-6"
  defp container_size_classes("sm"), do: "gap-y-6"
  defp container_size_classes("md"), do: "gap-y-6"
  defp container_size_classes("lg"), do: "gap-y-8"
  defp container_size_classes("xl"), do: "gap-y-[38px]"

  defp header_size_classes("xs"), do: "-mr-2.5"
  defp header_size_classes("sm"), do: "-mr-2.5"
  defp header_size_classes("md"), do: "-mr-3.5"
  defp header_size_classes("lg"), do: "-mr-5"
  defp header_size_classes("xl"), do: "-mr-5"

  defp title_size_classes("xs"), do: "mb-2 text-base"
  defp title_size_classes("sm"), do: "mb-2.5 text-xl"
  defp title_size_classes("md"), do: "mb-3 text-3xl"
  defp title_size_classes("lg"), do: "mb-4 text-5xl"
  defp title_size_classes("xl"), do: "mb-6 text-7xl"

  defp subtitle_size_classes("xs"), do: "text-sm"
  defp subtitle_size_classes("sm"), do: "text-base"
  defp subtitle_size_classes("md"), do: "text-lg"
  defp subtitle_size_classes("lg"), do: "text-2xl"
  defp subtitle_size_classes("xl"), do: "text-4xl"

  defp content_size_classes("xs"), do: "max-h-[180px]"
  defp content_size_classes("sm"), do: "max-h-[180px]"
  defp content_size_classes("md"), do: "max-h-[280px]"
  defp content_size_classes("lg"), do: "max-h-[320px]"
  defp content_size_classes("xl"), do: "max-h-[400px]"

  defp footer_size_classes("xs"), do: "gap-3"
  defp footer_size_classes("sm"), do: "gap-4"
  defp footer_size_classes("md"), do: "gap-5"
  defp footer_size_classes("lg"), do: "gap-6"
  defp footer_size_classes("xl"), do: "gap-6"

  defp footer_variant_classes("justified"), do: "flex-wrap items-center justify-between"
  defp footer_variant_classes("full"), do: "grid grid-cols-1 md:grid-cols-2"
  defp footer_variant_classes("stacked"), do: "flex-col items-start"
  defp footer_variant_classes(_), do: "flex-wrap items-center justify-end"
end
