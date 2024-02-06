defmodule Beacon.LiveAdmin.PageBuilder.Table do
  @moduledoc false

  defstruct [:per_page, :current_page, :page_count, :offset, :sort_by, :query]

  import Beacon.LiveAdmin.Router, only: [beacon_live_admin_path: 4]
  alias Beacon.LiveAdmin.PageBuilder.Page
  alias Beacon.LiveAdmin.PageBuilder.Table
  alias Phoenix.LiveView.Socket

  def build(opts) when is_list(opts) do
    per_page = Keyword.get(opts, :per_page, 15)
    sort_by = Keyword.get(opts, :sort_by) || raise ":sort_by is required in :table options"

    %__MODULE__{
      per_page: per_page,
      current_page: 1,
      page_count: 0,
      offset: 0,
      sort_by: sort_by,
      query: nil
    }
  end

  def build(_opts), do: nil

  def update(%Socket{} = socket, new_table) when is_list(new_table) do
    new_table = Map.new(new_table)

    Phoenix.Component.update(socket, :beacon_page, fn page ->
      table = Map.merge(page.table, new_table)
      Map.put(page, :table, table)
    end)
  end

  def prev_path(socket, %Page{
        site: site,
        path: path,
        table: %{current_page: current_page} = table
      }) do
    page = if current_page <= 1, do: 1, else: current_page - 1
    query_params = query_params(table, page: page)
    beacon_live_admin_path(socket, site, path, query_params)
  end

  def next_path(socket, %Page{
        site: site,
        path: path,
        table: %{current_page: current_page, page_count: page_count} = table
      }) do
    page = if current_page >= page_count, do: current_page, else: current_page + 1
    query_params = query_params(table, page: page)
    beacon_live_admin_path(socket, site, path, query_params)
  end

  def goto_path(socket, %Page{site: site, path: path, table: table}, page) do
    query_params = query_params(table, page: page)
    beacon_live_admin_path(socket, site, path, query_params)
  end

  def handle_params(socket, params, count_fn) do
    %{per_page: per_page, sort_by: sort_by} = socket.assigns.beacon_page.table

    current_page = params |> Map.get("page", "1") |> String.to_integer()
    page_count = ceil(count_fn.(socket.assigns.beacon_page) / per_page)
    offset = current_page * per_page - per_page
    sort_by = params |> Map.get("sort_by", sort_by) |> safe_to_atom()
    query = Map.get(params, "query", nil)

    update(socket,
      current_page: current_page,
      page_count: page_count,
      offset: offset,
      sort_by: sort_by,
      query: query
    )
  end

  defp safe_to_atom(value) when is_atom(value), do: value
  defp safe_to_atom(value) when is_binary(value), do: String.to_existing_atom(value)

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
