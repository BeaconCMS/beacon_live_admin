defmodule Beacon.LiveAdmin.PageNotFound do
  @moduledoc false
  defexception [:message, plug_status: 404]
end

defmodule Beacon.LiveAdmin.PageLive do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_view
  require Logger
  alias Beacon.LiveAdmin.Cluster
  alias Beacon.LiveAdmin.PageBuilder.Menu
  alias Beacon.LiveAdmin.PageBuilder.Page
  alias Beacon.LiveAdmin.PageBuilder.Table
  alias Beacon.LiveAdmin.Private
  alias Phoenix.LiveView.Socket

  @impl true
  def mount(%{"site" => site} = params, session, socket) do
    site = String.to_existing_atom(site)

    if connected?(socket) do
      # TODO: pubsub cluster
      # TODO: nodedow -> notify/alert user
    end

    Cluster.maybe_discover_sites()

    sites = Beacon.LiveAdmin.Cluster.running_sites()

    %{"pages" => pages} = session

    current_url =
      Map.get(session, "beacon_live_admin_page_url") ||
        raise """
        failed to resolve Beacon.LiveAdmin page URL

        You must add Beacon.LiveAdmin.Plug to the :browser pipeline that beacon_live_admin is piped through.
        """

    page = lookup_page!(socket, current_url)

    socket =
      socket
      |> assign(
        __beacon_sites__: sites,
        __beacon_pages__: pages,
        __beacon_menu__: %Menu{},
        beacon_page: %Page{}
      )
      |> Private.build_on_mount_lifecycle(page.module)

    update_page = fn socket, site, page, params ->
      update_page(socket,
        site: site,
        path: page.path,
        module: page.module,
        params: params,
        table: page.module.__beacon_page_table__()
      )
    end

    with {:cont, socket} <- Private.mount(params, session, socket),
         %Socket{redirected: nil} = socket <- update_page.(socket, site, page, params),
         %Socket{redirected: nil} = socket <- assign_menu_links(socket, pages) do
      maybe_apply_module(socket, :mount, [params, page.session], &{:ok, &1})
    else
      %Socket{} = redirected_socket ->
        {:ok, redirected_socket}

      {:halt, socket} ->
        {:ok, socket}
    end
  end

  @impl true
  def handle_params(params, url, socket) do
    %{__beacon_pages__: pages} = socket.assigns
    page = lookup_page!(socket, url)

    with %Socket{redirected: nil} = socket <-
           update_page(socket, path: page.path, module: page.module, params: params),
         %Socket{redirected: nil} = socket <- assign_menu_links(socket, pages) do
      maybe_apply_module(socket, :handle_params, [params, url], &{:noreply, &1})
    else
      %Socket{} = redirected_socket ->
        {:noreply, redirected_socket}
    end
  end

  @impl true
  def handle_event("beacon:table-search", %{"search" => %{"query" => query}}, socket) do
    to =
      beacon_live_admin_path(
        socket,
        socket.assigns.beacon_page.site,
        socket.assigns.beacon_page.path,
        Table.query_params(socket.assigns.beacon_page.table, page: 1, query: query)
      )

    {:noreply, push_patch(socket, to: to)}
  end

  def handle_event("beacon:table-sort", %{"sort" => %{"sort_by" => sort_by}}, socket) do
    to =
      beacon_live_admin_path(
        socket,
        socket.assigns.beacon_page.site,
        socket.assigns.beacon_page.path,
        Table.query_params(socket.assigns.beacon_page.table, sort_by: sort_by)
      )

    {:noreply, push_patch(socket, to: to)}
  end

  def handle_event(event, params, socket) do
    maybe_apply_module(socket, :handle_event, [event, params], &{:noreply, &1})
  end

  @impl true
  def handle_info(msg, socket) do
    maybe_apply_module(socket, :handle_info, [msg], &{:noreply, &1})
  end

  defp lookup_page!(socket, url) do
    %URI{host: host, path: path} = URI.parse(url)

    case Phoenix.Router.route_info(socket.router, "GET", path, host) do
      %{beacon: %{"page" => page}} ->
        page

      _ ->
        msg = """
        failed to find a page for URL #{url}
        """

        # TODO: custom exception 404
        raise msg
    end
  end

  # TODO subpath /pages/:id -> Pages menu
  defp assign_menu_links(socket, pages) do
    ["", current_prefix | _] = String.split(socket.assigns.beacon_page.path, "/")
    current_prefix = "/" <> current_prefix

    links =
      pages
      |> Enum.reduce(%{}, fn {path, module, live_action, _session}, acc ->
        ["", prefix | _] = String.split(path, "/")
        prefix = "/" <> prefix

        current? = prefix == current_prefix

        menu_link =
          case module.menu_link(prefix, live_action) do
            {state, anchor} -> {state, anchor, nil}
            menu_link -> menu_link
          end

        case {current?, menu_link} do
          {true, {:root, anchor, icon}} ->
            value = {:current, anchor, icon}
            Map.update(acc, prefix, value, fn _ -> value end)

          {true, {:submenu, anchor, icon}} ->
            value = {:current, anchor, icon}
            Map.update(acc, prefix, value, fn _ -> value end)

          {false, {:root, anchor, icon}} ->
            value = {:enabled, anchor, icon}
            Map.update(acc, prefix, value, fn _ -> value end)

          _ ->
            acc
        end
      end)
      |> Enum.sort(fn {a, _}, {b, _} ->
        case {a, b} do
          {"/layouts", _} -> true
          {_, "/layouts"} -> false
          {"/components", _} -> true
          {_, "/components"} -> false
          {"/pages", _} -> true
          {_, "/pages"} -> false
          {"/error_pages", _} -> true
          {_, "/error_pages"} -> false
          {"/media_library", _} -> true
          {_, "/media_library"} -> false
          {a, b} -> a <= b
        end
      end)
      |> Enum.map(fn {prefix, {state, anchor, icon}} -> {state, anchor, icon, prefix} end)

    update_menu(socket, links: links)
  end

  defp maybe_apply_module(socket, fun, params, default) do
    mod = socket.assigns.beacon_page.module

    if exported?(mod, fun, length(params) + 1) do
      Logger.debug("""
      Applying #{fun} in #{mod}
      Parameters: #{inspect(params)}
      """)

      apply(mod, fun, params ++ [socket])
    else
      Logger.debug("""
      Module/Function not exported: #{inspect(mod)}/#{inspect(fun)}
      Parameters: #{inspect(params)}
      """)

      default.(socket)
    end
  end

  # https://github.com/phoenixframework/phoenix_live_view/blob/8fedc6927fd937fe381553715e723754b3596a97/lib/phoenix_live_view/channel.ex#L435-L437
  defp exported?(m, f, a) do
    function_exported?(m, f, a) || (Code.ensure_loaded?(m) && function_exported?(m, f, a))
  end

  defp update_page(socket, assigns) do
    update(socket, :beacon_page, fn page ->
      Enum.reduce(assigns, page, fn {key, value}, page ->
        Map.replace!(page, key, value)
      end)
    end)
  end

  defp update_menu(socket, assigns) do
    update(socket, :__beacon_menu__, fn menu ->
      Enum.reduce(assigns, menu, fn {key, value}, menu ->
        Map.replace!(menu, key, value)
      end)
    end)
  end

  defp render_page(module, assigns) do
    module.render(assigns)
  end

  ## Navbar handling

  defp maybe_link(socket, page, {:current, text, icon, path}) do
    path = Beacon.LiveAdmin.Router.beacon_live_admin_path(socket, page.site, path)
    assigns = %{text: text, icon: icon, path: path}

    # force redirect to re-execute plug to fecth current url
    ~H"""
    <.link
      href={@path}
      class="w-full transition-colors outline-none active:text-blue-700 focus-visible:[&:not(:active)]:ring-2 @[350px]:focus-visible:[&:not(:active)]:ring-4 focus-visible:ring-purple-500 hover:bg-slate-100 flex rounded items-center justify-center @[180px]:justify-start gap-0 @[180px]:gap-1.5 @[240px]:gap-2  @[300px]:gap-2.5 px-[22px] py-3.5 @[180px]:p-3 @[240px]:py-3.5 @[240px]:px-3 @[350px]:py-4 antialiased font-semibold text-base @[240px]:text-lg  @[300px]:text-xl @[350px]:text-2xl text-slate-800"
    >
      <span :if={@icon} aria-hidden="true" class={@icon <> " aspect-square h-7 @[180px]:h-4.5 w-7 @[180px]:w-4.5 @[350px]:h-7 @[350px]:w-7"}></span>
      <div class="hidden font-semibold @[180px]:block line-clamp-1"><%= @text %></div>
    </.link>
    """
  end

  defp maybe_link(socket, page, {:enabled, text, icon, path}) do
    path = Beacon.LiveAdmin.Router.beacon_live_admin_path(socket, page.site, path)
    assigns = %{text: text, icon: icon, path: path}

    # force redirect to re-execute plug to fecth current url
    ~H"""
    <.link
      href={@path}
      class="w-full transition-colors outline-none active:text-blue-700 focus-visible:[&:not(:active)]:ring-2 @[350px]:focus-visible:[&:not(:active)]:ring-4 focus-visible:ring-purple-500 hover:bg-slate-100 flex rounded items-center justify-center @[180px]:justify-start gap-0 @[180px]:gap-1.5 @[240px]:gap-2  @[300px]:gap-2.5 px-[22px] py-3.5 @[180px]:p-3 @[240px]:py-3.5 @[240px]:px-3 @[350px]:py-4 antialiased font-semibold text-base @[240px]:text-lg  @[300px]:text-xl @[350px]:text-2xl text-slate-800"
    >
      <span :if={@icon} aria-hidden="true" class={@icon <> " aspect-square h-7 @[180px]:h-4.5 w-7 @[180px]:w-4.5 @[350px]:h-7 @[350px]:w-7"}></span>
      <div class="hidden font-semibold @[180px]:block line-clamp-1"><%= @text %></div>
    </.link>
    """
  end

  defp maybe_link(_socket, _page, {:disabled, text, icon}) do
    assigns = %{text: text, icon: icon}

    ~H"""
    <span :if={@icon} aria-hidden="true" class={@icon <> " aspect-square h-7 @[180px]:h-4.5 w-7 @[180px]:w-4.5 @[350px]:h-7 @[350px]:w-7"}></span>
    <span class=""><%= @text %></span>
    """
  end
end
