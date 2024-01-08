defmodule Beacon.LiveAdmin.Layouts do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :html

  embed_templates "layouts/*"

  def render("admin.html", assigns), do: admin(assigns)

  def asset_path(conn_or_socket, asset) when asset in [:css, :js] do
    prefix = router(conn_or_socket).__beacon_live_admin_assets_prefix__()
    hash = Beacon.LiveAdmin.AssetsController.current_hash(asset)
    path = Beacon.LiveAdmin.Router.sanitize_path("#{prefix}/#{asset}-#{hash}")
    Phoenix.VerifiedRoutes.unverified_path(conn_or_socket, router(conn_or_socket), path)
  end

  def page_stylesheet(site, template) do
    case Beacon.LiveAdmin.RuntimeCSS.compile(site, template) do
      {:ok, stylesheet} ->
        stylesheet

      {:error, error} ->
        """
        Failed to generate the page stylesheet:

        #{inspect(error)}
        """
    end
  end

  defp router(%Plug.Conn{private: %{phoenix_router: router}}), do: router
  defp router(%Phoenix.LiveView.Socket{router: router}), do: router
end
