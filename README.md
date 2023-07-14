# Beacon LiveAdmin

Admin UI to manage content for sites built by [Beacon](https://github.com/BeaconCMS/beacon).

## Status

Pre-release version. You can expect incomplete features and breaking changes before a stable v0.1.0 is released.

## Local Development

LiveAdmin requires at least one site running to manage, so let's start LiveAdmin first and then start a sample site.

1. Setup your local env

```shell
mix setup
```

2. Run LiveAdemin

```shell
iex --sname admin -S mix dev
```

Keep this instance running.

3. Open another terminal or tab, clone [Beacon](https://github.com/BeaconCMS/beacon) into another directory and follow the [Local Development instructions](https://github.com/BeaconCMS/beacon#local-development) to get a site up and running.

4. Open http://localhost:4002/admin 

You'll notice that no site is displayed, that's because Beacon LiveAdmin looks for sites running in the cluster and the two nodes aren't connected yet.

5. In the beacon iex terminal (the last one you started) execute the following:

```elixir
{:ok, hostname} = :inet.gethostname()
node = :"admin@#{List.to_string(hostname)}"
Node.connect(node)
```

Now you should see a site listed in the admin home page.
