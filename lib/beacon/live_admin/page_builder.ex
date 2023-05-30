defmodule Beacon.LiveAdmin.PageBuilder.Page do
  @moduledoc false
  defstruct path: nil, module: nil, params: %{}, current_site: nil
end

defmodule Beacon.LiveAdmin.PageBuilder.Menu do
  @moduledoc false
  defstruct links: []
end

defmodule Beacon.LiveAdmin.PageBuilder do
  @moduledoc """
  TODO
  """

  use Phoenix.Component

  @type session :: map
  @type unsigned_params :: map

  @callback init(path :: String.t(), live_action :: atom(), opts :: term()) :: {:ok, session()}

  @callback menu_link(session()) ::
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
      import Beacon.LiveAdmin.PageBuilder
      import Phoenix.LiveView

      @behaviour Beacon.LiveAdmin.PageBuilder

      def init(_path, _live_action, opts), do: {:ok, opts}
      defoverridable init: 3
    end
  end
end
