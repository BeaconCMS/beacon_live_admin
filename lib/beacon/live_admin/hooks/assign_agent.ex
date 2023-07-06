defmodule Beacon.LiveAdmin.Hooks.AssignAgent do
  @moduledoc """
  Assigns the agent on the socket to be used by `Beacon.Authorization`.

  It is presumed you will have already authenticated the agent with your own hook.
  See `Beacon.LiveAdmin.Router.beacon_live_admin/2` for details on adding hooks.
  """

  import Phoenix.Component

  def on_mount(:default, %{"site" => site}, session, socket) do
    site = String.to_existing_atom(site)

    socket =
      assign_new(socket, :agent, fn ->
        Beacon.LiveAdmin.Authorization.get_agent(site, session)
      end)

    {:cont, socket}
  end

  # site is not defined on the initial page
  def on_mount(:default, _params, _session, socket) do
    {:cont, socket}
  end
end
