defmodule Beacon.LiveAdmin.ComponentEditorLive.NewTest do
  use Beacon.LiveAdmin.ConnCase, async: false
  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

  setup do
    on_exit(fn ->
      rpc(node1(), Beacon.Repo, :delete_all, [Beacon.Content.Component, [log: false]])
    end)
  end

  test "create a new component", %{conn: conn} do
    {:ok, live, _html} = live(conn, "/admin/site_a/components/new")

    live
    |> form("#component-form", component: %{name: "Site A - Header"})
    |> render_submit(%{component: %{"template" => "<header>header_site_a</header>"}})

    assert has_element?(live, "h1", "Edit Component")
    assert has_element?(live, "input[value='Site A - Header']")
  end
end
