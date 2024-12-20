defmodule Beacon.LiveAdmin.PageEditorLive.NewTest do
  use Beacon.LiveAdmin.ConnCase, async: false
  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

  setup do
    on_exit(fn ->
      rpc(node1(), MyApp.Repo, :delete_all, [Beacon.Content.Page, [log: false]])
      rpc(node1(), MyApp.Repo, :delete_all, [Beacon.Content.Layout, [log: false]])
    end)

    layout_fixture()

    :ok
  end

  test "create new page and patch to edit page", %{conn: conn} do
    {:ok, live, _html} = live(conn, "/admin/site_a/pages/new")

    live
    |> form("#page-form", page: %{path: "/my/page", title: "My Page", format: "heex"})
    |> render_submit(%{page: %{"template" => "<div>test</div>"}, save: "save"})

    assert_patch(live)
    assert has_element?(live, "#flash", "Page saved successfully")
    assert has_element?(live, "h1", "Edit Page")
    assert has_element?(live, "button", "Save Changes")
  end

  describe "extra page fields" do
    test "display with default value", %{conn: conn} do
      {:ok, live, _html} = live(conn, "/admin/site_a/pages/new")
      assert has_element?(live, ~s|input#page-form_extra_type[value="page"]|)
    end
  end
end
