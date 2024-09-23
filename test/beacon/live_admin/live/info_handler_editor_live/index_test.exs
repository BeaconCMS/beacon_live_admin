defmodule Beacon.LiveAdmin.InfoHandlerEditorLive.IndexTest do
  use Beacon.LiveAdmin.ConnCase, async: false
  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

  setup do
    attrs = %{msg: "{:validate_msg, msg}"}
    info_handler = info_handler_fixture(node1(), attrs)
    attrs = %{
      msg: "{:assign_email, email}",
      code: ~S"""
      socket =
        socket
        |> assign(email: email)

      {:noreply, socket}
      """
    }
    info_handler_fixture(node1(), attrs)

    on_exit(fn ->
      rpc(node1(), MyApp.Repo, :delete_all, [Beacon.Content.InfoHandler, [log: false]])
    end)

    [info_handler: info_handler]
  end

  test "select info handler page via path", %{conn: conn} do
    info_handler = info_handler_fixture(node1())
    info_handler2 = info_handler_fixture(node1())

    {:ok, view, _html} = live(conn, "/admin/site_a/info_handlers/#{info_handler.id}")
    assert has_element?(view, "input[name='info_handler[code]'][value='#{info_handler.code}']")

    {:ok, view, _html} = live(conn, "/admin/site_a/info_handlers/#{info_handler2.id}")
    assert has_element?(view, "input[name='info_handler[code]'][value='#{info_handler2.code}']")
  end

  test "create a new info handler", %{conn: conn} do
    {:ok, view, _html} = live(conn, "/admin/site_a/info_handlers")

    view |> element("#new-info-handler-button") |> render_click()

    assert has_element?(view, "#create-modal")

    view = {:error, {:live_redirect, %{to: path}}} =
      view
      |> form("#create-form", %{msg: "{:assign_email, email}"})
      |> render_submit()

    {:ok, view, _html} =
      view
      |> follow_redirect(conn, path)

    refute has_element?(view, "#create-modal")
    assert has_element?(view, "input[name='info_handler[msg]'][value='{:assign_email, email}']")
  end

  test "update a info handler", %{conn: conn, info_handler: info_handler} do
    {:ok, view, _html} = live(conn, "/admin/site_a/info_handlers/#{info_handler.id}")

    assert has_element?(view, "input[name=\"info_handler[msg]\"][value=\"#{info_handler.msg}\"]")
    assert has_element?(view, "input[name=\"info_handler[code]\"][value=\"#{info_handler.code}\"]")

    code = ~S"""
    socket =
      socket
      |> assign(msg: msg)

    {:noreply, socket}
    """

    view
    |> form("#info-handler-form")
    |> render_submit(info_handler: %{msg: "{:assign_msg, msg}", code: code})

    assert has_element?(view, "p", "Info Handler updated successfully")

    refute has_element?(view, "input[name=\"info_handler[msg]\"][value=\"#{info_handler.msg}\"]")
    assert has_element?(view, "input[name=\"info_handler[msg]\"][value=\"{:assign_msg, msg}\"]")

    refute has_element?(view, "input[name=\"info_handler[code]\"][value=\"#{info_handler.code}\"]")
    assert has_element?(view, "input[name=\"info_handler[code]\"][value=\"#{code}\"]")
  end

  test "delete error page", %{conn: conn, info_handler: info_handler} do
    {:ok, view, _html} = live(conn, "/admin/site_a/info_handlers/#{info_handler.id}")

    assert has_element?(view, "input[name=\"info_handler[msg]\"][value=\"#{info_handler.msg}\"]")

    view |> element("#delete-info-handler-button") |> render_click()

    assert has_element?(view, "#delete-modal")

    view |> element("#confirm-delete-button") |> render_click()

    refute has_element?(view, "#delete-modal")
    refute has_element?(view, "input[name=\"info_handler[msg]\"][value=\"#{info_handler.msg}\"]")
  end
end
