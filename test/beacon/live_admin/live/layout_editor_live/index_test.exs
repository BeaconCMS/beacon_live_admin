defmodule Beacon.LiveAdmin.LayoutEditorLive.IndexTest do
  use Beacon.LiveAdmin.ConnCase, async: false
  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

  setup do
    on_exit(fn ->
      rpc(node1(), MyApp.Repo, :delete_all, [Beacon.Content.Layout, [log: false]])
    end)

    layout_fixture()

    :ok
  end

  test "display all layouts", %{conn: conn} do
    {:ok, _live, html} = live(conn, "/admin/site_a/layouts")
    assert html =~ "Site A - Main Layout"
    assert html =~ "Draft"
  end

  test "search layouts by title", %{conn: conn} do
    {:ok, live, _html} = live(conn, "/admin/site_a/layouts")

    html =
      live
      |> element("#search-form")
      |> render_change(%{search: %{query: "nope"}})

    refute html =~ "Site A - Main Layout"

    html =
      live
      |> element("#search-form")
      |> render_change(%{search: %{query: "main"}})

    assert html =~ "Site A - Main Layout"
  end

  test "display a site selector", %{conn: conn} do
    {:ok, live, _html} = live(conn, "/admin/site_a/layouts")

    live
    |> element("#site-selector-form")
    |> render_change(%{site: "site_c"})

    assert_redirected(live, "/admin/site_c/layouts")
  end
end
