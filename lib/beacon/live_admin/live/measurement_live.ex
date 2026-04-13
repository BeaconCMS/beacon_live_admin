defmodule Beacon.LiveAdmin.MeasurementLive do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Client.Content

  @impl true
  def menu_link("/measurement", :measurement), do: {:root, "Measurement"}
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(params, _url, socket) do
    site = socket.assigns.beacon_page.site
    days = String.to_integer(Map.get(params, "days", "30"))
    snapshots = Content.list_seo_snapshots(site, days: days)

    {:noreply,
     socket
     |> assign(:snapshots, snapshots)
     |> assign(:days, days)
     |> assign(:latest, List.first(snapshots))
     |> assign(page_title: "Measurement")}
  end

  @impl true
  def handle_event("take_snapshot", _, socket) do
    site = socket.assigns.beacon_page.site

    case Content.take_seo_snapshot(site) do
      {:ok, _snapshot} ->
        snapshots = Content.list_seo_snapshots(site, days: socket.assigns.days)
        {:noreply,
         socket
         |> assign(snapshots: snapshots, latest: List.first(snapshots))
         |> put_flash(:info, "Snapshot taken")}

      {:error, _} ->
        {:noreply, put_flash(socket, :error, "Failed to take snapshot")}
    end
  end

  def handle_event("set_days", %{"days" => days}, socket) do
    site = socket.assigns.beacon_page.site
    days = String.to_integer(days)
    snapshots = Content.list_seo_snapshots(site, days: days)

    {:noreply, assign(socket, snapshots: snapshots, days: days, latest: List.first(snapshots))}
  end

  defp metric(snapshot, key) do
    if snapshot, do: Map.get(snapshot.metrics, key, 0), else: 0
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="mx-auto max-w-6xl py-6 px-4">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">SEO Measurement</h1>
        <div class="flex items-center gap-3">
          <select phx-change="set_days" name="days" class="rounded-md border-gray-300 text-sm">
            <option value="7" selected={@days == 7}>7 days</option>
            <option value="30" selected={@days == 30}>30 days</option>
            <option value="90" selected={@days == 90}>90 days</option>
          </select>
          <button phx-click="take_snapshot" class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">
            Take Snapshot
          </button>
        </div>
      </div>

      <%= if @latest do %>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-white rounded-lg border p-4 text-center">
            <div class="text-2xl font-bold text-gray-900"><%= metric(@latest, "total_pages") %></div>
            <div class="text-xs text-gray-500 uppercase">Total Pages</div>
          </div>
          <div class="bg-white rounded-lg border p-4 text-center">
            <div class="text-2xl font-bold text-green-600"><%= metric(@latest, "pages_with_description") %></div>
            <div class="text-xs text-gray-500 uppercase">With Description</div>
          </div>
          <div class="bg-white rounded-lg border p-4 text-center">
            <div class="text-2xl font-bold text-green-600"><%= metric(@latest, "pages_with_og_image") %></div>
            <div class="text-xs text-gray-500 uppercase">With OG Image</div>
          </div>
          <div class="bg-white rounded-lg border p-4 text-center">
            <div class="text-2xl font-bold text-yellow-600"><%= metric(@latest, "stale_pages_count") %></div>
            <div class="text-xs text-gray-500 uppercase">Stale (90+ days)</div>
          </div>
          <div class="bg-white rounded-lg border p-4 text-center">
            <div class="text-2xl font-bold text-gray-900"><%= metric(@latest, "pages_with_canonical") %></div>
            <div class="text-xs text-gray-500 uppercase">With Canonical</div>
          </div>
          <div class="bg-white rounded-lg border p-4 text-center">
            <div class="text-2xl font-bold text-gray-900"><%= metric(@latest, "pages_with_author") %></div>
            <div class="text-xs text-gray-500 uppercase">With Author</div>
          </div>
          <div class="bg-white rounded-lg border p-4 text-center">
            <div class="text-2xl font-bold text-gray-900"><%= metric(@latest, "pages_article_type") %></div>
            <div class="text-xs text-gray-500 uppercase">Articles</div>
          </div>
          <div class="bg-white rounded-lg border p-4 text-center">
            <div class="text-2xl font-bold text-gray-900"><%= metric(@latest, "redirect_count") %></div>
            <div class="text-xs text-gray-500 uppercase">Redirects</div>
          </div>
        </div>
      <% else %>
        <div class="bg-gray-50 rounded-lg border p-8 text-center mb-8">
          <p class="text-gray-500">No snapshots yet. Click "Take Snapshot" to capture current metrics.</p>
        </div>
      <% end %>

      <h2 class="text-lg font-medium text-gray-900 mb-4">History</h2>
      <div class="bg-white rounded-lg border overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pages</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descriptions</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">OG Images</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stale</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Redirects</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <%= for snapshot <- @snapshots do %>
              <tr>
                <td class="px-4 py-3 text-sm text-gray-900"><%= snapshot.snapshot_date %></td>
                <td class="px-4 py-3 text-sm"><%= metric(snapshot, "total_pages") %></td>
                <td class="px-4 py-3 text-sm"><%= metric(snapshot, "pages_with_description") %></td>
                <td class="px-4 py-3 text-sm"><%= metric(snapshot, "pages_with_og_image") %></td>
                <td class="px-4 py-3 text-sm"><%= metric(snapshot, "stale_pages_count") %></td>
                <td class="px-4 py-3 text-sm"><%= metric(snapshot, "redirect_count") %></td>
              </tr>
            <% end %>
            <%= if @snapshots == [] do %>
              <tr><td colspan="6" class="px-4 py-8 text-center text-sm text-gray-500">No snapshots recorded</td></tr>
            <% end %>
          </tbody>
        </table>
      </div>
    </div>
    """
  end
end
