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
    # TODO: current_site
    %{"sites" => sites, "pages" => pages} = session

    socket =
      assign(socket,
        env: %Env{sites: sites, pages: pages},
        menu: %Menu{},
        page: %Page{}
      )

    maybe_apply_module(socket, :mount, [params, session], &{:ok, &1})
  end

  @impl true
  def handle_params(params, uri, socket) do
    {site, params} = Map.pop(params, "site")
    site = String.to_existing_atom(site)
    %{env: %{pages: pages}} = socket.assigns
    %URI{host: host, path: path} = URI.parse(uri)

    case Phoenix.Router.route_info(socket.router, "GET", path, host) do
      %{beacon: beacon} ->
        %{"page" => page} = beacon

        with %Socket{redirected: nil} = socket <- update_env(socket, current_site: site),
             %Socket{redirected: nil} = socket <-
               update_page(socket, path: page.path, module: page.module, params: params),
             %Socket{redirected: nil} = socket <- assign_menu_links(socket, pages) do
          maybe_apply_module(socket, :handle_params, [params, uri], &{:noreply, &1})
        else
          %Socket{} = redirected_socket ->
            {:noreploy, redirected_socket}
        end

      :error ->
        {:noreply, socket}
    end
  end

  defp assign_menu_links(socket, pages) do
    current_path = socket.assigns.page.path

    {links, socket} =
      Enum.map_reduce(pages, socket, fn {path, module, _live_action}, socket ->
        current? = path == current_path
        menu_link = module.menu_link()

        case {current?, menu_link} do
          {true, {:ok, anchor}} ->
            {{:current, anchor, path}, socket}

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

    ~H"""
    <.link navigate={@path} class="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"><%= @text %></.link>
    """
  end

  defp maybe_link(socket, env, {:enabled, text, path}) do
    path = Beacon.LiveAdmin.PageBuilder.live_admin_path(socket, env, path)
    assigns = %{text: text, path: path}

    ~H"""
    <.link navigate={@path} class="text-gray-900 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"><%= @text %></.link>
    """
  end

  defp maybe_link(_socket, _env, {:disabled, text}) do
    assigns = %{text: text}

    ~H"""
    <span class=""><%= @text %></span>
    """
  end
end
