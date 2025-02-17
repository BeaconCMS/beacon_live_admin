defmodule Beacon.LiveAdmin.PageBuilder.Menu do
  @moduledoc false
  defstruct links: []
end

defmodule Beacon.LiveAdmin.PageBuilder.Page do
  @moduledoc """
  Represents a Page in the LiveAdmin UI.
  """
  defstruct site: nil, path: nil, module: nil, params: %{}, session: %{}, table: nil

  @type t :: %__MODULE__{
          site: Beacon.Types.Site.t(),
          path: String.t(),
          module: module(),
          params: map(),
          session: map(),
          table: Beacon.LiveAdmin.PageBuilder.Table.t()
        }
end

# https://github.com/phoenixframework/phoenix_live_dashboard/blob/32fef8da6a7df97f92f05bd6e7aab33be4036490/lib/phoenix/live_dashboard/page_builder.ex
defmodule Beacon.LiveAdmin.PageBuilder do
  @moduledoc """
  The foundation for building admin pages.

  Either built-in pages and custom pages on your app should implement these callbacks
  to properly mount the menu and the private assigns used by LiveAdmin.

  """
  use Phoenix.Component

  alias Beacon.LiveAdmin.PageBuilder.Table
  alias Phoenix.LiveView.Socket

  @type session :: map()
  @type unsigned_params :: map()

  @callback init(term()) :: {:ok, session()}

  @callback menu_link(prefix :: String.t(), live_action :: atom) ::
              {:root, String.t()}
              | {:submenu, String.t()}
              | :skip

  @callback menu_link(prefix :: String.t(), live_action :: atom, icon :: String.t()) ::
              {:root, String.t()}
              | {:submenu, String.t()}
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
                      handle_info: 2,
                      menu_link: 3

  defmacro __using__(opts) do
    quote location: :keep, bind_quoted: [opts: opts] do
      use Phoenix.Component
      use Beacon.LiveAdmin.StationUI.HTML

      import Beacon.LiveAdmin.Router,
        only: [
          beacon_live_admin_path: 1,
          beacon_live_admin_path: 3,
          beacon_live_admin_path: 4,
          beacon_live_admin_static_path: 1
        ]

      import Phoenix.LiveView
      import Beacon.LiveAdmin.AdminComponents
      import Beacon.LiveAdmin.Components, only: [template_error: 1]
      import LiveSvelte

      alias Phoenix.LiveView.JS
      alias Beacon.LiveAdmin.PageBuilder.Table

      @behaviour Beacon.LiveAdmin.PageBuilder

      @impl true
      def init(opts), do: {:ok, opts}
      defoverridable init: 1

      @impl true
      def handle_event("change-site", %{"site" => site}, socket) do
        site = String.to_existing_atom(site)

        path =
          case String.split(socket.assigns.beacon_page.path, "/") do
            ["", path | _] -> beacon_live_admin_path(socket, site, path)
            _ -> beacon_live_admin_path(socket)
          end

        {:noreply, push_navigate(socket, to: path)}
      end

      def __beacon_page_table__ do
        unquote(opts)
        |> Keyword.get(:table)
        |> Table.build()
      end
    end
  end
end
