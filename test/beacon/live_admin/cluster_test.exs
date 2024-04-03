defmodule Beacon.LiveAdmin.ClusterTest do
  use ExUnit.Case, async: true

  alias Beacon.LiveAdmin.Cluster

  test "running_sites" do
    assert Enum.sort(Cluster.running_sites()) == [:site_a, :site_b, :site_c]
  end

  test "find nodes" do
    assert Enum.sort(Cluster.find_nodes(:site_a)) == [:"node1@127.0.0.1"]
  end

  test "call function on remote node" do
    assert Cluster.call(:site_a, Node, :self, []) == :"node1@127.0.0.1"
  end
end
