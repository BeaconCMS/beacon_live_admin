import Config

config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :phoenix, :json_library, Jason

if Mix.env() == :dev do
  config :tailwind,
    version: "3.4.1",
    beacon_live_admin: [
      args: ~w(
      --minify
      --config=tailwind.config.js
      --input=css/beacon_live_admin.css
      --output=../priv/static/beacon_live_admin.min.css
    ),
      cd: Path.expand("../assets", __DIR__)
    ]
end

if config_env() == :test, do: import_config("test.exs")