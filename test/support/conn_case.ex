defmodule Beacon.LiveAdmin.ConnCase do
  use ExUnit.CaseTemplate

  using do
    quote do
      @endpoint Beacon.LiveAdminTest.Endpoint
      @router Beacon.LiveAdminTest.Router
      @socket %Phoenix.LiveView.Socket{endpoint: @endpoint, router: @router}

      import Beacon.LiveAdmin.ConnCase
      import Beacon.LiveAdmin.Fixtures
      import Plug.Conn
      import Phoenix.ConnTest
      import Phoenix.LiveViewTest
    end
  end

  setup do
    {:ok, conn: Phoenix.ConnTest.build_conn()}
  end
end
