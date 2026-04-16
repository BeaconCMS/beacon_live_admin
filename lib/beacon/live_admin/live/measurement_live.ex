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

  @metric_cards [
    %{key: "total_pages", label: "Total Pages", color: "zinc"},
    %{key: "pages_with_description", label: "With Description", color: "emerald"},
    %{key: "pages_with_og_image", label: "With OG Image", color: "emerald"},
    %{key: "stale_pages_count", label: "Stale (90+ days)", color: "amber"},
    %{key: "pages_with_canonical", label: "With Canonical", color: "zinc"},
    %{key: "pages_with_collection", label: "With Collection", color: "zinc"},
    %{key: "redirect_count", label: "Redirects", color: "zinc"}
  ]

  defp metric_value_class("emerald"), do: "text-success"
  defp metric_value_class("amber"), do: "text-warning"
  defp metric_value_class(_), do: "text-base-content"

  @impl true
  def render(assigns) do
    assigns = assign(assigns, :metric_cards, @metric_cards)

    ~H"""
    <.header>
      SEO Measurement
      <:actions>
        <div class="flex items-center gap-3">
          <select phx-change="set_days" name="days" class="rounded-lg border-base-300 bg-base-200 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            <option value="7" selected={@days == 7}>7 days</option>
            <option value="30" selected={@days == 30}>30 days</option>
            <option value="90" selected={@days == 90}>90 days</option>
          </select>
          <.button phx-click="take_snapshot" class="btn-primary">Take Snapshot</.button>
        </div>
      </:actions>
    </.header>

    <%= if @latest do %>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 -mt-2">
        <%= for card <- @metric_cards do %>
          <.main_content>
            <div class="text-center py-1">
              <div class={"text-2xl font-bold tabular-nums #{metric_value_class(card.color)}"}><%= metric(@latest, card.key) %></div>
              <div class="text-[11px] font-medium text-base-content/60 uppercase tracking-wide"><%= card.label %></div>
            </div>
          </.main_content>
        <% end %>
      </div>
    <% else %>
      <.main_content class="mb-8">
        <div class="py-8 text-center">
          <.icon name="hero-chart-bar" class="w-10 h-10 text-zinc-300  mx-auto mb-3" />
          <p class="text-sm text-base-content/60">No snapshots yet. Click "Take Snapshot" to capture current metrics.</p>
        </div>
      </.main_content>
    <% end %>

    <h3 class="text-xs font-semibold uppercase tracking-[1.68px] text-base-content/60 mb-3 px-1">History</h3>
    <.main_content>
      <.table id="snapshots" rows={@snapshots} row_id={&"snapshot-#{&1.id}"}>
        <:col :let={snapshot} label="Date">
          <span class="font-medium"><%= snapshot.snapshot_date %></span>
        </:col>
        <:col :let={snapshot} label="Pages">
          <span class="tabular-nums"><%= metric(snapshot, "total_pages") %></span>
        </:col>
        <:col :let={snapshot} label="Descriptions">
          <span class="tabular-nums"><%= metric(snapshot, "pages_with_description") %></span>
        </:col>
        <:col :let={snapshot} label="OG Images">
          <span class="tabular-nums"><%= metric(snapshot, "pages_with_og_image") %></span>
        </:col>
        <:col :let={snapshot} label="Stale">
          <span class="tabular-nums"><%= metric(snapshot, "stale_pages_count") %></span>
        </:col>
        <:col :let={snapshot} label="Redirects">
          <span class="tabular-nums"><%= metric(snapshot, "redirect_count") %></span>
        </:col>
      </.table>
    </.main_content>
    """
  end
end
