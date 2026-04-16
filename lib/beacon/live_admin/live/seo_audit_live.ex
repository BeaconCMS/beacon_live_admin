defmodule Beacon.LiveAdmin.SEOAuditLive do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Client.Content

  @impl true
  def menu_link(_path, :seo_audit), do: {:root, "SEO Audit"}
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(_params, _url, socket) do
    site = socket.assigns.beacon_page.site
    pages = Content.list_pages(site, per_page: 500)

    audited =
      pages
      |> Enum.map(fn page ->
        score = compute_score(page)
        issues = find_issues(page)
        %{page: page, score: score, issues: issues}
      end)
      |> Enum.sort_by(fn %{score: {earned, total}} -> earned / max(total, 1) end)

    stats = compute_stats(audited)

    {:noreply,
     socket
     |> assign(:audited_pages, audited)
     |> assign(:stats, stats)
     |> assign(page_title: "SEO Audit")}
  end

  defp compute_score(page) do
    checks = [
      {10, non_empty?(page.title)},
      {10, non_empty?(page.title) and String.length(page.title || "") <= 60},
      {10, non_empty?(page.meta_description || page.description)},
      {10, non_empty?(page.meta_description || page.description) and String.length(page.meta_description || page.description || "") <= 160},
      {15, non_empty?(page.og_image)},
      {5, non_empty?(page.og_title)},
      {5, non_empty?(page.og_description)},
      {10, non_empty?(page.canonical_url)},
      {10, page.raw_schema != nil and page.raw_schema != []},
      {5, non_empty?(page.robots)},
      {5, page.collection_id != nil},
      {5, non_empty?(page.twitter_card)}
    ]

    earned = checks |> Enum.filter(&elem(&1, 1)) |> Enum.map(&elem(&1, 0)) |> Enum.sum()
    total = checks |> Enum.map(&elem(&1, 0)) |> Enum.sum()
    {earned, total}
  end

  defp find_issues(page) do
    issues = []
    issues = if !non_empty?(page.title), do: ["Missing title" | issues], else: issues
    issues = if non_empty?(page.title) and String.length(page.title) > 60, do: ["Title too long" | issues], else: issues
    issues = if !non_empty?(page.meta_description) and !non_empty?(page.description), do: ["No description" | issues], else: issues
    issues = if !non_empty?(page.og_image), do: ["No OG image" | issues], else: issues
    issues = if !non_empty?(page.canonical_url), do: ["No canonical" | issues], else: issues
    issues = if page.raw_schema == nil or page.raw_schema == [], do: ["No schema" | issues], else: issues
    issues
  end

  defp compute_stats(audited) do
    total = length(audited)
    good = Enum.count(audited, fn %{score: {e, t}} -> e / max(t, 1) >= 0.8 end)
    needs_work = Enum.count(audited, fn %{score: {e, t}} -> pct = e / max(t, 1); pct >= 0.4 and pct < 0.8 end)
    poor = Enum.count(audited, fn %{score: {e, t}} -> e / max(t, 1) < 0.4 end)
    missing_desc = Enum.count(audited, fn %{page: p} -> !non_empty?(p.meta_description) and !non_empty?(p.description) end)
    missing_og = Enum.count(audited, fn %{page: p} -> !non_empty?(p.og_image) end)

    %{total: total, good: good, needs_work: needs_work, poor: poor, missing_desc: missing_desc, missing_og: missing_og}
  end

  defp non_empty?(nil), do: false
  defp non_empty?(""), do: false
  defp non_empty?(_), do: true

  defp score_pct({earned, total}), do: round(earned / max(total, 1) * 100)

  defp score_color({earned, total}) do
    pct = earned / max(total, 1) * 100
    cond do
      pct >= 80 -> "text-success"
      pct >= 40 -> "text-warning"
      true -> "text-error"
    end
  end

  defp score_bg({earned, total}) do
    pct = earned / max(total, 1) * 100
    cond do
      pct >= 80 -> "bg-emerald-50/50"
      pct >= 40 -> "bg-amber-50/50"
      true -> "bg-rose-50/50"
    end
  end

  defp issue_badge_class(issue) do
    cond do
      String.contains?(issue, "Missing") or String.contains?(issue, "No ") ->
        "bg-rose-50 text-rose-700 ring-rose-200"
      String.contains?(issue, "too long") ->
        "bg-amber-50 text-amber-700 ring-amber-200"
      true ->
        "bg-zinc-100 text-zinc-600 ring-zinc-200 bg-base-200 "
    end
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.header>
      SEO Audit
    </.header>

    <%!-- Summary Stats --%>
    <div class="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8 -mt-2">
      <.main_content>
        <div class="text-center py-1">
          <div class="text-2xl font-bold text-base-content tabular-nums"><%= @stats.total %></div>
          <div class="text-[11px] font-medium text-base-content/60 uppercase tracking-wide">Pages</div>
        </div>
      </.main_content>
      <.main_content>
        <div class="text-center py-1">
          <div class="text-2xl font-bold text-success tabular-nums"><%= @stats.good %></div>
          <div class="text-[11px] font-medium text-success uppercase tracking-wide">Good</div>
        </div>
      </.main_content>
      <.main_content>
        <div class="text-center py-1">
          <div class="text-2xl font-bold text-warning tabular-nums"><%= @stats.needs_work %></div>
          <div class="text-[11px] font-medium text-warning uppercase tracking-wide">Needs Work</div>
        </div>
      </.main_content>
      <.main_content>
        <div class="text-center py-1">
          <div class="text-2xl font-bold text-error tabular-nums"><%= @stats.poor %></div>
          <div class="text-[11px] font-medium text-error uppercase tracking-wide">Poor</div>
        </div>
      </.main_content>
      <.main_content>
        <div class="text-center py-1">
          <div class="text-2xl font-bold text-base-content tabular-nums"><%= @stats.missing_desc %></div>
          <div class="text-[11px] font-medium text-base-content/60 uppercase tracking-wide">No Desc</div>
        </div>
      </.main_content>
      <.main_content>
        <div class="text-center py-1">
          <div class="text-2xl font-bold text-base-content tabular-nums"><%= @stats.missing_og %></div>
          <div class="text-[11px] font-medium text-base-content/60 uppercase tracking-wide">No OG</div>
        </div>
      </.main_content>
    </div>

    <%!-- Audit Table --%>
    <.main_content>
      <div class="px-4 overflow-y-auto sm:overflow-visible sm:px-0">
        <table class="w-[40rem] mt-2 sm:w-full">
          <thead class="text-sm leading-6 text-left text-base-content/60">
            <tr>
              <th class="pt-0 pb-4 pl-4 pr-6 font-sans font-semibold uppercase text-sm tracking-[1.68px] w-20">Score</th>
              <th class="pt-0 pb-4 pl-0 pr-6 font-sans font-semibold uppercase text-sm tracking-[1.68px]">Path</th>
              <th class="pt-0 pb-4 pl-0 pr-6 font-sans font-semibold uppercase text-sm tracking-[1.68px]">Title</th>
              <th class="pt-0 pb-4 pl-0 pr-6 font-sans font-semibold uppercase text-sm tracking-[1.68px]">Issues</th>
              <th class="relative p-0 pb-4"><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody class="relative text-sm leading-6 divide-y divide-zinc-100 text-slate-800 ">
            <%= for %{page: page, score: score, issues: issues} <- @audited_pages do %>
              <tr class={"group #{score_bg(score)}"}>
                <td class="py-4 pl-4 pr-6">
                  <span class={"text-sm font-bold tabular-nums #{score_color(score)}"}><%= score_pct(score) %>%</span>
                </td>
                <td class="py-4 pr-6">
                  <span class="font-mono text-base-content/70 text-xs"><%= page.path %></span>
                </td>
                <td class="py-4 pr-6 max-w-[200px]">
                  <span class="text-base-content font-medium truncate block"><%= page.title %></span>
                </td>
                <td class="py-4 pr-6">
                  <div class="flex flex-wrap gap-1">
                    <%= for issue <- issues do %>
                      <span class={"inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium ring-1 #{issue_badge_class(issue)}"}><%= issue %></span>
                    <% end %>
                  </div>
                </td>
                <td class="py-4 pr-4 text-right">
                  <.link
                    patch={beacon_live_admin_path(@socket, @beacon_page.site, "/pages/#{page.id}/seo")}
                    class="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-indigo-800 transition-colors"
                  >
                    Fix <.icon name="hero-arrow-right-mini" class="w-3.5 h-3.5" />
                  </.link>
                </td>
              </tr>
            <% end %>
          </tbody>
        </table>
      </div>
    </.main_content>
    """
  end
end
