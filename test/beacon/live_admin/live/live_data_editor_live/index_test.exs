defmodule Beacon.LiveAdmin.LiveDataEditorLive.IndexTest do
  use Beacon.LiveAdmin.ConnCase, async: false
  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

  setup do
    on_exit(fn ->
      rpc(node1(), Beacon.Repo, :delete_all, [Beacon.Content.Page, [log: false]])
      rpc(node1(), Beacon.Repo, :delete_all, [Beacon.Content.Layout, [log: false]])
      rpc(node1(), Beacon.Repo, :delete_all, [Beacon.Content.LiveData, [log: false]])
    end)

    page = page_fixture()
    ld1 = live_data_fixture(node1(), path: "/testpages/:page_id")
    ld2 = live_data_fixture(node1(), path: "/testobjects/:object_id")

    [page: page, live_data: [ld1, ld2]]
  end

  test "display header and all live data paths", %{conn: conn, live_data: [ld1, ld2]} do
    {:ok, view, html} = live(conn, "/admin/site_a/live_data")

    assert assert has_element?(view, "#header-page-title", "Live Data")
    assert html =~ ld1.path
    assert html =~ ld2.path
  end

  test "search paths", %{conn: conn, live_data: [ld1, ld2]} do
    {:ok, view, _html} = live(conn, "/admin/site_a/live_data")

    view
    |> form("#live-data-path-search")
    |> render_change(%{"search" => %{"query" => ld1.path}})

    assert has_element?(view, "#live-data-table-row-#{ld1.id}")
    refute has_element?(view, "#live-data-table-row-#{ld2.id}")

    view
    |> form("#live-data-path-search")
    |> render_change(%{"search" => %{"query" => ld2.path}})

    refute has_element?(view, "#live-data-table-row-#{ld1.id}")
    assert has_element?(view, "#live-data-table-row-#{ld2.id}")
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
      |> follow_redirect(conn)

    assert render(view) =~ "/my/fun/path"
  end

  test "edit existing path", %{conn: conn, live_data: [ld1, _ld2]} do
    {:ok, view, _html} = live(conn, "/admin/site_a/live_data/edit/#{ld1.id}")

    new_path = "/testposts/:post_id"

    {:ok, _view, html} =
      view
      |> form("#edit-path-form", path: new_path)
      |> render_submit()
      |> follow_redirect(conn, "/admin/site_a/live_data")

    assert html =~ new_path
    refute html =~ ld1.path
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
