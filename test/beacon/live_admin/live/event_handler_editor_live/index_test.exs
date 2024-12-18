defmodule Beacon.LiveAdmin.EventHandlerEditorLive.IndexTest do
  use Beacon.LiveAdmin.ConnCase, async: false

  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

  setup do
    on_exit(fn ->
      rpc(node1(), MyApp.Repo, :delete_all, [Beacon.Content.ErrorPage, [log: false]])
      rpc(node1(), MyApp.Repo, :delete_all, [Beacon.Content.Layout, [log: false]])
    end)

    :ok
  end

  test "select event handler via path", %{conn: conn} do
    foo_handler = event_handler_fixture(node1(), name: "foo")
    bar_handler = event_handler_fixture(node1(), name: "bar")

    {:ok, view, _html} = live(conn, "/admin/site_a/events/#{foo_handler.id}")
    assert has_element?(view, "input[name='event_handler[name]'][value=foo]")

    {:ok, view, _html} = live(conn, "/admin/site_a/events/#{bar_handler.id}")
    assert has_element?(view, "input[name='event_handler[name]'][value=bar]")
  end

  test "create a new event handler", %{conn: conn} do
    {:ok, view, _html} = live(conn, "/admin/site_a/events")

    view |> element("#new-event-handler-button") |> render_click()

    assert has_element?(view, "#create-modal")

    {:ok, view, _html} =
      view
      |> form("#create-form", %{event_handler: %{name: "my_test"}})
      |> render_submit()
      |> follow_redirect(conn)

    refute has_element?(view, "#create-modal")
    assert has_element?(view, "input[name='event_handler[name]'][value=my_test]")
  end

  test "update an event handler", %{conn: conn} do
    event_handler = event_handler_fixture(node1(), name: "init")
    {:ok, view, _html} = live(conn, "/admin/site_a/events/#{event_handler.id}")

    assert has_element?(view, "input[name='event_handler[name]'][value=init]")

    view
    |> form("#event-handler-form", event_handler: %{name: "changed"})
    |> render_submit()

    assert has_element?(view, "p", "Event Handler updated successfully")

    refute has_element?(view, "input[name='event_handler[name]'][value=init]")
    assert has_element?(view, "input[name='event_handler[name]'][value=changed]")
  end

  test "delete event handler", %{conn: conn} do
    event_handler = event_handler_fixture(node1(), name: "legacy")
    {:ok, view, _html} = live(conn, "/admin/site_a/events/#{event_handler.id}")

    assert has_element?(view, "span", "legacy")

    view |> element("#delete-event-handler-button") |> render_click()

    assert has_element?(view, "#delete-modal")

    view |> element("#confirm-delete-button") |> render_click()

    refute has_element?(view, "#delete-modal")
    refute has_element?(view, "span", "legacy")
  end

  test "display a site selector", %{conn: conn} do
    {:ok, live, _html} = live(conn, "/admin/site_a/events")

    live
    |> element("#site-selector-form")
    |> render_change(%{site: "site_c"})

    assert_redirected(live, "/admin/site_c/events")
  end
end
