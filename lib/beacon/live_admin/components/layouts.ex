defmodule Beacon.LiveAdmin.Layouts do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :html

  embed_templates "layouts/*"

  def render("admin.html", assigns), do: admin(assigns)

  def hash(term) when is_binary(term) do
    Base.encode16(:crypto.hash(:md5, term), case: :lower)
  end

  def asset_path(conn_or_socket, asset) when asset in [:css, :js] do
    prefix = router(conn_or_socket).__beacon_live_admin_assets_prefix__()
    hash = Beacon.LiveAdmin.AssetsController.current_hash(asset)
    path = Beacon.LiveAdmin.Router.sanitize_path("#{prefix}/#{asset}-#{hash}")
    Phoenix.VerifiedRoutes.unverified_path(conn_or_socket, router(conn_or_socket), path)
  end

  def asset_path(conn_or_socket, :css_page_baseline = _asset, view_id, hash) do
    prefix = router(conn_or_socket).__beacon_live_admin_assets_prefix__()
    path = Beacon.LiveAdmin.Router.sanitize_path("#{prefix}/page/#{view_id}/css-baseline-#{hash}")
    Phoenix.VerifiedRoutes.unverified_path(conn_or_socket, router(conn_or_socket), path)
  end

  def asset_path(conn_or_socket, :css_page_chunks = _asset, view_id, hash) do
    prefix = router(conn_or_socket).__beacon_live_admin_assets_prefix__()
    path = Beacon.LiveAdmin.Router.sanitize_path("#{prefix}/page/#{view_id}/css-chunks-#{hash}")
    Phoenix.VerifiedRoutes.unverified_path(conn_or_socket, router(conn_or_socket), path)
  end

  defp router(%Plug.Conn{private: %{phoenix_router: router}}), do: router
  defp router(%Phoenix.LiveView.Socket{router: router}), do: router
end
