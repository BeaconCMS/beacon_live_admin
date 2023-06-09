defmodule Beacon.LiveAdmin.Router do
  @moduledoc """
  TODO
  """

  defmacro __using__(_opts) do
    quote do
      unquote(prelude())
    end
  end

  defp prelude do
    assets =
      quote do
        scope "/__beacon_live_admin/assets", alias: false, as: false do
          get "/css-:md5", Beacon.LiveAdmin.AssetsController, :css, as: :beacon_live_admin_asset
          get "/js-:md5", Beacon.LiveAdmin.AssetsController, :js, as: :beacon_live_admin_asset
        end
      end

    quote do
      Module.register_attribute(__MODULE__, :beacon_live_admin_prefix, accumulate: false)
      import Beacon.LiveAdmin.Router, only: [beacon_live_admin: 1, beacon_live_admin: 2]
      @before_compile unquote(__MODULE__)
      unquote(assets)
    end
  end

  defmacro __before_compile__(env) do
    live_admin_prefix = Module.get_attribute(env.module, :beacon_live_admin_prefix)

    quote do
      @doc false
      def __beacon_live_admin_prefix__ do
        unquote(Macro.escape(live_admin_prefix))
      end

      @doc false
      def __beacon_live_admin_assets_prefix__ do
        "/__beacon_live_admin/assets"
      end
    end
  end

  @doc """
  Mount Beacon LiveAdmin routes to manage running sites in the cluster.

  ## Examples

      defmodule MyAppWeb.Router do
        use Phoenix.Router
        use Beacon.LiveAdmin.Router

        scope "/", MyAppWeb do
          pipe_through :browser
          beacon_live_admin "/admin", on_mount: [SomeHook]
        end
      end

  ## Options

    * `:on_mount` (optional) , an optional list of `on_mount` hooks passed to `live_session`.
    This will allow for authenticated routes, among other uses.

  """
  defmacro beacon_live_admin(prefix, opts \\ []) do
    opts =
      if Macro.quoted_literal?(opts) do
        Macro.prewalk(opts, &expand_alias(&1, __CALLER__))
      else
        opts
      end

    quote bind_quoted: binding(), location: :keep do
      if existing = Module.get_attribute(__MODULE__, :beacon_live_admin_prefix) do
        raise ArgumentError, """
        only one declaration of beacon_live_admin/2 is allowed per router.

        Can not add #{inspect(prefix)} when #{inspect(existing)} is already defined.
        """
      else
        @beacon_live_admin_prefix Phoenix.Router.scoped_path(__MODULE__, prefix)
      end

      scope prefix, alias: false, as: false do
        {additional_pages, opts} = Keyword.pop(opts, :additional_pages, [])
        pages = Beacon.LiveAdmin.Router.__pages__(additional_pages)

        {session_name, session_opts} = Beacon.LiveAdmin.Router.__session_options__(prefix, pages, opts)

        import Phoenix.Router, only: [get: 4]
        import Phoenix.LiveView.Router, only: [live: 4, live_session: 3]

        live_session session_name, session_opts do
          live "/", Beacon.LiveAdmin.HomeLive, :index, as: :beacon_live_admin_home

          for {path, page_module, live_action, _session} = page <- pages do
            route_opts = Beacon.LiveAdmin.Router.__route_options__(opts, page)
            path = "/:site#{path}"
            live path, Beacon.LiveAdmin.PageLive, live_action, route_opts
          end
        end
      end
    end
  end

  defp expand_alias({:__aliases__, _, _} = alias, env),
    do: Macro.expand(alias, %{env | function: {:live_admin, 2}})

  defp expand_alias(other, _env), do: other

  @doc false
  def __pages__(additional_pages) do
    # TODO validate additional_pages
    additional_pages = additional_pages || []

    [
      {"/pages", Beacon.LiveAdmin.PageEditorLive.Index, :index, %{}},
      {"/pages/new", Beacon.LiveAdmin.PageEditorLive.New, :new, %{}},
      {"/pages/:id", Beacon.LiveAdmin.PageEditorLive.Edit, :edit, %{}}
    ]
    |> Enum.concat(additional_pages)
    |> Enum.map(fn {path, module, live_action, opts} ->
      session = initialize_page!(module, opts)
      {path, module, live_action, session}
    end)
  end

  defp initialize_page!(module, opts) do
    case module.init(opts) do
      {:ok, session} ->
        session

      error ->
        msg = """
        failed to initialize page #{inspect(module)}

        Expected c:init/1 to return {:ok, opts}

        Got:

          #{inspect(error)}

        """

        # TODO: custom exception?
        raise msg
    end
  end

  @doc false
  def __session_options__(prefix, pages, opts) do
    # TODO validate options
    if Keyword.has_key?(opts, :root_layout) do
      raise ArgumentError, """
      you cannot assign a different root_layout
      """
    end

    if Keyword.has_key?(opts, :layout) do
      raise ArgumentError, """
      you cannot assign a layout
      """
    end

    session_args = [
      pages
    ]

    {
      opts[:live_session_name] || String.to_atom("beacon_live_admin_#{prefix}"),
      [
        session: {__MODULE__, :__session__, session_args},
        root_layout: {Beacon.LiveAdmin.Layouts, :admin}
      ]
    }
  end

  @doc false
  def __session__(_conn, pages) do
    %{"pages" => pages}
  end

  @doc false
  def __route_options__(opts, page) do
    live_socket_path = Keyword.get(opts, :live_socket_path, "/live")
    {path, module, _live_action, session} = page
    page = %{path: path, module: module, session: session}

    [
      metadata: %{beacon: %{"live_socket_path" => live_socket_path, "page" => page}},
      as: :beacon_live_admin_page
    ]
  end

  @doc """
  Generates prefix `path` for live admin.

    ## Examples

        iex> Beacon.LiveAdmin.Router.beacon_live_admin_path(@socket, :my_site, "/pages")
        "/my_admin/my_site/pages"

        iex> Beacon.LiveAdmin.Router.beacon_live_admin_path(@socket, :my_site, "/pages", status: :draft)
        "/my_admin/my_site/pages?status=draft"

  """
  def beacon_live_admin_path(conn_or_socket, site, path, params \\ %{})
      when is_atom(site) and is_binary(path) do
    router = router(conn_or_socket)
    prefix = router.__beacon_live_admin_prefix__()
    path = build_path_with_prefix(prefix, site, path)
    params = for {key, val} <- params, do: {key, val}
    Phoenix.VerifiedRoutes.unverified_path(conn_or_socket, router, path, params)
  end

  defp router(%Plug.Conn{private: %{phoenix_router: router}}), do: router
  defp router(%Phoenix.LiveView.Socket{router: router}), do: router

  defp build_path_with_prefix(prefix, site, "/") do
    "#{prefix}/#{site}"
  end

  defp build_path_with_prefix(prefix, site, path) do
    sanitize_path("#{prefix}/#{site}/#{path}")
  end

  defp sanitize_path(path) do
    String.replace(path, "//", "/")
  end
end
