defmodule Beacon.LiveAdmin.MixProject do
  use Mix.Project

  def project do
    [
      app: :beacon_live_admin,
      version: "0.1.0-dev",
      elixir: "~> 1.13",
      elixirc_paths: elixirc_paths(Mix.env()),
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps(),
      dialyzer: [
        plt_file: {:no_warn, "priv/plts/dialyzer.plt"},
        plt_add_apps: [:mix],
        list_unused_filters: true
      ]
    ]
  end

  def application do
    [
      mod: {Beacon.LiveAdmin.Application, []},
      extra_applications: [:logger, :runtime_tools]
    ]
  end

  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  defp deps do
    [
      beacon_dep(),
      live_monaco_editor_dep(),
      {:phoenix, "~> 1.7"},
      {:phoenix_html, "~> 3.3"},
      {:phoenix_live_reload, "~> 1.2", only: :dev},
      {:phoenix_live_view, "~> 0.19"},
      {:floki, ">= 0.30.0", only: :test},
      {:esbuild, "~> 0.5", only: :dev},
      {:tailwind, "~> 0.2"},
      {:gettext, "~> 0.20"},
      {:jason, "~> 1.0"},
      {:plug_cowboy, "~> 2.5"},
      {:dialyxir, "~> 1.2", only: :dev, runtime: false}
    ]
  end

  defp beacon_dep do
    if path = System.get_env("BEACON_PATH") do
      {:beacon, path: path, runtime: false}
    else
      {:beacon, github: "beaconCMS/beacon", runtime: false}
    end
  end

  defp live_monaco_editor_dep do
    if path = System.get_env("LIVE_MONACO_EDITOR_PATH") do
      {:live_monaco_editor, path: path}
    else
      {:live_monaco_editor, "~> 0.1"}
    end
  end

  defp aliases do
    [
      setup: ["deps.get", "assets.setup", "assets.build"],
      dev: "run --no-halt dev.exs",
      "assets.setup": ["tailwind.install --if-missing", "esbuild.install --if-missing"],
      "assets.build": [
        "tailwind default",
        "esbuild module",
        "esbuild main",
        "esbuild cdn",
        "esbuild cdn_min"
      ],
      "assets.deploy": ["tailwind default --minify", "esbuild default --minify", "phx.digest"]
    ]
  end
end
