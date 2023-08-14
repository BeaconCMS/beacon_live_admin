defmodule Beacon.LiveAdmin.LayoutEditorLive.IndexTest do
  use Beacon.LiveAdmin.ConnCase, async: false
  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

  setup do
    on_exit(fn ->
      rpc(node1(), Beacon.Repo, :delete_all, [Beacon.Content.Layout, [log: false]])
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
      |> element("form")
      |> render_change(%{search: %{query: "nope"}})

    refute html =~ "Site A - Main Layout"

    html =
      live
      |> element("form")
      |> render_change(%{search: %{query: "main"}})

    assert html =~ "Site A - Main Layout"
  end
end
