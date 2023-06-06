defmodule Beacon.LiveAdmin.HomeLive do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_view

  @impl true
  def mount(_params, _session, socket) do
    if connected?(socket) do
      :net_kernel.monitor_nodes(true, node_type: :all)
    end

    running_sites = Beacon.LiveAdmin.Cluster.running_sites()
    {:ok, assign(socket, :running_sites, running_sites)}
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
            <div class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mt-10">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"><%= site %></h5>
              <.link
                href={Beacon.LiveAdmin.Router.beacon_live_admin_path(@socket, site, "/pages")}
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Pages
                <svg aria-hidden="true" class="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd">
                  </path>
                </svg>
              </.link>
            </div>
          <% end %>
        </div>
      </main>
    </div>
    """
  end

  @impl true
  def handle_info({:nodeup, _, _}, socket) do
    Beacon.LiveAdmin.Cluster.discover_sites()
    {:noreply, assign(socket, :running_sites, Beacon.LiveAdmin.Cluster.running_sites())}
  end

  def handle_info({:nodedown, _, _}, socket) do
    Beacon.LiveAdmin.Cluster.discover_sites()
    {:noreply, assign(socket, :running_sites, Beacon.LiveAdmin.Cluster.running_sites())}
  end
end
