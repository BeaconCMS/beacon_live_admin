defmodule Beacon.LiveAdmin.Router do
  @moduledoc """
  TODO
  """

  @doc """
  TODO
  """
  # TODO opts :sites
  defmacro beacon_live_admin(path, opts \\ []) do
    opts =
      if Macro.quoted_literal?(opts) do
        Macro.prewalk(opts, &expand_alias(&1, __CALLER__))
      else
        opts
      end

    scope =
      quote bind_quoted: binding() do
        # TODO scope by site
        scope path, alias: false, as: false do
          {session_name, session_opts, route_opts} = Beacon.LiveAdmin.Router.__options__(opts)

          import Phoenix.Router, only: [get: 4]
          import Phoenix.LiveView.Router, only: [live: 4, live_session: 3]

          live_session session_name, session_opts do
            live "/:site", Beacon.LiveAdmin.PageLive, :index, route_opts
            live "/:site/pages", Beacon.LiveAdmin.PageLive, :index, route_opts
          end
        end
      end

    quote do
      unquote(scope)

      @live_admin_prefix Phoenix.Router.scoped_path(__MODULE__, path)

      for site <- opts[:sites] do
        def __live_admin_prefix__(site) do
          [@live_admin_prefix, site]
          |> Enum.join("/")
          |> String.replace("//", "/")
        end
      end
    end
  end

  defp expand_alias({:__aliases__, _, _} = alias, env),
    do: Macro.expand(alias, %{env | function: {:live_admin, 2}})

  defp expand_alias(other, _env), do: other

  @doc false
  def __options__(options) do
    live_socket_path = Keyword.get(options, :live_socket_path, "/live")

    # TODO validate empty/invalid :sites
    sites = options[:sites]

    session_args = [
      sites
    ]

    {
      options[:live_session_name] || :live_admin,
      [
        session: {__MODULE__, :__session__, session_args},
        root_layout: {Beacon.LiveAdmin.Layouts, :admin}
      ],
      [
        private: %{live_socket_path: live_socket_path},
        as: :live_admin
      ]
    }
  end

  @doc false
  def __session__(_conn, sites) do
    # TODO additional_pages
    pages =
      [
        {"/", Beacon.LiveAdmin.HomePage, :index, %{}},
        {"/pages", Beacon.LiveAdmin.PageEditorPage, :index, %{}}
      ]
      |> Enum.map(fn {path, module, live_action, opts} ->
        session = initialize_page(module, path, live_action, opts)
        {path, module, live_action, session}
      end)

    %{
      "sites" => sites,
      "pages" => pages
    }
  end

  defp initialize_page(module, path, live_action, opts) do
    case module.init(path, live_action, opts) do
      {:ok, session} ->
        session

      output ->
        msg = """
        failed to initialize page #{inspect(module)}

        expected `c:init/3` to return {:ok, map}

        Got:

          #{inspect(output)}

        """

        # TODO: custom exception?
        raise msg
    end
  end
end
