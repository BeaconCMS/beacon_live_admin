defmodule Beacon.LiveAdmin.Live.PageEditorLive.IndexTest do
  use Beacon.LiveAdmin.ConnCase, async: true
  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

  setup tags do
    node = :"node1@127.0.0.1"

    pid =
      rpc(node, Ecto.Adapters.SQL.Sandbox, :start_owner!, [
        Beacon.Repo,
        [shared: not tags[:async]]
      ])

    %{id: layout_id} =
      rpc(node, Beacon.Layouts, :create_layout!, [
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

    rpc(node, Beacon.Pages, :create_page!, [
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
      rpc(node, Ecto.Adapters.SQL.Sandbox, :stop_owner, [pid])
    end)
  end

  test "show all pages", %{conn: conn} do
    {:ok, live, html} = live(conn, "/admin/site_a/pages")
    assert html =~ "site_a_home_page"
  end
end
