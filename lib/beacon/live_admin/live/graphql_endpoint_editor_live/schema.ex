defmodule Beacon.LiveAdmin.GraphQLEndpointEditorLive.Schema do
  @moduledoc false
  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Client.Content

  def menu_link(_, _), do: :skip

  def handle_params(%{"id" => id}, _uri, socket) do
    %{beacon_page: %{site: site}} = socket.assigns

    endpoint = Content.get_graphql_endpoint(site, id)
    schema = endpoint && endpoint.introspected_schema

    socket =
      socket
      |> assign(page_title: "Schema: #{endpoint && endpoint.name}")
      |> assign(endpoint: endpoint)
      |> assign(schema: schema)
      |> assign(search: "")
      |> assign(active_tab: "queries")

    {:noreply, socket}
  end

  def handle_event("search", %{"search" => search}, socket) do
    {:noreply, assign(socket, search: search)}
  end

  def handle_event("set_tab", %{"tab" => tab}, socket) do
    {:noreply, assign(socket, active_tab: tab)}
  end

  def handle_event("introspect", _, socket) do
    %{endpoint: endpoint, beacon_page: %{site: site}} = socket.assigns

    socket =
      case Content.introspect_graphql_endpoint(site, endpoint.name) do
        {:ok, schema} ->
          updated = Content.get_graphql_endpoint(site, endpoint.id)

          socket
          |> assign(endpoint: updated, schema: schema)
          |> put_flash(:info, "Schema introspected successfully")

        {:error, reason} ->
          put_flash(socket, :error, "Introspection failed: #{inspect(reason)}")
      end

    {:noreply, socket}
  end

  defp filtered_items(items, search) when is_list(items) and search != "" do
    search = String.downcase(search)
    Enum.filter(items, fn item ->
      name = String.downcase(item["name"] || "")
      desc = String.downcase(item["description"] || "")
      String.contains?(name, search) or String.contains?(desc, search)
    end)
  end

  defp filtered_items(items, _), do: items || []

  defp type_display(%{"kind" => "NON_NULL", "ofType" => inner}), do: "#{type_display(inner)}!"
  defp type_display(%{"kind" => "LIST", "ofType" => inner}), do: "[#{type_display(inner)}]"
  defp type_display(%{"name" => name}) when is_binary(name), do: name
  defp type_display(_), do: "Unknown"

  def render(assigns) do
    ~H"""
    <div>
      <.header>
        Schema: <%= @endpoint && @endpoint.name %>
        <:actions>
          <.back navigate={beacon_live_admin_path(@socket, @beacon_page.site, "/graphql_endpoints/#{@endpoint && @endpoint.id}")}>
            Back to Endpoint
          </.back>
          <.button type="button" phx-click="introspect" class="btn-primary ml-4">
            Refresh Schema
          </.button>
        </:actions>
      </.header>

      <.main_content>
        <%= if @schema do %>
          <div class="mb-4">
            <input type="text" name="search" value={@search} phx-keyup="search" phx-debounce="300"
              placeholder="Search queries, mutations, types..."
              class="w-full px-3 py-2 border border-gray-300  rounded-lg bg-base-100 text-base-content text-sm" />
          </div>

          <div class="flex gap-2 mb-4">
            <button type="button" phx-click="set_tab" phx-value-tab="queries"
              class={"px-4 py-2 text-sm rounded-lg transition-colors #{if @active_tab == "queries", do: "bg-indigo-600 text-white", else: "bg-gray-100 bg-base-100 text-base-content/80"}"}>
              Queries (<%= length(@schema["queries"] || []) %>)
            </button>
            <button type="button" phx-click="set_tab" phx-value-tab="mutations"
              class={"px-4 py-2 text-sm rounded-lg transition-colors #{if @active_tab == "mutations", do: "bg-indigo-600 text-white", else: "bg-gray-100 bg-base-100 text-base-content/80"}"}>
              Mutations (<%= length(@schema["mutations"] || []) %>)
            </button>
            <button type="button" phx-click="set_tab" phx-value-tab="types"
              class={"px-4 py-2 text-sm rounded-lg transition-colors #{if @active_tab == "types", do: "bg-indigo-600 text-white", else: "bg-gray-100 bg-base-100 text-base-content/80"}"}>
              Types (<%= length(@schema["types"] || []) %>)
            </button>
          </div>

          <div class="space-y-2">
            <%= if @active_tab == "queries" do %>
              <%= for query <- filtered_items(@schema["queries"], @search) do %>
                <.operation_card operation={query} />
              <% end %>
            <% end %>

            <%= if @active_tab == "mutations" do %>
              <%= for mutation <- filtered_items(@schema["mutations"], @search) do %>
                <.operation_card operation={mutation} />
              <% end %>
            <% end %>

            <%= if @active_tab == "types" do %>
              <%= for type <- filtered_items(@schema["types"], @search) do %>
                <.type_card type={type} />
              <% end %>
            <% end %>
          </div>
        <% else %>
          <div class="text-center py-12">
            <p class="text-base-content/60 mb-4">No schema loaded for this endpoint.</p>
            <.button type="button" phx-click="introspect" class="btn-primary">
              Introspect Schema
            </.button>
          </div>
        <% end %>
      </.main_content>
    </div>
    """
  end

  defp operation_card(assigns) do
    ~H"""
    <div class="p-4 bg-base-100 border border-base-300 rounded-lg">
      <div class="flex items-start justify-between">
        <div>
          <h4 class="text-sm font-semibold text-base-content font-mono"><%= @operation["name"] %></h4>
          <p :if={@operation["description"]} class="mt-1 text-xs text-base-content/60"><%= @operation["description"] %></p>
        </div>
        <span class="text-xs font-mono text-primary"><%= type_display(@operation["type"]) %></span>
      </div>
      <%= if @operation["args"] && @operation["args"] != [] do %>
        <div class="mt-2 border-t border-gray-100  pt-2">
          <span class="text-xs text-base-content/60">Arguments:</span>
          <div class="mt-1 space-y-1">
            <%= for arg <- @operation["args"] do %>
              <div class="flex items-center gap-2 text-xs">
                <span class="font-mono text-base-content/80"><%= arg["name"] %></span>
                <span class="font-mono text-primary"><%= type_display(arg["type"]) %></span>
                <span :if={arg["defaultValue"]} class="text-gray-400">= <%= arg["defaultValue"] %></span>
              </div>
            <% end %>
          </div>
        </div>
      <% end %>
    </div>
    """
  end

  defp type_card(assigns) do
    ~H"""
    <div class="p-4 bg-base-100 border border-base-300 rounded-lg">
      <div class="flex items-center gap-2">
        <span class="px-2 py-0.5 text-xs rounded bg-gray-100 bg-base-200 text-base-content/70"><%= @type["kind"] %></span>
        <h4 class="text-sm font-semibold text-base-content"><%= @type["name"] %></h4>
      </div>
      <p :if={@type["description"]} class="mt-1 text-xs text-base-content/60"><%= @type["description"] %></p>
      <%= if @type["fields"] && @type["fields"] != [] do %>
        <div class="mt-2 border-t border-gray-100  pt-2 space-y-1">
          <%= for field <- @type["fields"] do %>
            <div class="flex items-center gap-2 text-xs">
              <span class="font-mono text-base-content/80"><%= field["name"] %></span>
              <span class="font-mono text-primary"><%= type_display(field["type"]) %></span>
            </div>
          <% end %>
        </div>
      <% end %>
      <%= if @type["enumValues"] && @type["enumValues"] != [] do %>
        <div class="mt-2 border-t border-gray-100  pt-2">
          <span class="text-xs text-base-content/60">Values:</span>
          <div class="flex flex-wrap gap-1 mt-1">
            <%= for val <- @type["enumValues"] do %>
              <span class="px-2 py-0.5 text-xs font-mono bg-amber-50 text-warning rounded"><%= val["name"] %></span>
            <% end %>
          </div>
        </div>
      <% end %>
    </div>
    """
  end
end
