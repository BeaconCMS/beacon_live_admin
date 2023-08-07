defmodule Beacon.LiveAdmin.ConnCase do
  use ExUnit.CaseTemplate

  using do
    quote do
      @endpoint Beacon.LiveAdminTest.Endpoint
      import Beacon.LiveAdmin.ConnCase
      import Beacon.LiveAdmin.Fixtures
      import Phoenix.ConnTest
      import Phoenix.LiveViewTest
      import Plug.Conn
    end
  end

  setup do
    {:ok, conn: Phoenix.ConnTest.build_conn()}
  end
end
