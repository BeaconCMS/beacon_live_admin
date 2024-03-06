defmodule Beacon.LiveAdmin.AssetsController do
  @moduledoc false
  import Plug.Conn
  alias Beacon.LiveAdmin.Layouts
  alias Beacon.LiveAdmin.RuntimeCSS

  phoenix_js_paths =
    for app <- [:phoenix, :phoenix_html, :phoenix_live_view] do
      path = Application.app_dir(app, ["priv", "static", "#{app}.js"])
      Module.put_attribute(__MODULE__, :external_resource, path)
      path
    end

  css_path = Path.join(__DIR__, "../../../../priv/static/beacon_live_admin.min.css")
  @external_resource css_path
  @css File.read!(css_path)

  js_path =
    if Code.ensure_loaded?(Mix.Project) and Mix.env() == :dev do
      Path.join(__DIR__, "../../../../priv/static/beacon_live_admin.js")
    else
      Path.join(__DIR__, "../../../../priv/static/beacon_live_admin.min.js")
    end

  @external_resource js_path

  @js """
  #{for path <- phoenix_js_paths, do: path |> File.read!() |> String.replace("//# sourceMappingURL=", "// ")}
  #{File.read!(js_path)}
  """

  @hashes %{
    :css => Layouts.hash(@css),
    :js => Layouts.hash(@js)
  }

  def init(asset) when asset in [:css, :css_site, :css_page, :js], do: asset

  def call(conn, asset) do
    {contents, content_type} = contents_and_type(asset, conn.params)

    conn
    |> put_resp_header("content-type", content_type)
    |> put_resp_header("cache-control", "public, max-age=31536000, immutable")
    |> put_private(:plug_skip_csrf_protection, true)
    |> send_resp(200, contents)
    |> halt()
  end

  defp contents_and_type(:css, _params), do: {@css, "text/css"}

  defp contents_and_type(:css_site, %{"site" => site}) do
    {RuntimeCSS.fetch(site, :uncompressed), "text/css"}
  end

  defp contents_and_type(:css_page, %{"view_id" => view_id}) do
    case RuntimeCSS.fetch_for_page(view_id) do
      {:ok, css} ->
        {css, "text/css"}

      _ ->
        {"/* failed to load css /*", "text/css"}
    end
  end

  defp contents_and_type(:js, _params), do: {@js, "text/javascript"}

  @doc """
  Returns the current hash for the given `asset`.
  """
  def current_hash(:css), do: @hashes.css
  def current_hash(:js), do: @hashes.js
end
