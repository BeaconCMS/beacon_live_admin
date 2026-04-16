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
     |> assign(:confirm_delete, nil)
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
    {:noreply, assign(socket, show_form: false, editing: nil, confirm_delete: nil)}
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

  def handle_event("confirm_delete", %{"id" => id}, socket) do
    {:noreply, assign(socket, :confirm_delete, id)}
  end

  def handle_event("delete", %{"id" => id}, socket) do
    site = socket.assigns.beacon_page.site
    redirect = Content.get_redirect(site, id)

    case Content.delete_redirect(site, redirect) do
      {:ok, _} ->
        redirects = Content.list_redirects(site)
        {:noreply, socket |> assign(redirects: redirects, confirm_delete: nil) |> put_flash(:info, "Redirect deleted")}

      {:error, _} ->
        {:noreply, put_flash(socket, :error, "Failed to delete redirect")}
    end
  end

  defp status_badge_class(code) when code in [301, 308], do: "bg-indigo-50 text-indigo-700 ring-indigo-200"
  defp status_badge_class(_code), do: "bg-amber-50 text-amber-700 ring-amber-200"

  defp status_label(301), do: "301 Permanent"
  defp status_label(302), do: "302 Temporary"
  defp status_label(307), do: "307 Temporary"
  defp status_label(308), do: "308 Permanent"
  defp status_label(code), do: "#{code}"

  @impl true
  def render(assigns) do
    ~H"""
    <.header>
      Redirects
      <:actions>
        <.button phx-click="new" class="btn-primary">Create New Redirect</.button>
      </:actions>
    </.header>

    <div class="mb-4 -mt-2">
      <.form for={%{}} phx-change="search">
        <input
          type="search"
          name="search"
          value={@search}
          placeholder="Search by path..."
          phx-debounce="300"
          class="w-full sm:w-80 rounded-lg border-base-300 bg-base-200 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </.form>
    </div>

    <.main_content :if={@show_form} class="mb-6">
      <div class="px-2 py-4">
        <h2 class="text-base font-semibold text-base-content mb-4">
          <%= if @editing, do: "Edit Redirect", else: "New Redirect" %>
        </h2>
        <.form for={%{}} phx-submit="save" phx-change="validate" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-base-content/80 mb-1.5">Source Path</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/40">
                  <.icon name="hero-arrow-right-start-on-rectangle" class="w-4 h-4" />
                </span>
                <input
                  type="text"
                  name="redirect[source_path]"
                  value={@form_data["source_path"]}
                  placeholder="/old-page"
                  class="w-full pl-9 rounded-lg border-base-300 bg-base-200 text-sm font-mono shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-base-content/80 mb-1.5">Destination Path</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/40">
                  <.icon name="hero-arrow-right-end-on-rectangle" class="w-4 h-4" />
                </span>
                <input
                  type="text"
                  name="redirect[destination_path]"
                  value={@form_data["destination_path"]}
                  placeholder="/new-page"
                  class="w-full pl-9 rounded-lg border-base-300 bg-base-200 text-sm font-mono shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
          <div class="w-48">
            <label class="block text-sm font-medium text-base-content/80 mb-1.5">Status Code</label>
            <select name="redirect[status_code]" class="w-full rounded-lg border-base-300 bg-base-200 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option value="301" selected={@form_data["status_code"] == "301"}>301 — Permanent</option>
              <option value="302" selected={@form_data["status_code"] == "302"}>302 — Temporary</option>
              <option value="307" selected={@form_data["status_code"] == "307"}>307 — Temporary (preserve method)</option>
              <option value="308" selected={@form_data["status_code"] == "308"}>308 — Permanent (preserve method)</option>
            </select>
          </div>
          <div class="flex items-center gap-3 pt-2">
            <.button type="submit" class="btn-primary">Save</.button>
            <.button type="button" phx-click="cancel" class="btn-ghost">Cancel</.button>
          </div>
        </.form>
      </div>
    </.main_content>

    <.main_content>
      <.table id="redirects" rows={@redirects} row_id={&"redirect-#{&1.id}"}>
        <:col :let={redirect} label="Source">
          <span class="font-mono text-base-content/70"><%= redirect.source_path %></span>
        </:col>
        <:col :let={redirect} label="Destination">
          <div class="flex items-center gap-1.5">
            <.icon name="hero-arrow-long-right" class="w-4 h-4 text-zinc-300  flex-shrink-0" />
            <span class="font-mono text-base-content/70"><%= redirect.destination_path %></span>
          </div>
        </:col>
        <:col :let={redirect} label="Status">
          <span class={"inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ring-1 #{status_badge_class(redirect.status_code)}"}>
            <%= status_label(redirect.status_code) %>
          </span>
        </:col>
        <:col :let={redirect} label="Hits">
          <span class="text-base-content/40 tabular-nums"><%= redirect.hit_count %></span>
        </:col>
        <:action :let={redirect}>
          <div class="flex items-center gap-1">
            <button phx-click="edit" phx-value-id={redirect.id} title="Edit" class="p-2 rounded-md hover:bg-zinc-100 transition-colors">
              <.icon name="hero-pencil-square" class="w-4 h-4 text-zinc-400 hover:text-zinc-600" />
            </button>
            <%= if @confirm_delete == redirect.id do %>
              <span class="text-xs text-base-content/60">Delete?</span>
              <button phx-click="delete" phx-value-id={redirect.id} class="p-1 text-rose-600 hover:text-rose-800 text-xs font-semibold">Yes</button>
              <button phx-click="cancel" class="p-1 text-zinc-500 hover:text-zinc-700 text-xs">No</button>
            <% else %>
              <button phx-click="confirm_delete" phx-value-id={redirect.id} title="Delete" class="p-2 rounded-md hover:bg-rose-50 transition-colors">
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
