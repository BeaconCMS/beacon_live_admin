defmodule Beacon.LiveAdmin.GroupsLive do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Auth
  alias Beacon.LiveAdmin.Auth.FeatureRegistry

  @impl true
  def menu_link(_, :index), do: {:root, "Groups"}
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(_params, _url, socket) do
    site = socket.assigns.beacon_page.site
    groups = Auth.list_groups(site: site)
    all_users = Auth.list_users()

    {:noreply,
     socket
     |> assign(:groups, groups)
     |> assign(:all_users, all_users)
     |> assign(:features, FeatureRegistry.features())
     |> assign(:show_form, false)
     |> assign(:editing, nil)
     |> assign(:form_data, default_form())
     |> assign(:managing_permissions, nil)
     |> assign(:managing_members, nil)
     |> assign(:group_permissions, [])
     |> assign(:group_members, [])
     |> assign(:confirm_delete, nil)
     |> assign(page_title: "Groups")}
  end

  defp default_form do
    %{"name" => "", "description" => ""}
  end

  @impl true
  def handle_event("new", _, socket) do
    {:noreply, assign(socket, show_form: true, editing: nil, form_data: default_form())}
  end

  def handle_event("cancel", _, socket) do
    {:noreply,
     assign(socket,
       show_form: false,
       editing: nil,
       managing_permissions: nil,
       managing_members: nil,
       confirm_delete: nil
     )}
  end

  def handle_event("edit", %{"id" => id}, socket) do
    group = Auth.get_group(id)

    {:noreply,
     assign(socket,
       show_form: true,
       editing: group,
       form_data: %{
         "name" => group.name || "",
         "description" => group.description || ""
       }
     )}
  end

  def handle_event("validate", %{"group" => params}, socket) do
    {:noreply, assign(socket, :form_data, params)}
  end

  def handle_event("save", %{"group" => params}, socket) do
    site = socket.assigns.beacon_page.site

    attrs = %{
      name: params["name"],
      description: params["description"],
      site: site,
      is_template: false
    }

    result =
      case socket.assigns.editing do
        nil -> Auth.create_group(attrs)
        group -> Auth.update_group(group, attrs)
      end

    case result do
      {:ok, _} ->
        groups = Auth.list_groups(site: site)

        {:noreply,
         socket
         |> assign(groups: groups, show_form: false, editing: nil)
         |> put_flash(:info, "Group saved")}

      {:error, _} ->
        {:noreply, put_flash(socket, :error, "Failed to save group")}
    end
  end

  def handle_event("manage_permissions", %{"id" => id}, socket) do
    permissions = Auth.list_group_permissions(id)

    {:noreply,
     assign(socket,
       managing_permissions: id,
       group_permissions: permissions,
       managing_members: nil
     )}
  end

  def handle_event("toggle_permission", %{"feature" => feature, "sub-feature" => sub_feature}, socket) do
    group_id = socket.assigns.managing_permissions
    group = Auth.get_group(group_id)
    permissions = socket.assigns.group_permissions

    existing =
      Enum.find(permissions, fn p ->
        p.feature == feature && p.sub_feature == sub_feature && p.scope_type == "all"
      end)

    if existing do
      Auth.remove_group_permission(existing.id)
    else
      Auth.add_group_permission(group, %{
        feature: feature,
        sub_feature: sub_feature,
        scope_type: "all",
        scope_id: nil
      })
    end

    permissions = Auth.list_group_permissions(group_id)
    {:noreply, assign(socket, :group_permissions, permissions)}
  end

  def handle_event("manage_members", %{"id" => id}, socket) do
    members = Auth.list_group_members(id)

    {:noreply,
     assign(socket,
       managing_members: id,
       group_members: members,
       managing_permissions: nil
     )}
  end

  def handle_event("add_member", %{"user-id" => user_id}, socket) do
    group_id = socket.assigns.managing_members

    case Auth.add_user_to_group(user_id, group_id) do
      {:ok, _} ->
        members = Auth.list_group_members(group_id)
        {:noreply, socket |> assign(:group_members, members) |> put_flash(:info, "Member added")}

      {:error, _} ->
        {:noreply, put_flash(socket, :error, "Failed to add member")}
    end
  end

  def handle_event("remove_member", %{"user-id" => user_id}, socket) do
    group_id = socket.assigns.managing_members
    Auth.remove_user_from_group(user_id, group_id)
    members = Auth.list_group_members(group_id)
    {:noreply, socket |> assign(:group_members, members) |> put_flash(:info, "Member removed")}
  end

  def handle_event("confirm_delete", %{"id" => id}, socket) do
    {:noreply, assign(socket, :confirm_delete, id)}
  end

  def handle_event("delete", %{"id" => id}, socket) do
    site = socket.assigns.beacon_page.site
    group = Auth.get_group(id)

    case Auth.delete_group(group) do
      {:ok, _} ->
        groups = Auth.list_groups(site: site)

        {:noreply,
         socket
         |> assign(groups: groups, confirm_delete: nil)
         |> put_flash(:info, "Group deleted")}

      {:error, _} ->
        {:noreply, put_flash(socket, :error, "Failed to delete group")}
    end
  end

  defp has_permission?(permissions, feature, sub_feature) do
    Enum.any?(permissions, fn p ->
      p.feature == feature && p.sub_feature == sub_feature
    end)
  end

  defp member?(members, user) do
    Enum.any?(members, &(&1.id == user.id))
  end

  defp member_count(group) do
    try do
      length(Auth.list_group_members(group.id))
    rescue
      _ -> 0
    end
  end

  defp permission_summary(group) do
    try do
      perms = Auth.list_group_permissions(group.id)
      feature_count = perms |> Enum.map(& &1.feature) |> Enum.uniq() |> length()
      "#{length(perms)} permissions across #{feature_count} features"
    rescue
      _ -> "—"
    end
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.header>
      Groups
      <:actions>
        <.button phx-click="new" class="btn-primary">Create New Group</.button>
      </:actions>
    </.header>

    <%!-- Create/Edit Form --%>
    <.main_content :if={@show_form} class="mb-6">
      <div class="px-2 py-4">
        <h2 class="text-base font-semibold text-base-content mb-4">
          <%= if @editing, do: "Edit Group", else: "New Group" %>
        </h2>
        <.form for={%{}} phx-submit="save" phx-change="validate" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-base-content/80 mb-1.5">Name</label>
              <input
                type="text"
                name="group[name]"
                value={@form_data["name"]}
                placeholder="e.g. Marketing, Engineering"
                class="w-full rounded-lg border-base-300 bg-base-200 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-base-content/80 mb-1.5">Description</label>
              <input
                type="text"
                name="group[description]"
                value={@form_data["description"]}
                placeholder="What this group is for"
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

    <%!-- Permission Matrix --%>
    <.main_content :if={@managing_permissions} class="mb-6">
      <div class="px-2 py-4">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-base font-semibold text-base-content">Permission Matrix</h2>
          <button phx-click="cancel" class="text-sm text-zinc-500 hover:text-zinc-700  transition-colors">
            <.icon name="hero-x-mark" class="w-5 h-5" />
          </button>
        </div>
        <p class="text-sm text-base-content/60 mb-6">Toggle permissions for each feature. Changes save automatically.</p>
        <div class="overflow-x-auto -mx-2">
          <table class="w-full text-sm">
            <tbody class="divide-y divide-zinc-100">
              <%= for feature <- @features do %>
                <tr class="group">
                  <td class="py-3.5 pr-6 font-medium text-base-content whitespace-nowrap w-48 pl-2">
                    <div class="flex items-center gap-2">
                      <span><%= feature.label %></span>
                    </div>
                  </td>
                  <%= for sf <- feature.sub_features do %>
                    <td class="px-3 py-3.5 text-center">
                      <label class="flex flex-col items-center gap-1.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={has_permission?(@group_permissions, feature.key, sf.key)}
                          phx-click="toggle_permission"
                          phx-value-feature={feature.key}
                          phx-value-sub-feature={sf.key}
                          class="w-4 h-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 transition-colors"
                        />
                        <span class="text-[11px] text-base-content/40 font-medium uppercase tracking-wide"><%= sf.label %></span>
                      </label>
                    </td>
                  <% end %>
                </tr>
              <% end %>
            </tbody>
          </table>
        </div>
      </div>
    </.main_content>

    <%!-- Member Management --%>
    <.main_content :if={@managing_members} class="mb-6">
      <div class="px-2 py-4">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-base font-semibold text-base-content">Members</h2>
          <button phx-click="cancel" class="text-sm text-zinc-500 hover:text-zinc-700  transition-colors">
            <.icon name="hero-x-mark" class="w-5 h-5" />
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 class="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-3">Current Members</h3>
            <%= if @group_members == [] do %>
              <p class="text-sm text-base-content/40 italic">No members yet</p>
            <% else %>
              <div class="space-y-1">
                <%= for member <- @group_members do %>
                  <div class="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-zinc-50 transition-colors group/member">
                    <div class="flex items-center gap-2.5">
                      <div class="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span class="text-xs font-bold text-primary uppercase"><%= String.first(member.email) %></span>
                      </div>
                      <span class="text-sm text-base-content"><%= member.email %></span>
                    </div>
                    <button phx-click="remove_member" phx-value-user-id={member.id} class="opacity-0 group-hover/member:opacity-100 text-rose-500 hover:text-rose-700 text-xs font-medium transition-opacity">
                      Remove
                    </button>
                  </div>
                <% end %>
              </div>
            <% end %>
          </div>

          <div>
            <h3 class="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-3">Available Users</h3>
            <div class="space-y-1">
              <%= for user <- @all_users do %>
                <%= unless member?(@group_members, user) do %>
                  <div class="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-zinc-50 transition-colors">
                    <div class="flex items-center gap-2.5">
                      <div class="w-7 h-7 rounded-full bg-zinc-100 bg-base-200 flex items-center justify-center flex-shrink-0">
                        <span class="text-xs font-bold text-base-content/60 uppercase"><%= String.first(user.email) %></span>
                      </div>
                      <span class="text-sm text-base-content/70"><%= user.email %></span>
                    </div>
                    <button phx-click="add_member" phx-value-user-id={user.id} class="text-primary hover:text-indigo-800 text-xs font-medium transition-colors">
                      Add
                    </button>
                  </div>
                <% end %>
              <% end %>
            </div>
          </div>
        </div>
      </div>
    </.main_content>

    <%!-- Groups Table --%>
    <.main_content>
      <.table id="groups" rows={@groups} row_id={&"group-#{&1.id}"}>
        <:col :let={group} label="Name">
          <span class="font-semibold"><%= group.name %></span>
        </:col>
        <:col :let={group} label="Description">
          <span class="text-base-content/60"><%= group.description || "—" %></span>
        </:col>
        <:col :let={group} label="Members">
          <span class="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-100 bg-base-200 text-zinc-600 ">
            <.icon name="hero-users-mini" class="w-3.5 h-3.5" />
            <%= member_count(group) %>
          </span>
        </:col>
        <:col :let={group} label="Permissions">
          <span class="text-xs text-base-content/60"><%= permission_summary(group) %></span>
        </:col>
        <:action :let={group}>
          <div class="flex items-center gap-1">
            <button phx-click="edit" phx-value-id={group.id} title="Edit group" class="p-2 rounded-md hover:bg-zinc-100 transition-colors">
              <.icon name="hero-pencil-square" class="w-4 h-4 text-zinc-400 hover:text-zinc-600" />
            </button>
            <button phx-click="manage_permissions" phx-value-id={group.id} title="Manage permissions" class="p-2 rounded-md hover:bg-zinc-100 transition-colors">
              <.icon name="hero-key" class="w-4 h-4 text-zinc-400 hover:text-zinc-600" />
            </button>
            <button phx-click="manage_members" phx-value-id={group.id} title="Manage members" class="p-2 rounded-md hover:bg-zinc-100 transition-colors">
              <.icon name="hero-user-plus" class="w-4 h-4 text-zinc-400 hover:text-zinc-600" />
            </button>
            <%= if @confirm_delete == group.id do %>
              <span class="text-xs text-base-content/60 ml-1">Delete?</span>
              <button phx-click="delete" phx-value-id={group.id} class="p-1 text-rose-600 hover:text-rose-800 text-xs font-semibold">Yes</button>
              <button phx-click="cancel" class="p-1 text-zinc-500 hover:text-zinc-700 text-xs">No</button>
            <% else %>
              <button phx-click="confirm_delete" phx-value-id={group.id} title="Delete group" class="p-2 rounded-md hover:bg-rose-50 transition-colors">
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
