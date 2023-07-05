defmodule Beacon.LiveAdmin.RouterTest do
  use ExUnit.Case, async: true

  alias Beacon.LiveAdmin.Router

  test "beacon_live_admin_path" do
    socket = %Phoenix.LiveView.Socket{
      endpoint: Beacon.LiveAdminTest.Endpoint,
      router: Beacon.LiveAdminTest.Router
    }

    assert Router.beacon_live_admin_path(socket, :my_site, "/pages") ==
             "/admin/my_site/pages"

    assert Router.beacon_live_admin_path(socket, :my_site, "/pages", status: :draft) ==
             "/admin/my_site/pages?status=draft"
  end

  describe "session options" do
    test "session name based on prefix" do
      assert {:beacon_live_admin_prefix, _} = Router.__session_options__("prefix", [], [])
    end

    test "options are optional but always assign Hooks.AssignAgent" do
      assert {:beacon_live_admin_prefix,
              [
                {:root_layout, {Beacon.LiveAdmin.Layouts, :admin}},
                {:session, {Beacon.LiveAdmin.Router, :__session__, [[]]}},
                {:on_mount, [Beacon.LiveAdmin.Hooks.AssignAgent]}
              ]} = Router.__session_options__("prefix", [], [])
    end

    test "allow adding custom mount hooks" do
      assert {:beacon_live_admin_prefix,
              [
                root_layout: {Beacon.LiveAdmin.Layouts, :admin},
                session: {Beacon.LiveAdmin.Router, :__session__, [[]]},
                on_mount: [SomeHook, Beacon.LiveAdmin.Hooks.AssignAgent]
              ]} =
               Router.__session_options__("prefix", [], on_mount: [SomeHook])
    end

    test "preserve Hooks.AssignAgent position if defined by user" do
      assert {:beacon_live_admin_admin,
              [
                root_layout: {Beacon.LiveAdmin.Layouts, :admin},
                session: {Beacon.LiveAdmin.Router, :__session__, [[]]},
                on_mount: [AssignUser, Beacon.LiveAdmin.Hooks.AssignAgent, SomeHook]
              ]} =
               Router.__session_options__(
                 "admin",
                 [],
                 on_mount: [AssignUser, Beacon.LiveAdmin.Hooks.AssignAgent, SomeHook]
               )
    end

    test "dose not assign root_layout" do
      assert_raise ArgumentError, fn ->
        Router.__session_options__("admin", [], root_layout: {MyApp.Layouts, :other})
      end
    end

    test "does not assign layout" do
      assert_raise ArgumentError, fn ->
        Router.__session_options__("admin", [], layout: {MyApp.Layouts, :other})
      end
    end
  end
end
