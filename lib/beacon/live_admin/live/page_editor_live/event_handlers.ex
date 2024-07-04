defmodule Beacon.LiveAdmin.PageEditorLive.EventHandlers do
  @moduledoc false
  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Content

  def menu_link("/pages", :events), do: {:submenu, "Pages"}
  def menu_link(_, _), do: :skip

  # For switching between selected event_handlers, first load has already happened
  def handle_params(params, _url, %{assigns: %{page: %{event_handlers: [_ | _]}}} = socket) do
    {:noreply, assign_selected(socket, params["event_handler_id"])}
  end

  # For the first page load
  def handle_params(params, _url, socket) do
    page =
      Content.get_page(socket.assigns.beacon_page.site, params["page_id"], preloads: [:event_handlers])

    socket =
      socket
      |> assign(page: page)
      |> assign(unsaved_changes: false)
      |> assign(show_nav_modal: false)
      |> assign(show_delete_modal: false)
      |> assign(page_title: "Events")
      |> assign_selected(params["event_handler_id"])
      |> assign_form()

    {:noreply, socket}
  end

  def handle_event("select-" <> event_handler_id, _, socket) do
    %{page: page} = socket.assigns

    path =
      beacon_live_admin_path(socket, page.site, "/pages/#{page.id}/events/#{event_handler_id}")

    if socket.assigns.unsaved_changes do
      {:noreply, assign(socket, show_nav_modal: true, confirm_nav_path: path)}
    else
      {:noreply, push_navigate(socket, to: path)}
    end
  end

  def handle_event("set_code", %{"value" => code}, socket) do
    %{selected: selected, beacon_page: %{site: site}, form: form} = socket.assigns

    params = Map.merge(form.params, %{"code" => code})
    changeset = Content.change_page_event_handler(site, selected, params)

    socket =
      socket
      |> assign_form(changeset)
      |> assign(unsaved_changes: !(changeset.changes == %{}))

    {:noreply, socket}
  end

  def handle_event("validate", %{"page_event_handler" => params}, socket) do
    %{selected: selected, beacon_page: %{site: site}} = socket.assigns

    changeset =
      site
      |> Content.change_page_event_handler(selected, params)
      |> Map.put(:action, :validate)

    socket =
      socket
      |> assign_form(changeset)
      |> assign(unsaved_changes: !(changeset.changes == %{}))

    {:noreply, socket}
  end

  def handle_event("save_changes", %{"page_event_handler" => params}, socket) do
    %{page: page, selected: selected, beacon_page: %{site: site}} = socket.assigns

    attrs = %{name: params["name"], code: params["code"]}

    socket =
      case Content.update_event_handler_for_page(site, page, selected, attrs) do
        {:ok, updated_page} ->
          socket
          |> assign(page: updated_page)
          |> assign_selected(selected.id)
          |> assign_form()
          |> assign(unsaved_changes: false)
          |> put_flash(:info, "Page updated successfully")

        {:error, changeset} ->
          changeset = Map.put(changeset, :action, :update)
          assign_form(changeset)
      end

    {:noreply, socket}
  end

  def handle_event("create_new", _params, socket) do
    %{page: page, beacon_page: %{site: site}} = socket.assigns
    selected = socket.assigns.selected || %{id: nil}

    attrs = %{name: "new_event", code: "%{} = event_params\n\n{:noreply, socket}"}
    {:ok, updated_page} = Content.create_event_handler_for_page(site, page, attrs)

    socket =
      socket
      |> assign(page: updated_page)
      |> assign_selected(selected.id)

    {:noreply, assign(socket, page: updated_page)}
  end

  def handle_event("delete", _, socket) do
    {:noreply, assign(socket, show_delete_modal: true)}
  end

  def handle_event("delete_confirm", _, socket) do
    %{selected: event_handler, page: page, beacon_page: %{site: site}} = socket.assigns
    path = beacon_live_admin_path(socket, site, "/pages/#{page.id}/events")

    {:ok, _} = Content.delete_event_handler_from_page(site, page, event_handler)

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
      <Beacon.LiveAdmin.AdminComponents.page_header socket={@socket} flash={@flash} page={@page} live_action={@live_action} />

      <.header>
        <%= @page_title %>
        <:actions>
          <.button type="button" phx-click="create_new">New Event Handler</.button>
        </:actions>
      </.header>
      <.main_content>
        <.modal :if={@show_nav_modal} id="confirm-nav" on_cancel={JS.push("stay_here")} show>
          <p>You've made unsaved changes to this event handler!</p>
          <p>Navigating to another event handler without saving will cause these changes to be lost.</p>
          <.button type="button" phx-click="stay_here">
            Stay here
          </.button>
          <.button type="button" phx-click="discard_changes">
            Discard changes
          </.button>
        </.modal>

        <.modal :if={@show_delete_modal} id="confirm-delete" on_cancel={JS.push("delete_cancel")} show>
          <p>Are you sure you want to delete this event handler?</p>
          <p>Note: deleted event handlers will still be active until the page is re-published!</p>
          <.button type="button" phx-click="delete_confirm">
            Delete
          </.button>
          <.button type="button" phx-click="delete_cancel">
            Cancel
          </.button>
        </.modal>

        <div class="grid items-start grid-cols-1 grid-rows-1 mx-auto gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <div class="h-full lg:overflow-y-auto pb-4 lg:h-[calc(100vh_-_239px)]">
            <.table :if={@selected} id="event-handlers" rows={@page.event_handlers} row_click={fn row -> "select-#{row.id}" end}>
              <:col :let={event_handler} label="name">
                <%= Map.fetch!(event_handler, :name) %>
              </:col>
            </.table>
          </div>

          <div :if={@form} class="w-full col-span-2">
            <.form :let={f} for={@form} class="flex items-end gap-4" phx-change="validate" phx-submit="save_changes">
              <.input field={f[:name]} label="name" type="text" />
              <input type="hidden" name="page_event_handler[code]" id="page_event_handler-form_code" value={Phoenix.HTML.Form.input_value(f, :code)} />

              <.button phx-disable-with="Saving..." class="ml-auto">Save Changes</.button>
              <.button type="button" phx-click="delete">Delete</.button>
            </.form>

            <div class="w-full mt-10 space-y-8">
              <div class="py-6 rounded-[1.25rem] bg-[#0D1829] [&_.monaco-editor-background]:!bg-[#0D1829] [&_.margin]:!bg-[#0D1829]">
                <LiveMonacoEditor.code_editor
                  path="event_handler_code"
                  class="col-span-full lg:col-span-2"
                  value={@selected.code}
                  change="set_code"
                  opts={Map.merge(LiveMonacoEditor.default_opts(), %{"language" => "elixir"})}
                />
              </div>
            </div>
          </div>
        </div>
      </.main_content>
    </div>
    """
  end

  defp assign_selected(socket, nil) do
    case socket.assigns.page.event_handlers do
      [] ->
        assign(socket, selected: nil, changed_code: "")

      [event_handler | _] ->
        assign(socket, selected: event_handler, changed_code: event_handler.code)
    end
  end

  defp assign_selected(socket, event_handler_id) do
    selected = Enum.find(socket.assigns.page.event_handlers, &(&1.id == event_handler_id))
    assign(socket, selected: selected, changed_code: selected.code)
  end

  defp assign_form(socket) do
    form =
      case socket.assigns do
        %{selected: nil} ->
          nil

        %{selected: selected, beacon_page: %{site: site}} ->
          site
          |> Content.change_page_event_handler(selected)
          |> to_form()
      end

    assign(socket, form: form)
  end

  defp assign_form(socket, changeset) do
    assign(socket, :form, to_form(changeset))
  end
end
