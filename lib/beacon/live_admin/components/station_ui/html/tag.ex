defmodule Beacon.LiveAdmin.StationUI.HTML.Tag do
  @moduledoc false
  # For bordered tags, add "border-2"
  # For rounded tags, add "rounded-full py-1"
  use Phoenix.Component

  import Beacon.LiveAdmin.StationUI.HTML.Icon, only: [icon: 1]

  alias Phoenix.LiveView.JS

  attr :as, :string
  attr :class, :any, default: "gap-x-1.5 px-2.5 rounded py-1"
  attr :on_click, JS, default: nil
  attr :on_delete, JS, default: nil
  attr :tabindex, :string
  attr :rest, :global, include: ~w(disabled)

  slot :inner_block, required: true

  def tag(assigns) do
    assigns =
      assign_new(assigns, :as, fn ->
        if assigns.on_click && !assigns.on_delete, do: "button", else: "div"
      end)

    assigns =
      assign_new(assigns, :tabindex, fn ->
        assigns.on_click && !(assigns.as in ["a", "button"]) && "0"
      end)

    ~H"""
    <.dynamic_tag
      name={@as}
      phx-click={@on_click}
      class={[
        @class,
        container_interaction_classes(!!(@on_delete || @on_click)),
        "flex items-center max-w-fit whitespace-nowrap text-slate-800 border-slate-800 bg-gray-100 focus-visible:ring-purple-500 outline-none"
      ]}
      tabindex={@tabindex}
      type={@as == "button" && "button"}
      {@rest}
    >
      <span class={["text-base leading-6", "font-sans font-bold"]}>
        <%= render_slot(@inner_block) %>
      </span>
      <button
        :if={@on_delete}
        type="button"
        phx-click={@on_delete}
        class="rounded border-2 border-transparent outline-none hover:text-indigo-600 focus-visible:ring-2 focus-visible:ring-purple-500 active:text-indigo-900"
        aria-label="Delete"
      >
        <.icon
          name="hero-x-circle-solid"
          class={[
            "h-3.5 w-3.5",
            "block"
          ]}
        />
      </button>
    </.dynamic_tag>
    """
  end

  defp container_interaction_classes(true) do
    "cursor-pointer hover:bg-gray-200 [&:not(:has(button:active))]:active:bg-gray-300 focus-visible:ring-2 focus-visible:ring-offset-4"
  end

  defp container_interaction_classes(false), do: nil
end
