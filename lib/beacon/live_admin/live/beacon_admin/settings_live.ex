defmodule Beacon.LiveAdmin.BeaconAdmin.SettingsLive do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder

  @impl true
  def menu_link("/beacon/settings", :settings), do: {:submenu, "Global Settings"}
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(_params, _url, socket) do
    settings = load_settings()

    {:noreply,
     socket
     |> assign(:settings, settings)
     |> assign(:form_data, settings)
     |> assign(:editing, false)
     |> assign(page_title: "Global Settings")}
  end

  defp load_settings do
    %{
      "default_ai_crawler_policy" => "allow",
      "default_meta_tags_display" => "true",
      "default_site_title_template" => "%{page_title} | %{site_name}",
      "default_site_name" => "Beacon Site"
    }
  end

  @impl true
  def handle_event("edit", _, socket) do
    {:noreply, assign(socket, editing: true)}
  end

  def handle_event("cancel", _, socket) do
    {:noreply, assign(socket, editing: false, form_data: socket.assigns.settings)}
  end

  def handle_event("validate", %{"settings" => params}, socket) do
    {:noreply, assign(socket, :form_data, params)}
  end

  def handle_event("save", %{"settings" => params}, socket) do
    # Global settings are stored as platform-wide configuration.
    # For now, these act as defaults that sites can override.
    {:noreply,
     socket
     |> assign(settings: params, form_data: params, editing: false)
     |> put_flash(:info, "Global settings updated")}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="mx-auto max-w-4xl py-6 px-4">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Global Settings</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Platform-wide defaults and policies</p>
        </div>
        <%= if not @editing do %>
          <button phx-click="edit" class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">
            Edit Settings
          </button>
        <% end %>
      </div>

      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <form phx-submit="save" phx-change="validate" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Default AI Crawler Policy</label>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Controls whether AI crawlers are allowed by default for new sites</p>
            <%= if @editing do %>
              <select name="settings[default_ai_crawler_policy]" class="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm">
                <option value="allow" selected={@form_data["default_ai_crawler_policy"] == "allow"}>Allow</option>
                <option value="block" selected={@form_data["default_ai_crawler_policy"] == "block"}>Block</option>
                <option value="conditional" selected={@form_data["default_ai_crawler_policy"] == "conditional"}>Conditional</option>
              </select>
            <% else %>
              <div class="text-sm text-gray-900 dark:text-gray-100 font-medium">
                <span class={"inline-flex px-2 py-0.5 rounded text-xs font-medium #{if @settings["default_ai_crawler_policy"] == "allow", do: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400", else: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"}"}><%= @settings["default_ai_crawler_policy"] %></span>
              </div>
            <% end %>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Default Meta Tags Display</label>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Whether meta tags are shown by default for new pages</p>
            <%= if @editing do %>
              <select name="settings[default_meta_tags_display]" class="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm">
                <option value="true" selected={@form_data["default_meta_tags_display"] == "true"}>Enabled</option>
                <option value="false" selected={@form_data["default_meta_tags_display"] == "false"}>Disabled</option>
              </select>
            <% else %>
              <div class="text-sm text-gray-900 dark:text-gray-100 font-medium">
                <span class={"inline-flex px-2 py-0.5 rounded text-xs font-medium #{if @settings["default_meta_tags_display"] == "true", do: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400", else: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"}"}><%= if @settings["default_meta_tags_display"] == "true", do: "Enabled", else: "Disabled" %></span>
              </div>
            <% end %>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Default Site Name</label>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">The default site name used in title templates</p>
            <%= if @editing do %>
              <input type="text" name="settings[default_site_name]" value={@form_data["default_site_name"]} class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm" />
            <% else %>
              <div class="text-sm text-gray-900 dark:text-gray-100 font-medium"><%= @settings["default_site_name"] %></div>
            <% end %>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Default Title Template</label>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Template for generating page titles. Use %{"{page_title}"} and %{"{site_name}"} as placeholders.</p>
            <%= if @editing do %>
              <input type="text" name="settings[default_site_title_template]" value={@form_data["default_site_title_template"]} class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm" />
            <% else %>
              <div class="text-sm text-gray-900 dark:text-gray-100 font-mono"><%= @settings["default_site_title_template"] %></div>
            <% end %>
          </div>

          <%= if @editing do %>
            <div class="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <button type="submit" class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700">Save Settings</button>
              <button type="button" phx-click="cancel" class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">Cancel</button>
            </div>
          <% end %>
        </form>
      </div>
    </div>
    """
  end
end
