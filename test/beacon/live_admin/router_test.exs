defmodule Beacon.LiveAdmin.RouterTest do
  use ExUnit.Case, async: true

  alias Beacon.LiveAdmin.Router

  test "beacon_live_admin_path" do
    socket = %Phoenix.LiveView.Socket{
      endpoint: Beacon.LiveAdminTest.Endpoint,
      router: Beacon.LiveAdminTest.Router
    }

    assert Router.beacon_live_admin_path(socket, :my_site, "/pages") ==
             "/admin/my_site/pages"

    assert Router.beacon_live_admin_path(socket, :my_site, "/pages", status: :draft) ==
             "/admin/my_site/pages?status=draft"
  end
end
