defmodule Beacon.LiveAdmin.PageLive do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_view
  require Logger
  alias Beacon.LiveAdmin.PageBuilder
  alias Phoenix.LiveView.Socket

  @impl true
  def mount(%{"site" => site} = params, %{"pages" => pages} = session, socket) do
    site = String.to_existing_atom(site)

    # if connected?(socket) do
    # TODO: pubsub cluster
    # TODO: nodedow -> notify/alert user
    # end

    sites = Beacon.LiveAdmin.Cluster.running_sites()

    current_url =
      Map.get(session, "beacon_live_admin_page_url") ||
        raise Beacon.LiveAdmin.PageNotFoundError, """
        failed to resolve Beacon.LiveAdmin page URL

        You must add Beacon.LiveAdmin.Plug to the :browser pipeline that beacon_live_admin is piped through.
        """

    page = lookup_page!(socket, current_url)

    assign_mount(socket, site, page, sites, pages, params)
  end

  def mount(_params, _session, _socket) do
    raise Beacon.LiveAdmin.PageNotFoundError, """
    failed to resolve Beacon.LiveAdmin page URL

    You must add Beacon.LiveAdmin.Plug to the :browser pipeline that beacon_live_admin is piped through.
    """
  end

  defp assign_mount(socket, site, page, sites, pages, params) do
    page = %PageBuilder.Page{
      site: site,
      path: page.path,
      module: page.module,
      table: page.module.__beacon_page_table__()
    }

    socket =
      assign(socket,
        __beacon_sites__: sites,
        __beacon_pages__: pages,
        __beacon_menu__: %PageBuilder.Menu{},
        beacon_page: page
      )

    with %Socket{redirected: nil} = socket <- assign_params(socket, params),
         %Socket{redirected: nil} = socket <- assign_menu_links(socket, pages) do
      maybe_apply_module(socket, :mount, [params, page.session], &{:ok, &1})
    else
      %Socket{} = redirected_socket -> {:ok, redirected_socket}
    end
  end

  @impl true
  def handle_params(params, url, socket) do
    page = lookup_page!(socket, url)

    with %Socket{redirected: nil} = socket <-
           update_page(socket, path: page.path, module: page.module, params: params) do
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
        PageBuilder.Table.query_params(socket.assigns.beacon_page.table, page: 1, query: query)
      )

    {:noreply, push_patch(socket, to: to)}
  end

  def handle_event("beacon:table-sort", %{"sort" => %{"sort_by" => sort_by}}, socket) do
    to =
      beacon_live_admin_path(
        socket,
        socket.assigns.beacon_page.site,
        socket.assigns.beacon_page.path,
        PageBuilder.Table.query_params(socket.assigns.beacon_page.table, sort_by: sort_by)
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

  @impl true
  def handle_call(msg, from, socket) do
    maybe_apply_module(socket, :handle_call, [msg, from], &{:noreply, &1})
  end

  defp lookup_page!(socket, url) do
    %URI{host: host, path: path} = URI.parse(url)

    case Phoenix.Router.route_info(socket.router, "GET", path, host) do
      %{beacon: %{"page" => page}} ->
        page

      _ ->
        raise Beacon.LiveAdmin.PageNotFoundError, "failed to find a Beacon.LiveAdmin page for URL #{url}"
    end
  end

  defp assign_params(socket, params) do
    update_page(socket, params: params)
  end

  @default_icons %{
    "/pages" => "hero-document-text",
    "/layouts" => "hero-rectangle-group",
    "/components" => "hero-cube",
    "/media_library" => "hero-photo",
    "/live_data" => "hero-circle-stack",
    "/events" => "hero-bolt",
    "/info_handlers" => "hero-information-circle",
    "/error_pages" => "hero-exclamation-triangle",
    "/hooks" => "hero-code-bracket",
    "/settings" => "hero-cog-6-tooth"
  }

  @menu_groups [
    {:content, "Content", ["/pages", "/layouts", "/components", "/media_library"]},
    {:data, "Data & Logic", ["/live_data", "/events", "/info_handlers"]},
    {:developer, "Developer", ["/error_pages", "/hooks", "/settings"]}
  ]

  # TODO subpath /pages/:id -> Pages menu
  defp assign_menu_links(socket, pages) do
    ["", current_prefix | _] = String.split(socket.assigns.beacon_page.path, "/")
    current_prefix = "/" <> current_prefix

    link_map =
      Enum.reduce(pages, %{}, fn {path, module, live_action, _session}, acc ->
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
            icon = icon || Map.get(@default_icons, prefix)
            value = {:current, anchor, icon}
            Map.update(acc, prefix, value, fn _ -> value end)

          {true, {:submenu, anchor, icon}} ->
            icon = icon || Map.get(@default_icons, prefix)
            value = {:current, anchor, icon}
            Map.update(acc, prefix, value, fn _ -> value end)

          {false, {:root, anchor, icon}} ->
            icon = icon || Map.get(@default_icons, prefix)
            value = {:enabled, anchor, icon}
            Map.update(acc, prefix, value, fn _ -> value end)

          _ ->
            acc
        end
      end)

    grouped_links =
      Enum.flat_map(@menu_groups, fn {_group_id, group_label, prefixes} ->
        group_items =
          Enum.flat_map(prefixes, fn prefix ->
            case Map.get(link_map, prefix) do
              {state, anchor, icon} -> [{state, anchor, icon, prefix}]
              nil -> []
            end
          end)

        case group_items do
          [] -> []
          items -> [{:group, group_label} | items]
        end
      end)

    # Append any links not in a predefined group
    known_prefixes = Enum.flat_map(@menu_groups, fn {_, _, prefixes} -> prefixes end)

    extra_links =
      link_map
      |> Enum.reject(fn {prefix, _} -> prefix in known_prefixes end)
      |> Enum.sort_by(fn {prefix, _} -> prefix end)
      |> Enum.map(fn {prefix, {state, anchor, icon}} -> {state, anchor, icon, prefix} end)

    all_links = grouped_links ++ extra_links

    update_menu(socket, links: all_links)
  end

  defp maybe_apply_module(socket, fun, params, default) do
    mod = socket.assigns.beacon_page.module
    params = params ++ [socket]

    if exported?(mod, fun, length(params)) do
      Logger.debug("calling #{Exception.format_mfa(mod, fun, params)}")
      apply(mod, fun, params)
    else
      Logger.debug("not exported #{Exception.format_mfa(mod, fun, params)}")
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

  defp maybe_link(_socket, _page, {:group, label}) do
    assigns = %{label: label}

    ~H"""
    <div class="hidden @[180px]:block pt-4 pb-1 px-2 first:pt-0">
      <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500"><%= @label %></span>
    </div>
    """
  end

  defp maybe_link(socket, page, {:current, text, icon, path}) do
    path = Beacon.LiveAdmin.Router.beacon_live_admin_path(socket, page.site, path)
    assigns = %{text: text, icon: icon, path: path}

    # use href to force redirecting to re-execute plug to fecth current url
    # more info at https://github.com/phoenixframework/phoenix_live_view/pull/2654
    ~H"""
    <.link
      href={@path}
      class="w-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex rounded-lg items-center justify-center @[180px]:justify-start gap-0 @[180px]:gap-2.5 px-3 py-2 antialiased text-sm font-medium"
    >
      <span :if={@icon} aria-hidden="true" class={@icon <> " h-[18px] w-[18px] flex-shrink-0 text-indigo-600 dark:text-indigo-400"}></span>
      <span :if={!@icon} class="hidden @[180px]:block h-[18px] w-[18px] flex-shrink-0"></span>
      <span class="hidden @[180px]:block line-clamp-1"><%= @text %></span>
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
      class="w-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 hover:bg-slate-50 dark:hover:bg-gray-800 text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-gray-100 flex rounded-lg items-center justify-center @[180px]:justify-start gap-0 @[180px]:gap-2.5 px-3 py-2 antialiased text-sm font-medium"
    >
      <span :if={@icon} aria-hidden="true" class={@icon <> " h-[18px] w-[18px] flex-shrink-0 text-slate-400 dark:text-gray-500"}></span>
      <span :if={!@icon} class="hidden @[180px]:block h-[18px] w-[18px] flex-shrink-0"></span>
      <span class="hidden @[180px]:block line-clamp-1"><%= @text %></span>
    </.link>
    """
  end

  defp maybe_link(_socket, _page, {:disabled, text, icon}) do
    assigns = %{text: text, icon: icon}

    ~H"""
    <span class="w-full flex rounded-lg items-center justify-center @[180px]:justify-start gap-0 @[180px]:gap-2.5 px-3 py-2 antialiased text-sm font-medium text-slate-300 cursor-not-allowed">
      <span :if={@icon} aria-hidden="true" class={@icon <> " h-[18px] w-[18px] flex-shrink-0"}></span>
      <span class="hidden @[180px]:block line-clamp-1"><%= @text %></span>
    </span>
    """
  end
end
