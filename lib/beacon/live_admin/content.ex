defmodule Beacon.LiveAdmin.Content do
  @moduledoc """
  Calls Beacon Content API through the cluster.

  The function call is made on the first available node for a site,
  which may be running in multiple nodes.
  """

  import Beacon.LiveAdmin.Cluster, only: [call: 4]

  def list_layouts(site) do
    call(site, Beacon.Content, :list_layouts, [site])
  end

  def change_page(site, page) do
    call(site, Beacon.Content, :change_page, [page])
  end

  def validate_page(site, page, params) do
    call(site, Beacon.Content, :validate_page, [site, page, params])
  end

  def create_page(site, attrs) do
    call(site, Beacon.Content, :create_page, [attrs])
  end

  def update_page(site, page, attrs) do
    call(site, Beacon.Content, :update_page, [page, attrs])
  end

  def get_page(site, id) do
    call(site, Beacon.Content, :get_page, [id])
  end

  def list_pages(site, query) do
    call(site, Beacon.Content, :list_pages, [site, [query: query, per_page: 20]])
  end
end
