defmodule Beacon.LiveAdmin.PageBuilder.Menu do
  @moduledoc false
  defstruct links: []
end

defmodule Beacon.LiveAdmin.PageBuilder.Page do
  @moduledoc false
  defstruct site: nil, path: nil, module: nil, params: %{}, session: %{}
end

# https://github.com/phoenixframework/phoenix_live_dashboard/blob/32fef8da6a7df97f92f05bd6e7aab33be4036490/lib/phoenix/live_dashboard/page_builder.ex
defmodule Beacon.LiveAdmin.PageBuilder do
  @moduledoc """
  The foundation for building admin pages.

  Either built-in pages and custom pages on your app should implement these callbacks
  to properly mount the menu and the private assigns used by LiveAdmin.

  """

  use Phoenix.Component
  alias Phoenix.LiveView.Socket

  @type session :: map()
  @type unsigned_params :: map()

  @callback init(term()) :: {:ok, session()}

  @callback menu_link(live_actionn :: atom) ::
              {:ok, String.t()}
              | {:disabled, String.t()}
              | :skip

  @callback mount(unsigned_params(), session(), socket :: Socket.t()) ::
              {:ok, Socket.t()} | {:ok, Socket.t(), keyword()}

  @callback render(assigns :: Socket.assigns()) :: Phoenix.LiveView.Rendered.t()

  @callback handle_params(unsigned_params(), uri :: String.t(), socket :: Socket.t()) ::
              {:noreply, Socket.t()}

  @callback handle_event(event :: binary, unsigned_params(), socket :: Socket.t()) ::
              {:noreply, Socket.t()} | {:reply, map, Socket.t()}

  @callback handle_info(msg :: term, socket :: Socket.t()) :: {:noreply, Socket.t()}

  @optional_callbacks mount: 3,
                      handle_params: 3,
                      handle_event: 3,
                      handle_info: 2

  defmacro __using__(opts) do
    quote location: :keep, bind_quoted: [opts: opts] do
      use Phoenix.Component
      import Beacon.LiveAdmin.CoreComponents
      import Beacon.LiveAdmin.Router, only: [beacon_live_admin_path: 3, beacon_live_admin_path: 4]
      import Phoenix.LiveView
      alias Phoenix.LiveView.JS

      @behaviour Beacon.LiveAdmin.PageBuilder

      Beacon.LiveAdmin.Private.register_on_mount_lifecycle_attribute(__MODULE__)
      @before_compile Beacon.LiveAdmin.PageBuilder

      def init(opts), do: {:ok, opts}
      defoverridable init: 1
    end
  end

  defmacro __before_compile__(env) do
    phoenix_live_mount = Beacon.LiveAdmin.Private.get_on_mount_lifecycle_attribute(env.module)

    quote do
      @doc false
      def on_mount do
        unquote(Macro.escape(phoenix_live_mount))
      end
    end
  end
end
