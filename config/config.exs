import Config

config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :phoenix, :json_library, Jason

if Mix.env() == :dev do
  esbuild = fn args ->
    [
      args: ~w(./js/app.js --bundle) ++ args,
      cd: Path.expand("../assets", __DIR__),
      env: %{"NODE_PATH" => Path.expand("../deps", __DIR__)}
    ]
  end

  config :esbuild,
    version: "0.17.18",
    module:
      esbuild.(~w(--format=esm --sourcemap --outfile=../priv/static/beacon_live_admin.esm.js)),
    main:
      esbuild.(~w(--format=cjs --sourcemap --outfile=../priv/static/beacon_live_admin.cjs.js)),
    cdn:
      esbuild.(
        ~w(--format=iife --target=es2016 --global-name=BeaconLiveAdmin --outfile=../priv/static/beacon_live_admin.js)
      ),
    cdn_min:
      esbuild.(
        ~w(--format=iife --target=es2016 --global-name=BeaconLiveAdmin --minify --outfile=../priv/static/beacon_live_admin.min.js)
      )

  config :tailwind,
    version: "3.2.7",
    default: [
      args: ~w(
      --config=tailwind.config.js
      --input=css/app.css
      --output=../priv/static/beacon_live_admin.css
    ),
      cd: Path.expand("../assets", __DIR__)
    ]
end
