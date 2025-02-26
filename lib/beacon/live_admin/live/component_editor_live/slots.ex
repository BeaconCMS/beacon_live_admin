defmodule Beacon.LiveAdmin.ComponentEditorLive.Slots do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Client.Content

  def menu_link("/components", :slots), do: {:submenu, "Components"}
  def menu_link(_, _), do: :skip

  def mount(socket) do
    {:ok, stream_configure(socket, :slot_attrs, dom_id: &"#{Ecto.UUID.generate()}-#{&1.id}")}
  end

  # For switching between selected slots, first load has already happened
  def handle_params(params, _url, %{assigns: %{component: %{slots: [_ | _]}}} = socket) do
    {:noreply, assign_selected(socket, params["slot_id"])}
  end

  # For the first component load
  def handle_params(params, _url, socket) do
    component =
      Content.get_component(socket.assigns.beacon_page.site, params["id"], preloads: [slots: :attrs])

    socket =
      socket
      |> assign(component: component)
      |> assign(unsaved_changes: false)
      |> assign(show_nav_modal: false)
      |> assign(show_delete_modal: false)
      |> assign(page_title: "Slots")
      |> assign_selected(params["slot_id"])
      |> assign_form()

    {:noreply, socket}
  end

  def handle_event("select-" <> slot_id, _, socket) do
    %{component: component} = socket.assigns

    path =
      beacon_live_admin_path(
        socket,
        component.site,
        "/components/#{component.id}/slots/#{slot_id}"
      )

    if socket.assigns.unsaved_changes do
      {:noreply, assign(socket, show_nav_modal: true, confirm_nav_path: path)}
    else
      {:noreply, push_navigate(socket, to: path)}
    end
  end

  def handle_event("validate", %{"component_slot" => params}, socket) do
    %{selected: selected, beacon_page: %{site: site}, component: component} = socket.assigns

    component_slots_names = component.slots |> Enum.reject(&(&1.id == selected.id)) |> Enum.map(& &1.name)
    params = format_options_input(params)

    changeset =
      site
      |> Content.change_component_slot(selected, params, component_slots_names)
      |> Map.put(:action, :validate)

    socket =
      socket
      |> assign_form(changeset)
      |> assign(unsaved_changes: !(changeset.changes == %{}))

    {:noreply, socket}
  end

  def handle_event("save_changes", %{"component_slot" => params}, socket) do
    %{component: component, selected: selected, beacon_page: %{site: site}, __beacon_actor__: actor} = socket.assigns

    component_slots_names = component.slots |> Enum.reject(&(&1.id == selected.id)) |> Enum.map(& &1.name)
    params = format_options_input(params)

    socket =
      case Content.update_slot_for_component(site, actor, component, selected, params, component_slots_names) do
        {:ok, updated_component} ->
          path = beacon_live_admin_path(socket, site, "/components/#{updated_component.id}/slots/#{selected.id}")
          push_navigate(socket, to: path)

        {:error, changeset} ->
          changeset = Map.put(changeset, :action, :update)
          assign_form(socket, changeset)
      end

    {:noreply, socket}
  end

  def handle_event("create_new", _params, socket) do
    %{component: component, beacon_page: %{site: site}, __beacon_actor__: actor} = socket.assigns
    selected = socket.assigns.selected || %{id: nil}

    random_string = Ecto.UUID.generate() |> String.slice(0..5)
    attrs = %{name: "new_slot_#{random_string}"}
    {:ok, updated_component} = Content.create_slot_for_component(site, actor, component, attrs)

    path = beacon_live_admin_path(socket, site, "/components/#{updated_component.id}/slots/#{selected.id}")
    socket = push_navigate(socket, to: path)

    {:noreply, assign(socket, component: updated_component)}
  end

  def handle_event("delete_slot_attr", %{"attr_id" => slot_attr_id}, socket) do
    %{component: component, selected: slot, beacon_page: %{site: site}, __beacon_actor__: actor} = socket.assigns
    slot_attr = Enum.find(slot.attrs, &(&1.id == slot_attr_id))

    {:ok, _slot_attr} = Content.delete_slot_attr(site, actor, slot_attr)

    path = beacon_live_admin_path(socket, site, "/components/#{component.id}/slots/#{slot.id}")
    socket = push_navigate(socket, to: path)

    {:noreply, socket}
  end

  def handle_event("delete", _, socket) do
    {:noreply, assign(socket, show_delete_modal: true)}
  end

  def handle_event("delete_confirm", _, socket) do
    %{selected: slot, component: component, beacon_page: %{site: site}, __beacon_actor__: actor} = socket.assigns
    path = beacon_live_admin_path(socket, site, "/components/#{component.id}/slots")

    {:ok, _} = Content.delete_slot_from_component(site, actor, component, slot)

    {:noreply, push_navigate(socket, to: path)}
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

  def render(assigns) do
    ~H"""
    <div>
      <Beacon.LiveAdmin.AdminComponents.component_header socket={@socket} flash={@flash} component={@component} live_action={@live_action} />

      <.header>
        <%= @page_title %>
        <:actions>
          <.button type="button" phx-click="create_new">New Slot</.button>
        </:actions>
      </.header>
      <.main_content>
        <.modal :if={@show_nav_modal} id="confirm-nav" on_cancel={JS.push("stay_here")} show>
          <p>You've made unsaved changes to this slot!</p>
          <p>Navigating to another slot without saving will cause these changes to be lost.</p>
          <.button type="button" class="sui-secondary" phx-click="stay_here">
            Stay here
          </.button>
          <.button type="button" class="sui-primary-destructive" phx-click="discard_changes">
            Discard changes
          </.button>
        </.modal>

        <.modal :if={@show_delete_modal} id="confirm-delete" on_cancel={JS.push("delete_cancel")} show>
          <p class="mb-2">Are you sure you want to delete this slot?</p>
          <div class="flex justify-end w-full gap-4 mt-10">
            <.button type="button" class="sui-primary-destructive" phx-click="delete_confirm">
              Delete
            </.button>
            <.button type="button" class="sui-secondary" phx-click="delete_cancel">
              Cancel
            </.button>
          </div>
        </.modal>

        <div class="grid items-start grid-cols-1 grid-rows-1 mx-auto gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <div class="h-full lg:overflow-y-auto pb-4 lg:h-[calc(100vh_-_239px)]">
            <.table :if={@selected} id="slots" rows={@component.slots} row_click={fn row -> "select-#{row.id}" end}>
              <:col :let={slot} :for={{attr, suffix} <- [{:name, ""}]} label={"#{attr}#{suffix}"}>
                <%= Map.fetch!(slot, attr) %>
              </:col>
            </.table>
          </div>

          <div :if={@form} class="w-full col-span-2">
            <.form :let={f} for={@form} class="flex items-end gap-4" phx-change="validate" phx-submit="save_changes">
              <.input label="Name" field={f[:name]} type="text" />
              <.input label="Required" field={f[:opts_required]} type="select" options={["false", "true"]} value={opts_required_value(f)} />
              <.input label="Validate Attrs" field={f[:opts_validate]} type="select" options={["true", "false"]} value={opts_validate_value(f)} />
              <.input label="Doc" field={f[:opts_doc]} type="text" phx-debounce="100" value={opts_doc_value(f)} />

              <.button phx-disable-with="Saving..." class="sui-primary ml-auto">Save Changes</.button>
              <.button type="button" class="sui-primary-destructive" phx-click="delete">Delete</.button>
            </.form>

            <.table
              id="slot_attrs"
              rows={@streams.slot_attrs}
              row_click={fn {_dom_id, attr} -> JS.navigate(beacon_live_admin_path(@socket, @beacon_page.site, "/components/#{@component.id}/slots/#{@selected.id}/attrs/#{attr.id}")) end}
            >
              <:col :let={{_, attr}} label="Slot Attributes"><%= attr.name %></:col>
              <:action :let={{_, attr}}>
                <.link
                  patch={beacon_live_admin_path(@socket, @beacon_page.site, "/components/#{@component.id}/slots/#{@selected.id}/attrs/#{attr.id}")}
                  title="Edit Slot attribute"
                  aria-label="Edit Slot attribute"
                  class="flex items-center justify-center w-10 h-10 group"
                >
                  <.icon name="hero-pencil-square text-[#61758A] hover:text-[#304254]" />
                </.link>
              </:action>

              <:action :let={{_, attr}}>
                <.link
                  phx-click={JS.push("delete_slot_attr", value: %{attr_id: attr.id})}
                  aria-label="Delete Slot attribute"
                  title="Delete Slot attribute"
                  class="flex items-center justify-center w-10 h-10"
                  data-confirm="The Slot attribute will be deleted. Are you sure?"
                >
                  <.icon name="hero-trash text-[#F23630] hover:text-[#AE182D]" />
                </.link>
              </:action>
            </.table>

            <.button class="sui-tertiary mt-4" phx-click={JS.navigate(beacon_live_admin_path(@socket, @beacon_page.site, "/components/#{@component.id}/slots/#{@selected.id}/attrs/new"))}>
              Add new Attribute
            </.button>
          </div>
        </div>
      </.main_content>
    </div>
    """
  end

  defp assign_selected(socket, nil) do
    case socket.assigns.component.slots do
      [] ->
        socket
        |> assign(selected: nil)
        |> stream(:slot_attrs, [], reset: true)

      [slot | _] ->
        socket
        |> assign(selected: slot)
        |> stream(:slot_attrs, Enum.sort_by(slot.attrs, & &1.name), reset: true)
    end
  end

  defp assign_selected(socket, slot_id) do
    selected = Enum.find(socket.assigns.component.slots, &(&1.id == slot_id))

    socket
    |> assign(selected: selected)
    |> stream(:slot_attrs, Enum.sort_by(selected.attrs, & &1.name), reset: true)
  end

  defp assign_form(socket) do
    form =
      case socket.assigns do
        %{selected: nil} ->
          nil

        %{selected: selected, beacon_page: %{site: site}} ->
          site
          |> Content.change_component_slot(selected, %{}, [])
          |> to_form()
      end

    assign(socket, form: form)
  end

  defp assign_form(socket, changeset) do
    assign(socket, :form, to_form(changeset))
  end

  defp format_options_input(slot_params) do
    slot_opts = []

    slot_opts =
      slot_opts
      |> option_required(slot_params["opts_required"])
      |> option_validate(slot_params["opts_validate"])
      |> option_doc(slot_params["opts_doc"])

    Map.put(slot_params, "opts", slot_opts)
  end

  defp option_required(attr_opts, "false"), do: attr_opts

  defp option_required(attr_opts, "true") do
    Keyword.merge(attr_opts, required: true)
  end

  defp option_validate(attr_opts, "true"), do: attr_opts

  defp option_validate(attr_opts, "false") do
    Keyword.merge(attr_opts, validate_attrs: false)
  end

  defp option_doc(slot_opts, ""), do: slot_opts

  defp option_doc(slot_opts, opts_doc) do
    Keyword.merge(slot_opts, doc: opts_doc)
  end

  defp opts_doc_value(form) do
    form
    |> get_field_opts()
    |> Keyword.get(:doc, "")
  end

  def opts_required_value(form) do
    form
    |> get_field_opts()
    |> Keyword.get(:required, false)
    |> to_string()
  end

  def opts_validate_value(form) do
    form
    |> get_field_opts()
    |> Keyword.get(:validate_attrs, true)
    |> to_string()
  end

  defp get_field_opts(form) do
    form
    |> Phoenix.HTML.Form.input_value(:opts)
    |> maybe_binary_to_term()
  end

  defp maybe_binary_to_term(opts) when is_binary(opts), do: :erlang.binary_to_term(opts)
  defp maybe_binary_to_term(opts), do: opts
end
