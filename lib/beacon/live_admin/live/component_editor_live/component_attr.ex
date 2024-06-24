defmodule Beacon.LiveAdmin.ComponentEditorLive.ComponentAttr do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Content

  @impl true
  def menu_link("/components", :edit), do: {:submenu, "Components"}
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(%{"id" => component_id, "attr_id" => attr_id}, _url, socket) do
    component = Content.get_component(socket.assigns.beacon_page.site, component_id)
    component_attr = Enum.find(component.attrs, &(&1.id == attr_id))

    changeset =
      Content.change_component_attr(socket.assigns.beacon_page.site, component_attr, %{})

    {:noreply,
     socket
     |> assign_form(changeset)
     |> assign(
       component_id: component.id,
       component_attr: component_attr,
       page_title: "Edit Attribute"
     )}
  end

  def handle_params(%{"id" => component_id}, _url, socket) do
    component = Content.get_component(socket.assigns.beacon_page.site, component_id)
    component_attr = %Beacon.Content.ComponentAttr{component_id: component.id}

    changeset =
      Content.change_component_attr(socket.assigns.beacon_page.site, component_attr, %{})

    {:noreply,
     socket
     |> assign_form(changeset)
     |> assign(
       component_id: component.id,
       component_attr: component_attr,
       page_title: "Create Attribute"
     )}
  end

  @impl true
  def handle_event("validate", %{"component_attr" => component_attr_params}, socket) do
    changeset =
      socket.assigns.beacon_page.site
      |> Content.change_component_attr(socket.assigns.component_attr, component_attr_params)
      |> Map.put(:action, :validate)

    {:noreply, assign_form(socket, changeset)}
  end

  def handle_event("save", %{"component_attr" => component_attr_params}, socket) do
    save_component(socket, socket.assigns.live_action, component_attr_params)
  end

  defp save_component(socket, :new, component_attr_params) do
    %{beacon_page: %{site: site}, component_id: component_id} = socket.assigns

    case Content.create_component_attr(site, component_attr_params) do
      {:ok, _component_attr} ->
        to = beacon_live_admin_path(socket, site, "/components/#{component_id}")

        {:noreply,
         socket
         |> put_flash(:info, "Component Attribute created successfully")
         |> push_patch(to: to)}

      {:error, changeset} ->
        changeset = Map.put(changeset, :action, :insert)
        {:noreply, assign_form(socket, changeset)}
    end
  end

  defp save_component(socket, :edit, component_attr_params) do
    %{beacon_page: %{site: site}, component_id: component_id, component_attr: component_attr} =
      socket.assigns

    case Content.update_component_attr(site, component_attr, component_attr_params) do
      {:ok, _component_attr} ->
        to = beacon_live_admin_path(socket, site, "/components/#{component_id}")

        {:noreply,
         socket
         |> put_flash(:info, "Component Attribute updated successfully")
         |> push_patch(to: to)}

      {:error, changeset} ->
        changeset = Map.put(changeset, :action, :update)
        {:noreply, assign_form(socket, changeset)}
    end
  end

  defp assign_form(socket, changeset) do
    assign(socket, :form, to_form(changeset))
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.modal id="edit-attr-modal" on_cancel={JS.navigate(beacon_live_admin_path(@socket, @beacon_page.site, "/components/#{@component_id}"))} show>
      <p class="text-2xl font-bold mb-12"><%= @page_title %></p>
      <.form :let={f} id="new-path-form" for={@form} phx-change="validate" phx-submit="save" class="space-y-8">
        <.input type="hidden" name={f[:component_id].name} value={f[:component_id].value} />
        <.input field={f[:name]} type="text" phx-debounce="100" label="Attr Name" />
        <.input field={f[:type]} type="select" options={types_to_options()} label="Type" />
        <.input :if={f[:type].value == "struct"} field={f[:struct_name]} type="text" phx-debounce="100" label="Struct Name" />
        <div class="flex mt-8 gap-x-[20px]">
          <.button type="submit">Save</.button>
          <.button type="button" phx-click={JS.navigate(beacon_live_admin_path(@socket, @beacon_page.site, "/components/#{@component_id}"))}>Cancel</.button>
        </div>
      </.form>
    </.modal>
    """
  end

  defp types_to_options do
    ~w(any string atom boolean integer float list map global struct)a
    |> Enum.map(&{Phoenix.Naming.humanize(&1), &1})
  end
end
