defmodule Beacon.LiveAdmin.BeaconAdmin.UsersLive do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Client.Auth

  @impl true
  def menu_link("/beacon", :index), do: {:submenu, "Users"}
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(_params, _url, socket) do
    site = socket.assigns.beacon_page.site
    users = Auth.list_users(site)
    owner = Auth.get_owner(site)
    current_user = socket.assigns[:beacon_admin_user]
    current_is_owner = current_user && owner && current_user.id == owner.id

    {:noreply,
     socket
     |> assign(:users, users)
     |> assign(:owner, owner)
     |> assign(:current_is_owner, current_is_owner)
     |> assign(:show_form, false)
     |> assign(:editing, nil)
     |> assign(:form_data, default_form())
     |> assign(:confirm_delete, nil)
     |> assign(:confirm_transfer, nil)
     |> assign(page_title: "Users")}
  end

  defp default_form do
    %{"email" => "", "name" => ""}
  end

  @impl true
  def handle_event("new", _, socket) do
    {:noreply, assign(socket, show_form: true, editing: nil, form_data: default_form())}
  end

  def handle_event("cancel", _, socket) do
    {:noreply, assign(socket, show_form: false, editing: nil, confirm_delete: nil, confirm_transfer: nil)}
  end

  def handle_event("edit", %{"id" => id}, socket) do
    site = socket.assigns.beacon_page.site
    user = Auth.get_user(site, id)

    {:noreply,
     assign(socket,
       show_form: true,
       editing: user,
       form_data: %{
         "email" => user.email || "",
         "name" => user.name || ""
       }
     )}
  end

  def handle_event("validate", %{"user" => params}, socket) do
    {:noreply, assign(socket, :form_data, params)}
  end

  def handle_event("save", %{"user" => params}, socket) do
    site = socket.assigns.beacon_page.site

    attrs = Map.take(params, ["email", "name"])

    result =
      case socket.assigns.editing do
        nil -> Auth.create_user(site, attrs)
        user -> Auth.update_user(site, user, Map.take(attrs, ["name"]))
      end

    case result do
      {:ok, _} ->
        users = Auth.list_users(site)

        {:noreply,
         socket
         |> assign(users: users, show_form: false, editing: nil)
         |> put_flash(:info, "User saved")}

      {:error, changeset} ->
        message = format_errors(changeset)
        {:noreply, put_flash(socket, :error, "Failed to save user: #{message}")}
    end
  end

  def handle_event("confirm_delete", %{"id" => id}, socket) do
    {:noreply, assign(socket, :confirm_delete, id)}
  end

  def handle_event("delete", %{"id" => id}, socket) do
    site = socket.assigns.beacon_page.site
    user = Auth.get_user(site, id)

    case Auth.delete_user(site, user) do
      {:ok, _} ->
        users = Auth.list_users(site)

        {:noreply,
         socket
         |> assign(users: users, confirm_delete: nil)
         |> put_flash(:info, "User deleted")}

      {:error, _} ->
        {:noreply, put_flash(socket, :error, "Failed to delete user")}
    end
  end

  def handle_event("confirm_transfer", %{"id" => id}, socket) do
    {:noreply, assign(socket, :confirm_transfer, id)}
  end

  def handle_event("transfer_ownership", %{"id" => id}, socket) do
    site = socket.assigns.beacon_page.site
    new_owner = Auth.get_user(site, id)

    case Auth.transfer_ownership(site, new_owner) do
      {:ok, _} ->
        owner = Auth.get_owner(site)
        current_user = socket.assigns[:beacon_admin_user]
        current_is_owner = current_user && owner && current_user.id == owner.id

        {:noreply,
         socket
         |> assign(owner: owner, current_is_owner: current_is_owner, confirm_transfer: nil)
         |> put_flash(:info, "Ownership transferred to #{new_owner.email}")}

      {:error, _} ->
        {:noreply, put_flash(socket, :error, "Failed to transfer ownership")}
    end
  end

  defp format_errors(%Ecto.Changeset{} = changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {msg, opts} ->
      Regex.replace(~r"%{(\w+)}", msg, fn _, key ->
        opts |> Keyword.get(String.to_existing_atom(key), key) |> to_string()
      end)
    end)
    |> Enum.map_join(", ", fn {field, errors} -> "#{field}: #{Enum.join(errors, ", ")}" end)
  end

  defp format_errors(_), do: "unknown error"

  defp format_last_login(nil), do: "Never"

  defp format_last_login(datetime) do
    Calendar.strftime(datetime, "%Y-%m-%d %H:%M")
  end

  defp is_owner?(user, owner) do
    owner && user.id == owner.id
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.header>
      Users
      <:actions>
        <.button phx-click="new" class="btn-primary">Create New User</.button>
      </:actions>
    </.header>

    <%!-- Create/Edit Form --%>
    <.main_content :if={@show_form} class="mb-6">
      <div class="px-2 py-4">
        <h2 class="text-base font-semibold text-base-content mb-4">
          <%= if @editing, do: "Edit User", else: "New User" %>
        </h2>
        <.form for={%{}} phx-submit="save" phx-change="validate" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-base-content/80 mb-1.5">Email</label>
              <input
                type="email"
                name="user[email]"
                value={@form_data["email"]}
                placeholder="user@example.com"
                class="w-full rounded-lg border-base-300 bg-base-200 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                disabled={@editing != nil}
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-base-content/80 mb-1.5">Name</label>
              <input
                type="text"
                name="user[name]"
                value={@form_data["name"]}
                placeholder="Jane Smith"
                class="w-full rounded-lg border-base-300 bg-base-200 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div class="flex items-center gap-3 pt-2">
            <.button type="submit" class="btn-primary">Save</.button>
            <.button type="button" phx-click="cancel" class="btn-ghost">Cancel</.button>
          </div>
        </.form>
      </div>
    </.main_content>

    <%!-- Users Table --%>
    <.main_content>
      <.table id="users" rows={@users} row_id={&"user-#{&1.id}"}>
        <:col :let={user} label="Email">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span class="text-xs font-bold text-primary uppercase"><%= String.first(user.email) %></span>
            </div>
            <span><%= user.email %></span>
          </div>
        </:col>
        <:col :let={user} label="Name">
          <span class="text-base-content/60"><%= user.name || "—" %></span>
        </:col>
        <:col :let={user} label="Role">
          <%= if is_owner?(user, @owner) do %>
            <span class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 ring-1 ring-accent/30">
              <.icon name="hero-shield-check-mini" class="w-3.5 h-3.5" />
              Owner
            </span>
          <% end %>
        </:col>
        <:col :let={user} label="Last Login">
          <span class="text-base-content/40 text-xs"><%= format_last_login(user.last_login_at) %></span>
        </:col>
        <:action :let={user}>
          <div class="flex items-center gap-1">
            <button phx-click="edit" phx-value-id={user.id} title="Edit user" class="p-2 rounded-md hover:bg-zinc-100 transition-colors">
              <.icon name="hero-pencil-square" class="w-4 h-4 text-zinc-400 hover:text-zinc-600" />
            </button>
            <%= if @current_is_owner && !is_owner?(user, @owner) do %>
              <%= if @confirm_transfer == user.id do %>
                <span class="text-xs text-base-content/60">Transfer?</span>
                <button phx-click="transfer_ownership" phx-value-id={user.id} class="p-1 text-purple-600 hover:text-purple-800 text-xs font-semibold">Yes</button>
                <button phx-click="cancel" class="p-1 text-zinc-500 hover:text-zinc-700 text-xs">No</button>
              <% else %>
                <button phx-click="confirm_transfer" phx-value-id={user.id} title="Transfer ownership" class="p-2 rounded-md hover:bg-purple-50 transition-colors">
                  <.icon name="hero-arrow-right-circle" class="w-4 h-4 text-zinc-400 hover:text-purple-500" />
                </button>
              <% end %>
            <% end %>
            <%= if @confirm_delete == user.id do %>
              <span class="text-xs text-base-content/60">Delete?</span>
              <button phx-click="delete" phx-value-id={user.id} class="p-1 text-rose-600 hover:text-rose-800 text-xs font-semibold">Yes</button>
              <button phx-click="cancel" class="p-1 text-zinc-500 hover:text-zinc-700 text-xs">No</button>
            <% else %>
              <button phx-click="confirm_delete" phx-value-id={user.id} title="Delete user" class="p-2 rounded-md hover:bg-rose-50 transition-colors">
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
