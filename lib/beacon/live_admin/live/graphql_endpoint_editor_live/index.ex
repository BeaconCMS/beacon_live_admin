defmodule Beacon.LiveAdmin.GraphQLEndpointEditorLive.Index do
  @moduledoc false
  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Client.Content

  def menu_link(_, :index), do: {:root, "GraphQL Endpoints"}

  def handle_params(params, _uri, socket) do
    %{beacon_page: %{site: site}} = socket.assigns

    socket =
      socket
      |> assign(page_title: "GraphQL Endpoints")
      |> assign(unsaved_changes: false)
      |> assign(show_create_modal: false)
      |> assign(show_nav_modal: false)
      |> assign(show_delete_modal: false)
      |> assign(introspection_status: nil)
      |> assign(create_form: to_form(%{}, as: :graphql_endpoint))
      |> assign_new(:endpoints, fn -> Content.list_graphql_endpoints(site) end)
      |> assign_selected(params["id"])
      |> assign_form()

    {:noreply, socket}
  end

  def handle_event("select-" <> id, _, socket) do
    %{beacon_page: %{site: site}} = socket.assigns
    path = beacon_live_admin_path(socket, site, "/graphql_endpoints/#{id}")

    if socket.assigns.unsaved_changes do
      {:noreply, assign(socket, show_nav_modal: true, confirm_nav_path: path)}
    else
      {:noreply, push_navigate(socket, to: path)}
    end
  end

  def handle_event("validate", %{"graphql_endpoint" => params}, socket) do
    %{beacon_page: %{site: site}} = socket.assigns

    changeset =
      site
      |> Content.change_graphql_endpoint(socket.assigns.selected || %Beacon.Content.GraphQLEndpoint{}, params)
      |> Map.put(:action, :validate)

    socket =
      socket
      |> assign_form(changeset)
      |> assign(unsaved_changes: !(changeset.changes == %{}))

    {:noreply, socket}
  end

  def handle_event("create_new", _, socket) do
    {:noreply, assign(socket, show_create_modal: true)}
  end

  def handle_event("save_new", %{"graphql_endpoint" => params}, socket) do
    %{beacon_page: %{site: site}} = socket.assigns

    attrs = Map.merge(params, %{"site" => site})

    socket =
      case Content.create_graphql_endpoint(site, attrs) do
        {:ok, %{id: id}} ->
          socket
          |> assign(endpoints: Content.list_graphql_endpoints(site))
          |> assign(show_create_modal: false)
          |> push_navigate(to: beacon_live_admin_path(socket, site, "/graphql_endpoints/#{id}"))

        {:error, changeset} ->
          assign(socket, create_form: to_form(changeset))
      end

    {:noreply, socket}
  end

  def handle_event("save_changes", %{"graphql_endpoint" => params}, socket) do
    %{selected: selected, beacon_page: %{site: site}} = socket.assigns

    socket =
      case Content.update_graphql_endpoint(site, selected, params) do
        {:ok, updated} ->
          endpoints =
            Enum.map(socket.assigns.endpoints, fn
              %{id: id} when id == updated.id -> updated
              other -> other
            end)

          socket
          |> assign(endpoints: endpoints, selected: updated)
          |> assign_form()
          |> assign(unsaved_changes: false)
          |> put_flash(:info, "Endpoint updated successfully")

        {:error, changeset} ->
          assign(socket, form: to_form(Map.put(changeset, :action, :update)))
      end

    {:noreply, socket}
  end

  def handle_event("introspect", _, socket) do
    %{selected: selected, beacon_page: %{site: site}} = socket.assigns

    socket =
      case Content.introspect_graphql_endpoint(site, selected.name) do
        {:ok, _schema} ->
          updated = Content.get_graphql_endpoint(site, selected.id)

          endpoints =
            Enum.map(socket.assigns.endpoints, fn
              %{id: id} when id == updated.id -> updated
              other -> other
            end)

          socket
          |> assign(endpoints: endpoints, selected: updated)
          |> assign(introspection_status: :success)
          |> put_flash(:info, "Schema introspected successfully")

        {:error, reason} ->
          socket
          |> assign(introspection_status: :error)
          |> put_flash(:error, "Introspection failed: #{inspect(reason)}")
      end

    {:noreply, socket}
  end

  def handle_event("delete", _, socket) do
    {:noreply, assign(socket, show_delete_modal: true)}
  end

  def handle_event("delete_confirm", _, socket) do
    %{selected: endpoint, beacon_page: %{site: site}} = socket.assigns

    {:ok, _} = Content.delete_graphql_endpoint(site, endpoint)

    socket =
      socket
      |> assign(endpoints: Content.list_graphql_endpoints(site))
      |> push_patch(to: beacon_live_admin_path(socket, site, "/graphql_endpoints"))

    {:noreply, socket}
  end

  def handle_event("delete_cancel", _, socket) do
    {:noreply, assign(socket, show_delete_modal: false)}
  end

  def handle_event("stay_here", _params, socket) do
    {:noreply, assign(socket, show_nav_modal: false, confirm_nav_path: nil)}
  end

  def handle_event("discard_changes", _params, socket) do
    {:noreply, push_navigate(socket, to: socket.assigns.confirm_nav_path)}
  end

  def handle_event("cancel_create", _params, socket) do
    {:noreply, assign(socket, show_create_modal: false)}
  end

  defp assign_selected(socket, nil) do
    case socket.assigns.endpoints do
      [] -> assign(socket, selected: nil)
      [hd | _] -> assign(socket, selected: hd)
    end
  end

  defp assign_selected(socket, id) when is_binary(id) do
    selected = Enum.find(socket.assigns.endpoints, &(&1.id == id))
    assign(socket, selected: selected)
  end

  defp assign_form(socket) do
    form =
      case socket.assigns do
        %{selected: nil} ->
          nil

        %{selected: selected, beacon_page: %{site: site}} ->
          site
          |> Content.change_graphql_endpoint(selected)
          |> to_form()
      end

    assign(socket, form: form)
  end

  defp assign_form(socket, changeset) do
    assign(socket, :form, to_form(changeset))
  end

  defp schema_query_count(endpoint) do
    case endpoint.introspected_schema do
      %{"queries" => queries} -> length(queries)
      _ -> 0
    end
  end

  defp schema_mutation_count(endpoint) do
    case endpoint.introspected_schema do
      %{"mutations" => mutations} -> length(mutations)
      _ -> 0
    end
  end

  def render(assigns) do
    ~H"""
    <div>
      <.header>
        <%= @page_title %>
        <:actions>
          <.button type="button" id="new-endpoint-button" phx-click="create_new" class="btn-primary">
            New Endpoint
          </.button>
        </:actions>
      </.header>

      <.main_content>
        <.modal :if={@show_nav_modal} id="confirm-nav" on_cancel={JS.push("stay_here")} show>
          <p>You've made unsaved changes to this endpoint!</p>
          <.button type="button" phx-click="stay_here" class="btn-ghost">Stay here</.button>
          <.button type="button" phx-click="discard_changes" class="btn-error">Discard changes</.button>
        </.modal>

        <.modal :if={@show_create_modal} id="create-modal" on_cancel={JS.push("cancel_create")} show>
          <:title>New GraphQL Endpoint</:title>
          <.form :let={f} for={@create_form} id="create-form" phx-submit="save_new" class="px-4">
            <.input field={f[:name]} type="text" label="Endpoint name:" placeholder="e.g. blog_api" />
            <.input field={f[:url]} type="text" label="URL:" placeholder="https://api.example.com/graphql" />
            <.input field={f[:auth_type]} type="select" label="Auth type:" options={[{"Bearer Token", "bearer"}, {"Custom Header", "header"}, {"None", "none"}]} />
            <.button class="btn-primary mt-4">Save</.button>
          </.form>
        </.modal>

        <.modal :if={@show_delete_modal} id="delete-modal" on_cancel={JS.push("delete_cancel")} show>
          <p>Are you sure you want to delete this endpoint?</p>
          <.button type="button" id="confirm-delete-button" phx-click="delete_confirm" class="btn-error">Delete</.button>
          <.button type="button" phx-click="delete_cancel" class="btn-ghost">Cancel</.button>
        </.modal>

        <div class="grid items-start grid-cols-1 grid-rows-1 mx-auto gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <div class="h-full lg:overflow-y-auto pb-4 lg:h-[calc(100vh_-_239px)]">
            <.table id="graphql-endpoints" rows={@endpoints} row_click={fn row -> "select-#{row.id}" end}>
              <:col :let={endpoint} label="Name"><%= endpoint.name %></:col>
              <:col :let={endpoint} label="URL"><span class="truncate max-w-[200px] block"><%= endpoint.url %></span></:col>
            </.table>
          </div>

          <div :if={@form} class="w-full col-span-2">
            <.form :let={f} for={@form} id="endpoint-form" class="space-y-4" phx-change="validate" phx-submit="save_changes">
              <div class="flex items-end gap-4">
                <div class="flex-1">
                  <.input label="Name" field={f[:name]} type="text" />
                </div>
                <.button phx-disable-with="Saving..." class="btn-primary">Save Changes</.button>
                <.button id="delete-endpoint-button" type="button" phx-click="delete" class="btn-error">Delete</.button>
              </div>

              <.input label="URL" field={f[:url]} type="text" placeholder="https://api.example.com/graphql" />

              <div class="grid grid-cols-2 gap-4">
                <.input label="Auth Type" field={f[:auth_type]} type="select"
                  options={[{"Bearer Token", "bearer"}, {"Custom Header", "header"}, {"None", "none"}]} />
                <.input label="Auth Header" field={f[:auth_header]} type="text" />
              </div>

              <.input label="API Key / Token" field={f[:auth_value_encrypted]} type="password" placeholder="Enter API key..." />

              <div class="grid grid-cols-3 gap-4">
                <.input label="Default TTL (seconds)" field={f[:default_ttl]} type="number" />
                <.input label="Timeout (ms)" field={f[:timeout_ms]} type="number" />
                <.input label="Max Retries" field={f[:max_retries]} type="number" />
              </div>
            </.form>

            <div class="mt-6 p-4 bg-gray-50 bg-base-100 rounded-lg">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-semibold text-base-content/80">Schema</h3>
                <.button type="button" phx-click="introspect" class="btn-ghost btn-xs">
                  Introspect Schema
                </.button>
              </div>
              <%= if @selected && @selected.introspected_schema do %>
                <div class="text-sm text-base-content/70 space-y-1">
                  <p><%= schema_query_count(@selected) %> queries available</p>
                  <p><%= schema_mutation_count(@selected) %> mutations available</p>
                </div>
              <% else %>
                <p class="text-sm text-base-content/60">
                  No schema loaded. Click "Introspect Schema" to discover available queries and mutations.
                </p>
              <% end %>
            </div>
          </div>
        </div>
      </.main_content>
    </div>
    """
  end
end
