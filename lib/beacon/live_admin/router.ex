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
      import Beacon.LiveAdmin.Router, only: [beacon_live_admin: 2]
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
  TODO
  """
  defmacro beacon_live_admin(prefix, opts) do
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

        {session_name, session_opts} =
          Beacon.LiveAdmin.Router.__session_options__(prefix, pages, opts)

        import Phoenix.Router, only: [get: 4]
        import Phoenix.LiveView.Router, only: [live: 4, live_session: 3]

        live_session session_name, session_opts do
          get "/", Beacon.LiveAdmin.HomeController, :index, as: :beacon_live_admin_home

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
      {"/pages/:id", Beacon.LiveAdmin.PageEditorLive.Show, :show, %{}}
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
end
