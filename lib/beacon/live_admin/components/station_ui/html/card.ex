defmodule Beacon.LiveAdmin.StationUI.HTML.Card do
  use Phoenix.Component

  @moduledoc """
  The cards component renders a self-contained area of content which can contain:
  - Title
  - Image
  - Description
  - Date
  - Read More link

  The card can utilize either a vertical or horizontal layout.

  ## Examples

  ### Vertical Card

  <.card>
    <:header>
      <img
        class="w-full"
        src="https://images.pexels.com/photos/3635870/pexels-photo-3635870.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        alt="A whale leaps out of the water"
      />
    </:header>
    <:content>
      <div class="flex flex-wrap items-center justify-between gap-0.5">
        <!-- Allow the heading and date to wrap if the heading overflows the card -->
        <h2 class="text-base @[350px]:text-lg/[27px] @[425px]:text-2xl/[36px] @[625px]:text-3xl/[45px] font-semibold text-slate-800">
          The Whales Are Here!
        </h2>
        <h3 class="text-xs @[350px]:text-sm font-semibold text-gray-500">Nov 12, 2022</h3>
      </div>
      <p class="text-xs/[18px] @[350px]:text-sm/[21px] @[425px]:text-base @[625px]:text-lg/[27px] @[850px]:text-xl/[30px] font-medium text-slate-800">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis fugiat, aliquam assumenda repellat rerum nostrum.
      </p>
      <!-- Call to action -->
      <a
        href="#"
        class="text-sm/[21px] @[350px]:text-base @[625px]:text-2xl/[36px] px-2 py-2 justify-self-center font-bold text-skin-link hover:text-skin-link-hover active:text-skin-link-active focus-visible:ring-skin-link focus-visible:ring-2 focus-visible:outline-none"
      >
        Read More
      </a>
    </:content>
  </.card>

  ### Horizontal Card

  <.card_horizontal>
    <:header>
      <img
        class="h-full w-[260px] object-cover"
        src="https://images.pexels.com/photos/3635870/pexels-photo-3635870.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        alt="A whale leaps out of the water"
      />
    </:header>
    <:content>
      <div class="w-full">
        <h2 class="text-base @[350px]:text-xl/[30px] @[425px]:text-3xl/[45px] @[625px]:text-5xl/[72px] @[850px]:text-7xl/[108px] font-semibold text-slate-800">
          Headline
        </h2>
        <p class="text-xs/[18px] @[350px]:text-sm/[21px] @[425px]:text-base @[625px]:text-lg/[27px] @[850px]:text-xl/[30px] font-medium text-slate-800">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis fugiat, aliquam assumenda repellat rerum nostrum.
        </p>
      </div>

      <div
        aria-hidden
        class="py-2 pr-2 @[425px]:py-4 @[425px]:pr-4 @[625px]:py-6 @[625px]:pr-6 @[850px]:py-8 @[850px]:pr-8py-1 grid auto-rows-max place-content-center text-slate-800"
      >
        <.button class="w-10 h-10 rounded-full border-0 sui-secondary">
          <.icon name="hero-face-smile-solid" class="w-5 h-5 shrink-0" />
        </.button>
        <.button class="w-10 h-10 rounded-full border-0 sui-secondary">
          <.icon name="hero-face-smile-solid" class="w-5 h-5 shrink-0" />
        </.button>
        <.button class="w-10 h-10 rounded-full border-0 sui-secondary">
          <.icon name="hero-face-smile-solid" class="w-5 h-5 shrink-0" />
        </.button>
      </div>
    </:content>
  </.card_horizontal>
  """

  @base_classes "@container min-w-[200px] w-full h-full"
  defp base_classes, do: @base_classes

  @base_inner_classes "overflow-hidden drop-shadow-md @[425px]:drop-shadow-lg @[625px]:drop-shadow-xl @[850px]:drop-shadow-2xl rounded-xl w-auto h-full"
  defp base_inner_classes, do: @base_inner_classes

  @base_content_classes "grid gap-0.5 @[350px]:gap-1 @[425px]:gap-2 p-2 @[425px]:px-4 @[625px]:px-6 @[625px]:py-3 @[850px]:px-8 @[850px]:py-4"
  defp base_content_classes, do: @base_content_classes

  attr :class, :any, default: ""

  slot :header

  slot :content, required: true do
    attr :class, :string
  end

  def card(assigns) do
    ~H"""
    <div class={[base_classes() | List.wrap(@class)]}>
      <div class={base_inner_classes()}>
        <header :for={header <- @header}>
          <%= render_slot(header) %>
        </header>
        <.content_card slot={@content} />
      </div>
    </div>
    """
  end

  attr :slot, :any, required: true

  defp content_card(assigns) do
    class =
      case assigns.slot do
        [%{class: class} | _] -> class
        _ -> "bg-white"
      end

    assigns = assign(assigns, :class, class)

    ~H"""
    <div class={[base_content_classes() | List.wrap(@class)]}>
      <%= render_slot(@slot) %>
    </div>
    """
  end

  @base_horizontal_classes "@container min-w-[200px] w-full h-full"
  defp base_horizontal_classes, do: @base_horizontal_classes

  @base_horizontal_inner_classes "overflow-hidden drop-shadow-md @[425px]:drop-shadow-lg @[625px]:drop-shadow-xl @[850px]:drop-shadow-2xl rounded-xl w-full flex"
  defp base_horizontal_inner_classes, do: @base_horizontal_inner_classes

  @base_horizontal_content_classes "flex w-full gap-1 py-2 pl-2 @[425px]:py-4 @[425px]:pl-4 @[625px]:py-6 @[625px]:pl-6 @[850px]:py-8 @[850px]:pl-8"
  defp base_horizontal_content_classes, do: @base_horizontal_content_classes

  attr :class, :any, default: ""
  slot :inner_block, required: true
  slot :header

  slot :content do
    attr :class, :string
  end

  def card_horizontal(assigns) do
    ~H"""
    <div class={[base_horizontal_classes() | List.wrap(@class)]}>
      <div class={base_horizontal_inner_classes()}>
        <header :for={header <- @header}>
          <%= render_slot(header) %>
        </header>
        <.content_card_horizontal slot={@content} />
      </div>
    </div>
    """
  end

  attr :slot, :any, required: true

  defp content_card_horizontal(assigns) do
    class =
      case assigns.slot do
        [%{class: class} | _] -> class
        _ -> "bg-white"
      end

    assigns = assign(assigns, :class, class)

    ~H"""
    <div class={[base_horizontal_content_classes() | List.wrap(@class)]}>
      <%= render_slot(@slot) %>
    </div>
    """
  end
end
