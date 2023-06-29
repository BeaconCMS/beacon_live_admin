# Beacon LiveAdmin

Admin UI to manage content for sites built by [Beacon](https://github.com/BeaconCMS/beacon).

## Status

Pre-release version. You can expect incomplete features and breaking changes before a stable v0.1.0 is released.

## Local Development

Execute the following to start a local dev environment:

```shell
mix setup
iex --sname admin -S mix dev
```

Open http://localhost:4002/admin

Now in order to have some pages to manage you have to run a Beacon instance with sites and pages. Checkout [Beacon](https://github.com/BeaconCMS/beacon), execute its setup and dev environment:

```shell
git checkout git@github.com:BeaconCMS/beacon.git /path/to/beacon
cd /path/to/beacon
mix setup
iex --sname core -S mix dev
```

And finally, in that iex shell you can connect to the node running beacon admin:

```elixir
{:ok, hostname} = :inet.gethostname()
node = :"admin@#{List.to_string(hostname)}"
Node.connect(node)
```