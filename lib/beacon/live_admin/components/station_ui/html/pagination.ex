defmodule Beacon.LiveAdmin.StationUI.HTML.Pagination do
  @moduledoc false
  use Phoenix.Component

  @doc ~S"""
  The pagination component renders clickable numbered elements to progress through content that spans multiple pages.

  The default size for each pagination button is "md" but the size can be changed by supplying the
  `class` attribute to each slot.

  Suggested size classes:
    xl: gap-x-4 px-8 py-3 text-4xl lg:focus-visible:ring-4
    lg: gap-x-4 px-7 py-2.5 text-2xl
    md: gap-x-2 px-6 py-2 text-base
    sm: gap-x-2 px-5 py-2 text-sm
    xs: gap-x-2 px-4 py-2 text-xs

  ## Example Usage

  Example contents of a LiveView for the `~p"/posts"` route:

  ```elixir
  @impl true
  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply, assign_paginated_posts(socket, params)}
  end

  defp assign_paginated_posts(socket, params) do
    page = get_pagination_param(params, "page", 1)
    page_size = get_pagination_param(params, "page_size", 10)
    offset = (page - 1) * page_size

    socket
    |> assign(:pagination_params, %{"page" => page, "page_size" => page_size})
    |> assign(:posts, Posts.list_posts(offset: offset, limit: page_size))
    |> assign(:posts_count, Posts.count_posts())
  end

  defp get_pagination_param(params, param, default) do
    value = to_string(params[param] || default)

    case Integer.parse(value) do
      {page, _} -> max(page, 1)
      _ -> default
    end
  end
  ```

  Example usage in the rendered template:
  ```heex
  <.pagination
    link_fn={&~p"/posts?#{&1}"}
    params={@pagination_params}
    total_count={@posts_count}
  >
    <:first>
      <.icon class="h-5 w-5" name="hero-chevron-double-left-solid" />
      First
    </:first>

    <:previous>
      <.icon class="h-4 w-4" name="hero-chevron-left-solid" />

      <span class="sr-only">Prev</span>
    </:previous>

    <:page_links />

    <:next>
      <span class="sr-only">Next</span>

      <.icon class="h-4 w-4" name="hero-chevron-right-solid" />
    </:next>

    <:last>
      Last
      <.icon class="h-5 w-5" name="hero-chevron-double-right-solid" />
    </:last>
  </.pagination>
  ```
  """

  attr :class, :string, default: "inline-flex gap-x-2.5"

  attr :id, :string, default: "pagination-component", doc: "required if more than one pagination component is on a single page"

  attr :label, :string, default: "Pagination Navigation"

  attr :link_fn, :any,
    required: true,
    doc: "function that takes a single argument of pagination params and returns a url or path link"

  attr :max_pages, :integer, default: 7, doc: "maximum number of pages to show at a time"

  attr :params, :map,
    required: true,
    doc: ~s'map of the current pagination params (ex. `%{"page" => 1, "page_size" => 10}`)'

  attr :total_count, :integer,
    required: true,
    doc: "total number of records in the list being paginated"

  slot :first do
    attr :class, :string, doc: "gap-x-2 px-6 py-2 text-base"
  end

  slot :last do
    attr :class, :string, doc: "gap-x-2 px-6 py-2 text-base"
  end

  slot :next do
    attr :class, :string, doc: "gap-x-2 px-6 py-2 text-base"
  end

  slot :page_links do
    attr :class, :string, doc: "gap-x-2 px-6 py-2 text-base"
  end

  slot :previous do
    attr :class, :string, doc: "gap-x-2 px-6 py-2 text-base"
  end

  def pagination(assigns) do
    ~H"""
    <.live_component module={__MODULE__.LiveComponent} {assigns} />
    """
  end

  # Do not use directly; use `Pagination.pagination/1` component instead.
  defmodule LiveComponent do
    @moduledoc false

    use Phoenix.LiveComponent

    @impl true
    def update(assigns, socket) do
      %{"page" => current_page, "page_size" => page_size} =
        params =
        Map.merge(default_params(), cast_params(assigns.params))

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

    defp default_params, do: %{"page" => 1, "page_size" => 10}

    defp item_classes(slot) do
      [slot[:class] || item_default_classes(), item_base_classes()]
    end

    defp item_default_classes, do: "gap-x-2 px-6 py-2 text-base"

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
end
