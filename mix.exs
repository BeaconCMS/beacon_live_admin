defmodule Beacon.LiveAdmin.MixProject do
  use Mix.Project

  @version "0.1.0-rc.0"
  @source_url "https://github.com/BeaconCMS/beacon_live_admin"
  @homepage_url "https://beaconcms.org"

  def project do
    [
      app: :beacon_live_admin,
      version: @version,
      elixir: "~> 1.13",
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
      override_dep(:phoenix_live_view, "~> 0.19", "PHOENIX_LIVE_VIEW_VERSION", "PHOENIX_LIVE_VIEW_PATH"),
      beacon_dep(),

      # Runtime
      {:ecto, "~> 3.6"},
      {:plug_cowboy, "~> 2.5"},
      {:phoenix_html, "~> 4.0"},
      {:live_svelte, "~> 0.12"},
      {:floki, ">= 0.30.0"},
      {:tailwind, "~> 0.2"},
      {:gettext, "~> 0.20"},
      {:jason, "~> 1.0"},
      {:live_monaco_editor, "~> 0.1"},

      # Dev, Test, Docs
      {:phoenix_live_reload, "~> 1.2", only: :dev},
      {:ex_doc, "~> 0.29", only: :dev, runtime: false}
    ]
  end

  defp override_dep(dep, requirement, env_version, env_path) do
    cond do
      version = System.get_env(env_version) ->
        {dep, version}

      path = System.get_env(env_path) ->
        {dep, path: path}

      :default ->
        {dep, requirement}
    end
  end

  defp beacon_dep do
    if path = System.get_env("BEACON_PATH") do
      {:beacon, path: path, runtime: false}
    else
      {:beacon, "~> 0.1.0-rc.0", runtime: false}
    end
  end

  defp aliases do
    [
      setup: ["deps.get", "assets.setup", "assets.build"],
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
