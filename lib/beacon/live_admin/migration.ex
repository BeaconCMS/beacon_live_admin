defmodule Beacon.LiveAdmin.Migration do
  @moduledoc """
  Functions which can be called in an Ecto migration for Beacon LiveAdmin installation and upgrades.

  ## Usage

  Generate an `Ecto.Migration` that wraps calls to `Beacon.LiveAdmin.Migration`:

      $ mix ecto.gen.migration create_beacon_live_admin_tables

  Open the generated migration and delegate to `up/1` and `down/1`:

      defmodule MyApp.Repo.Migrations.CreateBeaconLiveAdminTables do
        use Ecto.Migration
        def up, do: Beacon.LiveAdmin.Migration.up()
        def down, do: Beacon.LiveAdmin.Migration.down()
      end

  Then run migrations:

      $ mix ecto.migrate

  To upgrade to a specific version:

      defmodule MyApp.Repo.Migrations.UpgradeBeaconLiveAdminToV2 do
        use Ecto.Migration
        def up, do: Beacon.LiveAdmin.Migration.up(version: 2)
        def down, do: Beacon.LiveAdmin.Migration.down(version: 2)
      end
  """

  @initial_version 1
  @current_version 3

  @doc """
  Upgrades Beacon LiveAdmin database schemas.

  If a specific version number is provided, only upgrades to that version.
  Otherwise, brings fully up-to-date with the current version.
  """
  def up(opts \\ []) do
    versions_to_run =
      case opts[:version] do
        nil -> @initial_version..@current_version//1
        version -> @initial_version..version//1
      end

    Enum.each(versions_to_run, fn version ->
      padded = String.pad_leading("#{version}", 3, "0")
      module = Module.concat([Beacon.LiveAdmin.Migrations, "V#{padded}"])
      module.up()
    end)
  end

  @doc """
  Downgrades Beacon LiveAdmin database schemas.

  If a specific version number is provided, only downgrades to that version (inclusive).
  Otherwise, completely uninstalls Beacon LiveAdmin tables.
  """
  def down(opts \\ []) do
    versions_to_run =
      case opts[:version] do
        nil -> @current_version..@initial_version//-1
        version -> @current_version..version//-1
      end

    Enum.each(versions_to_run, fn version ->
      padded = String.pad_leading("#{version}", 3, "0")
      module = Module.concat([Beacon.LiveAdmin.Migrations, "V#{padded}"])
      module.down()
    end)
  end
end
