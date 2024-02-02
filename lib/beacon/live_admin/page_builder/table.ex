defmodule Beacon.LiveAdmin.PageBuilder.Table do
  defstruct [:per_page, :current_page, :pages, :offset, :sort_by, :query]

  import Beacon.LiveAdmin.Router, only: [beacon_live_admin_path: 4]
  alias Beacon.LiveAdmin.PageBuilder.Page
  alias Beacon.LiveAdmin.PageBuilder.Table
  alias Phoenix.LiveView.Socket

  def build(opts) when is_list(opts) do
    per_page = Keyword.get(opts, :per_page, 20)
    sort_by = Keyword.get(opts, :sort_by) || raise ":sort_by is required in :table options"

    %__MODULE__{
      per_page: per_page,
      current_page: 1,
      pages: 0,
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
        table: %{current_page: current_page, pages: pages} = table
      }) do
    page = if current_page >= pages, do: current_page, else: current_page + 1
    query_params = query_params(table, page: page)
    beacon_live_admin_path(socket, site, path, query_params)
  end

  def goto_path(socket, %Page{site: site, path: path, table: table}, page) do
    query_params = query_params(table, page: page)
    beacon_live_admin_path(socket, site, path, query_params)
  end

  def handle_params(socket, params, count_fn) do
    %{per_page: per_page, sort_by: sort_by} = socket.assigns.beacon_page.table

    page = params |> Map.get("page", "1") |> String.to_integer()
    pages = ceil(count_fn.(socket.assigns.beacon_page) / per_page)
    offset = page * per_page - per_page
    # TODO: revisit safe_to_atom
    sort_by = params |> Map.get("sort_by", sort_by) |> Beacon.Types.Atom.safe_to_atom()
    query = Map.get(params, "query", nil)

    update(socket,
      current_page: page,
      pages: pages,
      offset: offset,
      sort_by: sort_by,
      query: query
    )
  end

  def query_params(%Table{} = table, new_params) when is_list(new_params) do
    new_params = Map.new(new_params)

    # TODO remove empty k/v
    table
    |> Map.take([:page, :sort_by, :query])
    |> Map.merge(new_params)
  end
end
