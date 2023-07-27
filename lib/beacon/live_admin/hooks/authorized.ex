defmodule Beacon.LiveAdmin.Hooks.Authorized do
  @moduledoc false

  import Phoenix.LiveView

  def on_mount({mod, action}, %{"site" => site}, _session, socket) do
    site = String.to_existing_atom(site)

    if Beacon.LiveAdmin.Authorization.authorized?(site, socket.assigns.agent, action, %{mod: mod}) do
      {:cont, socket}
    else
      redirect_to = Beacon.LiveAdmin.Router.beacon_live_admin_path(socket)
      {:halt, redirect(socket, to: redirect_to)}
    end
  end

  # site is not defined on the initial page
  def on_mount({_mod, _action}, _params, _session, socket) do
    {:cont, socket}
  end
end
