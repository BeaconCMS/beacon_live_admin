defmodule Beacon.LiveAdmin.PageEditorLive.EditTest do
  use Beacon.LiveAdmin.ConnCase, async: false
  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

  setup do
    node = :"node1@127.0.0.1"

    %{id: layout_id} =
      rpc(node, Beacon.Content, :create_layout!, [
        %{
          site: "site_a",
          title: "Site A - Home Page",
          stylesheet_urls: [],
          body: """
          <header>Site A Header</header>
          <%= @inner_content %>
          """
        }
      ])

    page =
      rpc(node, Beacon.Content, :create_page!, [
        %{
          skip_reload: true,
          path: "home",
          site: "site_a",
          title: "site_a_home_page",
          description: "site_a_home_page_desc",
          status: :published,
          layout_id: layout_id,
          template: """
          <main>
            <h1>site_a home page</h1>
          </main>
          """
        }
      ])

    on_exit(fn ->
      rpc(node, Beacon.Repo, :delete_all, [Beacon.Content.Page, [log: false]])
      rpc(node, Beacon.Repo, :delete_all, [Beacon.Content.Layout, [log: false]])
    end)

    [page: page]
  end

  test "save changes", %{conn: conn, page: page} do
    {:ok, live, html} = live(conn, "/admin/site_a/pages/#{page.id}")

    live
    |> form("#page-form", page: %{title: "site_a_other_page"})
    |> render_submit()

    {:ok, _live, html} = live(conn, "/admin/site_a/pages")

    assert html =~ "site_a_other_page"
  end

  test "publish", %{conn: conn, page: page} do
    {:ok, _live, html} = live(conn, "/admin/site_a/pages")
    refute html =~ "Published"

    {:ok, live, html} = live(conn, "/admin/site_a/pages/#{page.id}")

    live
    |> element("button", "Confirm")
    |> render_click()

    {:ok, _live, html} = live(conn, "/admin/site_a/pages")

    assert html =~ "Published"
  end
end
