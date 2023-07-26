defmodule Beacon.LiveAdmin.Content do
  @moduledoc """
  Calls Beacon Content API through the cluster.

  The function call is made on the first available node for a site,
  which may be running in multiple nodes.
  """

  import Beacon.LiveAdmin.Cluster, only: [call: 4]

  def change_layout(site, layout, params \\ %{}) do
    call(site, Beacon.Content, :change_layout, [layout, params])
  end

  def create_layout(site, attrs) do
    call(site, Beacon.Content, :create_layout, [attrs])
  end

  def update_layout(site, layout, attrs) do
    call(site, Beacon.Content, :update_layout, [layout, attrs])
  end

  def publish_layout(site, id) do
    call(site, Beacon.Content, :publish_layout, [id])
  end

  def get_layout(site, id) do
    call(site, Beacon.Content, :get_layout, [id])
  end

  def list_layout_events(site, id) do
    call(site, Beacon.Content, :list_layout_events, [site, id])
  end

  def get_latest_layout_event(site, id) do
    call(site, Beacon.Content, :get_latest_layout_event, [site, id])
  end

  def list_layouts(site, opts \\ []) do
    opts =
      opts
      |> Keyword.put_new(:query, nil)
      |> Keyword.put_new(:per_page, 20)

    call(site, Beacon.Content, :list_layouts, [site, opts])
  end

  def change_page(site, page) do
    call(site, Beacon.Content, :change_page, [page])
  end

  def page_extra_fields(site, form, params, errors) do
    call(site, Beacon.Content.PageField, :extra_fields, [site, form, params, errors])
  end

  def validate_page(site, page, params) do
    call(site, Beacon.Content, :validate_page, [page, params])
  end

  def create_page(site, attrs) do
    call(site, Beacon.Content, :create_page, [attrs])
  end

  def update_page(site, page, attrs) do
    call(site, Beacon.Content, :update_page, [page, attrs])
  end

  def publish_page(site, id) do
    call(site, Beacon.Content, :publish_page, [id])
  end

  def get_page(site, id) do
    call(site, Beacon.Content, :get_page, [id])
  end

  def get_latest_page_event(site, id) do
    call(site, Beacon.Content, :get_latest_page_event, [site, id])
  end

  def list_page_events(site, id) do
    call(site, Beacon.Content, :list_page_events, [site, id])
  end

  def list_pages(site, opts \\ []) do
    opts =
      opts
      |> Keyword.put_new(:query, nil)
      |> Keyword.put_new(:per_page, 20)

    call(site, Beacon.Content, :list_pages, [site, opts])
  end
end
