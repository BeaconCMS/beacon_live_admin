defmodule Beacon.LiveAdmin.Layouts do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :html

  embed_templates "layouts/*"

  def render("admin.html", assigns), do: admin(assigns)

  def asset_path(conn_or_socket, asset) when asset in [:css, :js, :wasm, :plugin_css] do
    prefix = router(conn_or_socket).__beacon_live_admin_assets_prefix__()
    hash = Beacon.LiveAdmin.AssetsController.current_hash(asset)
    slug = case asset do
      :plugin_css -> "plugin-css"
      other -> to_string(other)
    end
    path = Beacon.LiveAdmin.Router.sanitize_path("#{prefix}/#{slug}-#{hash}")
    Phoenix.VerifiedRoutes.unverified_path(conn_or_socket, router(conn_or_socket), path)
  end

  defp router(%Plug.Conn{private: %{phoenix_router: router}}), do: router
  defp router(%Phoenix.LiveView.Socket{router: router}), do: router
end
