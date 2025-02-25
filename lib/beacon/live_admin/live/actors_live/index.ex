defmodule Beacon.LiveAdmin.ActorsLive.Index do
  @moduledoc false
  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Client.Auth

  def menu_link(_, :index), do: {:root, "Actors"}

  def handle_params(_params, _uri, socket) do
    %{beacon_page: %{site: site}} = socket.assigns

    actors = Auth.list_actors(site)
    ids = Enum.map(actors, &elem(&1, 0))

    actor_role_map =
      site
      |> Auth.get_actor_roles(ids)
      |> Map.new(&{&1.actor_id, &1})

    actors_final =
      actors
      |> Enum.sort_by(&elem(&1, 1))
      |> Enum.map(fn {id, label} ->
        actor_role = actor_role_map[id] || Auth.new_actor_role(site)
        %{id: id, label: label, role_id: actor_role.role_id, actor_role: actor_role}
      end)

    forms =
      Map.new(actors_final, fn actor ->
        form =
          site
          |> Auth.change_actor_role(actor.actor_role)
          |> to_form()

        {actor.id, form}
      end)

    socket =
      socket
      |> assign(page_title: "Actors")
      |> assign(unsaved_changes: false)
      |> assign(show_create_modal: false)
      |> assign(show_nav_modal: false)
      |> assign(show_delete_modal: false)
      |> assign(actors: actors_final)
      |> assign(roles: Auth.list_roles(site))
      |> assign(forms: forms)

    {:noreply, socket}
  end

  def handle_event("validate", params, socket) do
    %{beacon_page: %{site: site}} = socket.assigns
    actor_id = params["actor_id"]
    form = socket.assigns.forms[actor_id]

    updated_form =
      site
      |> Auth.change_actor_role(form.source.data, params)
      |> to_form()

    {:noreply, update(socket, :forms, &Map.put(&1, actor_id, updated_form))}
  end

  def handle_event("update_role", params, socket) do
    %{__beacon_actor__: updater, roles: roles, beacon_page: %{site: site}} = socket.assigns
    role = Enum.find(roles, &(&1.id == params["role_id"]))

    socket =
      case Auth.set_role_for_actor(site, params["actor_id"], role, actor: updater) do
        {:ok, _} -> put_flash(socket, :info, "Role updated successfully.")
        {:error, _} -> put_flash(socket, :error, "Role update unsuccessful.")
      end

    {:noreply, socket}
  end

  def render(assigns) do
    ~H"""
    <div>
      <.header>
        User Roles
      </.header>

      <div class="mt-6">
        <div :for={actor <- @actors} class="flex gap-x-8 py-2 even:bg-slate-50 odd:bg-slate-300">
          <div class="font-bold w-1/4 py-2 pl-2">
            <%= actor.label %>
          </div>
          <.form id={"actor-#{actor.id}-role-form"} for={@forms[actor.id]} phx-change="validate" phx-submit="update_role">
            <.input type="hidden" name="actor_id" value={actor.id} />
            <div class="flex gap-x-8">
              <%!-- <.single_select
                    id={"actor-#{actor.id}-role-select"}
                    name="role_id"
                    value={@forms[actor.id][:role_id].value}
                    class="text-sm p-2 pr-[30px] focus:ring-2"
                    error_class="mt-0 first-of-type:mt-1 text-xs"
                    option_list_id={"actor-#{actor.id}-role-select-options"}
                    option_list_class="text-xs"
                    chevron_class="right-2 h-4 w-4"
                  >
                    <:label id={"actor-#{actor.id}-role-select-label"} class="mb-1 text-xs">Test Label</:label>
                    <:option :for={role <- @roles} value={role.id} label={role.name} class="px-3 py-2" />
                  </.single_select> --%>
              <select id={"actor-#{actor.id}-role-select"} name="role_id">
                <option value=""></option>
                <option :for={role <- @roles} value={role.id} selected={@forms[actor.id][:role_id].value == role.id}>
                  {role.name}
                </option>
              </select>
              <.button type="submit">Update</.button>
            </div>
          </.form>
        </div>
      </div>
    </div>
    """
  end
end
