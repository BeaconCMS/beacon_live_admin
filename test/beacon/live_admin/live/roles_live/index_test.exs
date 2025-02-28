defmodule Beacon.LiveAdmin.RolesLive.IndexTest do
  use Beacon.LiveAdmin.ConnCase, async: false

  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

  setup do
    on_exit(fn ->
      rpc(node1(), MyApp.Repo, :delete_all, [Beacon.Auth.Role, [log: false]])
    end)

    :ok
  end

  test "select role via path", %{conn: conn} do
    foo = role_fixture(node1(), name: "foo")
    bar = role_fixture(node1(), name: "bar")

    {:ok, view, _html} = live(conn, "/admin/site_a/roles/#{foo.id}")
    assert has_element?(view, "input[name='role[name]'][value=foo]")

    {:ok, view, _html} = live(conn, "/admin/site_a/roles/#{bar.id}")
    assert has_element?(view, "input[name='role[name]'][value=bar]")
  end

  test "create a new role", %{conn: conn} do
    {:ok, view, _html} = live(conn, "/admin/site_a/roles")

    view |> element("#new-role-button") |> render_click()

    assert has_element?(view, "#create-modal")

    {:ok, view, _html} =
      view
      |> form("#create-form", %{role: %{name: "my_test"}})
      |> render_submit()
      |> follow_redirect(conn)

    refute has_element?(view, "#create-modal")
    assert has_element?(view, "input[name='role[name]'][value=my_test]")
  end

  test "update a role's name", %{conn: conn} do
    role = role_fixture(node1(), name: "init")
    {:ok, view, _html} = live(conn, "/admin/site_a/roles/#{role.id}")

    assert has_element?(view, "input[name='role[name]'][value=init]")

    view
    |> form("#role-form", role: %{name: "changed"})
    |> render_submit()

    assert has_element?(view, "p", "Role updated successfully")

    refute has_element?(view, "input[name='role[name]'][value=init]")
    assert has_element?(view, "input[name='role[name]'][value=changed]")
  end

  test "update a role's capabilities", %{conn: conn} do
  end

  test "delete role", %{conn: conn} do
    role = role_fixture(node1(), name: "legacy")
    {:ok, view, _html} = live(conn, "/admin/site_a/roles/#{role.id}")

    assert has_element?(view, "span", "legacy")

    view |> element("#delete-role-button") |> render_click()

    assert has_element?(view, "#delete-modal")

    view |> element("#confirm-delete-button") |> render_click()

    refute has_element?(view, "#delete-modal")
    refute has_element?(view, "span", "legacy")
  end

  test "display a site selector", %{conn: conn} do
    {:ok, live, _html} = live(conn, "/admin/site_a/roles")

    live
    |> element("#site-selector-form")
    |> render_change(%{site: "site_c"})

    assert_redirected(live, "/admin/site_c/roles")
  end
end
