defmodule Beacon.LiveAdmin.LayoutEditorLive.EditTest do
  use Beacon.LiveAdmin.ConnCase, async: false
  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

  setup tags do
    node = :"node1@127.0.0.1"

    layout =
      rpc(node, Beacon.Content, :create_layout!, [
        %{
          site: "site_a",
          title: "Site A - Main Layout",
          stylesheet_urls: [],
          body: """
          <header>Site A Header</header>
          <%= @inner_content %>
          """
        }
      ])

    on_exit(fn ->
      rpc(node, Beacon.Repo, :delete_all, [Beacon.Content.Layout, [log: false]])
    end)

    [layout: layout]
  end

  test "save changes", %{conn: conn, layout: layout} do
    {:ok, live, html} = live(conn, "/admin/site_a/layouts/#{layout.id}")

    live
    |> form("#layout-form", layout: %{title: "Other Layout"})
    |> render_submit()

    {:ok, _live, html} = live(conn, "/admin/site_a/layouts")

    assert html =~ "Other Layout"
  end

  test "publish", %{conn: conn, layout: layout} do
    {:ok, _live, html} = live(conn, "/admin/site_a/layouts")
    refute html =~ "Published"

    {:ok, live, html} = live(conn, "/admin/site_a/layouts/#{layout.id}")

    live
    |> element("button", "Confirm")
    |> render_click()

    {:ok, _live, html} = live(conn, "/admin/site_a/layouts")

    assert html =~ "Published"
  end
end
