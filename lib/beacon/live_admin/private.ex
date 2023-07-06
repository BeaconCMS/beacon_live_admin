defmodule Beacon.LiveAdmin.Private do
  @doc false

  # Call to private APIs.
  # Those should be handled carefully and not be spread over the codebase.

  def mount(params, session, socket) do
    Phoenix.LiveView.Lifecycle.mount(params, session, socket)
  end

  def register_on_mount_lifecycle_attribute(mod) do
    Module.register_attribute(mod, :phoenix_live_mount, accumulate: true)
  end

  def get_on_mount_lifecycle_attribute(mod) do
    Module.get_attribute(mod, :phoenix_live_mount)
  end

  def build_on_mount_lifecycle(socket, page_module) do
    update_in(socket.private.lifecycle.mount, &(&1 ++ Enum.reverse(page_module.on_mount())))
  end
end
