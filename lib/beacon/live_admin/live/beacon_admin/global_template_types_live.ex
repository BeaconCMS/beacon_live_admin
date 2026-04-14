defmodule Beacon.LiveAdmin.BeaconAdmin.GlobalTemplateTypesLive do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Client.Content

  @impl true
  def menu_link("/beacon", :index), do: {:submenu, "Global Template Types"}
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(_params, _url, socket) do
    site = socket.assigns.beacon_page.site

    # List template types with site: nil (global)
    template_types =
      try do
        Content.list_template_types(site)
        |> Enum.filter(fn tt -> is_nil(tt.site) end)
      rescue
        _ -> []
      end

    {:noreply,
     socket
     |> assign(:template_types, template_types)
     |> assign(:show_form, false)
     |> assign(:editing, nil)
     |> assign(:form_data, default_form())
     |> assign(page_title: "Global Template Types")}
  end

  defp default_form do
    %{
      "name" => "",
      "slug" => "",
      "field_definitions" => "[]",
      "json_ld_mapping" => "{}",
      "meta_tag_mapping" => "[]"
    }
  end

  @impl true
  def handle_event("new", _, socket) do
    {:noreply, assign(socket, show_form: true, editing: nil, form_data: default_form())}
  end

  def handle_event("cancel", _, socket) do
    {:noreply, assign(socket, show_form: false, editing: nil)}
  end

  def handle_event("edit", %{"id" => id}, socket) do
    site = socket.assigns.beacon_page.site
    tt = Content.get_template_type(site, id)

    {:noreply,
     assign(socket,
       show_form: true,
       editing: tt,
       form_data: %{
         "name" => tt.name || "",
         "slug" => tt.slug || "",
         "field_definitions" => Jason.encode!(tt.field_definitions || [], pretty: true),
         "json_ld_mapping" => Jason.encode!(tt.json_ld_mapping || %{}, pretty: true),
         "meta_tag_mapping" => Jason.encode!(tt.meta_tag_mapping || [], pretty: true)
       }
     )}
  end

  def handle_event("validate", %{"template_type" => params}, socket) do
    {:noreply, assign(socket, :form_data, params)}
  end

  def handle_event("save", %{"template_type" => params}, socket) do
    site = socket.assigns.beacon_page.site

    # Global template types have site: nil
    attrs = %{
      "name" => params["name"],
      "slug" => params["slug"],
      "site" => nil,
      "field_definitions" => parse_json(params["field_definitions"], []),
      "json_ld_mapping" => parse_json(params["json_ld_mapping"], %{}),
      "meta_tag_mapping" => parse_json(params["meta_tag_mapping"], [])
    }

    result =
      case socket.assigns.editing do
        nil -> Content.create_template_type(site, attrs)
        tt -> Content.update_template_type(site, tt, attrs)
      end

    case result do
      {:ok, _} ->
        template_types =
          Content.list_template_types(site)
          |> Enum.filter(fn tt -> is_nil(tt.site) end)

        {:noreply,
         socket
         |> assign(template_types: template_types, show_form: false, editing: nil)
         |> put_flash(:info, "Global template type saved")}

      {:error, _} ->
        {:noreply, put_flash(socket, :error, "Failed to save template type")}
    end
  end

  def handle_event("delete", %{"id" => id}, socket) do
    site = socket.assigns.beacon_page.site
    tt = Content.get_template_type(site, id)

    case Content.delete_template_type(site, tt) do
      {:ok, _} ->
        template_types =
          Content.list_template_types(site)
          |> Enum.filter(fn tt -> is_nil(tt.site) end)

        {:noreply,
         socket
         |> assign(template_types: template_types)
         |> put_flash(:info, "Global template type deleted")}

      {:error, _} ->
        {:noreply, put_flash(socket, :error, "Failed to delete template type")}
    end
  end

  defp parse_json(str, default) do
    case Jason.decode(str || "") do
      {:ok, value} -> value
      {:error, _} -> default
    end
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="mx-auto max-w-6xl py-6 px-4">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Global Template Types</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Template types available to all sites (site = nil)</p>
        </div>
        <button phx-click="new" class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">
          New Global Template Type
        </button>
      </div>

      <%= if @show_form do %>
        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4"><%= if @editing, do: "Edit Global Template Type", else: "New Global Template Type" %></h2>
          <form phx-submit="save" phx-change="validate" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input type="text" name="template_type[name]" value={@form_data["name"]} placeholder="Blog Post" class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug</label>
                <input type="text" name="template_type[slug]" value={@form_data["slug"]} placeholder="blog-post" class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Field Definitions (JSON)</label>
              <textarea name="template_type[field_definitions]" rows="6" class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm font-mono" placeholder='[{"name": "author_name", "type": "string", "required": true}]'><%= @form_data["field_definitions"] %></textarea>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Array of objects with name, type, required, label. Types: string, text, integer, float, boolean, datetime, date, url, select, list, reference</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">JSON-LD Mapping</label>
              <textarea name="template_type[json_ld_mapping]" rows="8" class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm font-mono" placeholder='{"@context": "https://schema.org", "@type": "Article", "headline": "{title}"}'><%= @form_data["json_ld_mapping"] %></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meta Tag Mapping</label>
              <textarea name="template_type[meta_tag_mapping]" rows="6" class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm font-mono" placeholder='[{"property": "og:type", "content": "article"}]'><%= @form_data["meta_tag_mapping"] %></textarea>
            </div>
            <div class="flex gap-2 pt-2">
              <button type="submit" class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700">Save</button>
              <button type="button" phx-click="cancel" class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">Cancel</button>
            </div>
          </form>
        </div>
      <% end %>

      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Slug</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Fields</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <%= for tt <- @template_types do %>
              <tr>
                <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100"><%= tt.name %></td>
                <td class="px-4 py-3 text-sm font-mono text-gray-600 dark:text-gray-400"><%= tt.slug %></td>
                <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"><%= length(tt.field_definitions || []) %> fields</td>
                <td class="px-4 py-3 text-right space-x-2">
                  <button phx-click="edit" phx-value-id={tt.id} class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 text-sm">Edit</button>
                  <button phx-click="delete" phx-value-id={tt.id} data-confirm="Delete this global template type?" class="text-red-600 hover:text-red-900 text-sm">Delete</button>
                </td>
              </tr>
            <% end %>
            <%= if @template_types == [] do %>
              <tr>
                <td colspan="4" class="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No global template types created yet</td>
              </tr>
            <% end %>
          </tbody>
        </table>
      </div>
    </div>
    """
  end
end
