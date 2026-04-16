defmodule Beacon.LiveAdmin.BeaconAdmin.DashboardLive do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Cluster
  alias Beacon.LiveAdmin.Client.Content

  @impl true
  def menu_link("/beacon", :dashboard), do: {:root, "Beacon Admin"}
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(_params, _url, socket) do
    sites = Cluster.running_sites()

    site_stats =
      Enum.map(sites, fn site ->
        %{
          site: site,
          page_count: safe_count(fn -> Content.count_pages(site) end),
          layout_count: safe_count(fn -> Content.count_layouts(site) end),
          component_count: safe_count(fn -> Content.count_components(site) end)
        }
      end)

    user_count = safe_count(fn -> length(Beacon.LiveAdmin.Auth.list_users()) end)

    {:noreply,
     socket
     |> assign(:sites, sites)
     |> assign(:site_stats, site_stats)
     |> assign(:user_count, user_count)
     |> assign(page_title: "Beacon Admin")}
  end

  defp safe_count(fun) do
    try do
      fun.()
    rescue
      _ -> 0
    end
  end

  @admin_links [
    %{path: "/beacon/users", icon: "hero-users", title: "User Management", description: "Create, edit, and manage users"},
    %{path: "/beacon/group_templates", icon: "hero-user-group", title: "Group Templates", description: "Default permission groups for new sites"},
    %{path: "/beacon/collections", icon: "hero-document-duplicate", title: "Global Collections", description: "Manage collections available to all sites"},
    %{path: "/beacon/settings", icon: "hero-cog-6-tooth", title: "Global Settings", description: "Configure platform-wide defaults and policies"}
  ]

  @impl true
  def render(assigns) do
    assigns = assign(assigns, :admin_links, @admin_links)

    ~H"""
    <.header>
      Beacon Admin
    </.header>

    <%!-- Stats --%>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 -mt-2">
      <.main_content>
        <div class="flex items-center gap-3 px-1 py-2">
          <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <.icon name="hero-globe-alt" class="w-5 h-5 text-primary" />
          </div>
          <div>
            <div class="text-2xl font-bold text-base-content"><%= length(@sites) %></div>
            <div class="text-xs font-medium text-base-content/60 uppercase tracking-wide">Sites</div>
          </div>
        </div>
      </.main_content>
      <.main_content>
        <div class="flex items-center gap-3 px-1 py-2">
          <div class="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
            <.icon name="hero-users" class="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <div class="text-2xl font-bold text-base-content"><%= @user_count %></div>
            <div class="text-xs font-medium text-base-content/60 uppercase tracking-wide">Users</div>
          </div>
        </div>
      </.main_content>
      <.main_content>
        <div class="flex items-center gap-3 px-1 py-2">
          <div class="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
            <.icon name="hero-document-text" class="w-5 h-5 text-success" />
          </div>
          <div>
            <div class="text-2xl font-bold text-base-content"><%= Enum.reduce(@site_stats, 0, &(&1.page_count + &2)) %></div>
            <div class="text-xs font-medium text-base-content/60 uppercase tracking-wide">Total Pages</div>
          </div>
        </div>
      </.main_content>
    </div>

    <%!-- Sites Table --%>
    <h3 class="text-xs font-semibold uppercase tracking-[1.68px] text-base-content/60 mb-3 px-1">Sites</h3>
    <.main_content class="mb-8">
      <.table id="sites" rows={@site_stats} row_id={&"site-#{&1.site}"}>
        <:col :let={stat} label="Site">
          <span class="font-semibold"><%= stat.site %></span>
        </:col>
        <:col :let={stat} label="Pages"><%= stat.page_count %></:col>
        <:col :let={stat} label="Layouts"><%= stat.layout_count %></:col>
        <:col :let={stat} label="Components"><%= stat.component_count %></:col>
        <:action :let={stat}>
          <.link
            patch={beacon_live_admin_path(@socket, stat.site, "/pages")}
            class="text-sm font-medium text-primary hover:text-indigo-800"
          >
            Manage
          </.link>
        </:action>
      </.table>
    </.main_content>

    <%!-- Admin Links --%>
    <h3 class="text-xs font-semibold uppercase tracking-[1.68px] text-base-content/60 mb-3 px-1">Platform</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <%= for link <- @admin_links do %>
        <.link
          patch={Beacon.LiveAdmin.Router.beacon_live_admin_path(@socket, link.path)}
          class="group flex items-start gap-3.5 p-4 bg-base-100 rounded-xl border border-base-300 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <div class="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 bg-base-200 flex-shrink-0 group-hover:bg-indigo-50 transition-colors duration-200">
            <.icon name={link.icon} class="w-4.5 h-4.5 text-slate-500  group-hover:text-indigo-500 transition-colors duration-200" />
          </div>
          <div class="min-w-0 pt-0.5">
            <h4 class="text-sm font-semibold text-base-content group-hover:text-indigo-600 transition-colors"><%= link.title %></h4>
            <p class="mt-0.5 text-xs text-base-content/60"><%= link.description %></p>
          </div>
        </.link>
      <% end %>
    </div>
    """
  end
end
