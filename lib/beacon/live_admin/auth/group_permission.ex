defmodule Beacon.LiveAdmin.Auth.GroupPermission do
  @moduledoc """
  A single permission entry for a group.

  Specifies a feature + sub-feature (action) with optional resource scoping.

  ## Scope Types

    * `"all"` — applies to all resources (scope_id must be nil)
    * `"collection"` — applies to pages with the given collection_id
    * `"page"` — applies to a specific page
  """

  use Beacon.Schema

  alias Beacon.LiveAdmin.Auth.FeatureRegistry

  @type t :: %__MODULE__{}

  @valid_scope_types ~w(all collection page)

  schema "beacon_group_permissions" do
    belongs_to :group, Beacon.LiveAdmin.Auth.Group

    field :feature, :string
    field :sub_feature, :string
    field :scope_type, :string, default: "all"
    field :scope_id, :binary_id

    timestamps()
  end

  @doc false
  def changeset(permission \\ %__MODULE__{}, attrs) do
    permission
    |> cast(attrs, [:group_id, :feature, :sub_feature, :scope_type, :scope_id])
    |> validate_required([:group_id, :feature, :sub_feature, :scope_type])
    |> validate_inclusion(:scope_type, @valid_scope_types, message: "must be one of: #{Enum.join(@valid_scope_types, ", ")}")
    |> validate_feature()
    |> validate_scope_id()
    |> unique_constraint([:group_id, :feature, :sub_feature, :scope_type, :scope_id],
      name: :beacon_group_permissions_unique_index
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
