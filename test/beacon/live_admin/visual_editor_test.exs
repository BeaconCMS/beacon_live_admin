defmodule Beacon.LiveAdmin.VisualEditorTest do
  use ExUnit.Case, async: true

  alias Beacon.LiveAdmin.VisualEditor

  test "element_editable?" do
    assert VisualEditor.element_editable?(%{"tag" => "p"})

    refute VisualEditor.element_editable?(%{"tag" => "eex"})
    refute VisualEditor.element_editable?(%{"tag" => "eex_block"})
    refute VisualEditor.element_editable?(%{"tag" => nil})
    refute VisualEditor.element_editable?(%{})
    refute VisualEditor.element_editable?(nil)
  end

  test "find_utility_class" do
    assert VisualEditor.find_utility_class(%{"attrs" => %{"class" => "opacity-100"}}, "opacity") == "opacity-100"
    assert VisualEditor.find_utility_class(%{"attrs" => %{"class" => "opacity-100 opacity-50"}}, "opacity") == "opacity-100"
    assert VisualEditor.find_utility_class(%{"attrs" => %{"class" => "text-red-500 opacity-100"}}, "opacity") == "opacity-100"

    refute VisualEditor.find_utility_class(nil, "opacity")
    refute VisualEditor.find_utility_class(%{}, "opacity")
    refute VisualEditor.find_utility_class(%{"attrs" => nil}, "opacity")
    refute VisualEditor.find_utility_class(%{"attrs" => %{}}, "opacity")
    refute VisualEditor.find_utility_class(%{"attrs" => %{"class" => nil}}, "opacity")
    refute VisualEditor.find_utility_class(%{"attrs" => %{"class" => ""}}, "opacity")
  end

  test "extract_utility_class_value" do
    assert VisualEditor.extract_utility_class_value(%{"attrs" => %{"class" => "opacity-100"}}, "opacity") == "100"

    refute VisualEditor.extract_utility_class_value(nil, "opacity")
    refute VisualEditor.extract_utility_class_value(%{}, "opacity")
    refute VisualEditor.extract_utility_class_value(%{"attrs" => nil}, "opacity")
    refute VisualEditor.extract_utility_class_value(%{"attrs" => %{}}, "opacity")
    refute VisualEditor.extract_utility_class_value(%{"attrs" => %{"class" => nil}}, "opacity")
    refute VisualEditor.extract_utility_class_value(%{"attrs" => %{"class" => ""}}, "opacity")
    refute VisualEditor.extract_utility_class_value(%{"attrs" => %{"class" => "opacity-"}}, "opacity")
    refute VisualEditor.extract_utility_class_value(%{"attrs" => %{"class" => "opacity"}}, "opacity")
  end
end
