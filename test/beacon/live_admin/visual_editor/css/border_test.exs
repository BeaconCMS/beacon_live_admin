defmodule Beacon.LiveAdmin.VisualEditor.Css.BorderTest do
  use ExUnit.Case, async: true

  alias Beacon.LiveAdmin.VisualEditor.Css.Border

  defp element(class) do
    %{"attrs" => %{"class" => class}}
  end

  test "extract_border_radius_unit" do
    refute Border.extract_border_radius_unit(element(""), nil)
    refute Border.extract_border_radius_unit(element(""), "top-left")
    refute Border.extract_border_radius_unit(element("p-2"), "top-left")
    assert Border.extract_border_radius_unit(element("rounded-xl"), "top-left") == "xl"
    assert Border.extract_border_radius_unit(element("rounded-[20px]"), "top-left") == "px"
    assert Border.extract_border_radius_unit(element("rounded-tl-lg"), "top-left") == "lg"
    assert Border.extract_border_radius_unit(element("rounded-tl-[20px]"), "top-left") == "px"
  end
end
