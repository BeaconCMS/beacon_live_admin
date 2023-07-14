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

Note this node will be name __admin__

Now open http://localhost:4002/admin but you'll notice that no site is displayed, so let's start one.

Clone [Beacon](https://github.com/BeaconCMS/beacon) into another directory and follow the instructions:

1. Setup your local env

```shell
mix setup
```

2. Run Beacon

```shell
iex --sname core -S mix dev
```

3. And finally, connect the nodes to let LiveAdmin manage the sites running in the __core__ node

```elixir
{:ok, hostname} = :inet.gethostname()
node = :"admin@#{List.to_string(hostname)}"
Node.connect(node)
```