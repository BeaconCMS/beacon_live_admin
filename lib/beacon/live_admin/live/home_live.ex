defmodule Beacon.LiveAdmin.HomeLive do
  @moduledoc false
  use Beacon.LiveAdmin.Web, :live_view

  alias Beacon.LiveAdmin.Cluster
  alias Beacon.LiveAdmin.PubSub
  alias Beacon.LiveAdmin.Router

  @impl true
  def mount(_params, _session, socket) do
    if connected?(socket) do
      PubSub.subscribe()
    end

    {:ok, assign(socket, :running_sites, Cluster.running_sites())}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="w-full min-h-screen bg-gray-50">
      <header class="px-4 pt-7 sm:px-6 lg:px-8">
        <div class="max-w-screen-xl mx-auto">
          <!-- <h1 class="text-2xl font-medium leading-8 text-gray-900">Welcome Admin!</h1> -->
          <h1 class="text-2xl font-medium leading-8 text-gray-900">Welcome!</h1>
        </div>
      </header>
      <main class="px-4 pt-10 sm:px-6 lg:px-8">
        <section aria-labelledby="admin-sites" class="h-[calc(100vh_-_60px)] max-w-screen-xl mx-auto bg-white rounded-t-[20px]">
          <div class="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
            <h2 id="admin-sites" class="text-xl font-semibold leading-6 text-gray-900 col-span-full">Sites</h2>
            <%= for site <- @running_sites do %>
              <div class="p-6 rounded-[20px] bg-white border border-gray-200 hover:border-white hover:ring-2 hover:ring-gray-200 hover:ring-offset-8 hover:ring-offset-white transition">
                <h3 class="mb-2 text-sm font-semibold leading-8 tracking-wider text-gray-600 uppercase"><%= site %></h3>
                <div class="flex flex-col flex-wrap gap-2 mt-10 md:flex-row">
                  <.link href={Router.beacon_live_admin_path(@socket, site, "/layouts")} class={nav_class()}>
                    Layouts
                  </.link>
                  <.link href={Router.beacon_live_admin_path(@socket, site, "/components")} class={nav_class()}>
                    Components
                  </.link>
                  <.link href={Router.beacon_live_admin_path(@socket, site, "/pages")} class={nav_class()}>
                    Pages
                  </.link>
                  <.link href={Router.beacon_live_admin_path(@socket, site, "/live_data")} class={nav_class()}>
                    Live Data
                  </.link>
                  <.link href={Router.beacon_live_admin_path(@socket, site, "/error_pages")} class={nav_class()}>
                    Error Pages
                  </.link>
                  <.link href={Router.beacon_live_admin_path(@socket, site, "/media_library")} class={nav_class()}>
                    Media Library
                  </.link>
                  <.link
                    href={Beacon.LiveAdmin.Router.beacon_live_admin_path(@socket, site, "/info_handlers")}
                    class="whitespace-nowrap text-sm leading-5 py-3.5  font-bold tracking-widest text-center uppercase bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 active:bg-blue-800 px-6 text-gray-50"
                  >
                    Info Handlers
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

  defp nav_class do
    "whitespace-nowrap text-sm leading-5 py-3.5  font-bold tracking-widest text-center uppercase bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 active:bg-blue-800 px-6 text-gray-50"
  end

  @impl true
  def handle_info({Cluster, :sites_changed}, socket) do
    {:noreply, assign(socket, :running_sites, Beacon.LiveAdmin.Cluster.running_sites())}
  end
end
