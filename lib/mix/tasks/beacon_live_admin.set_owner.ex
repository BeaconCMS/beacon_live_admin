defmodule Mix.Tasks.BeaconLiveAdmin.SetOwner do
  @shortdoc "Sets the platform owner for Beacon LiveAdmin"

  @moduledoc """
  Sets a user as the platform owner for Beacon LiveAdmin.

  The owner has unrestricted access to all sites and platform-level features.
  Only one owner can exist at a time — running this replaces any existing owner.

  Creates the user if they don't already exist.

  ## Usage

      mix beacon_live_admin.set_owner --email admin@example.com --name "Admin User"

  ## Options

    * `--email` (required) — the owner's email address
    * `--name` — the owner's display name

  """

  use Mix.Task

  @requirements ["app.start"]

  @impl true
  def run(args) do
    {opts, _, _} =
      OptionParser.parse(args,
        strict: [email: :string, name: :string]
      )

    email = opts[:email] || Mix.raise("--email is required")
    name = opts[:name]

    Mix.shell().info("Setting Beacon LiveAdmin owner: #{email}")

    user =
      case Beacon.LiveAdmin.Auth.get_user_by_email(email) do
        nil ->
          case Beacon.LiveAdmin.Auth.create_user(%{email: email, name: name}) do
            {:ok, user} ->
              Mix.shell().info("Created user #{email}")
              user

            {:error, changeset} ->
              Mix.raise("Failed to create user: #{inspect(changeset.errors)}")
          end

        existing ->
          existing
      end

    case Beacon.LiveAdmin.Auth.set_owner(user) do
      {:ok, _} ->
        Mix.shell().info("Done! #{email} is now the platform owner.")

      {:error, reason} ->
        Mix.raise("Failed to set owner: #{inspect(reason)}")
    end
  end
end
