defmodule Beacon.LiveAdmin.SiteDashboardLive do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Client.Content
  alias Beacon.LiveAdmin.Auth.Permissions

  @impl true
  def menu_link(_, :site_dashboard), do: :skip
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(_params, _url, socket) do
    site = socket.assigns.beacon_page.site
    user = resolve_user(socket)

    stats = compute_stats(site)

    {:noreply,
     socket
     |> assign(:stats, stats)
     |> assign(:user, user)
     |> assign(:site_name, site)
     |> assign(page_title: "Dashboard")}
  end

  defp resolve_user(socket) do
    case socket.assigns do
      %{beacon_admin_user: user} when not is_nil(user) -> user
      _ -> nil
    end
  end

  defp compute_stats(site) do
    try do
      pages = Content.list_pages(site, per_page: :infinity)
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
      %{path: "/pages", icon: "hero-document-text", title: "Pages", description: "Create and manage your site's pages", feature: "pages"},
      %{path: "/layouts", icon: "hero-rectangle-group", title: "Layouts", description: "Design page layouts and structure", feature: "layouts"},
      %{path: "/components", icon: "hero-cube", title: "Components", description: "Build reusable UI components", feature: "components"},
      %{path: "/media_library", icon: "hero-photo", title: "Media Library", description: "Upload and organize media files", feature: "media_library"}
    ]},
    {"SEO & Analytics", [
      %{path: "/seo_audit", icon: "hero-chart-bar", title: "SEO Audit", description: "Review SEO health across all pages", feature: "seo_audit"},
      %{path: "/measurement", icon: "hero-presentation-chart-line", title: "Measurement", description: "Track SEO metrics over time", feature: "measurement"},
      %{path: "/link_health", icon: "hero-link", title: "Link Health", description: "Find orphan pages and broken links", feature: "link_health"},
      %{path: "/redirects", icon: "hero-arrow-uturn-right", title: "Redirects", description: "Manage URL redirects", feature: "redirects"}
    ]},
    {"Data & Logic", [
      %{path: "/graphql_endpoints", icon: "hero-server-stack", title: "GraphQL Endpoints", description: "Connect to external data sources", feature: "graphql_endpoints"},
      %{path: "/events", icon: "hero-bolt", title: "Event Handlers", description: "Handle user interactions", feature: "event_handlers"},
      %{path: "/info_handlers", icon: "hero-information-circle", title: "Info Handlers", description: "Process LiveView info messages", feature: "info_handlers"}
    ]},
    {"Developer", [
      %{path: "/error_pages", icon: "hero-exclamation-triangle", title: "Error Pages", description: "Customize error page templates", feature: "error_pages"},
      %{path: "/hooks", icon: "hero-code-bracket", title: "JS Hooks", description: "Add custom JavaScript hooks", feature: "js_hooks"},
      %{path: "/settings", icon: "hero-cog-6-tooth", title: "Site Settings", description: "Configure site-wide settings", feature: "site_settings"},
      %{path: "/collections", icon: "hero-document-duplicate", title: "Collections", description: "Manage content collections", feature: "collections"}
    ]},
    {"Administration", [
      %{path: "/groups", icon: "hero-user-group", title: "Groups", description: "Manage permission groups and members", feature: "site_settings"}
    ]}
  ]

  defp visible_sections(user, site) do
    Enum.map(@section_groups, fn {group_label, sections} ->
      filtered = Enum.filter(sections, fn section ->
        can_view_feature?(user, site, section.feature)
      end)
      {group_label, filtered}
    end)
    |> Enum.reject(fn {_, sections} -> sections == [] end)
  end

  defp can_view_feature?(nil, _site, _feature), do: true

  defp can_view_feature?(user, site, feature) do
    Permissions.can_access_feature?(user, site, feature)
  end

  @impl true
  def render(assigns) do
    assigns = assign(assigns, :sections, visible_sections(assigns[:user], assigns.site_name))

    ~H"""
    <.header>
      <%= @site_name %>
    </.header>

    <%!-- Stats --%>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 -mt-2">
      <.main_content>
        <div class="flex items-center gap-3 px-1 py-2">
          <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <.icon name="hero-document-text" class="w-5 h-5 text-primary" />
          </div>
          <div>
            <div class="text-2xl font-bold text-base-content"><%= @stats.total_pages %></div>
            <div class="text-xs font-medium text-base-content/60 uppercase tracking-wide">Pages</div>
          </div>
        </div>
      </.main_content>
      <.main_content>
        <div class="flex items-center gap-3 px-1 py-2">
          <div class="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
            <.icon name="hero-rectangle-group" class="w-5 h-5 text-success" />
          </div>
          <div>
            <div class="text-2xl font-bold text-base-content"><%= @stats.layouts %></div>
            <div class="text-xs font-medium text-base-content/60 uppercase tracking-wide">Layouts</div>
          </div>
        </div>
      </.main_content>
      <.main_content>
        <div class="flex items-center gap-3 px-1 py-2">
          <div class="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
            <.icon name="hero-cube" class="w-5 h-5 text-warning" />
          </div>
          <div>
            <div class="text-2xl font-bold text-base-content"><%= @stats.components %></div>
            <div class="text-xs font-medium text-base-content/60 uppercase tracking-wide">Components</div>
          </div>
        </div>
      </.main_content>
    </div>

    <%!-- Feature Sections --%>
    <%= for {group_label, sections} <- @sections do %>
      <div class="mb-8">
        <h3 class="text-xs font-semibold uppercase tracking-[1.68px] text-base-content/60 mb-3 px-1">
          <%= group_label %>
        </h3>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <%= for section <- sections do %>
            <.link
              patch={beacon_live_admin_path(@socket, @site_name, section.path)}
              class="group flex items-start gap-3.5 p-4 bg-base-100 rounded-xl border border-base-300 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <div class="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 bg-base-200 flex-shrink-0 group-hover:bg-indigo-50 transition-colors duration-200">
                <.icon name={section.icon} class="w-4.5 h-4.5 text-slate-500  group-hover:text-indigo-500 transition-colors duration-200" />
              </div>
              <div class="min-w-0 pt-0.5">
                <h4 class="text-sm font-semibold text-base-content group-hover:text-indigo-600 transition-colors"><%= section.title %></h4>
                <p class="mt-0.5 text-xs text-base-content/60 line-clamp-1"><%= section.description %></p>
              </div>
            </.link>
          <% end %>
        </div>
      </div>
    <% end %>
    """
  end
end
