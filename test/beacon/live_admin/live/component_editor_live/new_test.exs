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
    |> form("#component-form", component: %{name: "site_a_header"})
    |> render_submit(%{
      component: %{"template" => "<h1>header</h1>", "example" => "<.header />"}
    })

    assert has_element?(live, "h1", "Edit Component")
    assert has_element?(live, "input[value='site_a_header']")
  end
end
