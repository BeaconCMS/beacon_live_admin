defmodule Beacon.LiveAdmin.Private do
  @moduledoc false

  # Concentrate calls to private APIs so it's easier to track breaking changes and document them,
  # in case we need to make changes or understand why we had to call such APIs.

  # Should be avoided as much as possible.

  @phoenix_live_view_version to_string(Application.spec(:phoenix_live_view)[:vsn])

  def phoenix_live_view_version, do: @phoenix_live_view_version

  # TODO: remove after requiring LiveView >= 1.0.0
  if Version.compare(@phoenix_live_view_version, "1.0.0") in [:eq, :gt] do
    def attr_fun_0, do: {:fun, 0}
    def attr_fun_1, do: {:fun, 1}
  else
    def attr_fun_0, do: :any
    def attr_fun_1, do: :any
  end
end
