defmodule Beacon.LiveAdmin.MediaLibraryLive.UploadFormComponentTest do
  use Beacon.LiveAdmin.ConnCase, async: false
  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

  setup do
    on_exit(fn ->
      rpc(node1(), Beacon.Repo, :delete_all, [Beacon.MediaLibrary.Asset, [log: false]])
    end)
  end

  describe "uploads" do
    @tag :skip
    test "upload valid files", %{conn: conn} do
      # TODO: https://github.com/BeaconCMS/beacon/pull/316
      false
    end
  end
end
