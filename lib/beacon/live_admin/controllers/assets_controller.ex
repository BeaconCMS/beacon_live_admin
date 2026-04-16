defmodule Beacon.LiveAdmin.AssetsController do
  @moduledoc false

  import Plug.Conn

  phoenix_js_paths =
    for app <- [:phoenix, :phoenix_html, :phoenix_live_view] do
      path = Application.app_dir(app, ["priv", "static", "#{app}.js"])
      Module.put_attribute(__MODULE__, :external_resource, path)
      path
    end

  # ---------------------------------------------------------------------------
  # CSS: compiled at build time using TailwindCompiler NIF + DaisyUI
  # ---------------------------------------------------------------------------

  # 1. Extract CSS candidates from all LiveAdmin templates
  lib_dir = Path.join(__DIR__, "../../..") |> Path.expand()

  template_files = Path.wildcard(Path.join(lib_dir, "**/*.{ex,heex}"))

  candidates =
    template_files
    |> Enum.reduce(MapSet.new(), fn path, acc ->
      content = File.read!(path)

      file_candidates =
        content
        |> String.split(~r/[\s"'`<{},;]/)
        |> Enum.filter(fn token ->
          byte_size(token) > 1 and
            String.match?(token, ~r/^[!@a-z0-9\-\[]/i) and
            String.match?(token, ~r/[a-z]/i) and
            not String.contains?(token, ["<%", "%>", "<%=", "<.", "</.", "{@", "{{"])
        end)
        |> MapSet.new()

      MapSet.union(acc, file_candidates)
    end)
    |> MapSet.to_list()

  # 2. Load DaisyUI plugin CSS via the plugin_css API
  #    The TailwindCompiler parses plugin CSS to extract theme colors
  #    (so bg-base-100, text-primary, etc. become native utilities)
  #    and includes component CSS (.btn, .alert, .table, etc.)
  daisyui_dir = Path.join([__DIR__, "../../../../assets/node_modules/daisyui/dist"]) |> Path.expand()

  plugin_css =
    if File.exists?(daisyui_dir) do
      styled = File.read!(Path.join(daisyui_dir, "styled.css"))
      themes = File.read!(Path.join(daisyui_dir, "themes.css"))

      # Custom beacon themes — registered as plugin CSS so the compiler
      # extracts --color-* variables for utility generation
      beacon_themes = """
      [data-theme="beacon"] {
        --color-primary: oklch(51.06% 0.23 276.97);
        --color-primary-content: oklch(100% 0 0);
        --color-secondary: oklch(58.54% 0.204 277.12);
        --color-secondary-content: oklch(100% 0 0);
        --color-accent: oklch(60.56% 0.219 292.72);
        --color-accent-content: oklch(100% 0 0);
        --color-neutral: oklch(27.95% 0.037 260.03);
        --color-neutral-content: oklch(92.88% 0.013 255.51);
        --color-base-100: oklch(100% 0 0);
        --color-base-200: oklch(98.42% 0.003 247.86);
        --color-base-300: oklch(96.83% 0.007 247.9);
        --color-base-content: oklch(20.77% 0.04 265.75);
        --color-info: oklch(62.31% 0.188 259.81);
        --color-info-content: oklch(100% 0 0);
        --color-success: oklch(69.59% 0.149 162.48);
        --color-success-content: oklch(100% 0 0);
        --color-warning: oklch(76.86% 0.165 70.08);
        --color-warning-content: oklch(100% 0 0);
        --color-error: oklch(63.68% 0.208 25.33);
        --color-error-content: oklch(100% 0 0);
        color-scheme: light;
      }
      [data-theme="beacon-dark"] {
        --color-primary: oklch(58.54% 0.204 277.12);
        --color-primary-content: oklch(100% 0 0);
        --color-secondary: oklch(68.01% 0.158 276.93);
        --color-secondary-content: oklch(100% 0 0);
        --color-accent: oklch(70.9% 0.159 293.54);
        --color-accent-content: oklch(100% 0 0);
        --color-neutral: oklch(37.17% 0.039 257.29);
        --color-neutral-content: oklch(92.88% 0.013 255.51);
        --color-base-100: oklch(20.77% 0.04 265.75);
        --color-base-200: oklch(12.88% 0.041 264.7);
        --color-base-300: oklch(27.95% 0.037 260.03);
        --color-base-content: oklch(92.88% 0.013 255.51);
        --color-info: oklch(71.37% 0.143 254.62);
        --color-info-content: oklch(20.77% 0.04 265.75);
        --color-success: oklch(77.29% 0.153 163.22);
        --color-success-content: oklch(20.77% 0.04 265.75);
        --color-warning: oklch(83.69% 0.164 84.43);
        --color-warning-content: oklch(20.77% 0.04 265.75);
        --color-error: oklch(71.06% 0.166 22.22);
        --color-error-content: oklch(20.77% 0.04 265.75);
        color-scheme: dark;
      }
      """

      styled <> "\n" <> themes <> "\n" <> beacon_themes
    else
      ""
    end

  # 3. Custom CSS (font imports, non-plugin CSS)
  custom_css = """
  @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&display=swap");
  """

  # 4. Compile with TailwindCompiler — plugin_css extracts theme colors
  #    and includes component/utility CSS from the plugin
  @css (case TailwindCompiler.compile(candidates,
           preflight: true,
           custom_css: custom_css,
           plugin_css: plugin_css
         ) do
    {:ok, css} -> css
    {:error, reason} ->
      IO.warn("TailwindCompiler failed for beacon_live_admin: #{inspect(reason)}")
      css_path = Path.join(__DIR__, "../../../../priv/static/beacon_live_admin.min.css")
      if File.exists?(css_path), do: File.read!(css_path), else: ""
  end)

  # ---------------------------------------------------------------------------
  # JS: same as before
  # ---------------------------------------------------------------------------

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

  def init(asset) when asset in [:css, :js], do: asset

  def call(conn, asset) do
    {contents, content_type} = contents_and_type(asset)

    conn
    |> put_resp_header("content-type", content_type)
    |> put_resp_header("cache-control", "public, max-age=31536000, immutable")
    |> put_private(:plug_skip_csrf_protection, true)
    |> send_resp(200, contents)
    |> halt()
  end

  defp contents_and_type(:css), do: {@css, "text/css"}

  defp contents_and_type(:js), do: {@js, "text/javascript"}

  @doc """
  Returns the current hash for the given `asset`.
  """
  def current_hash(:css), do: @hashes.css
  def current_hash(:js), do: @hashes.js
end
