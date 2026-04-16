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
    <.header>
      Link Health
    </.header>

    <%!-- Stat Cards (clickable tabs) --%>
    <div class="grid grid-cols-3 gap-3 mb-6 -mt-2">
      <div phx-click="tab" phx-value-tab="orphans" class={"cursor-pointer transition-all duration-200 rounded-xl border p-4 text-center #{if @tab == "orphans", do: "bg-amber-50 border-amber-300 shadow-sm", else: "bg-base-100 border-base-300 hover:border-amber-200"}"}>
        <div class={"text-2xl font-bold tabular-nums #{if @tab == "orphans", do: "text-warning", else: "text-base-content"}"}><%= length(@orphans) %></div>
        <div class="text-[11px] font-medium text-base-content/60 uppercase tracking-wide mt-0.5">Orphan Pages</div>
        <div class="text-[10px] text-base-content/40 mt-0.5">No inbound links</div>
      </div>
      <div phx-click="tab" phx-value-tab="broken" class={"cursor-pointer transition-all duration-200 rounded-xl border p-4 text-center #{if @tab == "broken", do: "bg-rose-50 border-rose-300 shadow-sm", else: "bg-base-100 border-base-300 hover:border-rose-200"}"}>
        <div class={"text-2xl font-bold tabular-nums #{if @tab == "broken", do: "text-error", else: "text-base-content"}"}><%= length(@broken_links) %></div>
        <div class="text-[11px] font-medium text-base-content/60 uppercase tracking-wide mt-0.5">Broken Links</div>
        <div class="text-[10px] text-base-content/40 mt-0.5">Target not found</div>
      </div>
      <div phx-click="tab" phx-value-tab="stats" class={"cursor-pointer transition-all duration-200 rounded-xl border p-4 text-center #{if @tab == "stats", do: "bg-sky-50 border-sky-300 shadow-sm", else: "bg-base-100 border-base-300 hover:border-sky-200"}"}>
        <div class={"text-2xl font-bold tabular-nums #{if @tab == "stats", do: "text-info", else: "text-base-content"}"}><%= length(@link_stats) %></div>
        <div class="text-[11px] font-medium text-base-content/60 uppercase tracking-wide mt-0.5">Pages Analyzed</div>
        <div class="text-[10px] text-base-content/40 mt-0.5">Link counts</div>
      </div>
    </div>

    <%!-- Tab Content --%>
    <%= if @tab == "orphans" do %>
      <.main_content>
        <.table id="orphans" rows={@orphans} row_id={&"orphan-#{&1.id}"}>
          <:col :let={page} label="Path">
            <span class="font-mono text-xs text-base-content/70"><%= page.path %></span>
          </:col>
          <:col :let={page} label="Title">
            <span class="text-base-content font-medium"><%= page.title %></span>
          </:col>
          <:action :let={page}>
            <.link
              patch={beacon_live_admin_path(@socket, @beacon_page.site, "/pages/#{page.id}")}
              class="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-indigo-800 transition-colors"
            >
              Edit <.icon name="hero-arrow-right-mini" class="w-3.5 h-3.5" />
            </.link>
          </:action>
        </.table>
        <div :if={@orphans == []} class="py-8 text-center">
          <.icon name="hero-check-circle" class="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <p class="text-sm text-success font-medium">No orphan pages found</p>
        </div>
      </.main_content>
    <% end %>

    <%= if @tab == "broken" do %>
      <.main_content>
        <.table id="broken-links" rows={@broken_links} row_id={&"broken-#{&1.id}"}>
          <:col :let={link} label="Source Page">
            <span class="font-mono text-xs text-base-content/70"><%= link.source_page_id %></span>
          </:col>
          <:col :let={link} label="Broken Target">
            <span class="font-mono text-xs text-error"><%= link.target_path %></span>
          </:col>
          <:col :let={link} label="Anchor Text">
            <span class="text-base-content/60"><%= link.anchor_text %></span>
          </:col>
        </.table>
        <div :if={@broken_links == []} class="py-8 text-center">
          <.icon name="hero-check-circle" class="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <p class="text-sm text-success font-medium">No broken links found</p>
        </div>
      </.main_content>
    <% end %>

    <%= if @tab == "stats" do %>
      <.main_content>
        <.table id="link-stats" rows={@link_stats} row_id={&"stat-#{&1.path}"}>
          <:col :let={stat} label="Path">
            <span class="font-mono text-xs text-base-content/70"><%= stat.path %></span>
          </:col>
          <:col :let={stat} label="Title">
            <span class="text-base-content font-medium truncate block max-w-[200px]"><%= stat.title %></span>
          </:col>
          <:col :let={stat} label="Inbound">
            <span class={"tabular-nums #{if stat.inbound == 0, do: "text-warning font-bold", else: "text-base-content/70"}"}><%= stat.inbound %></span>
          </:col>
          <:col :let={stat} label="Outbound">
            <span class="text-base-content/70 tabular-nums"><%= stat.outbound %></span>
          </:col>
        </.table>
        <div :if={@link_stats == []} class="py-8 text-center">
          <.icon name="hero-link" class="w-8 h-8 text-zinc-300  mx-auto mb-2" />
          <p class="text-sm text-base-content/60">No link data available. Publish pages to generate link graph.</p>
        </div>
      </.main_content>
    <% end %>
    """
  end
end
