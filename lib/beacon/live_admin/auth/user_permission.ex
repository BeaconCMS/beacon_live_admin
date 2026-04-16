defmodule Beacon.LiveAdmin.Auth.UserPermission do
  @moduledoc """
  A direct permission grant for an individual user on a specific site.

  Same permission model as `GroupPermission` but applied to a single user
  instead of a group. Useful for fine-grained access without creating a group.
  """

  use Beacon.Schema

  alias Beacon.LiveAdmin.Auth.FeatureRegistry

  @type t :: %__MODULE__{}

  @valid_scope_types ~w(all collection page)

  schema "beacon_user_permissions" do
    belongs_to :user, Beacon.LiveAdmin.Auth.User

    field :site, Beacon.Types.Site
    field :feature, :string
    field :sub_feature, :string
    field :scope_type, :string, default: "all"
    field :scope_id, :binary_id

    timestamps()
  end

  @doc false
  def changeset(permission \\ %__MODULE__{}, attrs) do
    permission
    |> cast(attrs, [:user_id, :site, :feature, :sub_feature, :scope_type, :scope_id])
    |> validate_required([:user_id, :site, :feature, :sub_feature, :scope_type])
    |> validate_inclusion(:scope_type, @valid_scope_types, message: "must be one of: #{Enum.join(@valid_scope_types, ", ")}")
    |> validate_feature()
    |> validate_scope_id()
    |> unique_constraint([:user_id, :site, :feature, :sub_feature, :scope_type, :scope_id],
      name: :beacon_user_permissions_unique_index
    )
  end

  defp validate_feature(changeset) do
    feature = get_field(changeset, :feature)
    sub_feature = get_field(changeset, :sub_feature)

    cond do
      is_nil(feature) ->
        changeset

      not FeatureRegistry.valid_feature?(feature) ->
        add_error(changeset, :feature, "is not a valid feature")

      sub_feature && not FeatureRegistry.valid_sub_feature?(feature, sub_feature) ->
        add_error(changeset, :sub_feature, "is not a valid sub-feature for #{feature}")

      true ->
        changeset
    end
  end

  defp validate_scope_id(changeset) do
    scope_type = get_field(changeset, :scope_type)
    scope_id = get_field(changeset, :scope_id)

    cond do
      scope_type == "all" && scope_id ->
        add_error(changeset, :scope_id, "must be nil when scope_type is 'all'")

      scope_type in ["collection", "page"] && is_nil(scope_id) ->
        add_error(changeset, :scope_id, "is required when scope_type is '#{scope_type}'")

      true ->
        changeset
    end
  end
end
