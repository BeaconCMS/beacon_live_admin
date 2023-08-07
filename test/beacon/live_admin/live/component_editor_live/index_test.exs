defmodule Beacon.LiveAdmin.ComponentEditorLive.IndexTest do
  use Beacon.LiveAdmin.ConnCase, async: false
  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

  setup do
    node = :"node1@127.0.0.1"

    rpc(node, Beacon.Content, :create_component, [
      %{
        site: "site_a",
        name: "Site A - Header",
        body: """
        <header>Site A Header</header>
        """
      }
    ])

    on_exit(fn ->
      rpc(node, Beacon.Repo, :delete_all, [Beacon.Content.Component, [log: false]])
    end)
  end

  test "display all components", %{conn: conn} do
    {:ok, live, html} = live(conn, "/admin/site_a/components")
    assert html =~ "Site A - Header"
  end
end
