defmodule Beacon.LiveAdmin.RouterTest do
  use ExUnit.Case, async: true

  import Beacon.LiveAdmin.Router, only: [beacon_live_admin_path: 3, beacon_live_admin_path: 4]
  alias Beacon.LiveAdmin.Router

  defmodule RouterSimple do
    use Phoenix.Router
    use Beacon.LiveAdmin.Router
    import Plug.Conn
    import Phoenix.LiveView.Router

    scope "/" do
      beacon_live_admin("/admin")
    end
  end

  defmodule RouterNested do
    use Phoenix.Router
    use Beacon.LiveAdmin.Router
    import Plug.Conn
    import Phoenix.LiveView.Router

    scope "/parent" do
      scope "/nested" do
        beacon_live_admin("/admin")
      end
    end
  end

  defmodule Endpoint do
    use Phoenix.Endpoint, otp_app: :beacon
  end

  describe "beacon_admin_path" do
    setup do
      start_supervised!(Endpoint)
      :ok
    end

    test "plain route" do
      socket = %Phoenix.LiveView.Socket{endpoint: Endpoint, router: RouterSimple}

      assert beacon_live_admin_path(socket, :my_site, "/pages") == "/admin/my_site/pages"

      assert beacon_live_admin_path(socket, :my_site, :pages, %{foo: :bar}) ==
               "/admin/my_site/pages?foo=bar"
    end

    test "nested route" do
      socket = %Phoenix.LiveView.Socket{endpoint: Endpoint, router: RouterNested}

      assert beacon_live_admin_path(socket, :my_site, "/pages") ==
               "/parent/nested/admin/my_site/pages"

      assert beacon_live_admin_path(socket, :my_site, :pages, %{foo: :bar}) ==
               "/parent/nested/admin/my_site/pages?foo=bar"
    end
  end

  describe "session options" do
    test "session name based on prefix" do
      assert {:beacon_live_admin_prefix, _} = Router.__session_options__("prefix", [], [])
    end

    # TODO: review authz
    @tag :skip
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
                on_mount: [SomeHook]
              ]} = Router.__session_options__("prefix", [], on_mount: [SomeHook])
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

    test "does not assign root_layout" do
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
