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
    pages = Content.list_pages(site, %{per_page: 500})

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
      {5, page.page_type != nil and page.page_type != "website"},
      {5, non_empty?(page.twitter_card)}
    ]

    earned = checks |> Enum.filter(&elem(&1, 1)) |> Enum.map(&elem(&1, 0)) |> Enum.sum()
    total = checks |> Enum.map(&elem(&1, 0)) |> Enum.sum()
    {earned, total}
  end

  defp find_issues(page) do
    issues = []
    issues = if !non_empty?(page.title), do: ["Missing title" | issues], else: issues
    issues = if non_empty?(page.title) and String.length(page.title) > 60, do: ["Title too long (#{String.length(page.title)} chars)" | issues], else: issues
    issues = if !non_empty?(page.meta_description) and !non_empty?(page.description), do: ["Missing description" | issues], else: issues
    issues = if !non_empty?(page.og_image), do: ["Missing OG image" | issues], else: issues
    issues = if !non_empty?(page.canonical_url), do: ["No canonical URL" | issues], else: issues
    issues = if page.raw_schema == nil or page.raw_schema == [], do: ["No structured data" | issues], else: issues

    # Check for duplicate titles
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
      pct >= 80 -> "text-green-600"
      pct >= 40 -> "text-yellow-600"
      true -> "text-red-600"
    end
  end

  defp score_bg({earned, total}) do
    pct = earned / max(total, 1) * 100
    cond do
      pct >= 80 -> "bg-green-50"
      pct >= 40 -> "bg-yellow-50"
      true -> "bg-red-50"
    end
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="mx-auto max-w-6xl py-6 px-4">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">SEO Audit</h1>

      <%!-- Summary Stats --%>
      <div class="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <div class="bg-white rounded-lg border p-4 text-center">
          <div class="text-2xl font-bold text-gray-900"><%= @stats.total %></div>
          <div class="text-xs text-gray-500 uppercase">Pages</div>
        </div>
        <div class="bg-green-50 rounded-lg border border-green-200 p-4 text-center">
          <div class="text-2xl font-bold text-green-600"><%= @stats.good %></div>
          <div class="text-xs text-green-600 uppercase">Good</div>
        </div>
        <div class="bg-yellow-50 rounded-lg border border-yellow-200 p-4 text-center">
          <div class="text-2xl font-bold text-yellow-600"><%= @stats.needs_work %></div>
          <div class="text-xs text-yellow-600 uppercase">Needs Work</div>
        </div>
        <div class="bg-red-50 rounded-lg border border-red-200 p-4 text-center">
          <div class="text-2xl font-bold text-red-600"><%= @stats.poor %></div>
          <div class="text-xs text-red-600 uppercase">Poor</div>
        </div>
        <div class="bg-white rounded-lg border p-4 text-center">
          <div class="text-2xl font-bold text-gray-900"><%= @stats.missing_desc %></div>
          <div class="text-xs text-gray-500 uppercase">No Description</div>
        </div>
        <div class="bg-white rounded-lg border p-4 text-center">
          <div class="text-2xl font-bold text-gray-900"><%= @stats.missing_og %></div>
          <div class="text-xs text-gray-500 uppercase">No OG Image</div>
        </div>
      </div>

      <%!-- Page List --%>
      <div class="bg-white rounded-lg border overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Path</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issues</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <%= for %{page: page, score: score, issues: issues} <- @audited_pages do %>
              <tr class={score_bg(score)}>
                <td class="px-4 py-3">
                  <span class={"text-sm font-bold #{score_color(score)}"}><%= score_pct(score) %>%</span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-600 font-mono"><%= page.path %></td>
                <td class="px-4 py-3 text-sm text-gray-900 max-w-xs truncate"><%= page.title %></td>
                <td class="px-4 py-3">
                  <div class="flex flex-wrap gap-1">
                    <%= for issue <- issues do %>
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800"><%= issue %></span>
                    <% end %>
                  </div>
                </td>
                <td class="px-4 py-3 text-right">
                  <.link patch={beacon_live_admin_path(@socket, @beacon_page.site, "/pages/#{page.id}/seo")} class="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                    Fix
                  </.link>
                </td>
              </tr>
            <% end %>
          </tbody>
        </table>
      </div>
    </div>
    """
  end
end
