defmodule Beacon.LiveAdmin.MixProject do
  use Mix.Project

  @version "0.1.0-dev"

  def project do
    [
      app: :beacon_live_admin,
      version: @version,
      elixir: "~> 1.13",
      elixirc_paths: elixirc_paths(Mix.env()),
      start_permanent: Mix.env() == :prod,
      name: "Beacon LiveAdmin",
      deps: deps(),
      aliases: aliases(),
      docs: docs()
    ]
  end

  def application do
    [
      mod: {Beacon.LiveAdmin.Application, []},
      extra_applications: [:logger]
    ]
  end

  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  defp deps do
    [
      # Overridable
      override_dep(:phoenix, "~> 1.7", "PHOENIX_VERSION", "PHOENIX_PATH"),
      override_dep(:phoenix_live_view, "~> 0.19", "PHOENIX_LIVE_VIEW_VERSION", "PHOENIX_LIVE_VIEW_PATH"),
      override_dep(:beacon, [github: "BeaconCMS/beacon", runtime: false], "BEACON_VERSION", "BEACON_PATH"),
      override_dep(:live_monaco_editor, "~> 0.1", "LIVE_MONACO_EDITOR_VERSION", "LIVE_MONACO_EDITOR_PATH"),

      # Runtime
      {:ecto, "~> 3.6"},
      {:plug_cowboy, "~> 2.5"},
      {:phoenix_html, "~> 4.0"},
      {:live_svelte, "~> 0.12"},
      {:floki, ">= 0.30.0"},
      {:tailwind, "~> 0.2"},
      {:gettext, "~> 0.20"},
      {:jason, "~> 1.0"},

      # Dev, Test, Docs
      {:phoenix_live_reload, "~> 1.2", only: :dev},
      {:ex_doc, "~> 0.29", only: :docs}
    ]
  end

  defp override_dep(dep, version, env_version, env_path) do
    cond do
      env = System.get_env(env_version) -> {dep, env}
      path = System.get_env(env_path) -> {dep, path}
      :default -> {dep, version}
    end
  end

  defp aliases do
    [
      setup: ["deps.get", "assets.setup", "assets.build"],
      "format.all": ["format", "cmd npm run format --prefix ./assets"],
      "format.all.check": [
        "format --check-formatted",
        "cmd npm run format-check --prefix ./assets"
      ],
      "assets.setup": [
        "tailwind.install --if-missing --no-assets",
        "cmd npm install --prefix assets"
      ],
      "assets.build": [
        "tailwind beacon_live_admin --minify",
        "cmd --cd assets node build.js --deploy"
      ]
    ]
  end

  defp docs do
    [
      main: "Beacon.LiveAdmin",
      source_ref: "v#{@version}",
      source_url: "https://github.com/BeaconCMS/beacon_live_admin",
      extra_section: "GUIDES",
      extras: extras(),
      groups_for_extras: groups_for_extras(),
      groups_for_modules: groups_for_modules(),
      skip_undefined_reference_warnings_on: ["CHANGELOG.md"]
    ]
  end

  defp extras do
    ["CHANGELOG.md"] ++ Path.wildcard("guides/*/*.md")
  end

  defp groups_for_extras do
    [
      Introduction: ~r"guides/introduction/",
      Recipes: ~r"guides/recipes/"
    ]
  end

  defp groups_for_modules do
    [
      Execution: [
        Beacon.LiveAdmin.Router,
        Beacon.LiveAdmin.Plug,
        Beacon.LiveAdmin.Cluster
      ],
      "Authn and Authz": [
        Beacon.LiveAdmin.Authorization,
        Beacon.LiveAdmin.Hooks.AssignAgent
      ],
      Extensibility: [
        Beacon.LiveAdmin.PageBuilder,
        Beacon.LiveAdmin.PageBuilder.Page,
        Beacon.LiveAdmin.PageBuilder.Table,
        Beacon.LiveAdmin.AdminComponents,
        Beacon.LiveAdmin.CoreComponents
      ],
      Exceptions: [
        Beacon.LiveAdmin.ClusterError
      ]
    ]
  end
end
