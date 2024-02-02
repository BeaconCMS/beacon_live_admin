defmodule Beacon.LiveAdmin.PageBuilder.Table do
  defstruct [:per_page, :page, :pages, :offset, :sort, :query]

  import Beacon.LiveAdmin.Router, only: [beacon_live_admin_path: 4]
  alias Beacon.LiveAdmin.PageBuilder.Page
  alias Beacon.LiveAdmin.PageBuilder.Table
  alias Phoenix.LiveView.Socket

  def build(opts) when is_list(opts) do
    per_page = Keyword.get(opts, :per_page, 20)
    sort = Keyword.get(opts, :sort) || raise ":sort is required in :table options"

    %__MODULE__{per_page: per_page, page: 1, pages: 0, offset: 0, sort: sort, query: nil}
  end

  def build(_opts), do: nil

  def update(%Socket{} = socket, new_table) when is_list(new_table) do
    new_table = Map.new(new_table)

    Phoenix.Component.update(socket, :beacon_page, fn page ->
      table = Map.merge(page.table, new_table)
      Map.put(page, :table, table)
    end)
  end

  def prev_path(socket, %Page{site: site, path: path, table: %{page: page} = table}) do
    page = if page <= 1, do: 1, else: page - 1
    query_params = query_params(table, page: page)
    beacon_live_admin_path(socket, site, path, query_params)
  end

  def next_path(socket, %Page{site: site, path: path, table: %{page: page, pages: pages} = table}) do
    page = if page >= pages, do: page, else: page + 1
    query_params = query_params(table, page: page)
    beacon_live_admin_path(socket, site, path, query_params)
  end

  def goto_path(socket, %Page{site: site, path: path, table: table}, page) do
    query_params = query_params(table, page: page)
    beacon_live_admin_path(socket, site, path, query_params)
  end

  def handle_params(socket, params, count_fn) do
    %{per_page: per_page, sort: sort} = socket.assigns.beacon_page.table

    page = params |> Map.get("page", "1") |> String.to_integer()
    pages = ceil(count_fn.(socket.assigns.beacon_page) / per_page)
    offset = page * per_page - per_page
    # TODO: revisit safe_to_atom
    sort = params |> Map.get("sort", sort) |> Beacon.Types.Atom.safe_to_atom()
    query = Map.get(params, "query", nil)

    update(socket, page: page, pages: pages, offset: offset, sort: sort, query: query)
  end

  def query_params(%Table{} = table, new_params) when is_list(new_params) do
    new_params = Map.new(new_params)

    # TODO remove empty k/v
    table
    |> Map.take([:page, :sort, :query])
    |> Map.merge(new_params)
  end
end
