defmodule Beacon.LiveAdmin.LayoutEditorLive.NewTest do
  use Beacon.LiveAdmin.ConnCase, async: false
  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

  setup do
    node = :"node1@127.0.0.1"

    on_exit(fn ->
      rpc(node, Beacon.Repo, :delete_all, [Beacon.Content.Layout, [log: false]])
    end)
  end

  test "create a new draft layout", %{conn: conn} do
    {:ok, live, html} = live(conn, "/admin/site_a/layouts/new")

    html =
      live
      |> form("#layout-form", layout: %{title: "Main Layout"})
      |> render_submit(%{layout: %{"body" => "<div>test</div>"}})

    assert has_element?(live, "h1", "Main Layout")
    assert has_element?(live, "a", "Draft (not public)")
  end
end
