defmodule Beacon.LiveAdmin.Migrations.V001 do
  @moduledoc false
  use Ecto.Migration

  def up do
    create_if_not_exists table(:beacon_users, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :email, :text, null: false
      add :name, :text
      add :avatar_url, :text

      timestamps type: :utc_datetime_usec
    end

    create_if_not_exists unique_index(:beacon_users, [:email])

    create_if_not_exists table(:beacon_user_roles, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :user_id, references(:beacon_users, type: :binary_id, on_delete: :delete_all), null: false
      add :role, :text, null: false
      add :site, :text

      timestamps type: :utc_datetime_usec
    end

    create_if_not_exists unique_index(:beacon_user_roles, [:user_id, :role, :site])
  end

  def down do
    drop_if_exists unique_index(:beacon_user_roles, [:user_id, :role, :site])
    drop_if_exists table(:beacon_user_roles)

    drop_if_exists unique_index(:beacon_users, [:email])
    drop_if_exists table(:beacon_users)
  end
end
