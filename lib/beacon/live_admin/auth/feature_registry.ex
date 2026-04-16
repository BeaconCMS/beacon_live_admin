defmodule Beacon.LiveAdmin.Auth.FeatureRegistry do
  @moduledoc """
  Canonical registry of features and their sub-features (actions) for permission control.

  Each feature represents a section of the admin UI. Sub-features represent
  the actions a user can perform within that feature (view, create, edit, etc.).

  Designed for future plugin extensibility via `register_feature/1`.
  """

  @type sub_feature :: %{key: String.t(), label: String.t()}
  @type feature :: %{key: String.t(), label: String.t(), sub_features: [sub_feature()]}

  @features [
    %{key: "pages", label: "Pages", sub_features: [
      %{key: "view", label: "View"},
      %{key: "create_draft", label: "Create Draft"},
      %{key: "edit", label: "Edit"},
      %{key: "publish", label: "Publish"},
      %{key: "delete", label: "Delete"}
    ]},
    %{key: "layouts", label: "Layouts", sub_features: [
      %{key: "view", label: "View"},
      %{key: "create", label: "Create"},
      %{key: "edit", label: "Edit"},
      %{key: "delete", label: "Delete"}
    ]},
    %{key: "components", label: "Components", sub_features: [
      %{key: "view", label: "View"},
      %{key: "create", label: "Create"},
      %{key: "edit", label: "Edit"},
      %{key: "delete", label: "Delete"}
    ]},
    %{key: "media_library", label: "Media Library", sub_features: [
      %{key: "view", label: "View"},
      %{key: "upload", label: "Upload"},
      %{key: "delete", label: "Delete"}
    ]},
    %{key: "seo_audit", label: "SEO Audit", sub_features: [
      %{key: "view", label: "View"}
    ]},
    %{key: "measurement", label: "Measurement", sub_features: [
      %{key: "view", label: "View"},
      %{key: "take_snapshot", label: "Take Snapshot"}
    ]},
    %{key: "link_health", label: "Link Health", sub_features: [
      %{key: "view", label: "View"}
    ]},
    %{key: "redirects", label: "Redirects", sub_features: [
      %{key: "view", label: "View"},
      %{key: "create", label: "Create"},
      %{key: "edit", label: "Edit"},
      %{key: "delete", label: "Delete"}
    ]},
    %{key: "graphql_endpoints", label: "GraphQL Endpoints", sub_features: [
      %{key: "view", label: "View"},
      %{key: "create", label: "Create"},
      %{key: "edit", label: "Edit"},
      %{key: "delete", label: "Delete"}
    ]},
    %{key: "event_handlers", label: "Event Handlers", sub_features: [
      %{key: "view", label: "View"},
      %{key: "create", label: "Create"},
      %{key: "edit", label: "Edit"},
      %{key: "delete", label: "Delete"}
    ]},
    %{key: "info_handlers", label: "Info Handlers", sub_features: [
      %{key: "view", label: "View"},
      %{key: "create", label: "Create"},
      %{key: "edit", label: "Edit"},
      %{key: "delete", label: "Delete"}
    ]},
    %{key: "error_pages", label: "Error Pages", sub_features: [
      %{key: "view", label: "View"},
      %{key: "create", label: "Create"},
      %{key: "edit", label: "Edit"},
      %{key: "delete", label: "Delete"}
    ]},
    %{key: "js_hooks", label: "JS Hooks", sub_features: [
      %{key: "view", label: "View"},
      %{key: "create", label: "Create"},
      %{key: "edit", label: "Edit"},
      %{key: "delete", label: "Delete"}
    ]},
    %{key: "site_settings", label: "Site Settings", sub_features: [
      %{key: "view", label: "View"},
      %{key: "edit", label: "Edit"}
    ]},
    %{key: "collections", label: "Collections", sub_features: [
      %{key: "view", label: "View"},
      %{key: "create", label: "Create"},
      %{key: "edit", label: "Edit"},
      %{key: "delete", label: "Delete"}
    ]}
  ]

  @feature_keys Enum.map(@features, & &1.key)

  @feature_map Map.new(@features, fn f -> {f.key, f} end)

  @path_to_feature %{
    "/pages" => "pages",
    "/layouts" => "layouts",
    "/components" => "components",
    "/media_library" => "media_library",
    "/seo_audit" => "seo_audit",
    "/measurement" => "measurement",
    "/link_health" => "link_health",
    "/redirects" => "redirects",
    "/graphql_endpoints" => "graphql_endpoints",
    "/events" => "event_handlers",
    "/info_handlers" => "info_handlers",
    "/error_pages" => "error_pages",
    "/hooks" => "js_hooks",
    "/settings" => "site_settings",
    "/collections" => "collections"
  }

  @doc "Returns the full list of feature definitions."
  @spec features() :: [feature()]
  def features, do: @features

  @doc "Returns the list of all feature key strings."
  @spec feature_keys() :: [String.t()]
  def feature_keys, do: @feature_keys

  @doc "Returns the list of sub-feature key strings for the given feature."
  @spec sub_feature_keys(String.t()) :: [String.t()]
  def sub_feature_keys(feature_key) do
    case Map.get(@feature_map, feature_key) do
      nil -> []
      feature -> Enum.map(feature.sub_features, & &1.key)
    end
  end

  @doc "Returns true if the given feature key is valid."
  @spec valid_feature?(String.t()) :: boolean()
  def valid_feature?(feature_key), do: feature_key in @feature_keys

  @doc "Returns true if the given sub-feature key is valid for the feature."
  @spec valid_sub_feature?(String.t(), String.t()) :: boolean()
  def valid_sub_feature?(feature_key, sub_feature_key) do
    sub_feature_key in sub_feature_keys(feature_key)
  end

  @doc "Returns the feature key for a given route path, or nil."
  @spec feature_for_path(String.t()) :: String.t() | nil
  def feature_for_path(path), do: Map.get(@path_to_feature, path)

  @doc "Returns the feature definition for a given key, or nil."
  @spec get_feature(String.t()) :: feature() | nil
  def get_feature(feature_key), do: Map.get(@feature_map, feature_key)
end
