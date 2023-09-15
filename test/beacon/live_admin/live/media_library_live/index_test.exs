defmodule Beacon.LiveAdmin.MediaLibraryLive.IndexTest do
  use Beacon.LiveAdmin.ConnCase, async: false
  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

  setup do
    on_exit(fn ->
      rpc(node1(), Beacon.Repo, :delete_all, [Beacon.MediaLibrary.Asset, [log: false]])
    end)
  end

  test "index", %{conn: conn} do
    media_library_asset_fixture(node1(), file_name: "test_index.webp")
    {:ok, _view, html} = live(conn, "/admin/site_a/media_library")
    assert html =~ "test_index.webp"
  end

  test "search", %{conn: conn} do
    media_library_asset_fixture(node1(), file_name: "test_search.webp")

    {:ok, view, _html} = live(conn, "/admin/site_a/media_library")

    assert view
           |> element("#search-form")
           |> render_change(%{search: "ar"}) =~ "test_search.webp"
  end
end
