defmodule Beacon.LiveAdmin.PageEditorLive.New do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Client.Content

  @impl true
  def menu_link("/pages", :new), do: {:submenu, "Pages"}
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(params, _url, socket) do
    editor = Map.get(params, "editor", "code")
    %{site: site} = socket.assigns.beacon_page

    collections = Content.list_collections(site, [])

    socket =
      socket
      |> assign_new(:selected_element_path, fn -> nil end)
      |> assign_new(:layouts, fn -> Content.list_layouts(site) end)
      |> assign_new(:components, fn ->
        site
        |> Content.list_components(per_page: :infinity)
        |> Enum.map(fn component ->
          %{
            id: component.id,
            name: component.name,
            category: component.category,
            thumbnail: component.thumbnail,
            template: component.template,
            example: component.example
          }
        end)
      end)

    selected_collection = socket.assigns[:selected_collection]

    socket =
      assign(socket,
        page_title: "Create New Page",
        editor: editor,
        collections: collections,
        selected_collection: selected_collection,
        page: if(selected_collection, do: build_page_from_collection(site, selected_collection, socket.assigns.layouts), else: nil)
      )

    {:noreply, socket}
  end

  @impl true
  def handle_event("select_collection", %{"id" => id}, socket) do
    site = socket.assigns.beacon_page.site
    collection = Content.get_collection(site, id)
    layouts = socket.assigns.layouts

    page = build_page_from_collection(site, collection, layouts)

    {:noreply,
     assign(socket,
       selected_collection: collection,
       page: page
     )}
  end

  def handle_event("select_collection", %{"custom" => "true"}, socket) do
    site = socket.assigns.beacon_page.site
    layouts = socket.assigns.layouts

    page = build_blank_page(site, layouts)

    {:noreply,
     assign(socket,
       selected_collection: :custom,
       page: page
     )}
  end

  def handle_event("back_to_picker", _, socket) do
    {:noreply, assign(socket, selected_collection: nil, page: nil)}
  end

  defp build_page_from_collection(site, collection, layouts) do
    # Use the collection's layout, or fall back to first available
    layout = find_layout(collection.layout_id, layouts) || List.first(layouts)

    path =
      case collection.path_prefix do
        nil -> "/new-page-#{Date.utc_today()}"
        prefix -> "#{prefix}new-page-#{Date.utc_today()}"
      end

    template = collection.starter_template || "<div></div>"

    %Beacon.Content.Page{
      path: path,
      site: site,
      layout_id: layout && layout.id,
      layout: layout,
      title: "New #{collection.name}",
      template: template,
      collection_id: collection.id,
      fields: %{}
    }
  end

  defp build_blank_page(site, [layout | _]) do
    %Beacon.Content.Page{
      path: "/new-page-#{Date.utc_today()}",
      site: site,
      layout_id: layout.id,
      layout: layout,
      title: "New Page",
      template: "<div>Welcome to BeaconCMS!</div>"
    }
  end

  defp build_blank_page(site, _) do
    %Beacon.Content.Page{
      path: "",
      site: site,
      layout_id: nil,
      layout: nil
    }
  end

  defp find_layout(nil, _layouts), do: nil
  defp find_layout(layout_id, layouts) do
    Enum.find(layouts, fn l -> l.id == layout_id end)
  end

  @impl true
  def render(assigns) do
    ~H"""
    <%= if @selected_collection do %>
      <div class="mb-4">
        <button phx-click="back_to_picker" class="btn btn-ghost btn-sm gap-1">
          <.icon name="hero-arrow-left" class="w-4 h-4" /> Back to collection picker
        </button>
      </div>
      <.live_component
        module={Beacon.LiveAdmin.PageEditorLive.FormComponent}
        id="page-editor-form"
        live_action={@live_action}
        page_title={@page_title}
        site={@beacon_page.site}
        layouts={@layouts}
        page={@page}
        selected_element_path={@selected_element_path}
        components={@components}
        editor={@editor}
        patch="/pages"
      />
    <% else %>
      <.header>
        Create New Page
        <:subtitle>Choose a collection to get started, or create a custom page.</:subtitle>
      </.header>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <%= for collection <- @collections do %>
          <button
            phx-click="select_collection"
            phx-value-id={collection.id}
            class="group text-left p-5 bg-base-100 rounded-xl border border-base-300 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div class="flex items-start gap-3">
              <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <.icon name={collection.icon || "hero-document-text"} class="w-5 h-5 text-primary" />
              </div>
              <div class="min-w-0">
                <h3 class="text-sm font-semibold text-base-content group-hover:text-primary transition-colors">
                  <%= collection.name %>
                </h3>
                <p :if={collection.description} class="mt-1 text-xs text-base-content/60 line-clamp-2">
                  <%= collection.description %>
                </p>
                <div class="mt-2 flex items-center gap-2">
                  <span class={"badge badge-xs #{if collection.mode == "managed", do: "badge-primary", else: "badge-secondary"}"}>
                    <%= collection.mode %>
                  </span>
                  <span :if={collection.fields != []} class="text-[11px] text-base-content/40">
                    <%= length(collection.fields) %> fields
                  </span>
                </div>
              </div>
            </div>
          </button>
        <% end %>

        <%!-- Custom Page (always available) --%>
        <button
          phx-click="select_collection"
          phx-value-custom="true"
          class="group text-left p-5 bg-base-100 rounded-xl border border-base-300 border-dashed shadow-sm hover:shadow-md hover:border-base-content/30 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <div class="flex items-start gap-3">
            <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-base-200 flex-shrink-0 group-hover:bg-base-300 transition-colors">
              <.icon name="hero-plus" class="w-5 h-5 text-base-content/40" />
            </div>
            <div class="min-w-0">
              <h3 class="text-sm font-semibold text-base-content/80 group-hover:text-base-content transition-colors">
                Custom Page
              </h3>
              <p class="mt-1 text-xs text-base-content/50 line-clamp-2">
                Start from scratch with full control over layout and template.
              </p>
            </div>
          </div>
        </button>
      </div>
    <% end %>
    """
  end
end
