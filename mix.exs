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
      aliases: aliases(),
      deps: deps()
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
      {:ecto, "~> 3.6"},
      phoenix_dep(),
      {:phoenix_html, "~> 4.0"},
      {:phoenix_live_reload, "~> 1.2", only: :dev},
      phoenix_live_view_dep(),
      {:floki, ">= 0.30.0"},
      {:tailwind, "~> 0.2"},
      {:gettext, "~> 0.20"},
      {:jason, "~> 1.0"},
      {:plug_cowboy, "~> 2.5"},
      {:live_svelte, "~> 0.12"}
    ]
  end

  defp phoenix_dep do
    cond do
      env = System.get_env("PHOENIX_VERSION") -> {:phoenix, env}
      path = System.get_env("PHOENIX_PATH") -> {:phoenix, path}
      :default -> {:phoenix, "~> 1.7"}
    end
  end

  defp phoenix_live_view_dep do
    cond do
      env = System.get_env("PHOENIX_LIVE_VIEW_VERSION") -> {:phoenix_live_view, env}
      path = System.get_env("PHOENIX_LIVE_VIEW_PATH") -> {:phoenix_live_view, path}
      :default -> {:phoenix_live_view, "~> 0.19"}
    end
  end

  defp beacon_dep do
    cond do
      path = System.get_env("BEACON_PATH") -> {:beacon, path: path, runtime: false}
      :default -> {:beacon, github: "beaconCMS/beacon", runtime: false}
    end
  end

  defp live_monaco_editor_dep do
    cond do
      path = System.get_env("LIVE_MONACO_EDITOR_PATH") -> {:live_monaco_editor, path: path}
      :default -> {:live_monaco_editor, "~> 0.1.7"}
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
      dev: "run --no-halt dev.exs",
      "assets.setup": [
        "cmd npm install --prefix assets",
        "tailwind.install --if-missing --no-assets"
      ],
      "assets.build": [
        "tailwind default",
        "cmd --cd assets node build.js"
      ],
      "assets.deploy": [
        "tailwind default --minify",
        "cmd --cd assets node build.js --deploy"
      ]
    ]
  end
end
