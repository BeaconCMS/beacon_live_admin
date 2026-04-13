defmodule Beacon.LiveAdmin.PageEditorLive.SEO do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Client.Content

  @impl true
  def menu_link("/pages", :seo), do: {:submenu, "Pages"}
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(%{"id" => id}, _url, socket) do
    site = socket.assigns.beacon_page.site
    page = Content.get_page(site, id)

    {:noreply,
     socket
     |> assign(:page, page)
     |> assign(page_title: "SEO")
     |> assign_seo_fields(page)}
  end

  @impl true
  def handle_event("save", %{"seo" => params}, socket) do
    page = socket.assigns.page

    # Build the update attrs from the SEO form
    attrs = %{
      "meta_description" => params["meta_description"],
      "og_title" => params["og_title"],
      "og_description" => params["og_description"],
      "og_image" => params["og_image"],
      "canonical_url" => params["canonical_url"],
      "robots" => params["robots"],
      "twitter_card" => params["twitter_card"],
      "page_type" => params["page_type"]
    }

    case Content.update_page(page.site, page, attrs) do
      {:ok, updated_page} ->
        {:noreply,
         socket
         |> assign(:page, updated_page)
         |> assign_seo_fields(updated_page)
         |> put_flash(:info, "SEO settings updated successfully")}

      {:error, _changeset} ->
        {:noreply, put_flash(socket, :error, "Failed to update SEO settings")}
    end
  end

  def handle_event("validate", %{"seo" => params}, socket) do
    {:noreply, assign(socket, :form_data, params)}
  end

  defp assign_seo_fields(socket, page) do
    form_data = %{
      "meta_description" => page.meta_description || "",
      "og_title" => page.og_title || "",
      "og_description" => page.og_description || "",
      "og_image" => page.og_image || "",
      "canonical_url" => page.canonical_url || "",
      "robots" => page.robots || "index, follow",
      "twitter_card" => page.twitter_card || "summary_large_image",
      "page_type" => page.page_type || "website"
    }

    socket
    |> assign(:form_data, form_data)
    |> assign(:seo_score, compute_seo_score(page))
  end

  defp compute_seo_score(page) do
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

  defp non_empty?(nil), do: false
  defp non_empty?(""), do: false
  defp non_empty?(_), do: true

  defp score_color({earned, total}) do
    pct = earned / total * 100

    cond do
      pct >= 80 -> "text-green-600"
      pct >= 40 -> "text-yellow-600"
      true -> "text-red-600"
    end
  end

  defp score_label({earned, total}) do
    pct = round(earned / total * 100)

    cond do
      pct >= 80 -> "Good (#{pct}%)"
      pct >= 40 -> "Needs Work (#{pct}%)"
      true -> "Poor (#{pct}%)"
    end
  end

  defp char_count_class(value, limit) do
    len = String.length(value || "")

    cond do
      len == 0 -> "text-gray-400"
      len <= limit * 0.9 -> "text-green-600"
      len <= limit -> "text-yellow-600"
      true -> "text-red-600"
    end
  end

  defp serp_title(page, form_data) do
    title = form_data["og_title"]
    if non_empty?(title), do: title, else: page.title || "Page Title"
  end

  defp serp_description(form_data) do
    desc = form_data["meta_description"]
    if non_empty?(desc), do: desc, else: "No description set"
  end

  defp serp_url(page) do
    page.path || "/"
  end

  @impl true
  def render(assigns) do
    assigns = assign(assigns, :score_color, score_color(assigns.seo_score))
    assigns = assign(assigns, :score_label, score_label(assigns.seo_score))

    ~H"""
    <div>
      <Beacon.LiveAdmin.AdminComponents.page_header socket={@socket} flash={@flash} page={@page} live_action={@live_action} />

      <div class="mx-auto max-w-4xl py-6 px-4">
        <%!-- SEO Score --%>
        <div class="mb-8 flex items-center gap-3">
          <span class="text-sm font-medium text-gray-500 uppercase tracking-wide">SEO Score</span>
          <span class={"text-lg font-bold #{@score_color}"}><%= @score_label %></span>
        </div>

        <form phx-submit="save" phx-change="validate" class="space-y-8">
          <input type="hidden" name="_csrf_token" value={Phoenix.Controller.get_csrf_token()} />

          <%!-- SERP Preview --%>
          <section>
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Search Preview</h3>
            <div class="bg-white border border-gray-200 rounded-lg p-4 max-w-xl">
              <div class="text-blue-700 text-xl font-normal leading-tight truncate">
                <%= serp_title(@page, @form_data) |> String.slice(0..59) %>
              </div>
              <div class="text-green-700 text-sm mt-1 truncate">
                <%= serp_url(@page) %>
              </div>
              <div class="text-gray-600 text-sm mt-1 line-clamp-2">
                <%= serp_description(@form_data) |> String.slice(0..159) %>
              </div>
            </div>
          </section>

          <%!-- Search Appearance --%>
          <section>
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Search Appearance</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <textarea
                  name="seo[meta_description]"
                  rows="3"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  placeholder="Concise description of this page for search engines..."
                ><%= @form_data["meta_description"] %></textarea>
                <div class={"text-xs mt-1 #{char_count_class(@form_data["meta_description"], 160)}"}>
                  <%= String.length(@form_data["meta_description"] || "") %>/160 characters
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Robots</label>
                <select name="seo[robots]" class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm">
                  <option value="index, follow" selected={@form_data["robots"] == "index, follow"}>Index, Follow (default)</option>
                  <option value="noindex, follow" selected={@form_data["robots"] == "noindex, follow"}>No Index, Follow</option>
                  <option value="index, nofollow" selected={@form_data["robots"] == "index, nofollow"}>Index, No Follow</option>
                  <option value="noindex, nofollow" selected={@form_data["robots"] == "noindex, nofollow"}>No Index, No Follow</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Page Type</label>
                <select name="seo[page_type]" class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm">
                  <option value="website" selected={@form_data["page_type"] == "website"}>Website</option>
                  <option value="article" selected={@form_data["page_type"] == "article"}>Article</option>
                  <option value="product" selected={@form_data["page_type"] == "product"}>Product</option>
                </select>
              </div>
            </div>
          </section>

          <%!-- Social Sharing --%>
          <section>
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Social Sharing</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">OG Title</label>
                <input
                  type="text"
                  name="seo[og_title]"
                  value={@form_data["og_title"]}
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  placeholder={"Falls back to page title: #{@page.title}"}
                />
                <div class={"text-xs mt-1 #{char_count_class(@form_data["og_title"], 60)}"}>
                  <%= String.length(@form_data["og_title"] || "") %>/60 characters
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">OG Description</label>
                <textarea
                  name="seo[og_description]"
                  rows="2"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  placeholder="Falls back to meta description"
                ><%= @form_data["og_description"] %></textarea>
                <div class={"text-xs mt-1 #{char_count_class(@form_data["og_description"], 160)}"}>
                  <%= String.length(@form_data["og_description"] || "") %>/160 characters
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">OG Image URL</label>
                <input
                  type="text"
                  name="seo[og_image]"
                  value={@form_data["og_image"]}
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  placeholder="https://example.com/image.jpg (recommended: 1200x630)"
                />
              </div>

              <%!-- Social Preview --%>
              <div :if={@form_data["og_image"] != ""} class="flex gap-4">
                <div class="flex-1">
                  <p class="text-xs text-gray-500 mb-2">Facebook / LinkedIn Preview</p>
                  <div class="border border-gray-200 rounded-lg overflow-hidden max-w-sm">
                    <div :if={@form_data["og_image"] != ""} class="aspect-[1.91/1] bg-gray-100">
                      <img src={@form_data["og_image"]} class="w-full h-full object-cover" alt="" />
                    </div>
                    <div class="p-3">
                      <div class="text-xs text-gray-500 uppercase"><%= serp_url(@page) %></div>
                      <div class="text-sm font-bold text-gray-900 mt-1 truncate"><%= serp_title(@page, @form_data) %></div>
                      <div class="text-xs text-gray-500 mt-1 line-clamp-2"><%= serp_description(@form_data) %></div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Twitter Card Type</label>
                <select name="seo[twitter_card]" class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm">
                  <option value="summary_large_image" selected={@form_data["twitter_card"] == "summary_large_image"}>Summary Large Image</option>
                  <option value="summary" selected={@form_data["twitter_card"] == "summary"}>Summary</option>
                </select>
              </div>
            </div>
          </section>

          <%!-- Advanced --%>
          <section>
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Advanced</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Canonical URL</label>
                <input
                  type="text"
                  name="seo[canonical_url]"
                  value={@form_data["canonical_url"]}
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  placeholder="Auto-generated from page path if left empty"
                />
              </div>
            </div>
          </section>

          <div class="flex justify-end pt-4 border-t">
            <button type="submit" class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150">
              Save SEO Settings
            </button>
          </div>
        </form>
      </div>
    </div>
    """
  end
end
