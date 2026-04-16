defmodule Beacon.LiveAdmin.Migrations.V002 do
  @moduledoc false
  use Ecto.Migration

  def up do
    # 1. Create beacon_owners
    create_if_not_exists table(:beacon_owners, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :user_id, references(:beacon_users, type: :binary_id, on_delete: :delete_all), null: false

      timestamps type: :utc_datetime_usec
    end

    create_if_not_exists unique_index(:beacon_owners, [:user_id])

    # 2. Create beacon_groups
    create_if_not_exists table(:beacon_groups, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :site, :text
      add :name, :text, null: false
      add :description, :text
      add :is_template, :boolean, default: false

      timestamps type: :utc_datetime_usec
    end

    create_if_not_exists unique_index(:beacon_groups, [:site, :name])

    # 3. Create beacon_group_permissions
    create_if_not_exists table(:beacon_group_permissions, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :group_id, references(:beacon_groups, type: :binary_id, on_delete: :delete_all), null: false
      add :feature, :text, null: false
      add :sub_feature, :text, null: false
      add :scope_type, :text, null: false, default: "all"
      add :scope_id, :binary_id

      timestamps type: :utc_datetime_usec
    end

    create_if_not_exists unique_index(:beacon_group_permissions,
      [:group_id, :feature, :sub_feature, :scope_type, :scope_id],
      name: :beacon_group_permissions_unique_index
    )

    # 4. Create beacon_user_groups
    create_if_not_exists table(:beacon_user_groups, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :user_id, references(:beacon_users, type: :binary_id, on_delete: :delete_all), null: false
      add :group_id, references(:beacon_groups, type: :binary_id, on_delete: :delete_all), null: false

      timestamps type: :utc_datetime_usec
    end

    create_if_not_exists unique_index(:beacon_user_groups, [:user_id, :group_id])

    # 5. Create beacon_user_permissions
    create_if_not_exists table(:beacon_user_permissions, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :user_id, references(:beacon_users, type: :binary_id, on_delete: :delete_all), null: false
      add :site, :text, null: false
      add :feature, :text, null: false
      add :sub_feature, :text, null: false
      add :scope_type, :text, null: false, default: "all"
      add :scope_id, :binary_id

      timestamps type: :utc_datetime_usec
    end

    create_if_not_exists unique_index(:beacon_user_permissions,
      [:user_id, :site, :feature, :sub_feature, :scope_type, :scope_id],
      name: :beacon_user_permissions_unique_index
    )

    # Flush DDL operations before data migration
    flush()

    # 6. Data migration: convert roles to groups/permissions
    migrate_roles_to_groups()

    # 7. Drop beacon_user_roles
    drop_if_exists unique_index(:beacon_user_roles, [:user_id, :role, :site])
    drop_if_exists table(:beacon_user_roles)
  end

  def down do
    # Recreate beacon_user_roles
    create_if_not_exists table(:beacon_user_roles, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :user_id, references(:beacon_users, type: :binary_id, on_delete: :delete_all), null: false
      add :role, :text, null: false
      add :site, :text

      timestamps type: :utc_datetime_usec
    end

    create_if_not_exists unique_index(:beacon_user_roles, [:user_id, :role, :site])

    flush()

    # Best-effort reverse migration
    migrate_groups_to_roles()

    # Drop new tables in reverse order
    drop_if_exists unique_index(:beacon_user_permissions, [:user_id, :site, :feature, :sub_feature, :scope_type, :scope_id],
      name: :beacon_user_permissions_unique_index)
    drop_if_exists table(:beacon_user_permissions)

    drop_if_exists unique_index(:beacon_user_groups, [:user_id, :group_id])
    drop_if_exists table(:beacon_user_groups)

    drop_if_exists unique_index(:beacon_group_permissions, [:group_id, :feature, :sub_feature, :scope_type, :scope_id],
      name: :beacon_group_permissions_unique_index)
    drop_if_exists table(:beacon_group_permissions)

    drop_if_exists unique_index(:beacon_groups, [:site, :name])
    drop_if_exists table(:beacon_groups)

    drop_if_exists unique_index(:beacon_owners, [:user_id])
    drop_if_exists table(:beacon_owners)
  end

  # ---------------------------------------------------------------------------
  # Data migration helpers
  # ---------------------------------------------------------------------------

  @all_features [
    {"pages", ~w(view create_draft edit publish delete)},
    {"layouts", ~w(view create edit delete)},
    {"components", ~w(view create edit delete)},
    {"media_library", ~w(view upload delete)},
    {"seo_audit", ~w(view)},
    {"measurement", ~w(view take_snapshot)},
    {"link_health", ~w(view)},
    {"redirects", ~w(view create edit delete)},
    {"graphql_endpoints", ~w(view create edit delete)},
    {"event_handlers", ~w(view create edit delete)},
    {"info_handlers", ~w(view create edit delete)},
    {"error_pages", ~w(view create edit delete)},
    {"js_hooks", ~w(view create edit delete)},
    {"site_settings", ~w(view edit)},
    {"template_types", ~w(view create edit delete)}
  ]

  @editor_features [
    {"pages", ~w(view create_draft edit publish delete)},
    {"layouts", ~w(view create edit delete)},
    {"components", ~w(view create edit delete)},
    {"media_library", ~w(view upload delete)}
  ]

  @viewer_features Enum.map(@all_features, fn {feature, _} -> {feature, ~w(view)} end)

  defp migrate_roles_to_groups do
    now = DateTime.utc_now() |> DateTime.truncate(:microsecond)
    roles = fetch_all_roles()

    # Promote first super_admin to owner
    super_admins = Enum.filter(roles, &(&1.role == "super_admin"))
    remaining_super_admins = promote_owner(super_admins, now)

    # Collect unique sites from role entries
    sites =
      roles
      |> Enum.map(& &1.site)
      |> Enum.reject(&is_nil/1)
      |> Enum.uniq()

    # Create default group templates
    create_group_templates(now)

    # For each site, create groups and assign users
    Enum.each(sites, fn site ->
      site_roles = Enum.filter(roles, &(&1.site == site))

      group_ids = create_site_groups(site, now)

      assign_users_to_groups(site_roles, group_ids, now)

      # Any remaining super_admins (not the owner) get the Site Admin group
      Enum.each(remaining_super_admins, fn sa ->
        insert_user_group(sa.user_id, group_ids["Site Admin"], now)
      end)
    end)
  end

  defp fetch_all_roles do
    repo().query!("SELECT id, user_id, role, site FROM beacon_user_roles").rows
    |> Enum.map(fn [id, user_id, role, site] ->
      %{id: id, user_id: user_id, role: role, site: site}
    end)
  end

  defp promote_owner([], _now), do: []

  defp promote_owner([first | rest], now) do
    owner_id = Ecto.UUID.generate()

    repo().query!(
      "INSERT INTO beacon_owners (id, user_id, inserted_at, updated_at) VALUES ($1, $2, $3, $4)",
      [Ecto.UUID.dump!(owner_id), first.user_id, now, now]
    )

    rest
  end

  defp create_group_templates(now) do
    Enum.each(
      [
        {"Site Admin", "Full access to all site features", @all_features},
        {"Site Editor", "Create and edit content", @editor_features},
        {"Site Viewer", "Read-only access", @viewer_features}
      ],
      fn {name, description, features} ->
        group_id = insert_group(nil, name, description, true, now)
        insert_permissions_for_group(group_id, features, now)
      end
    )
  end

  defp create_site_groups(site, now) do
    [
      {"Site Admin", "Full access to all site features", @all_features},
      {"Site Editor", "Create and edit content", @editor_features},
      {"Site Viewer", "Read-only access", @viewer_features}
    ]
    |> Enum.reduce(%{}, fn {name, description, features}, acc ->
      group_id = insert_group(site, name, description, false, now)
      insert_permissions_for_group(group_id, features, now)
      Map.put(acc, name, group_id)
    end)
  end

  defp assign_users_to_groups(site_roles, group_ids, now) do
    Enum.each(site_roles, fn role_entry ->
      group_name =
        case role_entry.role do
          "site_admin" -> "Site Admin"
          "site_editor" -> "Site Editor"
          "site_viewer" -> "Site Viewer"
          _ -> nil
        end

      if group_name && group_ids[group_name] do
        insert_user_group(role_entry.user_id, group_ids[group_name], now)
      end
    end)
  end

  defp insert_group(site, name, description, is_template, now) do
    id = Ecto.UUID.generate()
    dumped_id = Ecto.UUID.dump!(id)

    repo().query!(
      """
      INSERT INTO beacon_groups (id, site, name, description, is_template, inserted_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (site, name) DO NOTHING
      """,
      [dumped_id, site, name, description, is_template, now, now]
    )

    dumped_id
  end

  defp insert_permissions_for_group(group_id, features, now) do
    Enum.each(features, fn {feature, sub_features} ->
      Enum.each(sub_features, fn sub_feature ->
        perm_id = Ecto.UUID.dump!(Ecto.UUID.generate())

        repo().query!(
          """
          INSERT INTO beacon_group_permissions (id, group_id, feature, sub_feature, scope_type, scope_id, inserted_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT DO NOTHING
          """,
          [perm_id, group_id, feature, sub_feature, "all", nil, now, now]
        )
      end)
    end)
  end

  defp insert_user_group(user_id, group_id, now) do
    id = Ecto.UUID.dump!(Ecto.UUID.generate())

    repo().query!(
      """
      INSERT INTO beacon_user_groups (id, user_id, group_id, inserted_at, updated_at)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id, group_id) DO NOTHING
      """,
      [id, user_id, group_id, now, now]
    )
  end

  defp migrate_groups_to_roles do
    now = DateTime.utc_now() |> DateTime.truncate(:microsecond)

    # Owner → super_admin
    owner_rows = repo().query!("SELECT user_id FROM beacon_owners").rows

    Enum.each(owner_rows, fn [user_id] ->
      insert_role(user_id, "super_admin", nil, now)
    end)

    # Groups → roles (best-effort mapping by group name)
    group_rows =
      repo().query!(
        "SELECT bg.site, bg.name, ug.user_id FROM beacon_groups bg JOIN beacon_user_groups ug ON ug.group_id = bg.id WHERE bg.is_template = false"
      ).rows

    Enum.each(group_rows, fn [site, name, user_id] ->
      role =
        case name do
          "Site Admin" -> "site_admin"
          "Site Editor" -> "site_editor"
          "Site Viewer" -> "site_viewer"
          _ -> nil
        end

      if role, do: insert_role(user_id, role, site, now)
    end)
  end

  defp insert_role(user_id, role, site, now) do
    id = Ecto.UUID.dump!(Ecto.UUID.generate())

    repo().query!(
      """
      INSERT INTO beacon_user_roles (id, user_id, role, site, inserted_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id, role, site) DO NOTHING
      """,
      [id, user_id, role, site, now, now]
    )
  end
end
