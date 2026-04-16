defmodule Beacon.LiveAdmin.Auth.User do
  @moduledoc """
  A pre-provisioned admin user for Beacon LiveAdmin.

  Users must be created by a super admin before they can access the admin.
  Authentication is handled by the host application — LiveAdmin only stores
  user identity for role assignment.
  """

  use Beacon.Schema

  @type t :: %__MODULE__{}

  schema "beacon_users" do
    field :email, :string
    field :name, :string
    field :avatar_url, :string
    field :last_login_at, :utc_datetime_usec
    field :last_login_provider, :string

    has_one :owner, Beacon.LiveAdmin.Auth.Owner
    has_many :user_groups, Beacon.LiveAdmin.Auth.UserGroup
    has_many :groups, through: [:user_groups, :group]
    has_many :permissions, Beacon.LiveAdmin.Auth.UserPermission

    timestamps()
  end

  @doc false
  def changeset(user \\ %__MODULE__{}, attrs) do
    user
    |> cast(attrs, [:email, :name, :avatar_url, :last_login_at, :last_login_provider])
    |> validate_required([:email])
    |> validate_format(:email, ~r/@/)
    |> unique_constraint(:email)
  end
end
