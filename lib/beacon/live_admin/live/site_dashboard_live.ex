defmodule Beacon.LiveAdmin.SiteDashboardLive do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Client.Content
  alias Beacon.LiveAdmin.Auth

  @impl true
  def menu_link(_, :site_dashboard), do: :skip
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(_params, _url, socket) do
    site = socket.assigns.beacon_page.site
    user = resolve_user(socket)
    is_admin = user && (Auth.is_super_admin?(user) || Auth.has_role?(user, "site_admin", site))

    stats = compute_stats(site)

    {:noreply,
     socket
     |> assign(:stats, stats)
     |> assign(:is_admin, is_admin)
     |> assign(:site_name, site)
     |> assign(page_title: "Dashboard")}
  end

  defp resolve_user(socket) do
    case socket.assigns do
      %{beacon_admin_user: user} when not is_nil(user) -> user
      _ ->
        # No auth provider or no user — dev mode
        nil
    end
  end

  defp compute_stats(site) do
    try do
      pages = Content.list_pages(site, %{per_page: :infinity})

      published = Enum.count(pages)

      %{
        total_pages: published,
        layouts: count_resource(site, :layouts),
        components: count_resource(site, :components)
      }
    rescue
      _ -> %{total_pages: 0, layouts: 0, components: 0}
    end
  end

  defp count_resource(site, :layouts) do
    try do
      length(Content.list_layouts(site))
    rescue
      _ -> 0
    end
  end

  defp count_resource(site, :components) do
    try do
      length(Content.list_components(site))
    rescue
      _ -> 0
    end
  end

  @section_groups [
    {"Content", [
      %{path: "/pages", icon: "hero-document-text", title: "Pages", description: "Create and manage your site's pages", min_role: "site_editor"},
      %{path: "/layouts", icon: "hero-rectangle-group", title: "Layouts", description: "Design page layouts and structure", min_role: "site_admin"},
      %{path: "/components", icon: "hero-cube", title: "Components", description: "Build reusable UI components", min_role: "site_admin"},
      %{path: "/media_library", icon: "hero-photo", title: "Media Library", description: "Upload and organize media files", min_role: "site_editor"}
    ]},
    {"SEO & Analytics", [
      %{path: "/seo_audit", icon: "hero-chart-bar", title: "SEO Audit", description: "Review SEO health across all pages", min_role: "site_admin"},
      %{path: "/measurement", icon: "hero-presentation-chart-line", title: "Measurement", description: "Track SEO metrics over time", min_role: "site_admin"},
      %{path: "/link_health", icon: "hero-link", title: "Link Health", description: "Find orphan pages and broken links", min_role: "site_admin"},
      %{path: "/redirects", icon: "hero-arrow-uturn-right", title: "Redirects", description: "Manage URL redirects", min_role: "site_admin"}
    ]},
    {"Data & Logic", [
      %{path: "/graphql_endpoints", icon: "hero-server-stack", title: "GraphQL Endpoints", description: "Connect to external data sources", min_role: "site_admin"},
      %{path: "/events", icon: "hero-bolt", title: "Event Handlers", description: "Handle user interactions", min_role: "site_admin"},
      %{path: "/info_handlers", icon: "hero-information-circle", title: "Info Handlers", description: "Process LiveView info messages", min_role: "site_admin"}
    ]},
    {"Developer", [
      %{path: "/error_pages", icon: "hero-exclamation-triangle", title: "Error Pages", description: "Customize error page templates", min_role: "site_admin"},
      %{path: "/hooks", icon: "hero-code-bracket", title: "JS Hooks", description: "Add custom JavaScript hooks", min_role: "site_admin"},
      %{path: "/settings", icon: "hero-cog-6-tooth", title: "Site Settings", description: "Configure site-wide settings", min_role: "site_admin"},
      %{path: "/template_types", icon: "hero-document-duplicate", title: "Template Types", description: "Site-specific content types", min_role: "site_admin"}
    ]}
  ]

  defp visible_sections(user, site) do
    Enum.map(@section_groups, fn {group_label, sections} ->
      filtered = Enum.filter(sections, fn section ->
        has_access?(user, site, section.min_role)
      end)
      {group_label, filtered}
    end)
    |> Enum.reject(fn {_, sections} -> sections == [] end)
  end

  defp has_access?(nil, _site, _min_role), do: true  # No auth — dev mode, show all

  defp has_access?(user, site, min_role) do
    Auth.is_super_admin?(user) ||
      case min_role do
        "site_viewer" -> Auth.can_access_site?(user, site)
        "site_editor" ->
          Auth.has_role?(user, "site_admin", site) ||
          Auth.has_role?(user, "site_editor", site)
        "site_admin" -> Auth.has_role?(user, "site_admin", site)
        _ -> false
      end
  end

  @impl true
  def render(assigns) do
    assigns = assign(assigns, :sections, visible_sections(assigns[:beacon_admin_user], assigns.site_name))

    ~H"""
    <div class="max-w-screen-xl mx-auto">
      <header class="mb-8">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100"><%= @site_name %></h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Site dashboard</p>
      </header>

      <%!-- Stats Cards --%>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div class="text-3xl font-bold text-gray-900 dark:text-gray-100"><%= @stats.total_pages %></div>
          <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">Pages</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div class="text-3xl font-bold text-gray-900 dark:text-gray-100"><%= @stats.layouts %></div>
          <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">Layouts</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div class="text-3xl font-bold text-gray-900 dark:text-gray-100"><%= @stats.components %></div>
          <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">Components</div>
        </div>
      </div>

      <%!-- Feature Sections (filtered by role) --%>
      <%= for {group_label, sections} <- @sections do %>
        <div class="mb-8">
          <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-1">
            <%= group_label %>
          </h3>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <%= for section <- sections do %>
              <.link
                href={beacon_live_admin_path(@socket, @site_name, section.path)}
                class="group block p-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all duration-200"
              >
                <div class="flex items-start gap-4">
                  <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex-shrink-0 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors duration-200">
                    <.icon name={section.icon} class="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div class="min-w-0">
                    <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"><%= section.title %></h4>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2"><%= section.description %></p>
                  </div>
                </div>
              </.link>
            <% end %>
          </div>
        </div>
      <% end %>
    </div>
    """
  end
end
