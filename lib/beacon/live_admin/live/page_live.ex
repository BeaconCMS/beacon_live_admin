defmodule Beacon.LiveAdmin.PageLive do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_view
  require Logger
  alias Beacon.LiveAdmin.PageBuilder
  alias Phoenix.LiveView.Socket

  @impl true
  def mount(%{"site" => site} = params, %{"pages" => pages} = session, socket) do
    site = String.to_existing_atom(site)
    sites = Beacon.LiveAdmin.Cluster.running_sites()

    current_url =
      Map.get(session, "beacon_live_admin_page_url") ||
        raise Beacon.LiveAdmin.PageNotFoundError, """
        failed to resolve Beacon.LiveAdmin page URL

        You must add Beacon.LiveAdmin.Plug to the :browser pipeline that beacon_live_admin is piped through.
        """

    page = lookup_page(socket, current_url)

    assign_mount(socket, site, page, sites, pages, params)
  end

  # Beacon admin pages (no site param — platform-level)
  def mount(params, %{"pages" => pages} = session, socket) when not is_map_key(params, "site") do
    sites = Beacon.LiveAdmin.Cluster.running_sites()
    site = List.first(sites) || :beacon

    current_url =
      Map.get(session, "beacon_live_admin_page_url") ||
        raise Beacon.LiveAdmin.PageNotFoundError, """
        failed to resolve Beacon.LiveAdmin page URL

        You must add Beacon.LiveAdmin.Plug to the :browser pipeline that beacon_live_admin is piped through.
        """

    page = lookup_page(socket, current_url)

    assign_mount(socket, site, page, sites, pages, params)
  end

  def mount(_params, _session, _socket) do
    raise Beacon.LiveAdmin.PageNotFoundError, """
    failed to resolve Beacon.LiveAdmin page URL

    You must add Beacon.LiveAdmin.Plug to the :browser pipeline that beacon_live_admin is piped through.
    """
  end

  defp assign_mount(socket, site, nil, sites, pages, params) do
    # Page not found from session URL — this happens when navigating
    # from HomeLive to PageLive. Use a minimal placeholder; handle_params
    # will immediately resolve the correct page from the actual URL.
    {first_path, first_module, _, _first_session} = List.first(pages)

    page = %PageBuilder.Page{
      site: site,
      path: first_path,
      module: first_module,
      table: first_module.__beacon_page_table__()
    }

    socket =
      assign(socket,
        __beacon_sites__: sites,
        __beacon_pages__: pages,
        __beacon_menu__: %PageBuilder.Menu{},
        beacon_page: page
      )

    # Don't call the module's mount — handle_params will mount the correct module
    {:ok, assign_params(socket, params)}
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
    prev_module = socket.assigns.beacon_page.module

    with %Socket{redirected: nil} = socket <-
           update_page(socket, path: page.path, module: page.module, params: params),
         %Socket{redirected: nil} = socket <- assign_menu_links(socket, socket.assigns.__beacon_pages__) do
      # If the module changed (e.g., navigating from a stale mount), call the new module's mount first
      socket =
        if page.module != prev_module do
          case maybe_apply_module(socket, :mount, [params, page.session], & &1) do
            {:ok, s} -> s
            s -> s
          end
        else
          socket
        end

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

  # Non-raising version for mount — returns nil if page not found.
  # This handles the case where the session URL is stale (e.g., from HomeLive)
  # and doesn't match a PageLive route. handle_params will correct it.
  defp lookup_page(socket, url) do
    %URI{path: path} = URI.parse(url)

    case Phoenix.Router.route_info(socket.router, "GET", path, "localhost") do
      %{beacon: %{"page" => page}} -> page
      _ -> nil
    end
  end

  # Raising version for handle_params — the URL is always correct here.
  defp lookup_page!(socket, url) do
    %URI{path: path} = URI.parse(url)

    case Phoenix.Router.route_info(socket.router, "GET", path, "localhost") do
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
    "/graphql_endpoints" => "hero-server-stack",
    "/events" => "hero-bolt",
    "/info_handlers" => "hero-information-circle",
    "/error_pages" => "hero-exclamation-triangle",
    "/hooks" => "hero-code-bracket",
    "/settings" => "hero-cog-6-tooth",
    "/groups" => "hero-user-group",
    "/beacon" => "hero-shield-check"
  }

  @menu_groups [
    {:content, "Content", ["/pages", "/layouts", "/components", "/media_library"]},
    {:data, "Data & Logic", ["/graphql_endpoints", "/events", "/info_handlers"]},
    {:developer, "Developer", ["/error_pages", "/hooks", "/settings"]},
    {:admin, "Administration", ["/groups"]},
    {:beacon_admin, "Platform", ["/beacon"]}
  ]

  # TODO subpath /pages/:id -> Pages menu
  defp assign_menu_links(socket, pages) do
    current_path = socket.assigns.beacon_page.path
    ["", current_prefix | _] = String.split(current_path, "/")
    current_prefix = "/" <> current_prefix

    # When viewing /beacon/* pages, only show beacon admin links
    # When viewing site-scoped pages, only show site-scoped links
    is_beacon_admin = String.starts_with?(current_path, "/beacon")

    filtered_pages =
      Enum.filter(pages, fn {path, _module, _live_action, _session} ->
        if is_beacon_admin do
          String.starts_with?(path, "/beacon")
        else
          not String.starts_with?(path, "/beacon")
        end
      end)

    link_map =
      Enum.reduce(filtered_pages, %{}, fn {path, module, live_action, _session}, acc ->
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

    # Only show menu groups relevant to the current scope
    active_groups = if is_beacon_admin do
      Enum.filter(@menu_groups, fn {group_id, _, _} -> group_id == :beacon_admin end)
    else
      Enum.filter(@menu_groups, fn {group_id, _, _} -> group_id != :beacon_admin end)
    end

    grouped_links =
      Enum.flat_map(active_groups, fn {_group_id, group_label, prefixes} ->
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

    # Append any links not in a predefined group (only from filtered pages)
    known_prefixes = Enum.flat_map(active_groups, fn {_, _, prefixes} -> prefixes end)

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
      <span class="text-[11px] font-semibold uppercase tracking-wider text-base-content/40"><%= @label %></span>
    </div>
    """
  end

  defp maybe_link(socket, page, {:current, text, icon, path}) do
    path = build_link_path(socket, page, path)
    assigns = %{text: text, icon: icon, path: path}

    ~H"""
    <.link
      patch={@path}
      class="w-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary bg-primary/10 text-primary flex rounded-lg items-center justify-center @[180px]:justify-start gap-0 @[180px]:gap-2.5 px-3 py-2 antialiased text-sm font-medium"
    >
      <span :if={@icon} aria-hidden="true" class={@icon <> " h-[18px] w-[18px] flex-shrink-0 text-primary"}></span>
      <span :if={!@icon} class="hidden @[180px]:block h-[18px] w-[18px] flex-shrink-0"></span>
      <span class="hidden @[180px]:block line-clamp-1"><%= @text %></span>
    </.link>
    """
  end

  defp maybe_link(socket, page, {:enabled, text, icon, path}) do
    path = build_link_path(socket, page, path)
    assigns = %{text: text, icon: icon, path: path}

    ~H"""
    <.link
      patch={@path}
      class="w-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary hover:bg-base-200 text-base-content/60 hover:text-base-content flex rounded-lg items-center justify-center @[180px]:justify-start gap-0 @[180px]:gap-2.5 px-3 py-2 antialiased text-sm font-medium"
    >
      <span :if={@icon} aria-hidden="true" class={@icon <> " h-[18px] w-[18px] flex-shrink-0 text-base-content/40"}></span>
      <span :if={!@icon} class="hidden @[180px]:block h-[18px] w-[18px] flex-shrink-0"></span>
      <span class="hidden @[180px]:block line-clamp-1"><%= @text %></span>
    </.link>
    """
  end

  defp maybe_link(_socket, _page, {:disabled, text, icon}) do
    assigns = %{text: text, icon: icon}

    ~H"""
    <span class="w-full flex rounded-lg items-center justify-center @[180px]:justify-start gap-0 @[180px]:gap-2.5 px-3 py-2 antialiased text-sm font-medium text-base-content/20 cursor-not-allowed">
      <span :if={@icon} aria-hidden="true" class={@icon <> " h-[18px] w-[18px] flex-shrink-0"}></span>
      <span class="hidden @[180px]:block line-clamp-1"><%= @text %></span>
    </span>
    """
  end

  # Beacon admin pages (/beacon/*) don't need the site prefix
  defp build_link_path(socket, _page, "/beacon" <> _ = path) do
    Beacon.LiveAdmin.Router.beacon_live_admin_path(socket, path)
  end

  # Site-scoped pages get the site prefix
  defp build_link_path(socket, page, path) do
    Beacon.LiveAdmin.Router.beacon_live_admin_path(socket, page.site, path)
  end
end
