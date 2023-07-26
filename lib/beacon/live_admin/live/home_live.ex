defmodule Beacon.LiveAdmin.HomeLive do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_view
  alias Beacon.LiveAdmin.Cluster
  alias Beacon.LiveAdmin.PubSub

  @impl true
  def mount(_params, _session, socket) do
    if connected?(socket) do
      PubSub.subscribe()
    end

    Cluster.maybe_reload_sites!()

    {:ok, assign(socket, :running_sites, Cluster.running_sites())}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="py-10">
      <header>
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900">Sites</h1>
        </div>
      </header>
      <main>
        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <%= for site <- @running_sites do %>
            <div class="max-w-sm p-6 mt-10 rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"><%= site %></h5>

              <.link
                href={Beacon.LiveAdmin.Router.beacon_live_admin_path(@socket, site, "/layouts")}
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Layouts
              </.link>

              <.link
                href={Beacon.LiveAdmin.Router.beacon_live_admin_path(@socket, site, "/pages")}
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Pages
              </.link>

              <.link
                href={Beacon.LiveAdmin.Router.beacon_live_admin_path(@socket, site, "/media_library")}
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Media Library
              </.link>
            </div>
          <% end %>
        </div>
      </main>
    </div>
    """
  end

  @impl true
  def handle_info({Cluster, :sites_changed}, socket) do
    {:noreply, assign(socket, :running_sites, Beacon.LiveAdmin.Cluster.running_sites())}
  end
end
