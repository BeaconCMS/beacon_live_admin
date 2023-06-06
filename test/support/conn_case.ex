defmodule Beacon.LiveAdmin.ConnCase do
  use ExUnit.CaseTemplate

  using do
    quote do
      @endpoint Beacon.LiveAdminTest.Endpoint
      import Plug.Conn
      import Phoenix.ConnTest
      import Phoenix.LiveViewTest
      import Beacon.LiveAdmin.ConnCase
    end
  end

  setup do
    {:ok, conn: Phoenix.ConnTest.build_conn()}
  end
end
