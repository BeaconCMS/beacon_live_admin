defmodule Beacon.LiveAdmin.StationUI.HTML.Avatar do
  @moduledoc false
  use Phoenix.Component

  import Beacon.LiveAdmin.StationUI.HTML.StatusBadge, only: [status_badge: 1]

  # The avatar component renders initials, an SVG, or an image thumbnail to represent a user.
  # Avatars can be displayed as single items or combined into a horizontal stack.

  # ## Stack Example

  #   <.avatar_stack overflow_link={~p"/avatars/link"} display_max={2}>
  #     <:avatar>
  #       <.avatar .../>
  #     </:avatar>
  #     <:avatar>
  #       <.avatar .../>
  #     </:avatar>
  #     <:avatar>
  #       <.avatar .../>
  #     </:avatar>
  #     <:avatar>
  #       <.avatar .../>
  #     </:avatar>
  #   <.avatar_stack>

  @stack_base_classes [
    "flex items-start [&_div]:flex [&_div]:flex-row-reverse",
    "[&>a]:z-20 [&>a]:hover:z-40 [&_div_a_figure]:z-10",
    "[&_div_a]:hover:z-30 [&_a:focus-visible]:z-50 [&_a]:active:z-50 [&_a:hover_figure]:ml-0 [&_a:focus-visible_figure]:ml-0"
  ]

  def stack_base_classes, do: @stack_base_classes

  attr(:class, :any, default: "[&_div]:ml-1.5 [&_div_figure]:-ml-3.5")
  attr(:display_max, :integer, default: 3)
  attr(:total_count, :integer, default: nil)
  attr(:overflow_link, :string, required: true)

  slot(:avatar)

  def avatar_stack(assigns) do
    assigns =
      assigns
      |> assign(:total_count, assigns.total_count || length(assigns.avatar))

    ~H"""
    <div class={[stack_base_classes() | List.wrap(@class)]}>
      <.avatar_link :if={@total_count > @display_max} to={@overflow_link} variant="initials" class="h-[42px] w-[42px] border-[--sui-brand-primary-border]">
        <:initials count={true}>+<%= @total_count - @display_max %></:initials>
      </.avatar_link>

      <div>
        <%= for {avatar, i} <- Enum.with_index(@avatar), i < @display_max do %>
          <%= render_slot(avatar) %>
        <% end %>
      </div>
    </div>
    """
  end

  @doc """
  An avatar that links somewhere.

  ## Example

      <.avatar_link to={~p"/some/link"} variant="placeholder" />

  """
  @link_base_classes "rounded-full outline-none transition hover:ring-2 hover:ring-[--sui-brand-primary-muted] focus-visible:ring-[--sui-brand-primary-focus] focus-visible:ring-offset-4 active:ring-[--sui-brand-primary]"

  def link_base_classes, do: @link_base_classes

  attr(:status, :string, values: ~w[active inactive deactivated pending])
  attr(:variant, :string, values: ~w[image initials placeholder])
  attr(:index, :integer)
  attr(:name, :string, default: nil)
  attr(:image_src, :string, default: nil)
  attr(:to, :string, required: true)
  attr(:link_class, :any, default: "focus-visible:ring-2 active:ring-1")
  attr(:class, :any, default: nil)

  # These are all passed through.
  slot :initials do
    attr(:count, :boolean)
  end

  slot(:placeholder)

  def avatar_link(assigns) do
    assigns =
      case assigns do
        %{class: nil} = assigns -> Map.drop(assigns, [:class])
        assigns -> assigns
      end

    ~H"""
    <a href={@to} class={[link_base_classes() | List.wrap(@link_class)]}>
      <.avatar {Map.drop(assigns, [:link_class])} />
    </a>
    """
  end

  @doc """
  A single avatar

  ## Examples

  Avatar with initials, a border, and an active status icon:

      <.avatar variant="initials" status="active" class="h-[42px] w-[42px] border-[--sui-brand-primary]" />

  Avatar with placeholder image with a pending status icon:

      <.avatar variant="placeholder" status="pending" />

  Suggested classes for various sizes:
    - xs -> "h-6 w-6 [&_svg]:w-3 text-xs"
    - sm -> "h-8 w-8 [&_svg]:w-4 text-sm"
    - md -> "h-[42px] w-[42px] [&_svg]:w-[21px]" (default)
    - lg -> "h-[52px] w-[52px] [&_svg]:w-[26px] text-lg"
    - xl -> "h-16 w-16 [&_svg]:w-8 text-lg"

  """
  @figure_base_classes "relative flex items-center justify-center border rounded-full bg-slate-50 transition-all duration-200 font-sans font-medium uppercase text-[--sui-brand-primary]"

  def figure_base_classes, do: @figure_base_classes

  attr(:status, :string, values: ~w[active inactive deactivated pending])
  attr(:variant, :string, values: ~w[image initials placeholder])
  attr(:index, :integer)
  attr(:name, :string, default: nil)
  attr(:image_src, :string, default: "")
  attr(:class, :any, default: "h-[42px] w-[42px] [&_svg]:w-[21px] border-transparent")

  slot :initials do
    attr(:count, :boolean)
  end

  # We may have to deal with applying styles to placeholders?
  slot(:placeholder)

  def avatar(%{variant: "image"} = assigns) do
    ~H"""
    <figure class={[figure_base_classes() | List.wrap(@class)]}>
      <img class="h-full w-full rounded-full object-cover" src={@image_src} alt={@name || ""} />
      <.avatar_status_badge :if={assigns[:status]} status={@status} />
    </figure>
    """
  end

  def avatar(%{variant: "initials"} = assigns) do
    ~H"""
    <figure class={[figure_base_classes(), @class]}>
      <figcaption>
        <span aria-hidden="true">
          <%= render_slot(@initials) || initials_from_name(@name || "") %>
        </span>
        <span :for={initials <- @initials} :if={initials[:count]} class="sr-only">
          <%= render_slot(@initials) %>
        </span>
        <span :if={@name} class="sr-only"><%= @name %></span>
      </figcaption>
      <.avatar_status_badge :if={assigns[:status]} status={@status} />
    </figure>
    """
  end

  def avatar(%{variant: "placeholder"} = assigns) do
    ~H"""
    <figure class={[figure_base_classes(), @class]}>
      <%= render_slot(@placeholder) || default_avatar_placeholder_icon(assigns) %>
      <.avatar_status_badge :if={assigns[:status]} status={@status} />
    </figure>
    """
  end

  defp initials_from_name(name) do
    String.split(name) |> Enum.map_join(&String.first/1)
  end

  @doc """
  The default placeholder icon for a placeholder variant of an avatar.
  """
  attr(:name, :string, default: nil)

  def default_avatar_placeholder_icon(assigns) do
    ~H"""
    <svg class="h-auto self-end" role="img" width="32" height="52" viewBox="0 0 32 52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label={@name || "Avatar Image"}>
      <title :if={@name}><%= @name %></title>
      <circle class="fill-gray-300" cx="16" cy="16" r="16" />
      <path class="fill-gray-400" opacity="0.6" d="M16 0C7.16344 0 0 7.16344 0 16C4 16 6 14 8 12C11.2 20 30 20 32 16C32 7.16344 24.8366 0 16 0Z" />
      <path
        class="fill-gray-300"
        d="M0.00195312 47.7202C0.151367 39.0127 7.25684 32 16 32C24.7432 32 31.8486 39.0127 31.998 47.7202C27.292 50.4421 21.8271 52 16 52C10.1729 52 4.70801 50.4421 0.00195312 47.7202Z"
      />
      <path
        class="fill-gray-400"
        opacity="0.4"
        d="M27.9998 37.4164C25.0679 34.0949 20.7785 32 15.9998 32C14.206 32 12.4811 32.2952 10.8711 32.8397C16.3681 38.3114 24.5807 38.1707 27.9998 37.4164Z"
        fill="#A5B4FC"
      />
    </svg>
    """
  end

  @doc """
  An avatar-specific status icon.
  """
  attr(:status, :string, required: true, values: ~w[active inactive deactivated pending])
  attr(:class, :any, default: nil, doc: "additional or overriding classes")

  def avatar_status_badge(assigns) do
    ~H"""
    <.status_badge
      :if={@status}
      status={@status}
      class={[
        "absolute -right-px -bottom-px z-10 transition-opacity duration-200",
        "after:absolute after:inset-0",
        "after:h-full after:w-full after:rounded-full",
        "w-3 [&>span]:w-0.5"
      ]}
    />
    """
  end
end
