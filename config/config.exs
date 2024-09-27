import Config

config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :phoenix, :json_library, Jason

if Mix.env() in [:dev, :e2e] do
  config :tailwind, version: "3.4.4"

  config :tailwind,
    version: "3.4.4",
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

if Mix.env() in [:test, :e2e] do
  config :logger, level: :error
end
