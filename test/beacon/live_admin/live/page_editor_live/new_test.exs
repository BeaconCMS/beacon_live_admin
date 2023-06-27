defmodule Beacon.LiveAdmin.Live.PageEditorLive.NewTest do
  use Beacon.LiveAdmin.ConnCase, async: false
  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

  setup tags do
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

    on_exit(fn ->
      rpc(node, Beacon.Repo, :delete_all, [Beacon.Content.Page, [log: false]])
      rpc(node, Beacon.Repo, :delete_all, [Beacon.Content.Layout, [log: false]])
    end)
  end

  test "create new page and patch to edit page", %{conn: conn} do
    {:ok, live, html} = live(conn, "/admin/site_a/pages/new")

    live
    |> form("#page-form", page: %{path: "/my/page", title: "My Page", format: "heex"})
    |> render_submit(%{page: %{"template" => "<div>test</div>"}})

    assert has_element?(live, "h1", "Edit Page")
    assert has_element?(live, "button", "Save Changes")
  end
end
