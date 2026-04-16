defmodule Mix.Tasks.BeaconLiveAdmin.CreateAdmin do
  @shortdoc "Deprecated: use beacon_live_admin.set_owner instead"

  @moduledoc """
  **Deprecated.** Use `mix beacon_live_admin.set_owner` instead.

  This task delegates to `beacon_live_admin.set_owner` for backwards compatibility.
  """

  use Mix.Task

  @requirements ["app.start"]

  @impl true
  def run(args) do
    Mix.shell().info("""
    WARNING: mix beacon_live_admin.create_admin is deprecated.
    Use mix beacon_live_admin.set_owner instead.
    """)

    Mix.Tasks.BeaconLiveAdmin.SetOwner.run(args)
  end
end
