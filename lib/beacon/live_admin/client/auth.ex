defmodule Beacon.LiveAdmin.Client.Auth do
  @moduledoc false

  import Beacon.LiveAdmin.Cluster, only: [call: 4]

  def get_actor(site, session) do
    call(site, Beacon.Auth, :get_actor, [site, session])
  end

  def list_actors(site) do
    call(site, Beacon.Auth, :list_actors, [site])
  end

  def change_actor_role(site, actor_role, attrs \\ %{}) do
    call(site, Beacon.Auth, :change_actor_role, [actor_role, attrs])
  end

  def new_actor_role(site) do
    call(site, Beacon.Auth, :new_actor_role, [])
  end

  def get_actor_roles(site, actor_ids, opts \\ []) do
    call(site, Beacon.Auth, :get_actor_roles, [site, actor_ids, opts])
  end

  def change_role(site, role, attrs \\ %{}) do
    call(site, Beacon.Auth, :change_role, [role, attrs])
  end

  def list_roles(site) do
    call(site, Beacon.Auth, :list_roles, [site])
  end

  def default_role_capabilities(site) do
    call(site, Beacon.Auth, :default_role_capabilities, [])
  end

  def create_role(site, actor, attrs) do
    call(site, Beacon.Auth, :create_role, [attrs, [actor: actor]])
  end

  def update_role(site, actor, role, attrs) do
    call(site, Beacon.Auth, :update_role, [role, attrs, [actor: actor]])
  end

  def delete_role(site, actor, role) do
    call(site, Beacon.Auth, :delete_role, [role, [actor: actor]])
  end
end
