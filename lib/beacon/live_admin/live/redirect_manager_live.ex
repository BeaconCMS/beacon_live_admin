defmodule Beacon.LiveAdmin.RedirectManagerLive do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Client.Content

  @impl true
  def menu_link("/redirects", action) when action in [:index, :edit], do: {:root, "Redirects"}
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(params, _url, socket) do
    site = socket.assigns.beacon_page.site
    search = Map.get(params, "search")
    redirects = Content.list_redirects(site, search: search)

    {:noreply,
     socket
     |> assign(:redirects, redirects)
     |> assign(:search, search || "")
     |> assign(:show_form, false)
     |> assign(:editing, nil)
     |> assign(:form_data, %{"source_path" => "", "destination_path" => "", "status_code" => "301"})
     |> assign(page_title: "Redirects")}
  end

  @impl true
  def handle_event("search", %{"search" => search}, socket) do
    site = socket.assigns.beacon_page.site
    redirects = Content.list_redirects(site, search: search)
    {:noreply, assign(socket, redirects: redirects, search: search)}
  end

  def handle_event("new", _, socket) do
    {:noreply, assign(socket, show_form: true, editing: nil, form_data: %{"source_path" => "", "destination_path" => "", "status_code" => "301"})}
  end

  def handle_event("cancel", _, socket) do
    {:noreply, assign(socket, show_form: false, editing: nil)}
  end

  def handle_event("edit", %{"id" => id}, socket) do
    site = socket.assigns.beacon_page.site
    redirect = Content.get_redirect(site, id)

    {:noreply,
     assign(socket,
       show_form: true,
       editing: redirect,
       form_data: %{
         "source_path" => redirect.source_path,
         "destination_path" => redirect.destination_path,
         "status_code" => to_string(redirect.status_code)
       }
     )}
  end

  def handle_event("validate", %{"redirect" => params}, socket) do
    {:noreply, assign(socket, :form_data, params)}
  end

  def handle_event("save", %{"redirect" => params}, socket) do
    site = socket.assigns.beacon_page.site

    attrs = %{
      "site" => site,
      "source_path" => params["source_path"],
      "destination_path" => params["destination_path"],
      "status_code" => String.to_integer(params["status_code"])
    }

    result =
      case socket.assigns.editing do
        nil -> Content.create_redirect(site, attrs)
        redirect -> Content.update_redirect(site, redirect, attrs)
      end

    case result do
      {:ok, _} ->
        redirects = Content.list_redirects(site)
        {:noreply,
         socket
         |> assign(redirects: redirects, show_form: false, editing: nil)
         |> put_flash(:info, "Redirect saved")}

      {:error, _} ->
        {:noreply, put_flash(socket, :error, "Failed to save redirect")}
    end
  end

  def handle_event("delete", %{"id" => id}, socket) do
    site = socket.assigns.beacon_page.site
    redirect = Content.get_redirect(site, id)

    case Content.delete_redirect(site, redirect) do
      {:ok, _} ->
        redirects = Content.list_redirects(site)
        {:noreply, socket |> assign(redirects: redirects) |> put_flash(:info, "Redirect deleted")}

      {:error, _} ->
        {:noreply, put_flash(socket, :error, "Failed to delete redirect")}
    end
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="mx-auto max-w-6xl py-6 px-4">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Redirects</h1>
        <button phx-click="new" class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">
          New Redirect
        </button>
      </div>

      <div class="mb-4">
        <form phx-change="search" class="flex gap-2">
          <input type="text" name="search" value={@search} placeholder="Search paths..." class="flex-1 rounded-md border-gray-300 text-sm" phx-debounce="300" />
        </form>
      </div>

      <%= if @show_form do %>
        <div class="bg-white border rounded-lg p-6 mb-6">
          <h2 class="text-lg font-medium mb-4"><%= if @editing, do: "Edit Redirect", else: "New Redirect" %></h2>
          <form phx-submit="save" phx-change="validate" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Source Path</label>
                <input type="text" name="redirect[source_path]" value={@form_data["source_path"]} placeholder="/old-page" class="w-full rounded-md border-gray-300 text-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Destination Path</label>
                <input type="text" name="redirect[destination_path]" value={@form_data["destination_path"]} placeholder="/new-page" class="w-full rounded-md border-gray-300 text-sm" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status Code</label>
              <select name="redirect[status_code]" class="rounded-md border-gray-300 text-sm">
                <option value="301" selected={@form_data["status_code"] == "301"}>301 — Permanent</option>
                <option value="302" selected={@form_data["status_code"] == "302"}>302 — Temporary</option>
                <option value="307" selected={@form_data["status_code"] == "307"}>307 — Temporary (preserve method)</option>
                <option value="308" selected={@form_data["status_code"] == "308"}>308 — Permanent (preserve method)</option>
              </select>
            </div>
            <div class="flex gap-2 pt-2">
              <button type="submit" class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700">Save</button>
              <button type="button" phx-click="cancel" class="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200">Cancel</button>
            </div>
          </form>
        </div>
      <% end %>

      <div class="bg-white rounded-lg border overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destination</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hits</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <%= for redirect <- @redirects do %>
              <tr>
                <td class="px-4 py-3 text-sm font-mono text-gray-600"><%= redirect.source_path %></td>
                <td class="px-4 py-3 text-sm font-mono text-gray-600"><%= redirect.destination_path %></td>
                <td class="px-4 py-3 text-sm"><%= redirect.status_code %></td>
                <td class="px-4 py-3 text-sm text-gray-500"><%= redirect.hit_count %></td>
                <td class="px-4 py-3 text-right space-x-2">
                  <button phx-click="edit" phx-value-id={redirect.id} class="text-indigo-600 hover:text-indigo-900 text-sm">Edit</button>
                  <button phx-click="delete" phx-value-id={redirect.id} data-confirm="Delete this redirect?" class="text-red-600 hover:text-red-900 text-sm">Delete</button>
                </td>
              </tr>
            <% end %>
            <%= if @redirects == [] do %>
              <tr>
                <td colspan="5" class="px-4 py-8 text-center text-sm text-gray-500">No redirects configured</td>
              </tr>
            <% end %>
          </tbody>
        </table>
      </div>
    </div>
    """
  end
end
