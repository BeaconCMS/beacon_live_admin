defmodule Beacon.LiveAdmin.ComponentEditorLive.IndexTest do
  use Beacon.LiveAdmin.ConnCase, async: false
  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

  setup do
    node = :"node1@127.0.0.1"

    rpc(node, Beacon.Content, :create_component, [
      %{
        site: "site_a",
        name: "site_a_header",
        template: "<h1>header</h1>",
        example: "<.header />"
      }
    ])

    on_exit(fn ->
      rpc(node, MyApp.Repo, :delete_all, [Beacon.Content.Component, [log: false]])
    end)
  end

  test "display all components", %{conn: conn} do
    {:ok, _live, html} = live(conn, "/admin/site_a/components")
    assert html =~ "site_a_header"
  end

  test "search components by name", %{conn: conn} do
    {:ok, live, _html} = live(conn, "/admin/site_a/components")

    html =
      live
      |> element("#search-form")
      |> render_change(%{search: %{query: "nope"}})

    refute html =~ "site_a_header"

    html =
      live
      |> element("#search-form")
      |> render_change(%{search: %{query: "header"}})

    assert html =~ "site_a_header"
  end

  test "display a site selector", %{conn: conn} do
    {:ok, live, _html} = live(conn, "/admin/site_a/components")

    live
    |> element("#site-selector-form")
    |> render_change(%{site: "site_c"})

    assert_redirected(live, "/admin/site_c/components")
  end
end
