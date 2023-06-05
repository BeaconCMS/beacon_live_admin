defmodule Beacon.LiveAdmin.Web do
  @moduledoc false

  @doc """
  Generates prefix `path` for live admin.

    ## Examples

        iex> Beacon.LiveAdmin.Web.live_admin_path(@socket, :my_site, "/pages")
        "/my_admin/my_site/pages"

        iex> Beacon.LiveAdmin.Web.live_admin_path(@socket, :my_site, "/pages", status: :draft)
        "/my_admin/my_site/pages?status=draft"

  """
  def live_admin_path(conn_or_socket, site, path, params \\ %{})
      when is_atom(site) and is_binary(path) do
    router = router(conn_or_socket)
    prefix = router.__beacon_live_admin_prefix__()
    path = build_path_with_prefix(prefix, site, path)
    params = for {key, val} <- params, do: {key, val}
    Phoenix.VerifiedRoutes.unverified_path(conn_or_socket, router, path, params)
  end

  defp router(%Plug.Conn{private: %{phoenix_router: router}}), do: router
  defp router(%Phoenix.LiveView.Socket{router: router}), do: router

  defp build_path_with_prefix(prefix, site, "/") do
    "#{prefix}/#{site}"
  end

  defp build_path_with_prefix(prefix, site, path) do
    sanitize_path("#{prefix}/#{site}/#{path}")
  end

  defp sanitize_path(path) do
    String.replace(path, "//", "/")
  end

  def router do
    quote do
      use Phoenix.Router, helpers: false

      import Plug.Conn
      import Phoenix.Controller
      import Phoenix.LiveView.Router
    end
  end

  def channel do
    quote do
      use Phoenix.Channel
    end
  end

  def controller do
    quote do
      use Phoenix.Controller,
        formats: [:html, :json],
        layouts: [html: Beacon.LiveAdmin.Layouts]

      import Plug.Conn
      import Beacon.LiveAdmin.Gettext
    end
  end

  def live_view do
    quote do
      use Phoenix.LiveView,
        layout: {Beacon.LiveAdmin.Layouts, :app}

      unquote(html_helpers())
    end
  end

  def live_component do
    quote do
      use Phoenix.LiveComponent

      unquote(html_helpers())
    end
  end

  def html do
    quote do
      use Phoenix.Component

      import Phoenix.Controller,
        only: [get_csrf_token: 0, view_module: 1, view_template: 1]

      unquote(html_helpers())
    end
  end

  defp html_helpers do
    quote do
      import Phoenix.HTML
      import Beacon.LiveAdmin.CoreComponents
      import Beacon.LiveAdmin.Gettext
      alias Phoenix.LiveView.JS
    end
  end

  defmacro __using__(which) when is_atom(which) do
    apply(__MODULE__, which, [])
  end
end
