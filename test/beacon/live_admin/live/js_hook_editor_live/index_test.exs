defmodule Beacon.LiveAdmin.JSHookEditorLive.IndexTest do
  use Beacon.LiveAdmin.ConnCase, async: false

  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

  setup do
    on_exit(fn ->
      rpc(node1(), MyApp.Repo, :delete_all, [Beacon.Content.JSHook, [log: false]])
    end)

    :ok
  end

  test "select js hook via path", %{conn: conn} do
    foo_hook = js_hook_fixture(node1(), name: "FooHook")
    bar_hook = js_hook_fixture(node1(), name: "BarHook")

    {:ok, view, _html} = live(conn, "/admin/site_a/hooks/#{foo_hook.id}")
    assert has_element?(view, "input[name='js_hook[name]'][value=FooHook]")

    {:ok, view, _html} = live(conn, "/admin/site_a/hooks/#{bar_hook.id}")
    assert has_element?(view, "input[name='js_hook[name]'][value=BarHook]")
  end

  test "create a new js hook", %{conn: conn} do
    {:ok, view, _html} = live(conn, "/admin/site_a/hooks")

    view |> element("#new-js-hook-button") |> render_click()

    assert has_element?(view, "#create-modal")

    {:ok, view, _html} =
      view
      |> form("#create-form", %{js_hook: %{name: "MyTestHook"}})
      |> render_submit()
      |> follow_redirect(conn)

    refute has_element?(view, "#create-modal")
    assert has_element?(view, "input[name='js_hook[name]'][value=MyTestHook]")
  end

  test "update a js hook", %{conn: conn} do
    js_hook = js_hook_fixture(node1(), name: "InitHook")
    {:ok, view, _html} = live(conn, "/admin/site_a/hooks/#{js_hook.id}")

    assert has_element?(view, "input[name='js_hook[name]'][value=InitHook]")

    view
    |> form("#js-hook-form", js_hook: %{name: "ChangedHook"})
    |> render_submit()

    assert has_element?(view, "p", "JS Hook updated successfully")

    refute has_element?(view, "input[name='js_hook[name]'][value=InitHook]")
    assert has_element?(view, "input[name='js_hook[name]'][value=ChangedHook]")
  end

  test "delete event handler", %{conn: conn} do
    js_hook = js_hook_fixture(node1(), name: "LegacyHook")
    {:ok, view, _html} = live(conn, "/admin/site_a/hooks/#{js_hook.id}")

    assert has_element?(view, "span", "LegacyHook")

    view |> element("#delete-js-hook-button") |> render_click()

    assert has_element?(view, "#delete-modal")

    view |> element("#confirm-delete-button") |> render_click()

    refute has_element?(view, "#delete-modal")
    refute has_element?(view, "span", "LegacyHook")
  end

  test "display a site selector", %{conn: conn} do
    {:ok, live, _html} = live(conn, "/admin/site_a/hooks")

    live
    |> element("#site-selector-form")
    |> render_change(%{site: "site_c"})

    assert_redirected(live, "/admin/site_c/hooks")
  end
end
