defmodule Beacon.LiveAdmin.Hooks.AssignAgentTest do
  use Beacon.LiveAdmin.ConnCase, async: false

  alias Beacon.LiveAdmin.Hooks.AssignAgent

  test "on_mount", %{conn: conn} do
    session =
      conn
      |> init_test_session(%{})
      |> put_session(:session_id, "admin_session_123")
      |> get_session()

    assert {:cont, %{assigns: %{agent: agent}}} =
             AssignAgent.on_mount(:default, %{"site" => "site_a"}, session, @socket)

    assert %{role: :admin, session_id: "admin_session_123"} = agent
  end
end
