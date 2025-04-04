import Config

config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :phoenix, :json_library, Jason

if Mix.env() in [:dev] do
  config :tailwind, version: "3.4.13"

  config :tailwind,
    version: "3.4.13",
    beacon_live_admin: [
      args: ~w(---config=tailwind.config.js --input=css/beacon_live_admin.css --output=../priv/static/beacon_live_admin.css ),
      cd: Path.expand("../assets", __DIR__)
    ],
    beacon_live_admin_min: [
      args: ~w(--minify --config=tailwind.config.js --input=css/beacon_live_admin.css --output=../priv/static/beacon_live_admin.min.css),
      cd: Path.expand("../assets", __DIR__)
    ]
end

if Mix.env() in [:dev] do
  config :nodejs, debug_mode: true
end

if Mix.env() in [:test] do
  config :logger, level: :error
end
