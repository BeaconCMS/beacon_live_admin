defmodule Beacon.LiveAdmin.Live.HomeLiveTest do
  use Beacon.LiveAdmin.ConnCase, async: true

  test "show all running sites", %{conn: conn} do
    {:ok, live, html} = live(conn, "/admin")
    assert has_element?(live, ~s{[href="/admin/site_a/pages"]})
    assert has_element?(live, ~s{[href="/admin/site_b/pages"]})
    assert has_element?(live, ~s{[href="/admin/site_c/pages"]})
  end
end
