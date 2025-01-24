defmodule Beacon.LiveAdmin.Client.Content do
  @moduledoc false

  import Beacon.LiveAdmin.Cluster, only: [call: 4]

  def list_stylesheets(site) do
    call(site, Beacon.Content, :list_stylesheets, [site])
  end

  def change_layout(site, layout, attrs \\ %{}) do
    call(site, Beacon.Content, :change_layout, [layout, attrs])
  end

  def create_layout(site, actor, attrs) do
    call(site, Beacon.Content, :create_layout, [attrs, [actor: actor]])
  end

  def update_layout(site, actor, layout, attrs) do
    call(site, Beacon.Content, :update_layout, [layout, attrs, [actor: actor]])
  end

  def publish_layout(site, actor, id) do
    call(site, Beacon.Content, :publish_layout, [site, id, [actor: actor]])
  end

  def get_layout(site, id) do
    call(site, Beacon.Content, :get_layout, [site, id])
  end

  def list_layout_events(site, id) do
    call(site, Beacon.Content, :list_layout_events, [site, id])
  end

  def get_latest_layout_event(site, id) do
    call(site, Beacon.Content, :get_latest_layout_event, [site, id])
  end

  def list_layouts(site, opts \\ []) do
    call(site, Beacon.Content, :list_layouts, [site, opts])
  end

  def count_layouts(site, opts \\ []) do
    call(site, Beacon.Content, :count_layouts, [site, opts])
  end

  def change_page(site, page, attrs \\ %{}) do
    call(site, Beacon.Content, :change_page, [page, attrs])
  end

  def page_extra_fields(site, form, attrs, errors) do
    call(site, Beacon.Content.PageField, :extra_fields, [site, form, attrs, errors])
  end

  def page_field_name(site, mod) do
    call(site, mod, :name, [])
  end

  def render_page_field(site, mod, field, env) do
    call(site, Beacon.Content.PageField, :render_field, [mod, field, env])
  end

  def validate_page(site, page, attrs) do
    call(site, Beacon.Content, :validate_page, [site, page, attrs])
  end

  def create_page(site, actor, attrs) do
    call(site, Beacon.Content, :create_page, [attrs, [actor: actor]])
  end

  def update_page(site, actor, page, attrs) do
    call(site, Beacon.Content, :update_page, [page, attrs, [actor: actor]])
  end

  def publish_page(site, actor, id) do
    call(site, Beacon.Content, :publish_page, [site, id, [actor: actor]])
  end

  def unpublish_page(site, actor, page) do
    call(site, Beacon.Content, :unpublish_page, [page, [actor: actor]])
  end

  def get_page(site, id) do
    call(site, Beacon.Content, :get_page, [site, id])
  end

  def get_page(site, id, opts) do
    call(site, Beacon.Content, :get_page, [site, id, opts])
  end

  def get_latest_page_event(site, id) do
    call(site, Beacon.Content, :get_latest_page_event, [site, id])
  end

  def list_page_events(site, id) do
    call(site, Beacon.Content, :list_page_events, [site, id])
  end

  def list_pages(site, opts \\ []) do
    call(site, Beacon.Content, :list_pages, [site, opts])
  end

  def count_pages(site, opts \\ []) do
    call(site, Beacon.Content, :count_pages, [site, opts])
  end

  def change_page_variant(site, variant, attrs \\ %{}) do
    call(site, Beacon.Content, :change_page_variant, [variant, attrs])
  end

  def create_variant_for_page(site, actor, page, attrs) do
    call(site, Beacon.Content, :create_variant_for_page, [page, attrs, [actor: actor]])
  end

  def update_variant_for_page(site, actor, page, variant, attrs) do
    call(site, Beacon.Content, :update_variant_for_page, [page, variant, attrs, [actor: actor]])
  end

  def delete_variant_from_page(site, actor, page, variant) do
    call(site, Beacon.Content, :delete_variant_from_page, [page, variant, [actor: actor]])
  end

  def change_event_handler(site, event_handler, attrs \\ %{}) do
    call(site, Beacon.Content, :change_event_handler, [event_handler, attrs])
  end

  def list_event_handlers(site) do
    call(site, Beacon.Content, :list_event_handlers, [site])
  end

  def create_event_handler(site, actor, attrs) do
    call(site, Beacon.Content, :create_event_handler, [attrs, [actor: actor]])
  end

  def update_event_handler(site, actor, event_handler, attrs) do
    call(site, Beacon.Content, :update_event_handler, [event_handler, attrs, [actor: actor]])
  end

  def delete_event_handler(site, actor, event_handler) do
    call(site, Beacon.Content, :delete_event_handler, [event_handler, [actor: actor]])
  end

  def component_categories(site) do
    call(site, Beacon.Content, :component_categories, [])
  end

  def change_component(site, component, attrs \\ %{}) do
    call(site, Beacon.Content, :change_component, [component, attrs])
  end

  def list_components(site, opts \\ []) do
    call(site, Beacon.Content, :list_components, [site, opts])
  end

  def count_components(site, opts \\ []) do
    call(site, Beacon.Content, :count_components, [site, opts])
  end

  def get_component(site, id, opts \\ []) do
    call(site, Beacon.Content, :get_component_by, [site, [id: id], opts])
  end

  def create_component(site, actor, attrs) do
    call(site, Beacon.Content, :create_component, [attrs, [actor: actor]])
  end

  def update_component(site, actor, component, attrs) do
    call(site, Beacon.Content, :update_component, [component, attrs, [actor: actor]])
  end

  def change_component_attr(site, component_attr, attrs, component_attr_names) do
    call(site, Beacon.Content, :change_component_attr, [component_attr, attrs, component_attr_names])
  end

  def change_component_slot(site, slot, attrs, component_slots_names) do
    call(site, Beacon.Content, :change_component_slot, [slot, attrs, component_slots_names])
  end

  def create_slot_for_component(site, actor, component, attrs) do
    call(site, Beacon.Content, :create_slot_for_component, [component, attrs, [actor: actor]])
  end

  def update_slot_for_component(site, actor, component, slot, attrs, component_slots_names) do
    call(site, Beacon.Content, :update_slot_for_component, [component, slot, attrs, component_slots_names, [actor: actor]])
  end

  def delete_slot_from_component(site, actor, component, slot) do
    call(site, Beacon.Content, :delete_slot_from_component, [component, slot, [actor: actor]])
  end

  def change_slot_attr(site, slot_attr, attrs, slot_attr_names) do
    call(site, Beacon.Content, :change_slot_attr, [slot_attr, attrs, slot_attr_names])
  end

  def create_slot_attr(site, actor, attrs, slot_attr_names) do
    call(site, Beacon.Content, :create_slot_attr, [site, attrs, slot_attr_names, [actor: actor]])
  end

  def update_slot_attr(site, actor, slot_attr, attrs, slot_attr_names) do
    call(site, Beacon.Content, :update_slot_attr, [site, slot_attr, attrs, slot_attr_names, [actor: actor]])
  end

  def delete_slot_attr(site, actor, slot_attr) do
    call(site, Beacon.Content, :delete_slot_attr, [site, slot_attr, [actor: actor]])
  end

  def change_error_page(site, error_page, attrs \\ %{}) do
    call(site, Beacon.Content, :change_error_page, [error_page, attrs])
  end

  def create_error_page(site, actor, attrs) do
    call(site, Beacon.Content, :create_error_page, [attrs, [actor: actor]])
  end

  def list_error_pages(site) do
    call(site, Beacon.Content, :list_error_pages, [site])
  end

  def update_error_page(site, actor, error_page, attrs) do
    call(site, Beacon.Content, :update_error_page, [error_page, attrs, [actor: actor]])
  end

  def delete_error_page(site, actor, error_page) do
    call(site, Beacon.Content, :delete_error_page, [error_page, [actor: actor]])
  end

  def valid_error_statuses(site) do
    call(site, Beacon.Content.ErrorPage, :valid_statuses, [])
  end

  def live_data_assign_formats(site) do
    call(site, Beacon.Content, :live_data_assign_formats, [])
  end

  def change_live_data_path(site, live_data, attrs \\ %{}) do
    call(site, Beacon.Content, :change_live_data_path, [live_data, attrs])
  end

  def change_live_data_assign(site, live_data_assign, attrs \\ %{}) do
    call(site, Beacon.Content, :change_live_data_assign, [live_data_assign, attrs])
  end

  def create_live_data(site, actor, attrs) do
    call(site, Beacon.Content, :create_live_data, [attrs, [actor: actor]])
  end

  def create_assign_for_live_data(site, actor, live_data, attrs) do
    call(site, Beacon.Content, :create_assign_for_live_data, [live_data, attrs, [actor: actor]])
  end

  def get_live_data_by(site, clauses) do
    call(site, Beacon.Content, :get_live_data_by, [site, clauses])
  end

  def live_data_for_site(site, opts \\ []) do
    call(site, Beacon.Content, :live_data_for_site, [site, opts])
  end

  def update_live_data_path(site, actor, live_data, attrs) do
    call(site, Beacon.Content, :update_live_data_path, [live_data, attrs, [actor: actor]])
  end

  def update_live_data_assign(site, actor, live_data_assign, attrs) do
    call(site, Beacon.Content, :update_live_data_assign, [live_data_assign, site, attrs, [actor: actor]])
  end

  def delete_live_data(site, actor, live_data) do
    call(site, Beacon.Content, :delete_live_data, [live_data, site, [actor: actor]])
  end

  def delete_live_data_assign(site, actor, live_data_assign) do
    call(site, Beacon.Content, :delete_live_data_assign, [live_data_assign, site, [actor: actor]])
  end

  def create_info_handler(site, actor, attrs) do
    call(site, Beacon.Content, :create_info_handler, [attrs, [actor: actor]])
  end

  def change_info_handler(site, info_handler, attrs \\ %{}) do
    call(site, Beacon.Content, :change_info_handler, [info_handler, attrs])
  end

  def list_info_handlers(site) do
    call(site, Beacon.Content, :list_info_handlers, [site])
  end

  def update_info_handler(site, actor, info_handler, attrs) do
    call(site, Beacon.Content, :update_info_handler, [info_handler, attrs, [actor: actor]])
  end

  def delete_info_handler(site, actor, info_handler) do
    call(site, Beacon.Content, :delete_info_handler, [info_handler, [actor: actor]])
  end
end
