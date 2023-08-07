defmodule Beacon.LiveAdmin.LayoutEditorLive.IndexTest do
  use Beacon.LiveAdmin.ConnCase, async: false
  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

  setup do
    node = :"node1@127.0.0.1"

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
  end

  test "display all layouts", %{conn: conn} do
    {:ok, live, html} = live(conn, "/admin/site_a/layouts")
    assert html =~ "Site A - Main Layout"
    assert html =~ "Draft"
  end

  test "search layouts by title", %{conn: conn} do
    {:ok, live, html} = live(conn, "/admin/site_a/layouts")

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
