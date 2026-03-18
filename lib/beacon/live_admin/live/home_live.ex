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
    <div class="w-full min-h-screen">
      <header class="px-6 pt-8 lg:px-8">
        <div class="max-w-screen-xl mx-auto">
          <h1 class="text-2xl font-semibold text-slate-900">Welcome!</h1>
          <p class="mt-1 text-sm text-slate-500">Select a site to manage its content and configuration.</p>
        </div>
      </header>
      <main class="px-6 pt-8 lg:px-8">
        <section aria-label="Sites" class="max-w-screen-xl mx-auto">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <%= for site <- @running_sites do %>
              <div class="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200">
                <div class="flex items-center gap-3 mb-6">
                  <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-50">
                    <svg class="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-slate-900"><%= site %></h3>
                </div>
                <div class="flex flex-wrap gap-2">
                  <.link href={Router.beacon_live_admin_path(@socket, site, "/pages")} class={nav_class()}>
                    Pages
                  </.link>
                  <.link href={Router.beacon_live_admin_path(@socket, site, "/layouts")} class={nav_class()}>
                    Layouts
                  </.link>
                  <.link href={Router.beacon_live_admin_path(@socket, site, "/components")} class={nav_class()}>
                    Components
                  </.link>
                  <.link href={Router.beacon_live_admin_path(@socket, site, "/media_library")} class={nav_class()}>
                    Media Library
                  </.link>
                  <.link href={Router.beacon_live_admin_path(@socket, site, "/live_data")} class={nav_class()}>
                    Live Data
                  </.link>
                  <.link href={Router.beacon_live_admin_path(@socket, site, "/events")} class={nav_class()}>
                    Event Handlers
                  </.link>
                  <.link href={Router.beacon_live_admin_path(@socket, site, "/info_handlers")} class={nav_class()}>
                    Info Handlers
                  </.link>
                  <.link href={Router.beacon_live_admin_path(@socket, site, "/error_pages")} class={nav_class()}>
                    Error Pages
                  </.link>
                  <.link href={Router.beacon_live_admin_path(@socket, site, "/hooks")} class={nav_class()}>
                    JS Hooks
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
    "whitespace-nowrap text-sm leading-5 py-2 font-medium rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:bg-indigo-100 px-3.5 text-slate-700 transition-colors duration-150"
  end

  @impl true
  def handle_info({Cluster, :sites_changed}, socket) do
    {:noreply, assign(socket, :running_sites, Beacon.LiveAdmin.Cluster.running_sites())}
  end
end
