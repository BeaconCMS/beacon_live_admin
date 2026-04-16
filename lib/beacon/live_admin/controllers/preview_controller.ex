defmodule Beacon.LiveAdmin.PreviewController do
  @moduledoc false

  import Plug.Conn

  def init(opts), do: opts

  def call(conn, _opts) do
    site = String.to_existing_atom(conn.params["site"])
    page_id = conn.params["id"]
    type = conn.params["type"] || "page"

    html = render_preview(site, type, page_id)

    conn
    |> put_resp_header("content-type", "text/html; charset=utf-8")
    |> put_resp_header("x-frame-options", "SAMEORIGIN")
    |> put_private(:plug_skip_csrf_protection, true)
    |> send_resp(200, html)
    |> halt()
  end

  defp render_preview(site, "page", page_id) do
    page = Beacon.Content.get_page!(site, page_id)
    layout = Beacon.Content.get_layout(site, page.layout_id)

    assigns = preview_assigns(site, page)

    # Render page template
    page_ast = Beacon.Template.Parser.parse(page.template || "")
    page_html = render_ast(page_ast, assigns)

    # Render layout with page content as inner_content
    if layout do
      layout_ast = Beacon.Template.Parser.parse(layout.template || "")
      layout_assigns = Map.put(assigns, :inner_content, page_html)
      layout_html = render_ast(layout_ast, layout_assigns)
      wrap_html(site, page.title || "Preview", layout_html)
    else
      wrap_html(site, page.title || "Preview", page_html)
    end
  end

  defp render_preview(site, "error_page", status) do
    error_page = Beacon.Content.get_error_page(site, String.to_integer(status))

    if error_page do
      ast = Beacon.Template.Parser.parse(error_page.template || "")
      html = render_ast(ast, %{})
      wrap_html(site, "Error #{status}", html)
    else
      wrap_html(site, "Error #{status}", "<p>No error page template for status #{status}</p>")
    end
  end

  defp render_preview(site, "layout", layout_id) do
    layout = Beacon.Content.get_layout(site, layout_id)

    if layout do
      placeholder = """
      <div style="padding: 2rem; margin: 2rem; border: 2px dashed #94a3b8; border-radius: 0.5rem; text-align: center; color: #64748b; font-family: system-ui;">
        <p style="font-size: 1.25rem; font-weight: 600;">Page Content Area</p>
        <p style="font-size: 0.875rem;">This is where the page content will be rendered</p>
      </div>
      """

      layout_ast = Beacon.Template.Parser.parse(layout.template || "")
      layout_assigns = %{inner_content: placeholder}
      html = render_ast(layout_ast, layout_assigns)
      wrap_html(site, layout.title || "Layout Preview", html)
    else
      wrap_html(site, "Layout Preview", "<p>Layout not found</p>")
    end
  end

  defp render_preview(_site, _type, _id) do
    wrap_html(nil, "Preview", "<p>Unknown preview type</p>")
  end

  defp render_ast(ast, assigns) do
    ast
    |> Beacon.Client.LiveViewCompiler.render_to_iodata(assigns)
    |> IO.iodata_to_binary()
  end

  defp preview_assigns(site, page) do
    %{
      beacon: %{
        site: site,
        page: %{
          path: page.path,
          title: page.title,
          description: page.description,
          fields: page.fields || %{}
        },
        private: %{
          page_id: page.id,
          layout_id: page.layout_id
        }
      },
      page_title: page.title || "",
      inner_content: ""
    }
  end

  defp wrap_html(site, title, body) do
    stylesheets = site_stylesheets(site)

    """
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>#{Phoenix.HTML.html_escape(title) |> Phoenix.HTML.safe_to_string()}</title>
      #{stylesheets}
      <style>
        /* Preview indicator */
        body::before {
          content: "PREVIEW";
          position: fixed;
          top: 8px;
          right: 8px;
          z-index: 99999;
          background: #f59e0b;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          padding: 2px 8px;
          border-radius: 4px;
          font-family: system-ui;
          pointer-events: none;
        }
      </style>
    </head>
    <body>
      #{body}
    </body>
    </html>
    """
  end

  defp site_stylesheets(nil), do: ""

  defp site_stylesheets(site) do
    try do
      hash = Beacon.RuntimeCSS.current_hash(site)
      ~s(<link rel="stylesheet" href="/__beacon_assets__/css-#{hash}">)
    rescue
      _ -> ""
    end
  end
end
