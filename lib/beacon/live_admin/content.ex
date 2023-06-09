defmodule Beacon.LiveAdmin.Content do
  @moduledoc """
  TODO
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

  def list_pages(site, query) do
    call(site, Beacon.Content, :list_pages, [site, query, [per_page: 20]])
  end

  def create_page(site, attrs) do
    call(site, Beacon.Content, :create_page, [attrs])
  end
end
