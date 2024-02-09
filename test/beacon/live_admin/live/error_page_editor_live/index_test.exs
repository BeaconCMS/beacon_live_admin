defmodule Beacon.LiveAdmin.ErrorPageEditorLive.IndexTest do
  use Beacon.LiveAdmin.ConnCase, async: false

  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

  setup do
    default_layout = layout_fixture(node1(), %{title: "Default"})
    another_layout = layout_fixture(node1(), %{title: "Another"})
    attrs = %{status: 404, layout_id: default_layout.id, template: "Not Found"}
    error_page_fixture(node1(), attrs)
    attrs = %{status: 500, layout_id: default_layout.id, template: "Internal Server Error"}
    error_page_fixture(node1(), attrs)

    on_exit(fn ->
      rpc(node1(), Beacon.Repo, :delete_all, [Beacon.Content.ErrorPage, [log: false]])
      rpc(node1(), Beacon.Repo, :delete_all, [Beacon.Content.Layout, [log: false]])
    end)

    [another_layout: another_layout]
  end

  test "select error page via path", %{conn: conn} do
    {:ok, view, _html} = live(conn, "/admin/site_a/error_pages")
    assert has_element?(view, "input[name='error_page[status]'][value=404]")

    {:ok, view, _html} = live(conn, "/admin/site_a/error_pages/404")
    assert has_element?(view, "input[name='error_page[status]'][value=404]")

    {:ok, view, _html} = live(conn, "/admin/site_a/error_pages/500")
    assert has_element?(view, "input[name='error_page[status]'][value=500]")
  end

  test "create a new error page", %{conn: conn} do
    {:ok, view, _html} = live(conn, "/admin/site_a/error_pages")

    view |> element("#new-error-page-button") |> render_click()

    assert has_element?(view, "#create-modal")

    {:ok, view, _html} =
      view
      |> form("#create-form", %{status: 400})
      |> render_submit()
      |> follow_redirect(conn, "/admin/site_a/error_pages/400")

    refute has_element?(view, "#create-modal")
    assert has_element?(view, "input[name='error_page[status]'][value=400]")
  end

  test "update an error page", %{conn: conn, another_layout: layout} do
    {:ok, view, _html} = live(conn, "/admin/site_a/error_pages/404")

    assert has_element?(view, "[selected=\"selected\"]", "Default")

    view
    |> form("#error-page-form", error_page: %{layout_id: layout.id})
    |> render_submit()

    assert has_element?(view, "p", "Error page updated successfully")

    refute has_element?(view, "[selected=\"selected\"]", "Default")
    assert has_element?(view, "[selected=\"selected\"]", "Another")
  end

  test "delete error page", %{conn: conn} do
    {:ok, view, _html} = live(conn, "/admin/site_a/error_pages/500")

    assert has_element?(view, "span", "500")

    view |> element("#delete-error-page-button") |> render_click()

    assert has_element?(view, "#delete-modal")

    view |> element("#confirm-delete-button") |> render_click()

    refute has_element?(view, "#delete-modal")
    refute has_element?(view, "span", "500")
  end

  test "display a site selector", %{conn: conn} do
    {:ok, live, _html} = live(conn, "/admin/site_a/error_pages")

    live
    |> element("#site-selector-form")
    |> render_change(%{site: "site_c"})

    assert_redirected(live, "/admin/site_c/error_pages")
  end
end
