defmodule Beacon.LiveAdmin.Migrations.V003 do
  @moduledoc false
  use Ecto.Migration

  def up do
    # Rename scope_type "template_type" → "collection" in permissions
    execute """
    UPDATE beacon_group_permissions
    SET scope_type = 'collection'
    WHERE scope_type = 'template_type'
    """

    execute """
    UPDATE beacon_user_permissions
    SET scope_type = 'collection'
    WHERE scope_type = 'template_type'
    """

    # Rename feature "template_types" → "collections" in permissions
    execute """
    UPDATE beacon_group_permissions
    SET feature = 'collections'
    WHERE feature = 'template_types'
    """

    execute """
    UPDATE beacon_user_permissions
    SET feature = 'collections'
    WHERE feature = 'template_types'
    """
  end

  def down do
    execute """
    UPDATE beacon_group_permissions
    SET scope_type = 'template_type'
    WHERE scope_type = 'collection'
    """

    execute """
    UPDATE beacon_user_permissions
    SET scope_type = 'template_type'
    WHERE scope_type = 'collection'
    """

    execute """
    UPDATE beacon_group_permissions
    SET feature = 'template_types'
    WHERE feature = 'collections'
    """

    execute """
    UPDATE beacon_user_permissions
    SET feature = 'template_types'
    WHERE feature = 'collections'
    """
  end
end
