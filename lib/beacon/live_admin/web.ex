defmodule Beacon.LiveAdmin.Web do
  @moduledoc false

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
      import Beacon.LiveAdmin.AdminComponents
      import Beacon.LiveAdmin.Components, only: [template_error: 1]
      import Beacon.LiveAdmin.Gettext
      import LiveSvelte

      import Beacon.LiveAdmin.Router,
        only: [
          beacon_live_admin_path: 3,
          beacon_live_admin_path: 4,
          beacon_live_admin_static_path: 1
        ]

      alias Phoenix.LiveView.JS
    end
  end

  defmacro __using__(which) when is_atom(which) do
    apply(__MODULE__, which, [])
  end
end
