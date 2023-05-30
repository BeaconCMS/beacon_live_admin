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
  def mount(params, %{"sites" => sites, "pages" => pages}, socket) do
    {current_site, request_path} = path_info(socket.private.connect_info.path_info, sites)

    find_page = fn pages ->
      Enum.find(pages, :error, fn {path, _module, _live_action, _opts} -> path == request_path end)
    end

    case find_page.(pages) do
      {path, module, _live_action, page_session} ->
        assign_mount(socket, sites, current_site, pages, path, module, page_session, params)

      :error ->
        raise Beacon.LiveAdmin.PageNotFound, "unknown page #{inspect(request_path)}"
    end
  end

  defp path_info(path_info, sites) do
    {current_site, path_info} =
      case path_info do
        [site] -> {site, [""]}
        [site | path_info] -> {site, path_info}
        other -> raise Beacon.LiveAdmin.PageNotFound, "failed to serve request #{inspect(other)}"
      end

    current_site =
      case Enum.find(sites, :error, fn site -> Atom.to_string(site) == current_site end) do
        :error -> raise Beacon.LiveAdmin.PageNotFound, "unknown site #{inspect(current_site)}"
        site -> site
      end

    {current_site, Enum.join(["", path_info], "/")}
  end

  defp assign_mount(socket, sites, current_site, pages, path, module, page_session, params) do
    socket =
      assign(socket,
        env: %Env{sites: sites, current_site: current_site},
        menu: %Menu{},
        page: %Page{module: module}
      )

    with %Socket{redirected: nil} = socket <- update_page(socket, params: params, path: path),
         %Socket{redirected: nil} = socket <- assign_menu_links(socket, pages) do
      maybe_apply_module(socket, :mount, [params, page_session], &{:ok, &1})
    else
      %Socket{} = redirected_socket -> {:ok, redirected_socket}
    end
  end

  defp assign_menu_links(socket, pages) do
    current_path = socket.assigns.page.path

    {links, socket} =
      Enum.map_reduce(pages, socket, fn {path, module, _live_action, session}, socket ->
        current? = path == current_path
        menu_link = module.menu_link(session)

        case {current?, menu_link} do
          {true, {:ok, anchor}} ->
            {{:current, anchor}, socket}

          {true, _} ->
            {:skip, redirect_to_home_page(socket)}

          {false, {:ok, anchor}} ->
            {{:enabled, anchor, path}, socket}

          {false, :skip} ->
            {:skip, socket}

          {false, {:disabled, anchor}} ->
            {{:disabled, anchor}, socket}
        end
      end)

    update_menu(socket, links: links)
  end

  defp redirect_to_home_page(socket) do
    # TODO: live_admin_path
    push_redirect(socket, to: "/")
  end

  defp maybe_apply_module(socket, fun, params, default) do
    if function_exported?(socket.assigns.page.module, fun, length(params) + 1) do
      apply(socket.assigns.page.module, fun, params ++ [socket])
    else
      default.(socket)
    end
  end

  defp update_page(socket, assigns) do
    update(socket, :page, fn page ->
      Enum.reduce(assigns, page, fn {key, value}, page ->
        Map.replace!(page, key, value)
      end)
    end)
  end

  defp update_menu(socket, assigns) do
    update(socket, :menu, fn page ->
      Enum.reduce(assigns, page, fn {key, value}, page ->
        Map.replace!(page, key, value)
      end)
    end)
  end

  defp render_page(module, assigns) do
    module.render(assigns)
  end

  ## Navbar handling

  defp maybe_link(_socket, _page, {:current, text}) do
    assigns = %{text: text}

    ~H"""
    <div class="">
      <%= @text %>
    </div>
    """
  end

  # TODO: prefix path
  defp maybe_link(socket, page, {:enabled, text, path}) do
    router = socket.private.connect_info.private[:phoenix_router]
    prefix = router.__live_admin_prefix__(page.current_site)

    # TODO: helper live_admin_path
    path =
      case path do
        "/" -> prefix
        path -> "#{prefix}/#{path}" |> String.replace("//", "/")
      end

    live_redirect(text, to: path, class: "")
  end

  defp maybe_link(_socket, _page, {:disabled, text}) do
    assigns = %{text: text}

    ~H"""
    <div class="">
      <%= @text %>
    </div>
    """
  end
end
