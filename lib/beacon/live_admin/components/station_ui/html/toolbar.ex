defmodule Beacon.LiveAdmin.StationUI.HTML.Toolbar do
  use Phoenix.Component

  import Beacon.LiveAdmin.StationUI.HTML.Icon, only: [icon: 1]
  import Beacon.LiveAdmin.StationUI.HTML.Button

  @doc """
  Sets up Toolbar component.  The Toolbar includes default and vertical variants

  ## Default Toolbar Example

    <.toolbar>
      <:toolbar_item icon_name="hero-face-smile-solid" text="Label" />
      ...
    </.toolbar>

  ## Default Toolbar w/o border Example

    <.toolbar class="border-0">
      <:toolbar_item icon_name="hero-face-smile-solid" text="Label" />
      ...
    </.toolbar>

  ## Vertical Toolbar Example

    <.toolbar_vertical image_src={~p"/images/narwin_logo.png"} alt_name="brand logo">
      <:toolbar_item icon_name="hero-face-smile" text="Label" />
      ...
    </.toolbar_vertical>

  ## Suggested size classes:

    Because of the nested <.button> and <.icon> components, the Toolbar's parent
    container will handle the bulk of styling. We can use the parent to modify the size
    of the nested elements.

    ### Default Toolbar Sizes:

    We can use the arbitrary class [&_span] to target
    the icon styles.

    xl: text-base [&_span]:size-12
    lg: text-sm [&_span]:size-[38px]
    sm: text-xs [&_span]:size-6

    ### Example

    <.toolbar class="text-base [&_span]:size-12">
      ...
    </.toolbar>

    ### Default Vertical Toolbar Sizes:

    We can use the arbitrary selectors [&_div] to target the logo size &
    [&_span] to target the icon styles.

    xl: [&_div]:size-[72px] [&_span]:size-7
    lg: [&_div]:size-[62px] [&_span]:size-4.5
    sm: [&_div]:size-11 [&_span]:size-3.5

    ### Example

    <.toolbar_vertical ... class="[&_div]:size-[72px] [&_span]:size-7">
      ...
    </.toolbar_vertical>
  """

  @toolbar_base_classes "px-3.5 pt-1.5 pb-1 w-fit border-[--sui-brand-primary-border] font-bold text-[--sui-brand-primary-text] [&_ul]:flex [&_ul]:gap-x-3 [&_ul]:items-center"

  def toolbar_base_classes, do: @toolbar_base_classes

  slot :toolbar_item, required: true do
    attr :class, :string
    attr :icon_name, :string
    attr :text, :string, required: true
  end

  attr :class, :string, default: "border text-sm [&_span]:size-8"
  attr :rest, :global

  def toolbar(assigns) do
    ~H"""
    <nav class={[toolbar_base_classes() | List.wrap(@class)]} {@rest}>
      <ul>
        <li :for={item <- @toolbar_item} class={["#{Map.get(item, :class, "")}"]}>
          <.button class="sui-secondary min-h-11 flex-col border-0 bg-transparent [&]:px-3.5 [&]:py-2">
            <.icon name={item[:icon_name]} />
            <%= item[:text] %>
          </.button>
        </li>
      </ul>
    </nav>
    """
  end

  @toolbar_vertical_base_classes "h-screen h-dvh w-fit px-3.5 pt-4 flex flex-col items-center gap-y-2 shadow-xl [:where(&_div)]:size-[54px] [&_ul]:space-y-1.5 [&_span]:size-4.5"

  def toolbar_vertical_base_classes, do: @toolbar_vertical_base_classes

  slot :toolbar_item, required: true do
    attr :class, :string
    attr :icon_name, :string
    attr :text, :string, required: true
  end

  attr :class, :string, default: nil
  attr(:alt_name, :string, required: true)
  attr(:image_src, :string, default: "")
  attr :rest, :global

  def toolbar_vertical(assigns) do
    ~H"""
    <nav class={[toolbar_vertical_base_classes() | List.wrap(@class)]} {@rest}>
      <div>
        <img class="size-full" src={@image_src} alt={@alt_name || ""} />
      </div>
      <ul>
        <li :for={item <- @toolbar_item} class={["#{Map.get(item, :class, "")}"]}>
          <.button class="sui-secondary min-h-11 flex-col border-0 bg-transparent">
            <.icon name={item[:icon_name]} />
            <span class="sr-only"><%= item[:text] %></span>
          </.button>
        </li>
      </ul>
    </nav>
    """
  end
end
