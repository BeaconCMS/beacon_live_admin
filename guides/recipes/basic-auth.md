# Basic Auth

The Admin interface should be protected to prevent unauthorized access,
but Beacon doesn't provide a sign up / login system out of the box because every
environment has its own requirements and workflows.

To get started quickly, you can use the basic auth on the router level which
works well and is safe when using SSL.

## Objective

Protect the admin interface with basic auth using credentials from environment variables.

## Requirements

Beacon LiveAdmin is already installed and configured.

## Router

Open your router file `lib/my_app_web/router.ex` to  create a new pipeline only for the admin routes that will call the basic auth function.

```elixir
defmodule MyAppWeb.Router do
  use MyAppWeb, :router
  use Beacon.LiveAdmin.Router

  pipeline :browser do
    # omitted for brevity...
    plug Beacon.LiveAdmin.Plug
  end

  # add this pipeline
  pipeline :require_auth do
    plug :admin_basic_auth
  end

  scope "/admin" do
    pipe_through [:browser, :require_auth] # <- add the require_auth pipeline
    beacon_live_admin "/"
  end

  # rest of the router ommitted for brevity...

  defp admin_basic_auth(conn, _opts) do
    username = System.fetch_env!("BEACON_ADMIN_USERNAME")
    password = System.fetch_env!("BEACON_ADMIN_PASSWORD")
    Plug.BasicAuth.basic_auth(conn, username: username, password: password)
  end
end
```