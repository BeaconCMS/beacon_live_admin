defmodule Mix.Tasks.BeaconLiveAdmin.CreateAdmin do
  @shortdoc "Creates a Beacon super admin user"

  @moduledoc """
  Creates a new Beacon super admin user.

  The user must be pre-provisioned here before they can access the admin.
  The host application handles authentication — LiveAdmin only needs the
  email to match against when checking roles.

  ## Usage

      mix beacon_live_admin.create_admin --email admin@example.com --name "Admin User"

  ## Options

    * `--email` (required) — the admin user's email address
    * `--name` — the admin user's display name

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

    Mix.shell().info("Creating Beacon super admin user: #{email}")

    case Beacon.LiveAdmin.Auth.create_user(%{email: email, name: name}) do
      {:ok, user} ->
        case Beacon.LiveAdmin.Auth.assign_role(user, "super_admin") do
          {:ok, _role} ->
            Mix.shell().info("Done! User #{email} is now a super admin.")

          {:error, changeset} ->
            Mix.raise("Failed to assign super_admin role: #{inspect(changeset.errors)}")
        end

      {:error, changeset} ->
        Mix.raise("Failed to create user: #{inspect(changeset.errors)}")
    end
  end
end
