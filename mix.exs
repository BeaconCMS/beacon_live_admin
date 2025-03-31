defmodule Beacon.LiveAdmin.MixProject do
  use Mix.Project

  @version "0.4.3"
  @source_url "https://github.com/BeaconCMS/beacon_live_admin"
  @homepage_url "https://beaconcms.org"

  def project do
    [
      app: :beacon_live_admin,
      version: @version,
      elixir: "~> 1.14",
      elixirc_paths: elixirc_paths(Mix.env()),
      start_permanent: Mix.env() == :prod,
      name: "Beacon LiveAdmin",
      homepage_url: @homepage_url,
      source_url: @source_url,
      description: """
      Phoenix LiveView Admin Panel to manage Beacon CMS sites.
      """,
      package: package(),
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

  defp package do
    [
      maintainers: ["Leandro Pereira", "Andrew Berrien"],
      licenses: ["MIT"],
      links: %{
        Changelog: "https://hexdocs.pm/beacon_live_admin/#{@version}/changelog.html",
        GitHub: @source_url,
        Website: @homepage_url,
        DockYard: "https://dockyard.com"
      },
      files: ~w(lib priv .formatter.exs mix.exs CHANGELOG.md LICENSE.md)
    ]
  end

  defp deps do
    [
      # Overridable
      override_dep(:phoenix, "~> 1.7", "PHOENIX_VERSION", "PHOENIX_PATH"),
      override_dep(:phoenix_live_view, "~> 0.20 or ~> 1.0", "PHOENIX_LIVE_VIEW_VERSION", "PHOENIX_LIVE_VIEW_PATH"),
      override_dep(:live_monaco_editor, "~> 0.2", "LIVE_MONACO_EDITOR_VERSION", "LIVE_MONACO_EDITOR_PATH"),
      beacon_dep(),

      # Runtime
      {:ecto, "~> 3.6"},
      {:phoenix_html, "~> 4.0"},
      {:live_svelte, "~> 0.12"},
      {:floki, ">= 0.30.0"},
      # TODO: tailwind v4 needs more testing
      {:tailwind, "~> 0.2"},
      {:gettext, "~> 0.26"},
      {:jason, "~> 1.0"},
      {:igniter, "~> 0.5", optional: true},
      {:turboprop, "~> 0.1"},

      # Dev, Test, Docs
      {:bandit, "~> 1.0", only: :dev, optional: true},
      {:phoenix_live_reload, "~> 1.2", only: :dev},
      {:ex_doc, "~> 0.29", only: :dev},
      {:makeup_elixir, "~> 1.0.1 or ~> 1.1", only: :dev},
      {:makeup_eex, "~> 2.0", only: :dev},
      {:makeup_syntect, "~> 0.1", only: :dev}
    ]
  end

  defp override_dep(dep, requirement, env_version, env_path) do
    cond do
      version = System.get_env(env_version) ->
        {dep, version, override: true}

      path = System.get_env(env_path) ->
        {dep, path: path, override: true}

      :default ->
        {dep, requirement}
    end
  end

  defp beacon_dep do
    cond do
      path = System.get_env("BEACON_PATH") ->
        {:beacon, path: path, runtime: false}

      String.ends_with?(@version, "-dev") ->
        {:beacon, github: "BeaconCMS/beacon", runtime: false}

      :else ->
        {:beacon, ">= 0.0.0 and < 1.0.0", runtime: false}
    end
  end

  defp aliases do
    [
      setup: ["deps.get", "assets.setup"],
      dev: "run --no-halt dev.exs",
      "format.all": ["format", "cmd npm run format --prefix ./assets"],
      "format.all.check": [
        "format --check-formatted",
        "cmd npm run format-check --prefix ./assets"
      ],
      "assets.setup": [
        "tailwind.install --if-missing --no-assets",
        "cmd npm install --prefix assets"
      ],
      "assets.watch": [
        "tailwind beacon_live_admin",
        "cmd --cd assets node build.js --watch"
      ],
      "assets.build": [
        "tailwind beacon_live_admin",
        "tailwind beacon_live_admin_min",
        "cmd --cd assets node build.js --deploy"
      ]
    ]
  end

  defp docs do
    [
      main: "Beacon.LiveAdmin",
      logo: "assets/images/beacon_logo.png",
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
