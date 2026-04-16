defmodule Beacon.LiveAdmin.Auth.Group do
  @moduledoc """
  A named collection of permissions scoped to a site.

  Users added to a group inherit all of its permissions. Groups with
  `is_template: true` and `site: nil` are global templates that get
  copied into new sites.
  """

  use Beacon.Schema

  @type t :: %__MODULE__{}

  schema "beacon_groups" do
    field :site, Beacon.Types.Site
    field :name, :string
    field :description, :string
    field :is_template, :boolean, default: false

    has_many :permissions, Beacon.LiveAdmin.Auth.GroupPermission
    has_many :user_groups, Beacon.LiveAdmin.Auth.UserGroup
    has_many :users, through: [:user_groups, :user]

    timestamps()
  end

  @doc false
  def changeset(group \\ %__MODULE__{}, attrs) do
    group
    |> cast(attrs, [:site, :name, :description, :is_template])
    |> validate_required([:name])
    |> validate_template()
    |> unique_constraint([:site, :name])
  end

  defp validate_template(changeset) do
    is_template = get_field(changeset, :is_template)
    site = get_field(changeset, :site)

    if is_template && site do
      add_error(changeset, :site, "must be nil for template groups")
    else
      changeset
    end
  end
end
