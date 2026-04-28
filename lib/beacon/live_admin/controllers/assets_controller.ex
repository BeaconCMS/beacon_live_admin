defmodule Beacon.LiveAdmin.AssetsController do
  @moduledoc false

  import Plug.Conn

  @dev_mode Code.ensure_loaded?(Mix.Project) and Mix.env() == :dev

  phoenix_js_paths =
    for app <- [:phoenix, :phoenix_html, :phoenix_live_view] do
      path = Application.app_dir(app, ["priv", "static", "#{app}.js"])
      Module.put_attribute(__MODULE__, :external_resource, path)
      path
    end

  @phoenix_js for(path <- phoenix_js_paths, into: "", do: File.read!(path) |> String.replace("//# sourceMappingURL=", "// "))

  # ---------------------------------------------------------------------------
  # CSS: minimal bootstrap — full CSS compiled at runtime via WASM
  # ---------------------------------------------------------------------------

  # Load DaisyUI plugin CSS to be served to the browser for WASM compilation
  daisyui_dir = Path.join([__DIR__, "../../../../assets/node_modules/daisyui/dist"]) |> Path.expand()

  daisyui_plugin_css =
    if File.exists?(daisyui_dir) do
      styled = File.read!(Path.join(daisyui_dir, "styled.css"))
      themes = File.read!(Path.join(daisyui_dir, "themes.css"))

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

  @plugin_css daisyui_plugin_css

  # Fallback CSS served before WASM initializes — just the pre-built file
  css_path = Path.join(__DIR__, "../../../../priv/static/beacon_live_admin.min.css")
  @external_resource css_path

  @css if File.exists?(css_path), do: File.read!(css_path), else: ""

  # WASM binary
  wasm_path = Path.join(__DIR__, "../../../../priv/static/tailwind_compiler.wasm")
  @external_resource wasm_path
  @wasm if File.exists?(wasm_path), do: File.read!(wasm_path), else: ""

  # ---------------------------------------------------------------------------
  # JS
  # ---------------------------------------------------------------------------

  js_path =
    if Code.ensure_loaded?(Mix.Project) and Mix.env() == :dev do
      Path.join(__DIR__, "../../../../priv/static/beacon_live_admin.js")
    else
      Path.join(__DIR__, "../../../../priv/static/beacon_live_admin.min.js")
    end

  @external_resource js_path

  @js """
  #{@phoenix_js}
  #{File.read!(js_path)}
  """

  @hashes %{
    css: Base.encode16(:crypto.hash(:md5, @css), case: :lower),
    js: Base.encode16(:crypto.hash(:md5, @js), case: :lower),
    wasm: Base.encode16(:crypto.hash(:md5, @wasm), case: :lower),
    plugin_css: Base.encode16(:crypto.hash(:md5, @plugin_css), case: :lower)
  }

  def init(asset) when asset in [:css, :js, :wasm, :plugin_css], do: asset

  def call(conn, asset) do
    {contents, content_type} = contents_and_type(asset)

    conn
    |> put_resp_header("content-type", content_type)
    |> put_resp_header("cache-control", "public, max-age=31536000, immutable")
    |> put_private(:plug_skip_csrf_protection, true)
    |> send_resp(200, contents)
    |> halt()
  end

  defp contents_and_type(:plugin_css), do: {@plugin_css, "text/css"}

  if @dev_mode do
    @css_path css_path
    @js_path js_path
    @wasm_path wasm_path

    defp contents_and_type(:css) do
      {if(File.exists?(@css_path), do: File.read!(@css_path), else: ""), "text/css"}
    end

    defp contents_and_type(:js) do
      js = if(File.exists?(@js_path), do: File.read!(@js_path), else: "")
      {@phoenix_js <> js, "text/javascript"}
    end

    defp contents_and_type(:wasm) do
      {if(File.exists?(@wasm_path), do: File.read!(@wasm_path), else: ""), "application/wasm"}
    end

    @doc """
    Returns the current hash for the given `asset`.
    """
    def current_hash(:css),
      do: Base.encode16(:crypto.hash(:md5, elem(contents_and_type(:css), 0)), case: :lower)

    def current_hash(:js),
      do: Base.encode16(:crypto.hash(:md5, elem(contents_and_type(:js), 0)), case: :lower)

    def current_hash(:wasm),
      do: Base.encode16(:crypto.hash(:md5, elem(contents_and_type(:wasm), 0)), case: :lower)

    def current_hash(:plugin_css), do: @hashes.plugin_css
  else
    defp contents_and_type(:css), do: {@css, "text/css"}
    defp contents_and_type(:js), do: {@js, "text/javascript"}
    defp contents_and_type(:wasm), do: {@wasm, "application/wasm"}

    @doc """
    Returns the current hash for the given `asset`.
    """
    def current_hash(:css), do: @hashes.css
    def current_hash(:js), do: @hashes.js
    def current_hash(:wasm), do: @hashes.wasm
    def current_hash(:plugin_css), do: @hashes.plugin_css
  end
end
