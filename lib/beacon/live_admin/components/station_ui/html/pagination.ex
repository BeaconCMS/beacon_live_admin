defmodule Beacon.LiveAdmin.StationUI.HTML.Pagination do
  @moduledoc """
  The pagination component renders clickable numbered elements to progress through content that spans multiple pages.


  The default size for each pagination button is "md" but the size can be changed by supplying the
  `class` attribute to each slot.

  Suggested size classes:
    xl: gap-x-4 px-8 py-3 text-4xl lg:focus-visible:ring-4
    lg: gap-x-4 px-7 py-2.5 text-2xl
    sm: gap-x-2 px-5 py-2 text-sm
    xs: gap-x-2 px-4 py-2 text-xs
  """

  use Phoenix.LiveComponent

  @default_params %{"page" => 1, "page_size" => 10}

  @item_default_classes "gap-x-2 px-6 py-2 text-base"

  attr :class, :string, default: "inline-flex gap-x-2.5"

  attr :id, :string, default: "pagination-component", doc: "required if more than one pagination component is on a single page"

  attr :label, :string, default: "Pagination Navigation"

  attr :link_fn, :any,
    required: true,
    doc: "function that takes a single argument of pagination params and returns a url or path link"

  attr :max_pages, :integer, default: 7, doc: "maximum number of pages to show at a time"

  attr :params, :map,
    default: @default_params,
    doc: "map of the current pagination params (page, page_size)"

  attr :total_count, :integer,
    default: 0,
    doc: "total number of records in the list being paginated"

  slot :first do
    attr :class, :string, doc: @item_default_classes
  end

  slot :last do
    attr :class, :string, doc: @item_default_classes
  end

  slot :next do
    attr :class, :string, doc: @item_default_classes
  end

  slot :page_links do
    attr :class, :string, doc: @item_default_classes
  end

  slot :previous do
    attr :class, :string, doc: @item_default_classes
  end

  def pagination(assigns) do
    ~H"""
    <.live_component module={__MODULE__} {assigns} />
    """
  end

  @impl true
  def update(assigns, socket) do
    %{"page" => current_page, "page_size" => page_size} =
      params =
      Map.merge(@default_params, cast_params(assigns.params))

    total_page_count = (assigns.total_count / page_size) |> ceil() |> max(1)

    {:ok,
     socket
     |> assign(assigns)
     |> assign(:current_page, current_page)
     |> assign(:params, params)
     |> assign(:total_page_count, total_page_count)
     |> assign_range()}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <nav class={@class} aria-label={@label} role="navigation">
      <.link :for={first_slot <- @first} patch={link_to_page(@params, 1, @link_fn)} class={item_classes(first_slot)} aria-disabled={@current_page == 1 && "true"} tabindex={@current_page == 1 && "-1"}>
        <%= if first_slot.inner_block, do: render_slot(first_slot), else: "First" %>
      </.link>

      <.link
        :for={previous_slot <- @previous}
        patch={link_to_page(@params, max(@current_page - 1, 1), @link_fn)}
        class={item_classes(previous_slot)}
        aria-disabled={@current_page == 1 && "true"}
        tabindex={@current_page == 1 && "-1"}
      >
        <%= if previous_slot.inner_block, do: render_slot(previous_slot), else: "Prev" %>
      </.link>

      <%= for page_link_slot <- @page_links, page <- @range_start..@range_end//1 do %>
        <%= cond do %>
          <% page == @range_start and page != 1 -> %>
            <button phx-click="update-pages-range" phx-value-range-start={page - @max_pages + 2} phx-target={@myself} class={item_classes(page_link_slot)}>
              ...
            </button>
          <% page == @range_end and page != @total_page_count -> %>
            <button phx-click="update-pages-range" phx-value-range-start={page - 1} phx-target={@myself} class={item_classes(page_link_slot)}>
              ...
            </button>
          <% true -> %>
            <.link patch={link_to_page(@params, page, @link_fn)} class={item_classes(page_link_slot)} aria-current={@current_page == page && "page"}>
              <%= if page_link_slot.inner_block, do: render_slot(page_link_slot, page), else: to_string(page) %>
            </.link>
        <% end %>
      <% end %>

      <.link
        :for={next_slot <- @next}
        patch={link_to_page(@params, min(@current_page + 1, @total_page_count), @link_fn)}
        class={item_classes(next_slot)}
        aria-disabled={@current_page == @total_page_count && "true"}
        tabindex={@current_page == @total_page_count && "-1"}
      >
        <%= if next_slot.inner_block, do: render_slot(next_slot), else: "Next" %>
      </.link>

      <.link
        :for={last_slot <- @last}
        patch={link_to_page(@params, @total_page_count, @link_fn)}
        class={item_classes(last_slot)}
        aria-disabled={@current_page == @total_page_count && "true"}
        tabindex={@current_page == @total_page_count && "-1"}
      >
        <%= if last_slot.inner_block, do: render_slot(last_slot), else: "Last" %>
      </.link>
    </nav>
    """
  end

  @impl true
  def handle_event("update-pages-range", %{"range-start" => range_start}, socket) do
    socket =
      case Integer.parse(range_start) do
        {parsed_range_start, _} -> assign_range(socket, parsed_range_start)
        _ -> socket
      end

    {:noreply, socket}
  end

  defp assign_range(socket) do
    %{current_page: current_page, max_pages: max_pages} = socket.assigns

    assign_range(socket, current_page - ceil(max_pages / 2) + 1)
  end

  defp assign_range(socket, range_start) do
    %{max_pages: max_pages, total_page_count: total_page_count} = socket.assigns

    range_start = max(range_start, 1)
    range_end = min(range_start + max_pages - 1, total_page_count)
    range_start = max(range_end - max_pages + 1, 1)

    socket
    |> assign(:range_start, range_start)
    |> assign(:range_end, range_end)
  end

  defp cast_params(params) do
    Map.new(params, fn {original_key, original_value} ->
      updated_key = to_string(original_key)

      updated_value =
        original_value
        |> to_string()
        |> String.to_integer()
        |> max(1)

      {updated_key, updated_value}
    end)
  end

  defp item_classes(slot) do
    [slot[:class] || item_default_classes(), item_base_classes()]
  end

  defp item_default_classes, do: @item_default_classes

  defp item_base_classes do
    ~w"
      inline-flex
      items-center
      justify-center
      rounded-md
      font-bold
      aria-[current=page]:bg-[--sui-brand-primary-bg]
      aria-[current=page]:text-[--sui-brand-primary-text-inverted]
      hover:aria-[current=page]:bg-[--sui-brand-primary-muted]
      aria-disabled:pointer-events-none
      aria-disabled:bg-[--sui-brand-primary-bg-disabled]
      aria-disabled:text-[--sui-brand-primary-text-disabled]
      aria-disabled:outline-none
      focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-[--sui-brand-primary-focus]
      focus-visible:ring-offset-4
    "
  end

  defp link_to_page(params, page, link_fn) do
    params
    |> Map.put("page", page)
    |> link_fn.()
  end
end
