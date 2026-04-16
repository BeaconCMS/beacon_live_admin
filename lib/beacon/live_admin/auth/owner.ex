defmodule Beacon.LiveAdmin.Auth.Owner do
  @moduledoc """
  The platform owner — a single account with unrestricted access to all
  sites and platform-level features.

  Only one owner can exist at a time. Ownership is transferable.
  """

  use Beacon.Schema

  @type t :: %__MODULE__{}

  schema "beacon_owners" do
    belongs_to :user, Beacon.LiveAdmin.Auth.User

    timestamps()
  end

  @doc false
  def changeset(owner \\ %__MODULE__{}, attrs) do
    owner
    |> cast(attrs, [:user_id])
    |> validate_required([:user_id])
    |> unique_constraint(:user_id)
  end
end
