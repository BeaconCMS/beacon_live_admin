defmodule Beacon.LiveAdmin.Client.Auth do
  @moduledoc false

  @doc """
  List all users.
  Auth functions are not site-scoped but we accept site for API consistency.
  """
  def list_users(_site, opts \\ []) do
    Beacon.LiveAdmin.Auth.list_users(opts)
  end

  def get_user(_site, id) do
    Beacon.LiveAdmin.Auth.get_user(id)
  end

  def create_user(_site, attrs) do
    Beacon.LiveAdmin.Auth.create_user(attrs)
  end

  def update_user(_site, user, attrs) do
    Beacon.LiveAdmin.Auth.update_user(user, attrs)
  end

  def delete_user(_site, user) do
    Beacon.LiveAdmin.Auth.delete_user(user)
  end

  def assign_role(_site, user, role, role_site) do
    Beacon.LiveAdmin.Auth.assign_role(user, role, role_site)
  end

  def revoke_role(_site, user, role, role_site) do
    Beacon.LiveAdmin.Auth.revoke_role(user, role, role_site)
  end

  def list_roles(_site, user) do
    Beacon.LiveAdmin.Auth.list_roles(user)
  end

  def has_role?(_site, user, role, role_site) do
    Beacon.LiveAdmin.Auth.has_role?(user, role, role_site)
  end

  def is_super_admin?(_site, user) do
    Beacon.LiveAdmin.Auth.is_super_admin?(user)
  end

  def can_access_site?(_site, user, target_site) do
    Beacon.LiveAdmin.Auth.can_access_site?(user, target_site)
  end
end
