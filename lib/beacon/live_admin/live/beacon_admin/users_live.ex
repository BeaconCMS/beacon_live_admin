defmodule Beacon.LiveAdmin.BeaconAdmin.UsersLive do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Client.Auth
  alias Beacon.LiveAdmin.Cluster

  @roles ["super_admin", "site_admin", "site_editor", "site_viewer"]

  @impl true
  def menu_link("/beacon", :index), do: {:submenu, "Users"}
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(_params, _url, socket) do
    site = socket.assigns.beacon_page.site
    users = Auth.list_users(site)
    sites = Cluster.running_sites()

    {:noreply,
     socket
     |> assign(:users, users)
     |> assign(:available_sites, sites)
     |> assign(:available_roles, @roles)
     |> assign(:show_form, false)
     |> assign(:editing, nil)
     |> assign(:show_role_form, nil)
     |> assign(:role_form_data, %{"role" => "site_editor", "site" => ""})
     |> assign(:form_data, default_form())
     |> assign(:confirm_delete, nil)
     |> assign(page_title: "Users")}
  end

  defp default_form do
    %{
      "email" => "",
      "name" => ""
    }
  end

  @impl true
  def handle_event("new", _, socket) do
    {:noreply, assign(socket, show_form: true, editing: nil, form_data: default_form())}
  end

  def handle_event("cancel", _, socket) do
    {:noreply, assign(socket, show_form: false, editing: nil, show_role_form: nil, confirm_delete: nil)}
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

  def handle_event("show_role_form", %{"id" => id}, socket) do
    {:noreply, assign(socket, show_role_form: id, role_form_data: %{"role" => "site_editor", "site" => ""})}
  end

  def handle_event("validate_role", %{"role_assignment" => params}, socket) do
    {:noreply, assign(socket, :role_form_data, params)}
  end

  def handle_event("assign_role", %{"role_assignment" => params}, socket) do
    site = socket.assigns.beacon_page.site
    user_id = socket.assigns.show_role_form
    user = Auth.get_user(site, user_id)

    role = params["role"]

    role_site =
      if role == "super_admin" do
        nil
      else
        case params["site"] do
          "" -> nil
          s -> String.to_existing_atom(s)
        end
      end

    case Auth.assign_role(site, user, role, role_site) do
      {:ok, _} ->
        users = Auth.list_users(site)

        {:noreply,
         socket
         |> assign(users: users, show_role_form: nil)
         |> put_flash(:info, "Role assigned")}

      {:error, _} ->
        {:noreply, put_flash(socket, :error, "Failed to assign role")}
    end
  end

  def handle_event("revoke_role", %{"user-id" => user_id, "role" => role, "site" => role_site_str}, socket) do
    site = socket.assigns.beacon_page.site
    user = Auth.get_user(site, user_id)

    role_site =
      case role_site_str do
        "" -> nil
        s -> String.to_existing_atom(s)
      end

    case Auth.revoke_role(site, user, role, role_site) do
      {:ok, _} ->
        users = Auth.list_users(site)

        {:noreply,
         socket
         |> assign(users: users)
         |> put_flash(:info, "Role revoked")}

      {:error, _} ->
        {:noreply, put_flash(socket, :error, "Failed to revoke role")}
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

  defp format_roles(user) do
    try do
      roles = Beacon.LiveAdmin.Auth.list_roles(user)

      Enum.map_join(roles, ", ", fn role ->
        if role.site do
          "#{role.role} (#{role.site})"
        else
          role.role
        end
      end)
    rescue
      _ -> ""
    end
  end

  defp format_last_login(nil), do: "Never"

  defp format_last_login(datetime) do
    Calendar.strftime(datetime, "%Y-%m-%d %H:%M")
  end

  @impl true
  def render(assigns) do

    ~H"""
    <div class="mx-auto max-w-6xl py-6 px-4">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Users</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage users and their roles across all sites</p>
        </div>
        <button phx-click="new" class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">
          New User
        </button>
      </div>

      <%= if @show_form do %>
        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            <%= if @editing, do: "Edit User", else: "New User" %>
          </h2>
          <form phx-submit="save" phx-change="validate" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  name="user[email]"
                  value={@form_data["email"]}
                  placeholder="user@example.com"
                  class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm"
                  disabled={@editing != nil}
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  name="user[name]"
                  value={@form_data["name"]}
                  placeholder="Jane Smith"
                  class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm"
                />
              </div>
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
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Roles</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Last Login</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <%= for user <- @users do %>
              <tr>
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"><%= user.email %></td>
                <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400"><%= user.name || "-" %></td>
                <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400"><%= format_roles(user) %></td>
                <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400"><%= format_last_login(user.last_login_at) %></td>
                <td class="px-4 py-3 text-right space-x-2">
                  <button phx-click="edit" phx-value-id={user.id} class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 text-sm">Edit</button>
                  <button phx-click="show_role_form" phx-value-id={user.id} class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 text-sm">Roles</button>
                  <%= if @confirm_delete == user.id do %>
                    <span class="text-sm text-gray-500 dark:text-gray-400">Confirm?</span>
                    <button phx-click="delete" phx-value-id={user.id} class="text-red-600 hover:text-red-900 text-sm font-medium">Yes</button>
                    <button phx-click="cancel" class="text-gray-600 hover:text-gray-900 text-sm">No</button>
                  <% else %>
                    <button phx-click="confirm_delete" phx-value-id={user.id} class="text-red-600 hover:text-red-900 text-sm">Delete</button>
                  <% end %>
                </td>
              </tr>

              <%= if @show_role_form == user.id do %>
                <tr>
                  <td colspan="5" class="px-4 py-4 bg-gray-50 dark:bg-gray-900">
                    <div class="mb-3">
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Current roles:</span>
                      <span class="text-sm text-gray-500 dark:text-gray-400 ml-1"><%= format_roles(user) || "None" %></span>
                    </div>
                    <form phx-submit="assign_role" phx-change="validate_role" class="flex items-end gap-3">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                        <select name="role_assignment[role]" class="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm">
                          <%= for role <- @available_roles do %>
                            <option value={role} selected={@role_form_data["role"] == role}><%= role %></option>
                          <% end %>
                        </select>
                      </div>
                      <%= if @role_form_data["role"] != "super_admin" do %>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Site</label>
                          <select name="role_assignment[site]" class="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm">
                            <option value="">All sites</option>
                            <%= for s <- @available_sites do %>
                              <option value={s} selected={@role_form_data["site"] == to_string(s)}><%= s %></option>
                            <% end %>
                          </select>
                        </div>
                      <% end %>
                      <button type="submit" class="px-3 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700">Assign</button>
                      <button type="button" phx-click="cancel" class="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">Close</button>
                    </form>
                  </td>
                </tr>
              <% end %>
            <% end %>
            <%= if @users == [] do %>
              <tr>
                <td colspan="5" class="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No users created yet</td>
              </tr>
            <% end %>
          </tbody>
        </table>
      </div>
    </div>
    """
  end
end
