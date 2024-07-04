defmodule Beacon.LiveAdmin.PageEditorLive.EditTest do
  use Beacon.LiveAdmin.ConnCase, async: false
  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

  setup do
    on_exit(fn ->
      rpc(node1(), MyApp.Repo, :delete_all, [Beacon.Content.Page, [log: false]])
      rpc(node1(), MyApp.Repo, :delete_all, [Beacon.Content.Layout, [log: false]])
    end)

    [page: page_fixture()]
  end

  test "save changes", %{conn: conn, page: page} do
    {:ok, live, _html} = live(conn, "/admin/site_a/pages/#{page.id}")

    live
    |> form("#page-form", page: %{title: "site_a_other_page"})
    |> render_submit()

    {:ok, _live, html} = live(conn, "/admin/site_a/pages")

    assert html =~ "site_a_other_page"
  end

  test "publish", %{conn: conn, page: page} do
    {:ok, _live, html} = live(conn, "/admin/site_a/pages")
    refute html =~ "Published"

    {:ok, live, _html} = live(conn, "/admin/site_a/pages/#{page.id}")

    live
    |> element("button", "Confirm")
    |> render_click()

    {:ok, _live, html} = live(conn, "/admin/site_a/pages")

    assert html =~ "Published"
  end
end
