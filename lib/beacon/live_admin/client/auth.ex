defmodule Beacon.LiveAdmin.Client.Auth do
  @moduledoc false

  alias Beacon.LiveAdmin.Auth

  # User CRUD (site param accepted for API consistency but unused)

  def list_users(_site, opts \\ []), do: Auth.list_users(opts)
  def get_user(_site, id), do: Auth.get_user(id)
  def create_user(_site, attrs), do: Auth.create_user(attrs)
  def update_user(_site, user, attrs), do: Auth.update_user(user, attrs)
  def delete_user(_site, user), do: Auth.delete_user(user)

  # Owner

  def is_owner?(_site, user), do: Auth.is_owner?(user)
  def get_owner(_site), do: Auth.get_owner()
  def set_owner(_site, user), do: Auth.set_owner(user)
  def transfer_ownership(_site, new_owner), do: Auth.transfer_ownership(new_owner)

  # Permission checking

  def can?(_site, user, site, feature, sub_feature), do: Auth.can?(user, site, feature, sub_feature)
  def can_access_site?(_site, user, target_site), do: Auth.can_access_site?(user, target_site)
  def can_access_feature?(_site, user, target_site, feature), do: Auth.can_access_feature?(user, target_site, feature)

  # Groups

  def list_groups(_site, opts \\ []), do: Auth.list_groups(opts)
  def get_group(_site, id), do: Auth.get_group(id)
  def get_group_with_permissions(_site, id), do: Auth.get_group_with_permissions(id)
  def create_group(_site, attrs), do: Auth.create_group(attrs)
  def update_group(_site, group, attrs), do: Auth.update_group(group, attrs)
  def delete_group(_site, group), do: Auth.delete_group(group)

  # Group membership

  def add_user_to_group(_site, user_id, group_id), do: Auth.add_user_to_group(user_id, group_id)
  def remove_user_from_group(_site, user_id, group_id), do: Auth.remove_user_from_group(user_id, group_id)
  def list_group_members(_site, group_id), do: Auth.list_group_members(group_id)
  def list_user_groups(_site, user_id, target_site), do: Auth.list_user_groups(user_id, target_site)

  # Group permissions

  def set_group_permissions(_site, group, perms), do: Auth.set_group_permissions(group, perms)
  def add_group_permission(_site, group, attrs), do: Auth.add_group_permission(group, attrs)
  def remove_group_permission(_site, id), do: Auth.remove_group_permission(id)
  def list_group_permissions(_site, group_id), do: Auth.list_group_permissions(group_id)

  # User permissions (individual grants)

  def grant_user_permission(_site, attrs), do: Auth.grant_user_permission(attrs)
  def revoke_user_permission(_site, id), do: Auth.revoke_user_permission(id)
  def list_user_permissions(_site, user_id, target_site), do: Auth.list_user_permissions(user_id, target_site)

  # Group templates

  def copy_templates_to_site(_site, target_site), do: Auth.copy_templates_to_site(target_site)
end
