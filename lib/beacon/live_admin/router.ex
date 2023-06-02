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
        @doc false
        def __beacon_live_admin_assets_prefix__ do
          "/__beacon_live_admin/assets"
        end

        scope "/__beacon_live_admin/assets", alias: false, as: false do
          get "/css-:md5", Beacon.LiveAdmin.AssetsController, :css, as: :beacon_live_admin_asset
          get "/js-:md5", Beacon.LiveAdmin.AssetsController, :js, as: :beacon_live_admin_asset
        end
      end

    quote do
      Module.register_attribute(__MODULE__, :beacon_live_admins, accumulate: true)
      import Beacon.LiveAdmin.Router, only: [beacon_live_admin: 2]
      @before_compile unquote(__MODULE__)
      unquote(assets)
    end
  end

  defmacro __before_compile__(env) do
    admins = Module.get_attribute(env.module, :beacon_live_admins)

    prefixes =
      for {prefix, sites} <- admins, site <- sites do
        quote do
          @doc false
          def __beacon_live_admin_prefix__(unquote(site)) do
            [unquote(prefix), unquote(site)]
            |> Enum.join("/")
            |> String.replace("//", "/")
          end
        end
      end

    quote do
      unquote(prefixes)
    end
  end

  @doc """
  TODO
  """
  # TODO opts :sites
  defmacro beacon_live_admin(prefix, opts) do
    opts =
      if Macro.quoted_literal?(opts) do
        Macro.prewalk(opts, &expand_alias(&1, __CALLER__))
      else
        opts
      end

    quote bind_quoted: binding() do
      # TODO scope by site
      p = "#{prefix}/:site"

      scope p, alias: false, as: false do
        {additional_pages, opts} = Keyword.pop(opts, :additional_pages, [])
        pages = Beacon.LiveAdmin.Router.__pages__(additional_pages)

        {session_name, session_opts} =
          Beacon.LiveAdmin.Router.__session_options__(prefix, pages, opts)

        import Phoenix.Router, only: [get: 4]
        import Phoenix.LiveView.Router, only: [live: 4, live_session: 3]

        live_session session_name, session_opts do
          for {path, page_module, live_action} = page <- pages do
            route_opts = Beacon.LiveAdmin.Router.__route_options__(opts, page)
            live path, Beacon.LiveAdmin.PageLive, live_action, route_opts
          end
        end
      end

      @beacon_live_admins {Phoenix.Router.scoped_path(__MODULE__, prefix), opts[:sites]}
    end
  end

  defp expand_alias({:__aliases__, _, _} = alias, env),
    do: Macro.expand(alias, %{env | function: {:live_admin, 2}})

  defp expand_alias(other, _env), do: other

  @doc false
  def __pages__(additional_pages) do
    # TODO validate additional_pages
    additional_pages = additional_pages || []

    Enum.concat(
      [
        {"/", Beacon.LiveAdmin.HomePage, :index},
        {"/pages", Beacon.LiveAdmin.PageEditorPage, :index}
      ],
      additional_pages
    )
  end

  @doc false
  def __session_options__(prefix, pages, opts) do
    # TODO validate options
    sites = opts[:sites]

    session_args = [
      sites,
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
  def __session__(_conn, sites, pages) do
    # beacon
    %{}
    |> Map.put("sites", sites)
    |> Map.put("pages", pages)
  end

  @doc false
  def __route_options__(opts, page) do
    live_socket_path = Keyword.get(opts, :live_socket_path, "/live")
    {path, module, _live_action} = page
    page = %{path: path, module: module}

    [
      # private: %{beacon: %{"live_socket_path" => live_socket_path, "page" => page}},
      metadata: %{beacon: %{"live_socket_path" => live_socket_path, "page" => page}},
      as: :beacon_live_admin_path
    ]
  end
end
