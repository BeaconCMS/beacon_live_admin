defmodule Beacon.LiveAdmin.Private do
  @doc false

  # Call to private APIs.
  # Those should be handled carefully and not be spread over the codebase.

  @phoenix_live_view_version to_string(Application.spec(:phoenix_live_view)[:vsn])

  def mount(params, session, socket) do
    Phoenix.LiveView.Lifecycle.mount(params, session, socket)
  end

  def register_on_mount_lifecycle_attribute(mod) do
    Module.register_attribute(mod, :phoenix_live_mount, accumulate: true)
  end

  def get_on_mount_lifecycle_attribute(mod) do
    Module.get_attribute(mod, :phoenix_live_mount)
  end

  # support LiveView up to v0.20.2
  if Version.compare(@phoenix_live_view_version, "0.20.2") in [:lt, :eq] do
    def build_on_mount_lifecycle(socket, page_module) do
      update_in(socket.private.lifecycle.mount, fn hooks ->
        page_hooks =
          page_module.on_mount()
          |> Enum.map(&Phoenix.LiveView.Lifecycle.on_mount(nil, &1))
          |> Enum.reverse()

        hooks ++ page_hooks
      end)
    end
  end

  # support LiveView v0.20.3+
  if Version.compare(@phoenix_live_view_version, "0.20.3") in [:gt, :eq] do
    def build_on_mount_lifecycle(socket, page_module) do
      update_in(socket.private.lifecycle.mount, fn hooks ->
        page_hooks =
          page_module.on_mount()
          |> Phoenix.LiveView.Lifecycle.prepare_on_mount!()
          |> Enum.reverse()

        hooks ++ page_hooks
      end)
    end
  end
end
