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
        page_count =
          try do
            Content.count_pages(site)
          rescue
            _ -> 0
          end

        layout_count =
          try do
            Content.count_layouts(site)
          rescue
            _ -> 0
          end

        component_count =
          try do
            Content.count_components(site)
          rescue
            _ -> 0
          end

        %{
          site: site,
          page_count: page_count,
          layout_count: layout_count,
          component_count: component_count
        }
      end)

    user_count =
      try do
        length(Beacon.LiveAdmin.Auth.list_users())
      rescue
        _ -> 0
      end

    {:noreply,
     socket
     |> assign(:sites, sites)
     |> assign(:site_stats, site_stats)
     |> assign(:user_count, user_count)
     |> assign(page_title: "Beacon Admin")}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="mx-auto max-w-6xl py-6 px-4">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Beacon Admin</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Platform-wide overview and management</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
          <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Sites</div>
          <div class="mt-1 text-3xl font-bold text-gray-900 dark:text-gray-100"><%= length(@sites) %></div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
          <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Users</div>
          <div class="mt-1 text-3xl font-bold text-gray-900 dark:text-gray-100"><%= @user_count %></div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
          <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Pages</div>
          <div class="mt-1 text-3xl font-bold text-gray-900 dark:text-gray-100"><%= Enum.reduce(@site_stats, 0, &(&1.page_count + &2)) %></div>
        </div>
      </div>

      <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Sites</h2>
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Site</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Pages</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Layouts</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Components</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <%= for stat <- @site_stats do %>
              <tr>
                <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100"><%= stat.site %></td>
                <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400"><%= stat.page_count %></td>
                <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400"><%= stat.layout_count %></td>
                <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400"><%= stat.component_count %></td>
                <td class="px-4 py-3 text-right">
                  <.link
                    href={beacon_live_admin_path(@socket, stat.site, "/pages")}
                    class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 text-sm font-medium"
                  >
                    Manage
                  </.link>
                </td>
              </tr>
            <% end %>
            <%= if @site_stats == [] do %>
              <tr>
                <td colspan="5" class="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No sites running</td>
              </tr>
            <% end %>
          </tbody>
        </table>
      </div>

      <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <.link
          href={Beacon.LiveAdmin.Router.beacon_live_admin_path(@socket, "/beacon/users")}
          class="block p-5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all"
        >
          <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">User Management</div>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Create, edit, and manage users and their roles</p>
        </.link>
        <.link
          href={Beacon.LiveAdmin.Router.beacon_live_admin_path(@socket, "/beacon/settings")}
          class="block p-5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all"
        >
          <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">Global Settings</div>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Configure platform-wide defaults and policies</p>
        </.link>
        <.link
          href={Beacon.LiveAdmin.Router.beacon_live_admin_path(@socket, "/beacon/template_types")}
          class="block p-5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all"
        >
          <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">Global Template Types</div>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage template types available to all sites</p>
        </.link>
      </div>
    </div>
    """
  end
end
