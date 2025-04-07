# Beacon LiveAdmin

[![GitHub Release](https://img.shields.io/github/v/release/beaconCMS/beacon_live_admin?color=blue)](https://hex.pm/packages/beacon_live_admin)
[![GitHub Release Date](https://img.shields.io/github/release-date/beaconCMS/beacon_live_admin)](https://github.com/BeaconCMS/beacon_live_admin/releases)
[![GitHub License](https://img.shields.io/github/license/beaconCMS/beacon_live_admin?color=orange)](https://github.com/BeaconCMS/beacon_live_admin/blob/main/LICENSE.md)
[![Documentation](https://img.shields.io/badge/documentation-555555)](https://hexdocs.pm/beacon_live_admin)

Phoenix LiveView web interface to manage content for sites built by [Beacon](https://github.com/BeaconCMS/beacon).

## Status

You can expect incomplete features and breaking changes before a stable v1.0 is released.

## Minimum Requirements

- Erlang/OTP v25.1
- Elixir v1.14.1
- Phoenix v1.7.0
- Phoenix LiveView v1.0.0

## Local Development

LiveAdmin requires at least one site running to manage, so let's start LiveAdmin first and then start a sample site.

1. Setup your local env

```shell
mix setup
```

2. Run LiveAdmin

```shell
iex --sname admin@localhost -S mix dev
```

Keep this instance running.

3. Run a Beacon site

Open another terminal or tab, clone [Beacon](https://github.com/BeaconCMS/beacon) into another directory and follow the [Local Development instructions](https://github.com/BeaconCMS/beacon#local-development) to get a site up and running.

4. Open http://localhost:4002/admin

You'll notice that no site is displayed, that's because Beacon LiveAdmin looks for sites running in the cluster and the two nodes aren't connected yet.

5. Connect the nodes

In the beacon iex terminal (the last one you started) execute the following:

```elixir
Node.connect(:admin@localhost)
```

Now you should see a site listed in the admin home page.

6. (Optional) Automatically connect the nodes

Create a `.iex.exs` file in the root of each repository:

In the beacon repo:

```elixir
Node.connect(:admin@localhost)
```

In the beacon_live_admin repo:

```elixir
Node.connect(:core@localhost)
```

Next time you can skip step 5.

## Troubleshooting

Running tests will boot a VM to simulate Beacon nodes and that operation requires that both services `epmd` and `beam.smp`
are allowed to run in your environment, please review your firewall config and system config.

If you're still getting a `:net_kernel` error, then execute `epmd -daemon` manually:

```shell
epmd -daemon
```

## Looking for help with your Elixir project?

<img src="assets/images/dockyard_logo.png" width="256" alt="DockYard logo">

At DockYard we are [ready to help you build your next Elixir project](https://dockyard.com/phoenix-consulting).
We have a unique expertise in Elixir and Phoenix development that is unmatched and we love to [write about Elixir](https://dockyard.com/blog/categories/elixir).

Have a project in mind? [Get in touch](https://dockyard.com/contact/hire-us)!
