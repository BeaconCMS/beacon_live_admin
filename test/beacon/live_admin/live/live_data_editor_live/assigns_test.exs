defmodule Beacon.LiveAdmin.LiveDataEditorLive.AssignsTest do
  use Beacon.LiveAdmin.ConnCase, async: false
  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

  setup do
    on_exit(fn ->
      rpc(node1(), Beacon.Repo, :delete_all, [Beacon.Content.Page, [log: false]])
      rpc(node1(), Beacon.Repo, :delete_all, [Beacon.Content.Layout, [log: false]])
      rpc(node1(), Beacon.Repo, :delete_all, [Beacon.Content.LiveData, [log: false]])
      rpc(node1(), Beacon.Repo, :delete_all, [Beacon.Content.LiveDataAssign, [log: false]])
    end)

    page = page_fixture()
    live_data = live_data_fixture(node1(), path: "/home")

    [page: page, live_data: live_data]
  end

  test "create new assign", %{conn: conn, live_data: live_data} do
    {:ok, view, _html} = live(conn, "/admin/site_a/live_data/#{live_data.id}")

    view
    |> element("button", "New Live Data Assign")
    |> render_click()

    view
    |> form("#new-assign-form", %{"key" => "valid?"})
    |> render_submit()

    assert render(view) =~ "@valid?"
  end

  test "nonexistent assign redirects to root LD page", %{conn: conn, live_data: live_data} do
    assert {:error, {:live_redirect, %{to: "/admin/site_a/live_data/#{live_data.id}"}}} ==
             live(conn, "/admin/site_a/live_data/#{live_data.id}/invalid-id")
  end

  test "edit existing assign", %{conn: conn, live_data: live_data} do
    lda = live_data_assign_fixture(node1(), live_data: live_data)
    {:ok, view, _html} = live(conn, "/admin/site_a/live_data/#{live_data.id}/#{lda.id}")

    view
    |> form("#edit-assign-form", %{"live_data_assign" => %{"key" => "new_key"}})
    |> render_submit()

    assert render(view) =~ "@new_key"
    assert has_element?(view, ~S|input[value="new_key"]|)
  end

  test "delete existing assign", %{conn: conn, live_data: live_data} do
    lda = live_data_assign_fixture(node1(), live_data: live_data)
    {:ok, view, _html} = live(conn, "/admin/site_a/live_data/#{live_data.id}/#{lda.id}")

    view
    |> element("button", "Delete")
    |> render_click()

    {:ok, _view, html} =
      view
      |> element("#delete-confirm")
      |> render_click()
      |> follow_redirect(conn)

    refute html =~ "@#{lda.key}"
  end
end
