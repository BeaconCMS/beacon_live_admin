# Beacon LiveAdmin

Admin UI to manage content for sites built by [Beacon](https://github.com/BeaconCMS/beacon).

## Status

You can expect incomplete features and breaking changes before a stable v1.0 is released.

## Minimum Requirements

- Erlang/OTP v25.1
- Elixir v1.14

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

Running tests requires booting a VM to run Beacon sites, which may be blocked by the firewall in your environment.

Make sure both `epmd` and `beam.smp` processes are allowed and try running the application before running tests:

```shell
iex --sname admin@localhost -S mix dev
```

## Looking for help with your Elixir project?

<img src="assets/images/dockyard_logo.png" width="256" alt="DockYard logo">

At DockYard we are [ready to help you build your next Elixir project](https://dockyard.com/phoenix-consulting).
We have a unique expertise in Elixir and Phoenix development that is unmatched and we love to [write about Elixir](https://dockyard.com/blog/categories/elixir).

Have a project in mind? [Get in touch](https://dockyard.com/contact/hire-us)!
