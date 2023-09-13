defmodule Beacon.LiveAdmin.LayoutEditorLive.EditTest do
  use Beacon.LiveAdmin.ConnCase, async: false
  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

  setup do
    on_exit(fn ->
      rpc(node1(), Beacon.Repo, :delete_all, [Beacon.Content.Layout, [log: false]])
    end)

    [layout: layout_fixture()]
  end

  test "save changes", %{conn: conn, layout: layout} do
    {:ok, live, _html} = live(conn, "/admin/site_a/layouts/#{layout.id}")

    live
    |> form("#layout-form", layout: %{title: "Other Layout"})
    |> render_submit()

    {:ok, _live, html} = live(conn, "/admin/site_a/layouts")

    assert html =~ "Other Layout"
  end

  test "publish", %{conn: conn, layout: layout} do
    {:ok, _live, html} = live(conn, "/admin/site_a/layouts")
    refute html =~ "Published"

    {:ok, live, _html} = live(conn, "/admin/site_a/layouts/#{layout.id}")

    live
    |> element("button", "Confirm")
    |> render_click()

    {:ok, _live, html} = live(conn, "/admin/site_a/layouts")

    assert html =~ "Published"
  end
end
