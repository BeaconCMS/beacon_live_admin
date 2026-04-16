defmodule Beacon.LiveAdmin.PageQueryEditorLive.Index do
  @moduledoc false
  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Client.Content

  def menu_link(_, _), do: :skip

  def handle_params(%{"page_id" => page_id} = params, _uri, socket) do
    %{beacon_page: %{site: site}} = socket.assigns

    endpoints = Content.list_graphql_endpoints(site)
    page_queries = Content.list_page_queries(site, page_id)

    socket =
      socket
      |> assign(page_title: "Page Queries")
      |> assign(page_id: page_id)
      |> assign(endpoints: endpoints)
      |> assign(page_queries: page_queries)
      |> assign(show_create_modal: false)
      |> assign(show_delete_modal: false)
      |> assign(delete_target: nil)
      |> assign(create_form: to_form(%{}, as: :page_query))
      |> assign_selected(params["id"])

    {:noreply, socket}
  end

  def handle_event("create_new", _, socket) do
    {:noreply, assign(socket, show_create_modal: true)}
  end

  def handle_event("save_new", %{"page_query" => params}, socket) do
    %{beacon_page: %{site: site}, page_id: page_id} = socket.assigns

    attrs = Map.merge(params, %{"page_id" => page_id, "sort_order" => length(socket.assigns.page_queries)})

    socket =
      case Content.create_page_query(site, attrs) do
        {:ok, _query} ->
          socket
          |> assign(page_queries: Content.list_page_queries(site, page_id))
          |> assign(show_create_modal: false)
          |> put_flash(:info, "Query added")

        {:error, changeset} ->
          assign(socket, create_form: to_form(changeset))
      end

    {:noreply, socket}
  end

  def handle_event("update_query", %{"id" => id} = params, socket) do
    %{beacon_page: %{site: site}, page_id: page_id} = socket.assigns

    query = Enum.find(socket.assigns.page_queries, &(&1.id == id))

    attrs =
      params
      |> Map.drop(["id", "_target"])
      |> Map.new(fn {k, v} -> {k, v} end)

    case Content.update_page_query(site, query, attrs) do
      {:ok, _} ->
        {:noreply, assign(socket, page_queries: Content.list_page_queries(site, page_id))}

      {:error, _} ->
        {:noreply, socket}
    end
  end

  def handle_event("delete", %{"id" => id}, socket) do
    {:noreply, assign(socket, show_delete_modal: true, delete_target: id)}
  end

  def handle_event("delete_confirm", _, socket) do
    %{beacon_page: %{site: site}, page_id: page_id, delete_target: id} = socket.assigns

    query = Enum.find(socket.assigns.page_queries, &(&1.id == id))
    {:ok, _} = Content.delete_page_query(site, query)

    socket =
      socket
      |> assign(page_queries: Content.list_page_queries(site, page_id))
      |> assign(show_delete_modal: false, delete_target: nil)
      |> put_flash(:info, "Query removed")

    {:noreply, socket}
  end

  def handle_event("delete_cancel", _, socket) do
    {:noreply, assign(socket, show_delete_modal: false, delete_target: nil)}
  end

  def handle_event("cancel_create", _, socket) do
    {:noreply, assign(socket, show_create_modal: false)}
  end

  defp assign_selected(socket, nil), do: assign(socket, selected: nil)
  defp assign_selected(socket, id), do: assign(socket, selected: Enum.find(socket.assigns.page_queries, &(&1.id == id)))

  defp endpoint_options(endpoints) do
    Enum.map(endpoints, &{&1.name, &1.name})
  end

  defp variable_binding_summary(bindings) when is_map(bindings) and map_size(bindings) > 0 do
    bindings
    |> Enum.map(fn {var, spec} ->
      source = spec["source"] || "unknown"
      key = spec["key"] || spec["value"] || spec["from"] || ""
      "#{var}: #{source}(#{key})"
    end)
    |> Enum.join(", ")
  end

  defp variable_binding_summary(_), do: "none"

  def render(assigns) do
    ~H"""
    <div>
      <.header>
        Page Queries
        <:actions>
          <.back navigate={beacon_live_admin_path(@socket, @beacon_page.site, "/pages/#{@page_id}")}>
            Back to Page
          </.back>
          <.button type="button" phx-click="create_new" class="btn-primary ml-4">
            Add Query
          </.button>
        </:actions>
      </.header>

      <.main_content>
        <.modal :if={@show_create_modal} id="create-modal" on_cancel={JS.push("cancel_create")} show>
          <:title>Add Page Query</:title>
          <.form :let={f} for={@create_form} id="create-form" phx-submit="save_new" class="px-4 space-y-4">
            <.input field={f[:endpoint_name]} type="select" label="GraphQL Endpoint:" options={endpoint_options(@endpoints)} />
            <.input field={f[:result_alias]} type="text" label="Result Alias:" placeholder="e.g. posts, author" />
            <.input field={f[:query_string]} type="textarea" label="GraphQL Query:" placeholder="query GetPosts($limit: Int) { posts(limit: $limit) { id title } }" />
            <.input field={f[:depends_on]} type="text" label="Depends On (optional):" placeholder="e.g. get_author (another query's alias)" />
            <.button class="btn-primary mt-4">Add Query</.button>
          </.form>
        </.modal>

        <.modal :if={@show_delete_modal} id="delete-modal" on_cancel={JS.push("delete_cancel")} show>
          <p>Remove this query from the page?</p>
          <.button type="button" phx-click="delete_confirm" class="btn-error">Remove</.button>
          <.button type="button" phx-click="delete_cancel" class="btn-ghost">Cancel</.button>
        </.modal>

        <%= if @page_queries == [] do %>
          <div class="text-center py-12">
            <p class="text-base-content/60 mb-4">No queries bound to this page yet.</p>
            <p class="text-sm text-base-content/40">Add a GraphQL query to populate page data.</p>
          </div>
        <% else %>
          <div class="space-y-3">
            <%= for {query, index} <- Enum.with_index(@page_queries) do %>
              <div class="p-4 bg-base-100 border border-base-300 rounded-lg">
                <div class="flex items-start justify-between">
                  <div class="flex items-center gap-3">
                    <span class="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-indigo-100 text-primary text-xs font-bold">
                      <%= index + 1 %>
                    </span>
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="text-sm font-semibold text-base-content font-mono">@<%= query.result_alias %></span>
                        <span class="text-xs px-2 py-0.5 rounded bg-gray-100 bg-base-200 text-base-content/70"><%= query.endpoint_name %></span>
                        <span :if={query.depends_on} class="text-xs px-2 py-0.5 rounded bg-amber-100 text-warning">depends on: <%= query.depends_on %></span>
                      </div>
                      <div class="mt-1 text-xs text-base-content/60">
                        Variables: <%= variable_binding_summary(query.variable_bindings) %>
                      </div>
                    </div>
                  </div>
                  <button type="button" phx-click="delete" phx-value-id={query.id}
                    class="text-gray-400 hover:text-red-500 transition-colors">
                    <.icon name="hero-x-mark" class="w-4 h-4" />
                  </button>
                </div>
                <div class="mt-3 p-2 bg-base-200 rounded font-mono text-xs text-base-content/80 overflow-x-auto">
                  <pre class="whitespace-pre-wrap"><%= query.query_string %></pre>
                </div>
              </div>
            <% end %>
          </div>
        <% end %>
      </.main_content>
    </div>
    """
  end
end
