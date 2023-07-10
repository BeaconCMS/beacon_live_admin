defmodule Beacon.LiveAdmin.MediaLibrary do
  @moduledoc """
  Calls Beacon Content API through the cluster.

  The function call is made on the first available node for a site,
  which may be running in multiple nodes.
  """

  import Beacon.LiveAdmin.Cluster, only: [call: 4]

  def get_asset_by(site, clauses) do
    call(site, Beacon.MediaLibrary, :get_asset_by, [site, clauses])
  end

  def list_assets(site) do
    call(site, Beacon.MediaLibrary, :list_assets, [site])
  end

  def search(site, query) do
    call(site, Beacon.MediaLibrary, :search, [site, query])
  end

  def url_for(site, asset) do
    call(site, Beacon.MediaLibrary, :url_for, [asset])
  end

  def urls_for(site, asset) do
    call(site, Beacon.MediaLibrary, :urls_for, [asset])
  end

  def is_image?(site, asset) do
    call(site, Beacon.MediaLibrary, :is_image?, [asset])
  end

  def new_upload_metadata(site, path, opts) do
    call(site, Beacon.MediaLibrary.UploadMetadata, :new, [site, path, opts])
  end

  def upload(site, upload_metadata) do
    call(site, Beacon.MediaLibrary, :upload, [upload_metadata])
  end
end
