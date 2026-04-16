defmodule Beacon.LiveAdmin.BeaconAdmin.GroupTemplatesLive do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Auth
  alias Beacon.LiveAdmin.Auth.FeatureRegistry

  @impl true
  def menu_link("/beacon", :index), do: {:submenu, "Group Templates"}
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(_params, _url, socket) do
    templates = Auth.list_groups(templates_only: true)

    {:noreply,
     socket
     |> assign(:templates, templates)
     |> assign(:features, FeatureRegistry.features())
     |> assign(:show_form, false)
     |> assign(:editing, nil)
     |> assign(:form_data, default_form())
     |> assign(:managing_permissions, nil)
     |> assign(:group_permissions, [])
     |> assign(:confirm_delete, nil)
     |> assign(page_title: "Group Templates")}
  end

  defp default_form do
    %{"name" => "", "description" => ""}
  end

  @impl true
  def handle_event("new", _, socket) do
    {:noreply, assign(socket, show_form: true, editing: nil, form_data: default_form())}
  end

  def handle_event("cancel", _, socket) do
    {:noreply, assign(socket, show_form: false, editing: nil, managing_permissions: nil, confirm_delete: nil)}
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
    attrs = %{
      name: params["name"],
      description: params["description"],
      site: nil,
      is_template: true
    }

    result =
      case socket.assigns.editing do
        nil -> Auth.create_group(attrs)
        group -> Auth.update_group(group, attrs)
      end

    case result do
      {:ok, _} ->
        templates = Auth.list_groups(templates_only: true)

        {:noreply,
         socket
         |> assign(templates: templates, show_form: false, editing: nil)
         |> put_flash(:info, "Group template saved")}

      {:error, _} ->
        {:noreply, put_flash(socket, :error, "Failed to save group template")}
    end
  end

  def handle_event("manage_permissions", %{"id" => id}, socket) do
    permissions = Auth.list_group_permissions(id)

    {:noreply,
     assign(socket,
       managing_permissions: id,
       group_permissions: permissions
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

  def handle_event("confirm_delete", %{"id" => id}, socket) do
    {:noreply, assign(socket, :confirm_delete, id)}
  end

  def handle_event("delete", %{"id" => id}, socket) do
    group = Auth.get_group(id)

    case Auth.delete_group(group) do
      {:ok, _} ->
        templates = Auth.list_groups(templates_only: true)

        {:noreply,
         socket
         |> assign(templates: templates, confirm_delete: nil)
         |> put_flash(:info, "Group template deleted")}

      {:error, _} ->
        {:noreply, put_flash(socket, :error, "Failed to delete group template")}
    end
  end

  defp has_permission?(permissions, feature, sub_feature) do
    Enum.any?(permissions, fn p ->
      p.feature == feature && p.sub_feature == sub_feature
    end)
  end

  defp permission_count(group) do
    try do
      length(Auth.list_group_permissions(group.id))
    rescue
      _ -> 0
    end
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.header>
      Group Templates
      <:actions>
        <.button phx-click="new" class="btn-primary">Create New Template</.button>
      </:actions>
    </.header>

    <p class="text-sm text-base-content/60 -mt-4 mb-4">
      Default permission groups that are copied into new sites. Changes here do not affect existing sites.
    </p>

    <%!-- Create/Edit Form --%>
    <.main_content :if={@show_form} class="mb-6">
      <div class="px-2 py-4">
        <h2 class="text-base font-semibold text-base-content mb-4">
          <%= if @editing, do: "Edit Template", else: "New Template" %>
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
                placeholder="What this group template is for"
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
          <h2 class="text-base font-semibold text-base-content">Template Permissions</h2>
          <button phx-click="cancel" class="text-sm text-zinc-500 hover:text-zinc-700  transition-colors">
            <.icon name="hero-x-mark" class="w-5 h-5" />
          </button>
        </div>
        <p class="text-sm text-base-content/60 mb-6">Configure which permissions this template grants. Changes save automatically.</p>
        <div class="overflow-x-auto -mx-2">
          <table class="w-full text-sm">
            <tbody class="divide-y divide-zinc-100">
              <%= for feature <- @features do %>
                <tr>
                  <td class="py-3.5 pr-6 font-medium text-base-content whitespace-nowrap w-48 pl-2">
                    <%= feature.label %>
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

    <%!-- Templates Table --%>
    <.main_content>
      <.table id="group-templates" rows={@templates} row_id={&"template-#{&1.id}"}>
        <:col :let={template} label="Name">
          <span class="font-semibold"><%= template.name %></span>
        </:col>
        <:col :let={template} label="Description">
          <span class="text-base-content/60"><%= template.description || "—" %></span>
        </:col>
        <:col :let={template} label="Permissions">
          <span class="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-100 bg-base-200 text-zinc-600 ">
            <.icon name="hero-key-mini" class="w-3.5 h-3.5" />
            <%= permission_count(template) %>
          </span>
        </:col>
        <:action :let={template}>
          <div class="flex items-center gap-1">
            <button phx-click="edit" phx-value-id={template.id} title="Edit template" class="p-2 rounded-md hover:bg-zinc-100 transition-colors">
              <.icon name="hero-pencil-square" class="w-4 h-4 text-zinc-400 hover:text-zinc-600" />
            </button>
            <button phx-click="manage_permissions" phx-value-id={template.id} title="Manage permissions" class="p-2 rounded-md hover:bg-zinc-100 transition-colors">
              <.icon name="hero-key" class="w-4 h-4 text-zinc-400 hover:text-zinc-600" />
            </button>
            <%= if @confirm_delete == template.id do %>
              <span class="text-xs text-base-content/60 ml-1">Delete?</span>
              <button phx-click="delete" phx-value-id={template.id} class="p-1 text-rose-600 hover:text-rose-800 text-xs font-semibold">Yes</button>
              <button phx-click="cancel" class="p-1 text-zinc-500 hover:text-zinc-700 text-xs">No</button>
            <% else %>
              <button phx-click="confirm_delete" phx-value-id={template.id} title="Delete template" class="p-2 rounded-md hover:bg-rose-50 transition-colors">
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
