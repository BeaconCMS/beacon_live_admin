defmodule Beacon.LiveAdmin.HomeLive do
  @moduledoc false
  use Beacon.LiveAdmin.Web, :live_view

  alias Beacon.LiveAdmin.Cluster
  alias Beacon.LiveAdmin.PubSub
  alias Beacon.LiveAdmin.Router

  @section_groups [
    {"Content", [
      %{path: "/pages", icon: "hero-document-text", title: "Pages", description: "Create and manage your site's pages"},
      %{path: "/layouts", icon: "hero-rectangle-group", title: "Layouts", description: "Design page layouts and structure"},
      %{path: "/components", icon: "hero-cube", title: "Components", description: "Build reusable UI components"},
      %{path: "/media_library", icon: "hero-photo", title: "Media Library", description: "Upload and organize media files"}
    ]},
    {"Data & Logic", [
      %{path: "/graphql_endpoints", icon: "hero-server-stack", title: "GraphQL Endpoints", description: "Connect to external data sources via GraphQL"},
      %{path: "/events", icon: "hero-bolt", title: "Event Handlers", description: "Handle user interactions"},
      %{path: "/info_handlers", icon: "hero-information-circle", title: "Info Handlers", description: "Process LiveView info messages"}
    ]},
    {"Developer", [
      %{path: "/error_pages", icon: "hero-exclamation-triangle", title: "Error Pages", description: "Customize error page templates"},
      %{path: "/hooks", icon: "hero-code-bracket", title: "JS Hooks", description: "Add custom JavaScript hooks"},
      %{path: "/settings", icon: "hero-cog-6-tooth", title: "Site Settings", description: "Configure site-wide settings"}
    ]}
  ]

  @impl true
  def mount(_params, _session, socket) do
    if connected?(socket) do
      PubSub.subscribe()
    end

    {:ok,
     socket
     |> assign(:running_sites, Cluster.running_sites())
     |> assign(:section_groups, @section_groups)}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="w-full min-h-screen bg-gray-50 dark:bg-slate-900">
      <header class="px-6 pt-8 lg:px-8">
        <div class="max-w-screen-xl mx-auto">
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">Welcome!</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Select a site to manage its content and configuration.</p>
        </div>
      </header>
      <main class="px-6 pt-8 pb-12 lg:px-8">
        <div class="max-w-screen-xl mx-auto space-y-10">
          <%= for site <- @running_sites do %>
            <section aria-label={"Site: #{site}"}>
              <div class="flex items-center gap-3 mb-6">
                <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-500/10">
                  <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                  </svg>
                </div>
                <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100"><%= site %></h2>
              </div>

              <%= for {group_label, sections} <- @section_groups do %>
                <div class="mb-8">
                  <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-1">
                    <%= group_label %>
                  </h3>
                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <%= for section <- sections do %>
                      <.link
                        href={Router.beacon_live_admin_path(@socket, site, section.path)}
                        class="group block p-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md dark:hover:shadow-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                      >
                        <div class="flex items-start gap-4">
                          <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex-shrink-0 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors duration-200">
                            <.icon name={section.icon} class="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                          </div>
                          <div class="min-w-0">
                            <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                              <%= section.title %>
                            </h4>
                            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                              <%= section.description %>
                            </p>
                          </div>
                        </div>
                      </.link>
                    <% end %>
                  </div>
                </div>
              <% end %>
            </section>
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
