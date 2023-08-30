import Config

config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :phoenix, :json_library, Jason

if Mix.env() == :dev do
  esbuild = fn args ->
    [
      args: ~w(
        ./js/beacon_live_admin.js
        --bundle
        --sourcemap
        --loader:.ttf=dataurl
        --loader:.woff=dataurl
        --loader:.woff2=dataurl
      ) ++ args,
      cd: Path.expand("../assets", __DIR__),
      env: %{"NODE_PATH" => Path.expand("../deps", __DIR__)}
    ]
  end

  config :esbuild,
    version: "0.17.18",
    cdn:
      esbuild.(
        ~w(--format=iife --target=es2016 --global-name=BeaconLiveAdmin --outfile=../priv/static/beacon_live_admin.js)
      ),
    cdn_min:
      esbuild.(
        ~w(--format=iife --target=es2016 --global-name=BeaconLiveAdmin --minify --outfile=../priv/static/beacon_live_admin.min.js)
      )

  config :tailwind,
    version: "3.3.3",
    default: [
      args: ~w(
      --minify
      --config=tailwind.config.js
      --input=css/beacon_live_admin.css
      --output=../priv/static/beacon_live_admin.min.css
    ),
      cd: Path.expand("../assets", __DIR__)
    ]
end
