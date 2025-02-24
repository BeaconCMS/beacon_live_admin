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
      Enum.map(actors, fn {id, label} ->
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

  def render(assigns) do
    ~H"""
    <h1>User Roles</h1>

    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        <%= for actor <- @actors do %>
          <tr>
            <td><%= actor.label %></td>
            <td>
              <.form id={"actor-#{actor.id}-role-form"} for={@forms[actor.id]} phx-submit="update_role">
                <.input type="hidden" name="actor_id" value={actor.id} />
                <div class="flex gap-x-8">
                  <.simple_select
                    id={"actor-#{actor.id}-role-select"}
                    name="role_id"
                    value={@forms[actor.id][:role_id].value}
                    options={Enum.map(@roles, &{&1.id, &1.name})}
                    class="h-8 text-base"
                    error_class="mt-0.5 first-of-type:mt-1.5 text-sm"
                  />
                  <.button type="submit">Update</.button>
                </div>
              </.form>
            </td>
          </tr>
        <% end %>
      </tbody>
    </table>
    """
  end
end
