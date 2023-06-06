defmodule Beacon.LiveAdmin.Live.HomeLiveTest do
  use Beacon.LiveAdmin.ConnCase, async: true

  test "display all running sites", %{conn: conn} do
    {:ok, live, html} = live(conn, "/admin")
    assert has_element?(live, ~s{[href="/admin/my_site/pages"]})
  end
end
