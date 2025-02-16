defmodule Beacon.LiveAdmin.Router do
  @moduledoc """
  Routing for Beacon LiveAdmin.
  """

  # require Logger

  @type conn_or_socket :: Phoenix.LiveView.Socket.t() | Plug.Conn.t()

  defmacro __using__(_opts) do
    quote do
      unquote(prelude())
    end
  end

  defp prelude do
    assets =
      quote do
        scope "/__beacon_live_admin__/assets", alias: false, as: false do
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
        "/__beacon_live_admin__/assets"
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

  Or using AshAuthentication to protect the admin pages:

      beacon_live_admin "/admin", AshAuthentication.Phoenix.LiveSession.opts(on_mount: [{MyAppWeb.LiveUserAuth, :live_user_required}])

  ## Options

    * `:name` (required) `atom()` - register your instance with a unique name.
      Note that the name has to match the one used in your instance configuration.
    * `:on_mount` (optional) - an optional list of `on_mount` hooks passed to `live_session`.
      This will allow for authenticated routes, among other uses.
    * `:session` (optional) - an optional extra session map or MFA tuple to be merged with the Beacon.LiveAdmin session.
      Useful to authenticate the session using 3rd-party libs like AshAuthentication.

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

        {_instance_name, session_name, session_opts} = Beacon.LiveAdmin.Router.__options__(pages, opts)

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
    additional_pages =
      Enum.map(additional_pages || [], fn
        {_path, _module, _live_action, _opts} = page -> page
        {path, module, live_action} -> {path, module, live_action, %{}}
      end)

    [
      # media library
      {"/media_library", Beacon.LiveAdmin.MediaLibraryLive.Index, :index, %{}},
      {"/media_library/upload", Beacon.LiveAdmin.MediaLibraryLive.Index, :upload, %{}},
      # components
      {"/components", Beacon.LiveAdmin.ComponentEditorLive.Index, :index, %{}},
      {"/components/new", Beacon.LiveAdmin.ComponentEditorLive.New, :new, %{}},
      {"/components/:id", Beacon.LiveAdmin.ComponentEditorLive.Edit, :edit, %{}},
      {"/components/:id/slots", Beacon.LiveAdmin.ComponentEditorLive.Slots, :slots, %{}},
      {"/components/:id/slots/:slot_id", Beacon.LiveAdmin.ComponentEditorLive.Slots, :slots, %{}},
      {"/components/:id/slots/:slot_id/attrs/new", Beacon.LiveAdmin.ComponentEditorLive.SlotAttr, :new, %{}},
      {"/components/:id/slots/:slot_id/attrs/:attr_id", Beacon.LiveAdmin.ComponentEditorLive.SlotAttr, :edit, %{}},
      # layouts
      {"/layouts", Beacon.LiveAdmin.LayoutEditorLive.Index, :index, %{}},
      {"/layouts/new", Beacon.LiveAdmin.LayoutEditorLive.New, :new, %{}},
      {"/layouts/:id", Beacon.LiveAdmin.LayoutEditorLive.Edit, :edit, %{}},
      {"/layouts/:id/meta_tags", Beacon.LiveAdmin.LayoutEditorLive.MetaTags, :meta_tags, %{}},
      {"/layouts/:id/revisions", Beacon.LiveAdmin.LayoutEditorLive.Revisions, :revisions, %{}},
      {"/layouts/:id/resource_links", Beacon.LiveAdmin.LayoutEditorLive.ResourceLinks, :resource_links, %{}},
      # pages
      {"/pages", Beacon.LiveAdmin.PageEditorLive.Index, :index, %{}},
      {"/pages/new", Beacon.LiveAdmin.PageEditorLive.New, :new, %{}},
      {"/pages/:id", Beacon.LiveAdmin.PageEditorLive.Edit, :edit, %{}},
      {"/pages/:id/meta_tags", Beacon.LiveAdmin.PageEditorLive.MetaTags, :meta_tags, %{}},
      {"/pages/:id/schema", Beacon.LiveAdmin.PageEditorLive.Schema, :schema, %{}},
      {"/pages/:id/revisions", Beacon.LiveAdmin.PageEditorLive.Revisions, :revisions, %{}},
      {"/pages/:page_id/variants", Beacon.LiveAdmin.PageEditorLive.Variants, :variants, %{}},
      {"/pages/:page_id/variants/:variant_id", Beacon.LiveAdmin.PageEditorLive.Variants, :variants, %{}},
      # live data
      {"/live_data", Beacon.LiveAdmin.LiveDataEditorLive.Index, :index, %{}},
      {"/live_data/new", Beacon.LiveAdmin.LiveDataEditorLive.Index, :new, %{}},
      {"/live_data/:live_data_id", Beacon.LiveAdmin.LiveDataEditorLive.Index, :edit, %{}},
      {"/live_data/:live_data_id/assigns", Beacon.LiveAdmin.LiveDataEditorLive.Assigns, :assigns, %{}},
      {"/live_data/:live_data_id/assigns/:assign_id", Beacon.LiveAdmin.LiveDataEditorLive.Assigns, :assigns, %{}},
      {"/media_library/:id", Beacon.LiveAdmin.MediaLibraryLive.Index, :show, %{}},
      # events
      {"/events", Beacon.LiveAdmin.EventHandlerEditorLive.Index, :index, %{}},
      {"/events/:id", Beacon.LiveAdmin.EventHandlerEditorLive.Index, :index, %{}},
      # info handlers
      {"/info_handlers", Beacon.LiveAdmin.InfoHandlerEditorLive.Index, :index, %{}},
      {"/info_handlers/:handler_id", Beacon.LiveAdmin.InfoHandlerEditorLive.Index, :index, %{}},
      # error pages
      {"/error_pages", Beacon.LiveAdmin.ErrorPageEditorLive.Index, :index, %{}},
      {"/error_pages/:status", Beacon.LiveAdmin.ErrorPageEditorLive.Index, :index, %{}},
      # js hooks
      {"/hooks", Beacon.LiveAdmin.JSHookEditorLive.Index, :index, %{}},
      {"/hooks/:id", Beacon.LiveAdmin.JSHookEditorLive.Index, :index, %{}}
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

        # TODO: custom exception 404
        raise msg
    end
  end

  @doc false
  # TODO validate options
  def __options__(pages, opts) do
    instance_name =
      Keyword.get_lazy(opts, :name, fn ->
        # TODO: enable this warning after we start using Config
        # Logger.warning("""
        # missing required option :name in beacon_live_admin/2
        #
        # It will default to :admin but it's recommended to provide a unique name for your instance.
        #
        # Example:
        #
        #     beacon_live_admin "/admin", name: :admin
        #
        # """)

        :admin
      end)

    instance_name =
      cond do
        String.starts_with?(Atom.to_string(instance_name), ["beacon", "__beacon"]) ->
          raise ArgumentError, ":name can not start with beacon or __beacon, got: #{instance_name}"

        instance_name && is_atom(instance_name) ->
          instance_name

        :invalid ->
          raise ArgumentError, ":name must be an atom, got: #{inspect(instance_name)}"
      end

    if Keyword.has_key?(opts, :root_layout) do
      raise ArgumentError, """
      you cannot assign a different root_layout.

      Beacon.LiveAdmin depends on {Beacon.LiveAdmin.Layouts, :admin}
      """
    end

    if Keyword.has_key?(opts, :layout) do
      raise ArgumentError, """
      you cannot assign a layout.

      Beacon.LiveAdmin depends on {Beacon.LiveAdmin.Layouts, :admin}
      """
    end

    on_mounts = get_on_mount_list(Keyword.get(opts, :on_mount, []))

    {
      instance_name,
      opts[:live_session_name] || String.to_atom("beacon_live_admin_#{instance_name}"),
      [
        root_layout: {Beacon.LiveAdmin.Layouts, :admin},
        session: {__MODULE__, :__session__, [pages, opts[:session]]},
        on_mount: on_mounts
      ]
    }
  end

  defp get_on_mount_list(on_mounts) when is_list(on_mounts) do
    on_mounts
  end

  defp get_on_mount_list(on_mounts) do
    raise ArgumentError, """
    expected `on_mount` option to be a list

    Got:

      #{inspect(on_mounts)}
    """
  end

  @doc false
  def __session__(conn, pages, extra_session) do
    extra_session =
      case extra_session do
        {mod, fun, args} when is_atom(mod) and is_atom(fun) and is_list(args) ->
          apply(mod, fun, [conn | args])

        %{} = session ->
          session

        nil ->
          %{}
      end

    # TODO: renamte pages to __beacon_pages__ or something more unique to avoid conflicts
    Map.merge(%{"pages" => pages}, extra_session)
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
  Generates a `path` with the proper admin prefix for a `site`.

  ## Examples

      iex> Beacon.LiveAdmin.Router.beacon_live_admin_path(@socket, :my_site, "/pages")
      "/my_admin/my_site/pages"

      iex> Beacon.LiveAdmin.Router.beacon_live_admin_path(@socket, :my_site, "/pages", status: :draft)
      "/my_admin/my_site/pages?status=draft"

  """
  @spec beacon_live_admin_path(
          conn_or_socket,
          Beacon.Types.Site.t(),
          String.t() | atom(),
          map() | keyword()
        ) :: String.t()
  def beacon_live_admin_path(conn_or_socket, site, path, params \\ %{}) when is_atom(site) do
    router = router(conn_or_socket)
    prefix = router.__beacon_live_admin_prefix__()
    path = build_path_with_prefix(prefix, site, path)
    params = for {key, val} <- params, do: {key, val}
    Phoenix.VerifiedRoutes.unverified_path(conn_or_socket, router, path, params)
  end

  @doc """
  Generates the root path with the admin prefix.

  ## Example

      iex> Beacon.LiveAdmin.Router.beacon_live_admin_path(@socket)
      "/my_admin"

  """
  @spec beacon_live_admin_path(conn_or_socket) :: String.t()
  def beacon_live_admin_path(conn_or_socket) do
    router = router(conn_or_socket)
    prefix = router.__beacon_live_admin_prefix__()
    path = sanitize_path("#{prefix}")
    Phoenix.VerifiedRoutes.unverified_path(conn_or_socket, router, path, %{})
  end

  @doc """
  Generate the path to serve files in `priv/static`.

  See the actual configuration in `Beacon.LiveAdmin.Plug`.

  ## Example

      iex> Beacon.LiveAdmin.Router.beacon_live_admin_static_path("/images/logo.webp")
      "__beacon_live_admin_static__/images/logo.webp"

  """
  def beacon_live_admin_static_path(file) do
    sanitize_path("/__beacon_live_admin_static__/" <> file)
  end

  defp router(%Plug.Conn{private: %{phoenix_router: router}}), do: router
  defp router(%Phoenix.LiveView.Socket{router: router}), do: router

  defp build_path_with_prefix(prefix, site, "/") do
    "#{prefix}/#{site}"
  end

  defp build_path_with_prefix(prefix, site, path) do
    sanitize_path("#{prefix}/#{site}/#{path}")
  end

  @doc false
  def sanitize_path(path) do
    String.replace(path, "//", "/")
  end
end
