defmodule Beacon.LiveAdmin.LiveDataEditorLive.IndexTest do
  use Beacon.LiveAdmin.ConnCase, async: false
  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

  setup do
    on_exit(fn ->
      rpc(node1(), Beacon.Repo, :delete_all, [Beacon.Content.Page, [log: false]])
      rpc(node1(), Beacon.Repo, :delete_all, [Beacon.Content.Layout, [log: false]])
      rpc(node1(), Beacon.Repo, :delete_all, [Beacon.Content.LiveData, [log: false]])
    end)

    page_fixture()
    live_data_fixture(path: "/testpages/:page_id")
    live_data_fixture(path: "/testobjects/:object_id")

    :ok
  end

  test "display header and all live data paths", %{conn: conn} do
    {:ok, view, html} = live(conn, "/admin/site_a/live_data")

    assert assert has_element?(view, "#header-page-title", "Live Data")
    assert html =~ "/testpages/:page_id"
    assert html =~ "/testobjects/:object_id"
  end

  test "search paths", %{conn: conn} do
    {:ok, view, _html} = live(conn, "/admin/site_a/live_data")

    view
    |> form("#live-data-path-search")
    |> render_change(%{"search" => %{"query" => "pages"}})

    assert render(view) =~ "/testpages/:page_id"
    refute render(view) =~ "/testobjects/:object_id"

    view
    |> form("#live-data-path-search")
    |> render_change(%{"search" => %{"query" => "objects"}})

    refute render(view) =~ "/testpages/:page_id"
    assert render(view) =~ "/testobjects/:object_id"
  end

  test "create new path", %{conn: conn} do
    {:ok, view, _html} = live(conn, "/admin/site_a/live_data")

    view
    |> element("#header-new-path-button")
    |> render_click()

    {:ok, view, _html} =
      view
      |> form("#new-path-form")
      |> render_submit(%{"path" => "/my/fun/path"})
      |> follow_redirect(conn, "/admin/site_a/live_data/%2Fmy%2Ffun%2Fpath")

    assert render(view) =~ "/my/fun/path"
  end

  test "edit existing path", %{conn: conn} do
    {:ok, view, _html} = live(conn, "/admin/site_a/live_data/edit/%2Ftestpages%2F%3Apage_id")

    {:ok, _view, html} =
      view
      |> form("#edit-path-form", live_data: %{path: "/testposts/:post_id"})
      |> render_submit()
      |> follow_redirect(conn, "/admin/site_a/live_data")

     assert html =~ "/testposts/:post_id"
     refute html =~ "/testpages/:page_id"
  end

  test "raises when missing beacon_live_admin_url in the session" do
    assert_raise RuntimeError, fn ->
      conn =
        Phoenix.ConnTest.dispatch(
          build_conn(:get, "/admin/site_a/live_data"),
          Beacon.LiveAdminTest.PluglessEndpoint,
          :get,
          "/admin/site_a/live_data",
          nil
        )

      {:ok, _live, _html} = live(conn, "/admin/site_a/live_data")
    end
  end
end
