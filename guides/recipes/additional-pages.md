# Additional Pages

## Add Pages

In your app router, you can mount additional pages in the `beacon_live_admin` route, for example:


```elixir
beacon_live_admin("/admin",
  additional_pages: [
    {"/documents", MyAppWeb.Admin.DocumentsLive.Index, :index}
  ]
)
```

The format is very similar to a regular route, you must inform the path, the LiveView module and action name. In this example a page will be available at `/admin/documents`.

## Build your page

Admin pages must use the `Beacon.LiveAdmin.PageBuilder` module, which provides the foundation for LiveView pages to work in the admin interface. Here's an example:

```elixir
defmodule MyAppWeb.Admin.DocumentsLive.Index do
  use Beacon.LiveAdmin.PageBuilder

  @impl true
  def menu_link(_prefix, _live_action), do: {:root, "Documents"}

  @impl true
  def mount(params, _session, socket) do
    documents = MyApp.Documents.list()
    {:ok, assign(socket, documents: documents)}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.header>
      Listing Documents
    </.header>

    <%-- implement your page template here --%>
    """
  end
end
```

You'll notice the only different from a regular LiveView is the `menu_link/2` callback, which is used to define the menu item for the page.
