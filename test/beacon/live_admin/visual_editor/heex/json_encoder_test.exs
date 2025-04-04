defmodule Beacon.LiveAdmin.VisualEditor.HEEx.JSONEncoderTest do
  use ExUnit.Case, async: true

  alias Beacon.LiveAdmin.VisualEditor.HEEx.JSONEncoder

  defp assert_output(template, expected, render_node_fun \\ nil) do
    render_node_fun = render_node_fun || fn node -> "TODO" end
    assert {:ok, encoded} = JSONEncoder.encode(template, render_node_fun)
    assert encoded == expected
  end

  test "nil template cast to empty string" do
    assert_output(nil, [])
  end
end
