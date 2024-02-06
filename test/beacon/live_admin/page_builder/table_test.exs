defmodule Beacon.LiveAdmin.PageBuilder.TableTest do
  use ExUnit.Case, async: true

  alias Beacon.LiveAdmin.PageBuilder.Table

  test "nav_pages" do
    assert Table.nav_pages(1, 0, 10) == []
    assert Table.nav_pages(1, 1, 10) == [1]
    assert Table.nav_pages(1, 10, 5) == [1, 2, 3, 4, :sep, 10]
    assert Table.nav_pages(2, 10, 5) == [1, 2, 3, 4, :sep, 10]
    assert Table.nav_pages(3, 10, 5) == [1, 2, 3, 4, :sep, 10]
    assert Table.nav_pages(4, 10, 5) == [1, :sep, 3, 4, 5, :sep, 10]
    assert Table.nav_pages(1, 10, 8) == [1, 2, 3, 4, 5, 6, 7, :sep, 10]
    assert Table.nav_pages(9, 10, 5) == [1, :sep, 7, 8, 9, 10]
    assert Table.nav_pages(10, 10, 5) == [1, :sep, 7, 8, 9, 10]
    assert Table.nav_pages(1, 30, 10) == [1, 2, 3, 4, 5, 6, 7, 8, 9, :sep, 30]
    assert Table.nav_pages(4, 30, 10) == [1, 2, 3, 4, 5, 6, 7, 8, 9, :sep, 30]
    assert Table.nav_pages(5, 30, 10) == [1, 2, 3, 4, 5, 6, 7, 8, 9, :sep, 30]
  end
end
