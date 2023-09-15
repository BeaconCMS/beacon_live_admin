defmodule Beacon.LiveAdmin.PageEditorLive.IndexTest do
  use Beacon.LiveAdmin.ConnCase, async: false
  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

  setup do
    on_exit(fn ->
      rpc(node1(), Beacon.Repo, :delete_all, [Beacon.Content.Page, [log: false]])
      rpc(node1(), Beacon.Repo, :delete_all, [Beacon.Content.Layout, [log: false]])
    end)

    page_fixture()

    :ok
  end

  test "display all pages", %{conn: conn} do
    {:ok, _live, html} = live(conn, "/admin/site_a/pages")
    assert html =~ "site_a_home_page"
  end

  test "raises when missing beacon_live_admin_url in the session" do
    assert_raise MatchError, fn ->
      conn =
        Phoenix.ConnTest.dispatch(
          build_conn(:get, "/admin/site_a/pages"),
          Beacon.LiveAdminTest.PluglessEndpoint,
          :get,
          "/admin/site_a/pages",
          nil
        )

      {:ok, _live, _html} = live(conn, "/admin/site_a/pages")
    end
  end
end
