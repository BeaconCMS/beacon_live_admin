defmodule Beacon.LiveAdmin.ActorsLive.IndexTest do
  use Beacon.LiveAdmin.ConnCase, async: false

  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

  setup do
    on_exit(fn ->
      rpc(node1(), MyApp.Repo, :delete_all, [Beacon.Auth.ActorRole, [log: false]])
    end)

    :ok
  end

  test "lists all actors", %{conn: conn} do
    {:ok, view, _html} = live(conn, "/admin/site_a/actors")

    assert has_element?(view, "#actor-10203-label", "Test Actor")
    assert has_element?(view, "#actor-40506-label", "Another Actor")
    assert has_element?(view, "#actor-10203-role-form")
    assert has_element?(view, "#actor-40506-role-form")
  end

  test "update the role of an actor", %{conn: conn} do
    role = role_fixture()

    {:ok, view, _html} = live(conn, "/admin/site_a/actors")

    view
    |> form("#actor-10203-role-form", %{role_id: role.id})
    |> render_submit(%{actor_id: "10203"})
  end

  test "remove the role of an actor", %{conn: conn} do
    role = role_fixture()
    actor_role = actor_role_fixture("10203", role)

    {:ok, view, _html} = live(conn, "/admin/site_a/actors")

    view
    |> element("#actor-10203-remove-role-button")
    |> render_click()

    refute rpc(node1(), MyApp.Repo, :reload, [actor_role])
  end
end
