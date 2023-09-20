defmodule Beacon.LiveAdmin.LayoutEditorLive.EditTest do
  use Beacon.LiveAdmin.ConnCase, async: false
  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

  setup do
    on_exit(fn ->
      rpc(node1(), Beacon.Repo, :delete_all, [Beacon.Content.Layout, [log: false]])
    end)

    [layout: layout_fixture(),
      resource_links_layout: layout_fixture(node1(), %{resource_links: [
        %{
          "crossorigin" => "",
          "href" => "https://example.com",
          "rel" => "preload",
          "type" => "",
          "as" => ""
        }
      ]})]
  end

  test "save changes", %{conn: conn, layout: layout} do
    {:ok, live, _html} = live(conn, "/admin/site_a/layouts/#{layout.id}")

    live
    |> form("#layout-form", layout: %{title: "Other Layout"})
    |> render_submit()

    {:ok, _live, html} = live(conn, "/admin/site_a/layouts")

    assert html =~ "Other Layout"
  end

  test "publish", %{conn: conn, layout: layout} do
    {:ok, _live, html} = live(conn, "/admin/site_a/layouts")
    refute html =~ "Published"

    {:ok, live, _html} = live(conn, "/admin/site_a/layouts/#{layout.id}")

    live
    |> element("button", "Confirm")
    |> render_click()

    {:ok, _live, html} = live(conn, "/admin/site_a/layouts")

    assert html =~ "Published"
  end

  test "resource_links don't render nil or empty attributes", %{conn: conn, resource_links_layout: resource_links_layout} do
    content = rpc(node1(), Beacon.Content, :get_layout!, [resource_links_layout.id])
    IO.inspect(content.resource_links)

    {:ok, live, _html} = live(conn, "/admin/site_a/layouts/#{resource_links_layout.id}/resource_links")


    live
    |> form("#resource-links-form")
    |> render_submit(%{layout: %{resource_links: %{"1" => %{
      "crossorigin" => "",
      "href" => "https://example.com",
      "rel" => "preload",
      "type" => "foo",
      "as" => ""
    }}}})
    |> element("button", "type")

    assert content.resource_links == %{}
  end
end
