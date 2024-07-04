defmodule Beacon.LiveAdmin.MediaLibraryLive.IndexTest do
  use Beacon.LiveAdmin.ConnCase, async: false
  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

  setup do
    on_exit(fn ->
      rpc(node1(), MyApp.Repo, :delete_all, [Beacon.MediaLibrary.Asset, [log: false]])
    end)
  end

  test "index", %{conn: conn} do
    media_library_asset_fixture(node1(), file_name: "test_index.webp")
    {:ok, _view, html} = live(conn, "/admin/site_a/media_library")
    assert html =~ "test_index.webp"
  end

  test "display a site selector", %{conn: conn} do
    {:ok, live, _html} = live(conn, "/admin/site_a/media_library")

    live
    |> element("#site-selector-form")
    |> render_change(%{site: "site_c"})

    assert_redirected(live, "/admin/site_c/media_library")
  end
end
