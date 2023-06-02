defmodule Beacon.LiveAdmin.PageBuilder.Env do
  @moduledoc false
  defstruct sites: [], current_site: nil, pages: []
end

defmodule Beacon.LiveAdmin.PageBuilder.Menu do
  @moduledoc false
  defstruct links: []
end

defmodule Beacon.LiveAdmin.PageBuilder.Page do
  @moduledoc false
  defstruct path: nil, module: nil, params: %{}
end

defmodule Beacon.LiveAdmin.PageBuilder do
  @moduledoc """
  TODO
  """

  use Phoenix.Component

  @type session :: map
  @type unsigned_params :: map

  @callback menu_link() ::
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
    end
  end

  def live_admin_path(socket, env, path, params \\ %{}) do
    prefix = socket.router.__beacon_live_admin_prefix__(env.current_site)
    path = build_path_with_prefix(prefix, path)
    params = for {key, val} <- params, do: {key, val}
    Phoenix.VerifiedRoutes.unverified_path(socket, socket.router, path, params)
  end

  defp build_path_with_prefix(prefix, "/") do
    prefix
  end

  defp build_path_with_prefix(prefix, path) do
    sanitize_path("#{prefix}/#{path}")
  end

  defp sanitize_path(path) do
    String.replace(path, "//", "/")
  end
end
