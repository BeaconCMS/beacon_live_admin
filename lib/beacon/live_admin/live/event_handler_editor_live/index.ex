defmodule Beacon.LiveAdmin.EventHandlerEditorLive.Index do
  @moduledoc false
  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Client.Content

  def menu_link(_, :index), do: {:root, "Event Handlers"}

  def handle_params(params, _uri, socket) do
    %{beacon_page: %{site: site}} = socket.assigns

    socket =
      socket
      |> assign(page_title: "Event Handlers")
      |> assign(unsaved_changes: false)
      |> assign(show_create_modal: false)
      |> assign(show_nav_modal: false)
      |> assign(show_delete_modal: false)
      |> assign(create_form: to_form(%{}, as: :event_handler))
      |> assign_new(:event_handlers, fn -> Content.list_event_handlers(site) end)
      |> assign_selected(params["id"])
      |> assign_form()

    {:noreply, socket}
  end

  def handle_event("select-" <> id, _, socket) do
    %{beacon_page: %{site: site}} = socket.assigns

    path = beacon_live_admin_path(socket, site, "/events/#{id}")

    if socket.assigns.unsaved_changes do
      {:noreply, assign(socket, show_nav_modal: true, confirm_nav_path: path)}
    else
      {:noreply, push_navigate(socket, to: path)}
    end
  end

  def handle_event("set_code", %{"value" => code}, socket) do
    %{selected: selected, beacon_page: %{site: site}, form: form} = socket.assigns

    params = Map.merge(form.params, %{"code" => code})
    changeset = Content.change_event_handler(site, selected, params)

    socket =
      socket
      |> assign_form(changeset)
      |> assign(unsaved_changes: !(changeset.changes == %{}))

    {:noreply, socket}
  end

  def handle_event("create_new", _, socket) do
    {:noreply, assign(socket, show_create_modal: true)}
  end

  def handle_event("save_new", %{"name" => name}, socket) do
    %{beacon_page: %{site: site}} = socket.assigns

    attrs = %{
      "name" => name,
      "site" => site,
      "code" => "{:noreply, socket}"
    }

    socket =
      case Content.create_event_handler(site, attrs) do
        {:ok, %{id: event_handler_id}} ->
          socket
          |> assign(event_handlers: Content.list_event_handlers(site))
          |> assign_selected(event_handler_id)
          |> assign(show_create_modal: false)
          |> push_navigate(to: beacon_live_admin_path(socket, site, "/events/#{event_handler_id}"))

        {:error, changeset} ->
          assign(socket, create_form: to_form(changeset))
      end

    {:noreply, socket}
  end

  def handle_event("save_changes", %{"event_handler" => params}, socket) do
    %{selected: selected, beacon_page: %{site: site}} = socket.assigns

    attrs = %{code: params["code"], name: params["name"]}

    socket =
      case Content.update_event_handler(site, selected, attrs) do
        {:ok, updated_event_handler} ->
          socket
          |> assign_event_handler_update(updated_event_handler)
          |> assign_selected(selected.id)
          |> assign_form()
          |> assign(unsaved_changes: false)
          |> put_flash(:info, "Event Handler updated successfully")

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
    %{selected: event_handler, beacon_page: %{site: site}} = socket.assigns

    {:ok, _} = Content.delete_event_handler(site, event_handler)

    socket =
      socket
      |> assign(event_handlers: Content.list_event_handlers(site))
      |> push_patch(to: beacon_live_admin_path(socket, site, "/events"))

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

  defp assign_selected(socket, nil) do
    case socket.assigns.event_handlers do
      [] -> assign(socket, selected: nil, changed_code: "")
      [hd | _] -> assign(socket, selected: hd, changed_code: hd.code)
    end
  end

  defp assign_selected(socket, id) when is_binary(id) do
    selected = Enum.find(socket.assigns.event_handlers, &(&1.id == id))
    assign(socket, selected: selected, changed_code: selected.code)
  end

  defp assign_form(socket) do
    form =
      case socket.assigns do
        %{selected: nil} ->
          nil

        %{selected: selected, beacon_page: %{site: site}} ->
          site
          |> Content.change_event_handler(selected)
          |> to_form()
      end

    assign(socket, form: form)
  end

  defp assign_form(socket, changeset) do
    assign(socket, :form, to_form(changeset))
  end

  defp assign_event_handler_update(socket, updated_event_handler) do
    %{id: event_handler_id} = updated_event_handler

    event_handlers =
      Enum.map(socket.assigns.event_handlers, fn
        %{id: ^event_handler_id} -> updated_event_handler
        other -> other
      end)

    assign(socket, event_handlers: event_handlers)
  end

  def render(assigns) do
    ~H"""
    <div>
      <.header>
        <%= @page_title %>
        <:actions>
          <.button type="button" id="new-event-handler-button" phx-click="create_new" class="sui-primary uppercase">
            New Event Handler
          </.button>
        </:actions>
      </.header>

      <.main_content>
        <.modal :if={@show_nav_modal} id="confirm-nav" on_cancel={JS.push("stay_here")} show>
          <p>You've made unsaved changes to this event handler!</p>
          <p>Navigating to another event handler without saving will cause these changes to be lost.</p>
          <.button type="button" phx-click="stay_here" class="sui-secondary">
            Stay here
          </.button>
          <.button type="button" phx-click="discard_changes" class="sui-primary-destructive">
            Discard changes
          </.button>
        </.modal>

        <.modal :if={@show_create_modal} id="create-modal" on_cancel={JS.push("cancel_create")} show>
          <.simple_form :let={f} for={@create_form} id="create-form" phx-submit="save_new">
            <.input field={f[:name]} type="text" label="Event name:" />
            <:actions>
              <.button>Save</.button>
            </:actions>
          </.simple_form>
        </.modal>

        <.modal :if={@show_delete_modal} id="delete-modal" on_cancel={JS.push("delete_cancel")} show>
          <p>Are you sure you want to delete this event handler?</p>
          <.button type="button" id="confirm-delete-button" phx-click="delete_confirm" class="sui-primary-destructive">
            Delete
          </.button>
          <.button type="button" phx-click="delete_cancel" class="sui-secondary">
            Cancel
          </.button>
        </.modal>

        <div class="grid items-start grid-cols-1 grid-rows-1 mx-auto gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <div class="h-full lg:overflow-y-auto pb-4 lg:h-[calc(100vh_-_239px)]">
            <.table id="event-handlers" rows={@event_handlers} row_click={fn row -> "select-#{row.id}" end}>
              <:col :let={event_handler} label="name">
                <%= Map.fetch!(event_handler, :name) %>
              </:col>
            </.table>
          </div>

          <div :if={@form} class="w-full col-span-2">
            <.form :let={f} for={@form} id="event-handler-form" class="flex items-end gap-4" phx-submit="save_changes">
              <.input label="Name" field={f[:name]} type="text" />
              <input type="hidden" name="event_handler[code]" id="event_handler-form_code" value={Phoenix.HTML.Form.input_value(f, :code)} />

              <.button phx-disable-with="Saving..." class="sui-primary ml-auto">Save Changes</.button>
              <.button id="delete-event-handler-button" type="button" phx-click="delete" class="sui-primary-destructive">Delete</.button>
            </.form>
            <div class="mt-4 flex gap-x-4">
              <div>Variables available:</div>
              <div>params socket</div>
            </div>
            <%= template_error(@form[:code]) %>
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
end
