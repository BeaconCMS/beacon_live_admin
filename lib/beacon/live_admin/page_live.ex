defmodule Beacon.LiveAdmin.PageNotFound do
  @moduledoc false
  defexception [:message, plug_status: 404]
end

defmodule Beacon.LiveAdmin.PageLive do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_view
  alias Beacon.LiveAdmin.PageBuilder.Env
  alias Beacon.LiveAdmin.PageBuilder.Menu
  alias Beacon.LiveAdmin.PageBuilder.Page
  alias Phoenix.LiveView.Socket

  @impl true
  def mount(params, session, socket) do
    {site, params} = Map.pop(params, "site")
    site = String.to_existing_atom(site)
    %{"sites" => sites, "pages" => pages, "beacon_live_admin_page_url" => current_url} = session
    page = lookup_page!(socket, current_url)

    socket =
      assign(socket,
        env: %Env{},
        menu: %Menu{},
        page: %Page{}
      )


    with %Socket{redirected: nil} = socket <-
           update_env(socket, sites: sites, current_site: site, pages: pages),
         %Socket{redirected: nil} = socket <-
           update_page(socket, path: page.path, module: page.module, params: params),
         %Socket{redirected: nil} = socket <- assign_menu_links(socket, pages) do
      maybe_apply_module(socket, :mount, [params, page.session], &{:ok, &1})
    else
      %Socket{} = redirected_socket ->
        {:ok, redirected_socket}
    end
  end

  @impl true
  def handle_params(params, url, socket) do
    %{env: %{pages: pages}} = socket.assigns
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

  defp lookup_page!(socket, url) do
    %URI{host: host, path: path} = URI.parse(url)

    case Phoenix.Router.route_info(socket.router, "GET", path, host) do
      %{beacon: %{"page" => page}} ->
        page

      _ ->
        msg = """
        failed to find a page for URL #{url}
        """

        # TODO: custom exception?
        raise msg
    end
  end

  # TODO subpath /pages/:id -> Pages menu
  defp assign_menu_links(socket, pages) do
    current_path = socket.assigns.page.path

    {links, socket} =
      Enum.map_reduce(pages, socket, fn {path, module, live_action, _session}, socket ->
        current? = path == current_path
        menu_link = module.menu_link(live_action)

        case {current?, menu_link} do
          {true, {:ok, anchor}} ->
            {{:current, anchor, path}, socket}

          {false, {:ok, anchor}} ->
            {{:enabled, anchor, path}, socket}

          {false, {:disabled, anchor}} ->
            {{:disabled, anchor}, socket}

          {_, :skip} ->
            {:skip, socket}
        end
      end)

    update_menu(socket, links: links)
  end

  defp maybe_apply_module(socket, fun, params, default) do
    if function_exported?(socket.assigns.page.module, fun, length(params) + 1) do
      apply(socket.assigns.page.module, fun, params ++ [socket])
    else
      default.(socket)
    end
  end

  defp update_env(socket, assigns) do
    update(socket, :env, fn env ->
      Enum.reduce(assigns, env, fn {key, value}, env ->
        Map.replace!(env, key, value)
      end)
    end)
  end

  defp update_page(socket, assigns) do
    update(socket, :page, fn page ->
      Enum.reduce(assigns, page, fn {key, value}, page ->
        Map.replace!(page, key, value)
      end)
    end)
  end

  defp update_menu(socket, assigns) do
    update(socket, :menu, fn menu ->
      Enum.reduce(assigns, menu, fn {key, value}, menu ->
        Map.replace!(menu, key, value)
      end)
    end)
  end

  defp render_page(module, assigns) do
    module.render(assigns)
  end

  ## Navbar handling

  defp maybe_link(socket, env, {:current, text, path}) do
    path = Beacon.LiveAdmin.PageBuilder.live_admin_path(socket, env, path)
    assigns = %{text: text, path: path}

    # force redirect to re-execute plug to fecth current url
    ~H"""
    <.link href={@path} class="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"><%= @text %></.link>
    """
  end

  defp maybe_link(socket, env, {:enabled, text, path}) do
    path = Beacon.LiveAdmin.PageBuilder.live_admin_path(socket, env, path)
    assigns = %{text: text, path: path}

    # force redirect to re-execute plug to fecth current url
    ~H"""
    <.link href={@path} class="text-gray-900 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"><%= @text %></.link>
    """
  end

  defp maybe_link(_socket, _env, {:disabled, text}) do
    assigns = %{text: text}

    ~H"""
    <span class=""><%= @text %></span>
    """
  end
end
