# Installation

Beacon LiveAdmin is an application that runs in existing Phoenix LiveView applications. In this guide we'll install all required tools, generate a new Phoenix LiveView application, and install Beacon LiveAdmin.

Beacon LiveAdmin can be installed along with Beacon in the same application or in a separated application if you need to isolate it for performance or security reasons. LiveAdmin will find all running sites in the cluster as long as the applications are connected to each other, which can be achived with libs like [libcluster](https://hex.pm/packages/libcluster) or [dns_cluster](https://hex.pm/packages/dns_cluster).

This guide will show the steps of generating a separated application, but if have followed the [Beacon installation guide](https://github.com/BeaconCMS/beacon/blob/main/guides/introduction/installation.md) you may have an application named "my_app" working which can be used for this guide too, just skip directly to the step adding the `:beacon_live_admin` dependency.

After the installation is done, please follow the guide [Your First Site](https://github.com/BeaconCMS/beacon/blob/main/guides/introduction/your_first_site.md) to learn how to setup a functioning site to manage in Beacon LiveAdmin.

## TLDR

We recommend following the guide thoroughly, but if you want a short version or just recap the main steps:

1. Install Elixir v1.14+

2. Install Phoenix v1.7+

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

6. Add to your application `router.ex` file:

  ```elixir
  use Beacon.LiveAdmin.Router
  
  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, {BeaconDemoWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug Beacon.LiveAdmin.Plug # <- add this plug
  end

  scope "/admin" do
    pipe_through :browser
    beacon_live_admin "/"
  end
  ```

7. Run `mix setup`

## Detailed Instructions

### Elixir 1.14 or later

The minimum required version to run Beacon is Elixir v1.14. Make sure you have at least that version installed along with Hex:

1. Check Elixir version:

```sh
elixir --version
```

2. Install or updated Hex

```sh
mix local.hex
```

If that command fails or Elixir version is outdated, please follow [Elixir Install guide](https://elixir-lang.org/install.html) to set up your environment correctly.

### Phoenix 1.7 or later

Beacon also requires a minimum Phoenix version to work properly, make sure you have the latest `phx_new` archive - the command to generate new Phoenix applications.

```sh
mix archive.install hex phx_new
```

### Generating a new application

We'll be using `phx_new` to generate a new application. You can run `mix help phx.new` to show the full documentation with more options, but let's use the default values for our new site:

```sh
mix phx.new --install admin
```

Or if you prefer an Umbrella application, run instead:

```sh
mix phx.new --umbrella --install admin
```

Beacon supports both.

After it finishes you can open the generated directory: `cd admin`

### Adding Beacon LiveAdmin

1. Edit `mix.exs` to add `:beacon_live_admin` as a dependency:

```elixir
{:beacon_live_admin, github: "BeaconCMS/beacon_live_admin"},
```

Or add to `admin_web` if running in an Umbrella app.

2. Add `:beacon_live_admin` to `import_deps` in the .formatter.exs file:

```elixir
[
 import_deps: [:ecto, :ecto_sql, :phoenix, :beacon_live_admin],
 # rest of file
]
```

### Configuring the router

Beacon LiveAdmin requires calling a plug in the pipeline and calling the `beacon_live_admin` macro to mount the user interface. It will look like this:

  ```elixir
  use Beacon.LiveAdmin.Router
  
  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, {BeaconDemoWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug Beacon.LiveAdmin.Plug # <- add this plug
  end

  scope "/admin" do
    pipe_through :browser
    beacon_live_admin "/"
  end
  ```
  
You're free to adapt the pipeline and change the path as you wish.

### Install

Run `mix setup`