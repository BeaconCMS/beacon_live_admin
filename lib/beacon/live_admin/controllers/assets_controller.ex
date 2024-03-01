defmodule Beacon.LiveAdmin.AssetsController do
  @moduledoc false
  import Plug.Conn

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
    :css => Base.encode16(:crypto.hash(:md5, @css), case: :lower),
    :js => Base.encode16(:crypto.hash(:md5, @js), case: :lower)
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
    {Beacon.LiveAdmin.RuntimeCSS.fetch(site, :uncompressed), "text/css"}
  end

  defp contents_and_type(:css_page, %{"site" => site, "page_id" => page_id}) do
    css =
      with %{site: site, template: template} <- Beacon.LiveAdmin.Content.get_page(site, page_id),
           {:ok, stylesheet} <- Beacon.LiveAdmin.RuntimeCSS.compile(site, template) do
        stylesheet
      else
        {:error, error} ->
          """
          /*
          #{error}
          /*
          """

        _ ->
          "/* failed to generate the page stylesheet */"
      end

    {css, "text/css"}
  end

  defp contents_and_type(:js, _params), do: {@js, "text/javascript"}

  @doc """
  Returns the current hash for the given `asset`.
  """
  def current_hash(:css), do: @hashes.css
  def current_hash(:js), do: @hashes.js
end
