defmodule Beacon.LiveAdmin.PageBuilder.Menu do
  @moduledoc false
  defstruct links: []
end

defmodule Beacon.LiveAdmin.PageBuilder.Page do
  @moduledoc false
  defstruct site: nil, path: nil, module: nil, params: %{}, session: %{}
end

defmodule Beacon.LiveAdmin.PageBuilder do
  @moduledoc """
  TODO
  """

  use Phoenix.Component

  @type session :: map
  @type unsigned_params :: map

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

      def init(opts), do: {:ok, opts}
      defoverridable init: 1
    end
  end
end
