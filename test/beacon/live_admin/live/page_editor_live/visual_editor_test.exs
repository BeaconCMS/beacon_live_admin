defmodule Beacon.LiveAdmin.PageEditorLive.VisualEditorTest do
  use Beacon.LiveAdmin.ConnCase, async: false
  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

  setup do
    on_exit(fn ->
      rpc(node1(), MyApp.Repo, :delete_all, [Beacon.Content.Page, [log: false]])
      rpc(node1(), MyApp.Repo, :delete_all, [Beacon.Content.Layout, [log: false]])
    end)

    [page: page_fixture()]
  end

  test "change id", %{conn: conn, page: page} do
    {:ok, view, _html} = live(conn, "/admin/site_a/pages/#{page.id}?editor=visual")

    path = "0.0"
    render_click(view, "select_element", %{"path" => path})

    view
    |> element("#control-id-form")
    |> render_submit(%{"id" => %{"value" => "new"}})

    view
    |> element("#page-form")
    |> render_submit()

    assert Beacon.LiveAdmin.Client.Content.get_page(page.site, page.id).template =~ ~s|<h1 id="new"|
  end
end
