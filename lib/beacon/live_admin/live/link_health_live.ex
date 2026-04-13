defmodule Beacon.LiveAdmin.LinkHealthLive do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Client.Content

  @impl true
  def menu_link("/link_health", :index), do: {:root, "Link Health"}
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(_params, _url, socket) do
    site = socket.assigns.beacon_page.site
    orphans = Content.list_orphan_pages(site)
    broken = Content.list_broken_links(site)
    stats = Content.list_link_stats(site)

    {:noreply,
     socket
     |> assign(:orphans, orphans)
     |> assign(:broken_links, broken)
     |> assign(:link_stats, stats)
     |> assign(:tab, "orphans")
     |> assign(page_title: "Link Health")}
  end

  @impl true
  def handle_event("tab", %{"tab" => tab}, socket) do
    {:noreply, assign(socket, :tab, tab)}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="mx-auto max-w-6xl py-6 px-4">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Link Health</h1>

      <div class="grid grid-cols-3 gap-4 mb-8">
        <div class={"rounded-lg border p-4 text-center cursor-pointer #{if @tab == "orphans", do: "bg-yellow-50 border-yellow-300", else: "bg-white"}"} phx-click="tab" phx-value-tab="orphans">
          <div class="text-2xl font-bold text-yellow-600"><%= length(@orphans) %></div>
          <div class="text-xs text-gray-500 uppercase">Orphan Pages</div>
          <div class="text-xs text-gray-400 mt-1">No inbound links</div>
        </div>
        <div class={"rounded-lg border p-4 text-center cursor-pointer #{if @tab == "broken", do: "bg-red-50 border-red-300", else: "bg-white"}"} phx-click="tab" phx-value-tab="broken">
          <div class="text-2xl font-bold text-red-600"><%= length(@broken_links) %></div>
          <div class="text-xs text-gray-500 uppercase">Broken Links</div>
          <div class="text-xs text-gray-400 mt-1">Target not found</div>
        </div>
        <div class={"rounded-lg border p-4 text-center cursor-pointer #{if @tab == "stats", do: "bg-blue-50 border-blue-300", else: "bg-white"}"} phx-click="tab" phx-value-tab="stats">
          <div class="text-2xl font-bold text-blue-600"><%= length(@link_stats) %></div>
          <div class="text-xs text-gray-500 uppercase">Pages Analyzed</div>
          <div class="text-xs text-gray-400 mt-1">Inbound/outbound counts</div>
        </div>
      </div>

      <%= if @tab == "orphans" do %>
        <div class="bg-white rounded-lg border overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Path</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <%= for page <- @orphans do %>
                <tr class="bg-yellow-50">
                  <td class="px-4 py-3 text-sm font-mono text-gray-600"><%= page.path %></td>
                  <td class="px-4 py-3 text-sm text-gray-900 max-w-xs truncate"><%= page.title %></td>
                  <td class="px-4 py-3 text-right">
                    <.link patch={beacon_live_admin_path(@socket, @beacon_page.site, "/pages/#{page.id}")} class="text-indigo-600 hover:text-indigo-900 text-sm">Edit</.link>
                  </td>
                </tr>
              <% end %>
              <%= if @orphans == [] do %>
                <tr><td colspan="3" class="px-4 py-8 text-center text-sm text-green-600">No orphan pages found</td></tr>
              <% end %>
            </tbody>
          </table>
        </div>
      <% end %>

      <%= if @tab == "broken" do %>
        <div class="bg-white rounded-lg border overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source Page</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Broken Target</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Anchor Text</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <%= for link <- @broken_links do %>
                <tr class="bg-red-50">
                  <td class="px-4 py-3 text-sm font-mono text-gray-600"><%= link.source_page_id %></td>
                  <td class="px-4 py-3 text-sm font-mono text-red-600"><%= link.target_path %></td>
                  <td class="px-4 py-3 text-sm text-gray-600"><%= link.anchor_text %></td>
                </tr>
              <% end %>
              <%= if @broken_links == [] do %>
                <tr><td colspan="3" class="px-4 py-8 text-center text-sm text-green-600">No broken links found</td></tr>
              <% end %>
            </tbody>
          </table>
        </div>
      <% end %>

      <%= if @tab == "stats" do %>
        <div class="bg-white rounded-lg border overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Path</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Inbound</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Outbound</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <%= for stat <- @link_stats do %>
                <tr>
                  <td class="px-4 py-3 text-sm font-mono text-gray-600"><%= stat.path %></td>
                  <td class="px-4 py-3 text-sm text-gray-900 max-w-xs truncate"><%= stat.title %></td>
                  <td class={"px-4 py-3 text-sm text-center #{if stat.inbound == 0, do: "text-yellow-600 font-bold", else: "text-gray-600"}"}><%= stat.inbound %></td>
                  <td class="px-4 py-3 text-sm text-center text-gray-600"><%= stat.outbound %></td>
                </tr>
              <% end %>
              <%= if @link_stats == [] do %>
                <tr><td colspan="4" class="px-4 py-8 text-center text-sm text-gray-500">No link data available. Publish pages to generate link graph.</td></tr>
              <% end %>
            </tbody>
          </table>
        </div>
      <% end %>
    </div>
    """
  end
end
