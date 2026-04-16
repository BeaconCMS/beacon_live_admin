defmodule Beacon.LiveAdmin.CollectionManagerLive do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Client.Content

  @impl true
  def menu_link("/collections", action) when action in [:index], do: {:root, "Collections"}
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(_params, _url, socket) do
    site = socket.assigns.beacon_page.site
    collections = Content.list_collections(site)

    {:noreply,
     socket
     |> assign(:collections, collections)
     |> assign(:show_form, false)
     |> assign(:editing, nil)
     |> assign(:confirm_delete, nil)
     |> assign(:form_data, default_form())
     |> assign(page_title: "Collections")}
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
    {:noreply, assign(socket, show_form: false, editing: nil, confirm_delete: nil)}
  end

  def handle_event("edit", %{"id" => id}, socket) do
    site = socket.assigns.beacon_page.site
    tt = Content.get_collection(site, id)

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

  def handle_event("validate", %{"collection" => params}, socket) do
    {:noreply, assign(socket, :form_data, params)}
  end

  def handle_event("save", %{"collection" => params}, socket) do
    site = socket.assigns.beacon_page.site

    attrs = %{
      "name" => params["name"],
      "slug" => params["slug"],
      "site" => site,
      "field_definitions" => parse_json(params["field_definitions"], []),
      "json_ld_mapping" => parse_json(params["json_ld_mapping"], %{}),
      "meta_tag_mapping" => parse_json(params["meta_tag_mapping"], [])
    }

    result =
      case socket.assigns.editing do
        nil -> Content.create_collection(site, attrs)
        tt -> Content.update_collection(site, tt, attrs)
      end

    case result do
      {:ok, _} ->
        collections = Content.list_collections(site)
        {:noreply,
         socket
         |> assign(collections: collections, show_form: false, editing: nil)
         |> put_flash(:info, "Collection saved")}

      {:error, _} ->
        {:noreply, put_flash(socket, :error, "Failed to save collection")}
    end
  end

  def handle_event("confirm_delete", %{"id" => id}, socket) do
    {:noreply, assign(socket, :confirm_delete, id)}
  end

  def handle_event("delete", %{"id" => id}, socket) do
    site = socket.assigns.beacon_page.site
    tt = Content.get_collection(site, id)

    case Content.delete_collection(site, tt) do
      {:ok, _} ->
        collections = Content.list_collections(site)
        {:noreply, socket |> assign(collections: collections, confirm_delete: nil) |> put_flash(:info, "Collection deleted")}

      {:error, _} ->
        {:noreply, put_flash(socket, :error, "Failed to delete collection")}
    end
  end

  defp parse_json(str, default) do
    case Jason.decode(str || "") do
      {:ok, value} -> value
      {:error, _} -> default
    end
  end

  defp scope_label(tt) do
    if tt.site, do: "Site", else: "Global"
  end

  defp scope_badge_class(tt) do
    if tt.site,
      do: "bg-sky-50 text-sky-700 ring-sky-200",
      else: "bg-purple-50 text-purple-700 ring-purple-200"
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.header>
      Collections
      <:actions>
        <.button phx-click="new" class="btn-primary">Create New Collection</.button>
      </:actions>
    </.header>

    <.main_content :if={@show_form} class="mb-6">
      <div class="px-2 py-4">
        <h2 class="text-base font-semibold text-base-content mb-4">
          <%= if @editing, do: "Edit Collection", else: "New Collection" %>
        </h2>
        <.form for={%{}} phx-submit="save" phx-change="validate" class="space-y-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-base-content/80 mb-1.5">Name</label>
              <input type="text" name="collection[name]" value={@form_data["name"]} placeholder="Blog Post" class="w-full rounded-lg border-base-300 bg-base-200 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-base-content/80 mb-1.5">Slug</label>
              <input type="text" name="collection[slug]" value={@form_data["slug"]} placeholder="blog-post" class="w-full rounded-lg border-base-300 bg-base-200 text-sm font-mono shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-base-content/80 mb-1.5">
              Field Definitions
              <span class="font-normal text-base-content/40 ml-1">JSON</span>
            </label>
            <textarea
              name="collection[field_definitions]"
              rows="6"
              class="w-full rounded-lg border-base-300 bg-base-200 text-sm font-mono shadow-sm focus:border-indigo-500 focus:ring-indigo-500 leading-relaxed"
              placeholder='[{"name": "author_name", "type": "string", "required": true}]'
            ><%= @form_data["field_definitions"] %></textarea>
            <p class="text-xs text-base-content/40 mt-1.5">
              Array of objects: <code class="px-1 py-0.5 bg-zinc-100 bg-base-200 rounded text-[11px]">name</code>,
              <code class="px-1 py-0.5 bg-zinc-100 bg-base-200 rounded text-[11px]">type</code>,
              <code class="px-1 py-0.5 bg-zinc-100 bg-base-200 rounded text-[11px]">required</code>,
              <code class="px-1 py-0.5 bg-zinc-100 bg-base-200 rounded text-[11px]">label</code>.
              Types: string, text, integer, float, boolean, datetime, date, url, select, list, reference
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-base-content/80 mb-1.5">
              JSON-LD Mapping
              <span class="font-normal text-base-content/40 ml-1">JSON</span>
            </label>
            <textarea
              name="collection[json_ld_mapping]"
              rows="8"
              class="w-full rounded-lg border-base-300 bg-base-200 text-sm font-mono shadow-sm focus:border-indigo-500 focus:ring-indigo-500 leading-relaxed"
              placeholder='{"@context": "https://schema.org", "@type": "Article"}'
            ><%= @form_data["json_ld_mapping"] %></textarea>
            <p class="text-xs text-base-content/40 mt-1.5">
              Use <code class="px-1 py-0.5 bg-zinc-100 bg-base-200 rounded text-[11px]">{"{field_name}"}</code> for page fields,
              <code class="px-1 py-0.5 bg-zinc-100 bg-base-200 rounded text-[11px]">{"{fields.X}"}</code> for collection fields
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-base-content/80 mb-1.5">
              Meta Tag Mapping
              <span class="font-normal text-base-content/40 ml-1">JSON</span>
            </label>
            <textarea
              name="collection[meta_tag_mapping]"
              rows="6"
              class="w-full rounded-lg border-base-300 bg-base-200 text-sm font-mono shadow-sm focus:border-indigo-500 focus:ring-indigo-500 leading-relaxed"
              placeholder='[{"property": "og:type", "content": "article"}]'
            ><%= @form_data["meta_tag_mapping"] %></textarea>
            <p class="text-xs text-base-content/40 mt-1.5">
              Array of meta tag objects. Same <code class="px-1 py-0.5 bg-zinc-100 bg-base-200 rounded text-[11px]">{"{field}"}</code> reference syntax as JSON-LD.
            </p>
          </div>

          <div class="flex items-center gap-3 pt-1">
            <.button type="submit" class="btn-primary">Save</.button>
            <.button type="button" phx-click="cancel" class="btn-ghost">Cancel</.button>
          </div>
        </.form>
      </div>
    </.main_content>

    <.main_content>
      <.table id="collections" rows={@collections} row_id={&"tt-#{&1.id}"}>
        <:col :let={tt} label="Name">
          <span class="font-semibold"><%= tt.name %></span>
        </:col>
        <:col :let={tt} label="Slug">
          <span class="font-mono text-base-content/60"><%= tt.slug %></span>
        </:col>
        <:col :let={tt} label="Scope">
          <span class={"inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ring-1 #{scope_badge_class(tt)}"}>
            <%= scope_label(tt) %>
          </span>
        </:col>
        <:col :let={tt} label="Fields">
          <span class="text-base-content/60 tabular-nums"><%= length(tt.field_definitions || []) %> fields</span>
        </:col>
        <:action :let={tt}>
          <div class="flex items-center gap-1">
            <button phx-click="edit" phx-value-id={tt.id} title="Edit" class="p-2 rounded-md hover:bg-zinc-100 transition-colors">
              <.icon name="hero-pencil-square" class="w-4 h-4 text-zinc-400 hover:text-zinc-600" />
            </button>
            <%= if @confirm_delete == tt.id do %>
              <span class="text-xs text-base-content/60">Delete?</span>
              <button phx-click="delete" phx-value-id={tt.id} class="p-1 text-rose-600 hover:text-rose-800 text-xs font-semibold">Yes</button>
              <button phx-click="cancel" class="p-1 text-zinc-500 hover:text-zinc-700 text-xs">No</button>
            <% else %>
              <button phx-click="confirm_delete" phx-value-id={tt.id} title="Delete" class="p-2 rounded-md hover:bg-rose-50 transition-colors">
                <.icon name="hero-trash" class="w-4 h-4 text-zinc-400 hover:text-rose-500" />
              </button>
            <% end %>
          </div>
        </:action>
      </.table>
    </.main_content>
    """
  end
end
