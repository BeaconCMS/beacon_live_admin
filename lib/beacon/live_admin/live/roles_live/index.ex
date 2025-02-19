defmodule Beacon.LiveAdmin.RolesLive.Index do
  @moduledoc false
  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Client.Auth

  def menu_link(_, :index), do: {:root, "Roles"}

  def handle_params(params, _uri, socket) do
    %{beacon_page: %{site: site}} = socket.assigns

    socket =
      socket
      |> assign(page_title: "Roles")
      |> assign(unsaved_changes: false)
      |> assign(show_create_modal: false)
      |> assign(show_nav_modal: false)
      |> assign(show_delete_modal: false)
      |> assign(create_form: to_form(%{}, as: :role))
      |> assign_new(:roles, fn -> Auth.list_roles(site) end)
      |> assign_selected(params["id"])
      |> assign_form()

    {:noreply, socket}
  end

  def handle_event("select-" <> id, _, socket) do
    %{beacon_page: %{site: site}} = socket.assigns

    path = beacon_live_admin_path(socket, site, "/roles/#{id}")

    if socket.assigns.unsaved_changes do
      {:noreply, assign(socket, show_nav_modal: true, confirm_nav_path: path)}
    else
      {:noreply, push_navigate(socket, to: path)}
    end
  end

  def handle_event("validate", params, socket) do
    %{beacon_page: %{site: site}, form: form} = socket.assigns

    params = format_capabilities_param(params)

    changeset =
      site
      |> Auth.change_role(form.source.data, params["role"])
      |> Map.put(:action, :validate)

    {:noreply, assign_form(socket, changeset)}
  end

  def handle_event("create_new", _, socket) do
    {:noreply, assign(socket, show_create_modal: true)}
  end

  def handle_event("save_new", params, socket) do
    %{beacon_page: %{site: site}, __beacon_actor__: actor} = socket.assigns
    %{"role" => %{"name" => name}} = params

    attrs = %{
      site: site,
      name: name,
      capabilities: Auth.default_role_capabilities(site)
    }

    socket =
      case Auth.create_role(site, actor, attrs) do
        {:ok, %{id: role_id}} ->
          socket
          |> assign(roles: Auth.list_roles(site))
          |> assign_selected(role_id)
          |> assign(show_create_modal: false)
          |> push_navigate(to: beacon_live_admin_path(socket, site, "/roles/#{role_id}"))

        {:error, changeset} ->
          assign(socket, create_form: to_form(changeset))
      end

    {:noreply, socket}
  end

  def handle_event("save_changes", params, socket) do
    %{selected: selected, beacon_page: %{site: site}, __beacon_actor__: actor} = socket.assigns

    params = format_capabilities_param(params)

    socket =
      case Auth.update_role(site, actor, selected, params["role"]) do
        {:ok, updated_role} ->
          socket
          |> assign_role_update(updated_role)
          |> assign_selected(selected.id)
          |> assign_form()
          |> assign(unsaved_changes: false)
          |> put_flash(:info, "Role updated successfully")

        {:error, changeset} ->
          changeset = Map.put(changeset, :action, :update)
          assign(socket, form: to_form(changeset))
      end

    {:noreply, socket}
  end

  def handle_event("delete", _, socket) do
    {:noreply, assign(socket, show_delete_modal: true)}
  end

  def handle_event("delete_confirm", _, socket) do
    %{selected: role, beacon_page: %{site: site}, __beacon_actor__: actor} = socket.assigns

    {:ok, _} = Auth.delete_role(site, actor, role)

    socket =
      socket
      |> assign(roles: Auth.list_roles(site))
      |> push_patch(to: beacon_live_admin_path(socket, site, "/roles"))

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

  defp assign_role_update(socket, updated_role) do
    %{id: role_id} = updated_role

    roles =
      Enum.map(socket.assigns.roles, fn
        %{id: ^role_id} -> updated_role
        other -> other
      end)

    assign(socket, roles: roles)
  end

  defp assign_selected(socket, nil) do
    case socket.assigns.roles do
      [] -> assign(socket, selected: nil)
      [hd | _] -> assign(socket, selected: hd)
    end
  end

  defp assign_selected(socket, id) when is_binary(id) do
    selected = Enum.find(socket.assigns.roles, &(&1.id == id))
    assign(socket, selected: selected)
  end

  defp assign_form(socket) do
    form =
      case socket.assigns do
        %{selected: nil} ->
          nil

        %{selected: selected, beacon_page: %{site: site}} ->
          site
          |> Auth.change_role(selected)
          |> to_form()
      end

    assign(socket, form: form)
  end

  defp assign_form(socket, changeset) do
    assign(socket, form: to_form(changeset))
  end

  defp format_capabilities_param(params) do
    capabilities =
      params["role"]["capabilities"]
      |> Enum.filter(fn {_k, v} -> v == "true" end)
      |> Enum.map(fn {k, _v} -> k end)

    put_in(params, ["role", "capabilities"], capabilities)
  end

  def render(assigns) do
    ~H"""
    <div>
      <.header>
        <%= @page_title %>
        <:actions>
          <.button type="button" id="new-role-button" phx-click="create_new" class="sui-primary uppercase">
            New Role
          </.button>
        </:actions>
      </.header>

      <.main_content>
        <.modal :if={@show_nav_modal} id="confirm-nav" on_cancel={JS.push("stay_here")} show>
          <p>You've made unsaved changes to this role!</p>
          <p>Navigating to another role without saving will cause these changes to be lost.</p>
          <.button type="button" phx-click="stay_here" class="sui-secondary">
            Stay here
          </.button>
          <.button type="button" phx-click="discard_changes" class="sui-primary-destructive">
            Discard changes
          </.button>
        </.modal>

        <.modal :if={@show_create_modal} id="create-modal" on_cancel={JS.push("cancel_create")} show>
          <:title>New Role</:title>
          <.form :let={f} for={@create_form} id="create-form" phx-submit="save_new" class="px-4">
            <.input field={f[:name]} type="text" label="Role name:" />
            <.button class="sui-primary mt-4">Save</.button>
          </.form>
        </.modal>

        <.modal :if={@show_delete_modal} id="delete-modal" on_cancel={JS.push("delete_cancel")} show>
          <p>Are you sure you want to delete this role?</p>
          <.button type="button" id="confirm-delete-button" phx-click="delete_confirm" class="sui-primary-destructive">
            Delete
          </.button>
          <.button type="button" phx-click="delete_cancel" class="sui-secondary">
            Cancel
          </.button>
        </.modal>

        <div class="grid items-start grid-cols-1 grid-rows-1 mx-auto gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <div class="h-full lg:overflow-y-auto pb-4 lg:h-[calc(100vh_-_239px)]">
            <.table id="roles" rows={@roles} row_click={fn row -> "select-#{row.id}" end}>
              <:col :let={role} label="name">
                <%= Map.fetch!(role, :name) %>
              </:col>
            </.table>
          </div>

          <div :if={@form} class="w-full col-span-2 mb-6">
            <.form for={@form} id="role-form" phx-change="validate" phx-submit="save_changes">
              <div class="flex items-start gap-4 mb-8">
                <.input label="Name" field={@form[:name]} type="text" />
                <.button phx-disable-with="Saving..." class="sui-primary ml-auto">Save Changes</.button>
                <.button id="delete-role-button" type="button" phx-click="delete" class="sui-primary-destructive">Delete</.button>
              </div>

              <div class="text-xl font-bold">Capabilities</div>
              <div class="mt-8 space-y-4">
                <div :for={capability <- Beacon.Auth.list_capabilities()} class="w-1/3">
                  <.checkbox id={"capability-checkbox-#{capability}"} name={"role[capabilities][#{capability}]"} value={to_string(capability) in @form[:capabilities].value}>
                    <:label>{format_capability(capability)}</:label>
                  </.checkbox>
                </div>
              </div>
            </.form>
          </div>
        </div>
      </.main_content>
    </div>
    """
  end

  defp format_capability(a) when is_atom(a), do: format_capability(to_string(a))

  defp format_capability(str) when is_binary(str) do
    str
    |> String.split("_")
    |> Enum.map(fn
      word when word in ~w(for from) -> word
      other -> String.capitalize(other)
    end)
    |> Enum.intersperse(" ")
  end
end
