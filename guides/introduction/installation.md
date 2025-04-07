# Installation

Beacon LiveAdmin is a Phoenix LiveView application to manage running sites, allowing you to build your site by creating resources like layouts, pages, components, and more.

It runs as a library in your Phoenix LiveView application, either in a new or an existing application.

Beacon LiveAdmin can be [installed along with Beacon](https://github.com/BeaconCMS/beacon/blob/main/guides/introduction/installation.md) in the same application/node or in a separated application/node if you need to isolate it for performance or security reasons.

It will find all running sites in the cluster as long as the nodes are connected to each other, which can be achieved with libs like [libcluster](https://hex.pm/packages/libcluster) or [dns_cluster](https://hex.pm/packages/dns_cluster).

If you already have a Phoenix LiveView application up and running that meet the minimum requirements for Beacon and Beacon LiveAdmin, you can directly to step 5 - adding the `:beacon_live_admin` dependency.

## Steps

1. Install Elixir v1.14.1 or later

Check out the official [Elixir install guide](https://elixir-lang.org/install.html) for more info.

2. Update Hex

  ```sh
  mix local.hex
  ```

If that command fails or Elixir version is outdated, please follow the [Elixir Install guide](https://elixir-lang.org/install.html) to set up your environment correctly.

3. Install Phoenix v1.7 or later

  ```sh
  mix archive.install hex phx_new
  ```

Check out the official [Phoenix install guide](https://hexdocs.pm/phoenix/installation.html) for more info.

4. Generate a new Phoenix application

  ```sh
  mix phx.new --install admin
  ```

Note that BeaconLiveAdmin supports Umbrella applications as well.

5. Add `:beacon_live_admin` dependency to `mix.exs`

  ```diff
  + {:beacon_live_admin, ">= 0.0.0"},
  ```

6. Add `:beacon_live_admin` into `:import_deps` in file `.formatter.exs`

  ```diff
  - import_deps: [:ecto, :ecto_sql, :phoenix],
  + import_deps: [:ecto, :ecto_sql, :phoenix, :beacon_live_admin],
  ```

7. Add `beacon_live_admin` to your application `router.ex` file:

  ```elixir
  use Beacon.LiveAdmin.Router # <- add this line

  pipeline :browser do
    # ...
    # ommited for brevity
    plug Beacon.LiveAdmin.Plug # <- add this line
  end

  # add the following scope before any beacon_site
  scope "/admin" do
    pipe_through :browser
    beacon_live_admin "/"
  end
  ```

Note that route precedence is important, make sure the there are no conflicts with other routes otherwise Beacon LiveAdmin will not work properly.

For example, if a site is mounted at `/` then you should add the admin scope before so `/admin` is handled by Beacon LiveAdmin,
otherwise Beacon will try to find a page for `/admin` defined in the site. The same may happen with other routes on your application.

8. Install deps

  ```sh
  mix deps.get
  ```
