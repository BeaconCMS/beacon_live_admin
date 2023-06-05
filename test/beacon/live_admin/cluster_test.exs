defmodule Beacon.LiveAdmin.ClusterTest do
  use ExUnit.Case, async: true

  alias Beacon.LiveAdmin.Cluster

  test "group_sites" do
    mapping = %{
      node_a: [:site_1, :site_2],
      node_b: [],
      node_c: [:site_1, :site_3]
    }

    assert Cluster.group_sites(mapping) == %{
             site_1: [:node_a, :node_c],
             site_2: [:node_a],
             site_3: [:node_c]
           }
  end
end
