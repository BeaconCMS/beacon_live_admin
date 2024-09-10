defmodule Beacon.LiveAdmin.PageBuilder.Table do
  @moduledoc """
  Represents a Table in the LiveAdmin UI, with pagination, filtering, and sorting.
  """

  defstruct [:per_page, :current_page, :page_count, :sort_by, :query]

  @type t :: %__MODULE__{
          per_page: integer(),
          current_page: integer(),
          page_count: integer(),
          sort_by: atom(),
          query: String.t()
        }

  import Beacon.LiveAdmin.Router, only: [beacon_live_admin_path: 4]

  alias Beacon.LiveAdmin.PageBuilder.Page
  alias Beacon.LiveAdmin.PageBuilder.Table
  alias Phoenix.LiveView.Socket

  @doc """
  Initializes a new `Table` struct.

  ## Options

    * `sort_by` - (required) the field on which to sort the table contents
    * `per_page` - the number of items to display per page (defaults to 15)

  """
  @spec build(keyword()) :: Table.t()
  @spec build(term()) :: nil
  def build(opts) when is_list(opts) do
    per_page = Keyword.get(opts, :per_page, 15)
    sort_by = Keyword.get(opts, :sort_by) || raise ":sort_by is required in :table options"

    %__MODULE__{
      per_page: per_page,
      current_page: 1,
      page_count: 0,
      sort_by: sort_by,
      query: nil
    }
  end

  def build(_opts), do: nil

  @doc """
  Pushes updated Table data to the websocket.

  The Beacon Page containing the table will be automatically updated
  """
  @spec update(Socket.t(), keyword()) :: Socket.t()
  def update(%Socket{} = socket, new_table) when is_list(new_table) do
    new_table = Map.new(new_table)

    Phoenix.Component.update(socket, :beacon_page, fn page ->
      table = Map.merge(page.table, new_table)
      Map.put(page, :table, table)
    end)
  end

  @doc """
  Generates a path for the previous page of a paginated table.

  ## Usage

  ```
  <.link patch={Table.prev_path(@socket, @page)}>
  ```
  """
  @spec prev_path(Socket.t(), Page.t()) :: String.t()
  def prev_path(socket, %Page{
        site: site,
        path: path,
        table: %{current_page: current_page} = table
      }) do
    page = if current_page <= 1, do: 1, else: current_page - 1
    query_params = query_params(table, page: page)
    beacon_live_admin_path(socket, site, path, query_params)
  end

  @doc """
  Generates a path for the next page of a paginated table.

  ## Usage

  ```
  <.link patch={Table.next_path(@socket, @page)}>
  ```
  """
  @spec next_path(Socket.t(), Page.t()) :: String.t()
  def next_path(socket, %Page{
        site: site,
        path: path,
        table: %{current_page: current_page, page_count: page_count} = table
      }) do
    page = if current_page >= page_count, do: current_page, else: current_page + 1
    query_params = query_params(table, page: page)
    beacon_live_admin_path(socket, site, path, query_params)
  end

  @doc """
  Generates a path to navigate from the current page to another given page.

  If the current and goto pages are the same, it will still append table params to the path.

  ## Usage

  ```
  <.link patch={Table.goto_path(@socket, @page)}>
  ```
  """
  @spec goto_path(Socket.t(), Page.t(), Page.t()) :: String.t()
  def goto_path(socket, %Page{site: site, path: path, table: table}, page) do
    query_params = query_params(table, page: page)
    beacon_live_admin_path(socket, site, path, query_params)
  end

  @doc """
  Updates the current page based on incoming params and a `count_fn` which returns the number of
  items which have already been seen.

  Can be called as a helper inside a `Beacon.LiveAdmin.PageBuilder.handle_params/3` callback when
  updating params for a Table.
  """
  @spec handle_params(Socket.t(), map(), (Page.t() -> integer())) :: Socket.t()
  def handle_params(socket, params, count_fn)

  def handle_params(%{assigns: %{beacon_page: %{table: %{per_page: per_page, sort_by: sort_by}}}} = socket, params, count_fn) do
    current_page = params |> Map.get("page", "1") |> String.to_integer()
    page_count = ceil(count_fn.(socket.assigns.beacon_page) / per_page)
    sort_by = params |> Map.get("sort_by", sort_by) |> safe_to_atom()
    query = Map.get(params, "query", nil)

    update(socket,
      current_page: current_page,
      page_count: page_count,
      sort_by: sort_by,
      query: query
    )
  end

  def handle_params(socket, _params, _count_fn), do: socket

  defp safe_to_atom(value) when is_atom(value), do: value
  defp safe_to_atom(value) when is_binary(value), do: String.to_existing_atom(value)

  @doc """
  Creates a list of query params based on the existing params in a given `table` and a new set of incoming params.

  The existing and incoming params will be merged, with precedence for the latter (incoming will overwrite existing).
  """
  @spec query_params(Table.t(), keyword()) :: map()
  def query_params(%Table{} = table, new_params) when is_list(new_params) do
    new_params = Map.new(new_params)

    table
    |> Map.take([:page, :sort_by, :query])
    |> Map.merge(new_params)
    |> Map.reject(fn {_k, v} -> v == "" or is_nil(v) end)
  end

  @doc false
  def nav_pages(_current_page, 0 = _page_count, _limit), do: []

  def nav_pages(_current_page, page_count, limit) when page_count <= limit do
    :lists.seq(1, page_count, 1)
  end

  def nav_pages(current_page, page_count, limit) do
    current_page
    |> middle(page_count, limit - 2)
    |> head()
    |> tail(page_count)
  end

  defp middle(current_page, page_count, limit) do
    # how many pages it needs to distribute between current_page
    bounds = (limit - 1) / 2

    # move current_page cursor to not cross start/end boundaries
    current_page =
      cond do
        current_page <= 3 ->
          max(ceil(bounds) + 1, 3)

        current_page - 1 <= floor(bounds) ->
          current_page + 1

        current_page + ceil(bounds) >= page_count ->
          gap = page_count - current_page
          offset = limit - ceil(bounds) - gap
          current_page - offset

        :else ->
          current_page
      end

    # distribute pages around current_page
    lower_bound = current_page - floor(bounds)
    upper_bound = current_page + ceil(bounds)

    :lists.seq(lower_bound, upper_bound, 1)
  end

  defp head(middle) do
    gap = List.first(middle) - 1

    cond do
      gap == 0 -> middle
      gap == 1 -> [1] ++ middle
      :else -> [1, :sep] ++ middle
    end
  end

  defp tail(middle, page_count) do
    gap = page_count - List.last(middle)

    cond do
      gap == 0 -> middle
      gap == 1 -> middle ++ [page_count]
      :else -> middle ++ [:sep, page_count]
    end
  end
end
