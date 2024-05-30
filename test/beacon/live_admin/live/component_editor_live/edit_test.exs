defmodule Beacon.LiveAdmin.ComponentEditorLive.EditTest do
  use Beacon.LiveAdmin.ConnCase, async: false
  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

  setup do
    node = :"node1@127.0.0.1"

    component =
      rpc(node, Beacon.Content, :create_component!, [
        %{
          site: "site_a",
          name: "Site A - Header",
          template: """
          <header>site_a_header</header>
          """
        }
      ])

    on_exit(fn ->
      rpc(node, Beacon.Repo, :delete_all, [Beacon.Content.Component, [log: false]])
    end)

    [component: component]
  end

  test "save changes", %{conn: conn, component: component} do
    {:ok, live, _html} = live(conn, "/admin/site_a/components/#{component.id}")

    live
    |> form("#component-form", component: %{name: "Site A - Other"})
    |> render_submit()

    {:ok, _live, html} = live(conn, "/admin/site_a/components")

    assert html =~ "Site A - Other"
  end
end
