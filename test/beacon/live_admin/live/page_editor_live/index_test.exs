defmodule Beacon.LiveAdmin.Live.PageEditorLive.IndexTest do
  use Beacon.LiveAdmin.ConnCase, async: true
  alias Beacon.LiveAdmin.Live.PageEditorLive.Index

  test "show all pages", %{conn: conn} do
    {:ok, _live, html} = live(conn, "/admin/my_site/pages")
    assert html =~ "test_home_page"
  end
end
