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

    Cluster.maybe_discover_sites()

    {:ok, assign(socket, :running_sites, Cluster.running_sites())}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="w-full min-h-screen bg-gray-50">
      <main class="px-4 pt-10 sm:px-6 lg:px-8">
        <section aria-labelledby="admin-sites" class="h-[calc(100vh_-_60px)] max-w-screen-xl mx-auto bg-white rounded-t-[20px]">
          <div class="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
            <h2 id="admin-sites" class="text-xl font-semibold leading-6 text-gray-900 col-span-full">Sites</h2>
            <%= for site <- @running_sites do %>
              <div class="p-6 rounded-[20px] bg-white border border-gray-200 hover:border-white hover:ring-2 hover:ring-gray-200 hover:ring-offset-8 hover:ring-offset-white transition">
                <h3 class="mb-2 text-sm font-semibold leading-8 tracking-wider text-gray-600 uppercase"><%= site %></h3>
                <div class="flex flex-col flex-wrap gap-2 mt-10 md:flex-row">
                  <.link
                    href={Beacon.LiveAdmin.Router.beacon_live_admin_path(@socket, site, "/layouts")}
                    class="whitespace-nowrap text-sm leading-5 py-3.5  font-bold tracking-widest text-center uppercase bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 active:bg-blue-800 px-6 text-gray-50"
                  >
                    Layouts
                  </.link>

                  <.link
                    href={Beacon.LiveAdmin.Router.beacon_live_admin_path(@socket, site, "/pages")}
                    class="whitespace-nowrap text-sm leading-5 py-3.5  font-bold tracking-widest text-center uppercase bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 active:bg-blue-800 px-6 text-gray-50"
                  >
                    Pages
                  </.link>

                  <.link
                    href={Beacon.LiveAdmin.Router.beacon_live_admin_path(@socket, site, "/components")}
                    class="whitespace-nowrap text-sm leading-5 py-3.5  font-bold tracking-widest text-center uppercase bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 active:bg-blue-800 px-6 text-gray-50"
                  >
                    Components
                  </.link>

                  <.link
                    href={Beacon.LiveAdmin.Router.beacon_live_admin_path(@socket, site, "/error_pages")}
                    class="whitespace-nowrap text-sm leading-5 py-3.5 font-bold tracking-widest text-center uppercase bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 active:bg-blue-800 px-6 text-gray-50"
                  >
                    Error Pages
                  </.link>

                  <.link
                    href={Beacon.LiveAdmin.Router.beacon_live_admin_path(@socket, site, "/media_library")}
                    class="whitespace-nowrap text-sm leading-5 py-3.5  font-bold tracking-widest text-center uppercase bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 active:bg-blue-800 px-6 text-gray-50"
                  >
                    Media Library
                  </.link>
                </div>
              </div>
            <% end %>
          </div>
        </section>
      </main>
    </div>
    """
  end

  @impl true
  def handle_info({Cluster, :sites_changed}, socket) do
    {:noreply, assign(socket, :running_sites, Beacon.LiveAdmin.Cluster.running_sites())}
  end
end
