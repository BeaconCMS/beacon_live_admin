# Installation

Beacon LiveAdmin is a Phoenix LiveView application to manage running sites, allowing you to build your site by creating resources like layouts, pages, components, and others. It runs as a library in your Phoenix LiveView application, in this guide we'll start from zero initilizating a new Phoenix LiveView application and installing Beacon LiveAdmin.

Beacon LiveAdmin can be [installed along with Beacon](https://github.com/BeaconCMS/beacon/blob/main/guides/introduction/installation.md) in the same application/node or in a separated application/node if you need to isolate it for performance or security reasons. It will find all running sites in the cluster as long as the nodes are connected to each other, which can be achived with libs like [libcluster](https://hex.pm/packages/libcluster) or [dns_cluster](https://hex.pm/packages/dns_cluster).

This guide will show the steps of generating a separated application, but if have followed the [Beacon installation guide](https://github.com/BeaconCMS/beacon/blob/main/guides/introduction/installation.md) you already have an application working which can be used for this guide too, just skip directly to step 4 - adding the `:beacon_live_admin` dependency.

After the installation is done, you can follow the guide [Your First Site](https://github.com/BeaconCMS/beacon/blob/main/guides/introduction/your_first_site.md) to get started into creating the first layout, pages, and components for your site.

## TLDR

We recommend following the guide thoroughly, but if you want a short version or just recap the main steps:

1. Install Elixir v1.13 or later.

2. Install Phoenix v1.7 or later.

  ```sh
  mix archive.install hex phx_new
  ```

3. Generate a new Phoenix application

  ```sh
  mix phx.new --install admin
  ```

4. Add `:beacon_live_admin` dependency to `mix.exs`

  ```elixir
  {:beacon_live_admin, github: "BeaconCMS/beacon_live_admin"}
  ```
  
5. Add `:beacon_live_admin` into `:import_deps` in file `.formatter.exs`

6. Run `mix setup`

7. Add `beacon_live_admin` to your application `router.ex` file:

  ```elixir
  use Beacon.LiveAdmin.Router # <- add this line
  
  pipeline :browser do
    # ...
    # ommited for brevity
    plug Beacon.LiveAdmin.Plug # <- add this line
  end

  # add the following scope
  scope "/admin" do
    pipe_through :browser
    beacon_live_admin "/" 
  end
  ```

Now you can follow the guide [your first site](https://github.com/BeaconCMS/beacon/blob/main/guides/introduction/your_first_site.md) to setup your first layout, pages, and components.

## Detailed Instructions

### Elixir 1.13 or later

The minimum required version to run Beacon is Elixir v1.13. Make sure you have at least that version installed along with Hex:

1. Check Elixir version:

```sh
elixir --version
```

2. Install or update Hex

```sh
mix local.hex
```

If that command fails or Elixir version is outdated, please follow [Elixir Install guide](https://elixir-lang.org/install.html) to set up your environment correctly.

### Phoenix 1.7 or later

Beacon also requires at least Phoenix v1.7 to work properly, make sure you have the latest `phx_new` archive - the command to generate new Phoenix applications.

```sh
mix archive.install hex phx_new
```

### Generate a new application

We'll be using `phx_new` to generate a new application. You can run `mix help phx.new` to show the full documentation with more options, but let's use the default values for our new site:

```sh
mix phx.new --install admin
```

Or if you prefer an Umbrella application, execute:

```sh
mix phx.new --umbrella --install admin
```

Beacon supports both.

After it finishes you can open the generated directory: `cd admin`

### Install Beacon LiveAdmin

1. Edit `mix.exs` to add `:beacon_live_admin` as a dependency:

```elixir
{:beacon_live_admin, github: "BeaconCMS/beacon_live_admin"},
```

Or add to `admin_web` if running in an Umbrella app.

2. Add `:beacon_live_admin` to `import_deps` in the .formatter.exs file:

```elixir
[
 import_deps: [:ecto, :ecto_sql, :phoenix, :beacon_live_admin],
 # rest of file ommited
]
```

3. Run `mix setup`

### Mount admin in the router

Beacon LiveAdmin requires calling a plug in the pipeline and calling the `beacon_live_admin` macro to mount the user interface. It will look like this:

  ```elixir
  use Beacon.LiveAdmin.Router # <- add this line
  
  pipeline :browser do
    # ...
    # ommited for brevity
    plug Beacon.LiveAdmin.Plug # <- add this line
  end

  # add the following scope
  scope "/admin" do
    pipe_through :browser
    beacon_live_admin "/" 
  end
  ```
  
You're free to adapt the pipeline and change the path as you wish.

--

Now you can follow the guide [your first site](https://github.com/BeaconCMS/beacon/blob/main/guides/introduction/your_first_site.md) to setup your first layout, pages, and components.