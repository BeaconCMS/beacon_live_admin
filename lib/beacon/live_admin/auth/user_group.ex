defmodule Beacon.LiveAdmin.Auth.UserGroup do
  @moduledoc """
  Join table linking users to groups.
  """

  use Beacon.Schema

  @type t :: %__MODULE__{}

  schema "beacon_user_groups" do
    belongs_to :user, Beacon.LiveAdmin.Auth.User
    belongs_to :group, Beacon.LiveAdmin.Auth.Group

    timestamps()
  end

  @doc false
  def changeset(user_group \\ %__MODULE__{}, attrs) do
    user_group
    |> cast(attrs, [:user_id, :group_id])
    |> validate_required([:user_id, :group_id])
    |> unique_constraint([:user_id, :group_id])
  end
end
