defmodule Beacon.LiveAdmin.InfoHandlerEditorLive.Index do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Content
  require Logger

  @impl true
  def menu_link(_, :index), do: {:root, "Info Handlers"}

  @impl true
  def handle_params(params, _uri, socket) do
    %{beacon_page: %{site: site}} = socket.assigns

    socket =
      socket
      |> assign(page_title: "Info Handlers")
      |> assign(show_create_modal: false)
      |> assign(show_nav_modal: false)
      |> assign(unsaved_changes: false)
      |> assign(show_delete_modal: false)
      |> assign(create_form: to_form(%{}, as: :info_handler))
      |> assign_new(:info_handlers, fn -> Content.list_info_handlers(site) end)
      |> assign_selected(params["handler_id"])
      |> assign_form()

    {:noreply, socket}
  end

  @impl true
  def handle_event("select-" <> handle_id, _params, socket) do
    %{beacon_page: %{site: site}} = socket.assigns

    path = beacon_live_admin_path(socket, site, "/info_handlers/#{handle_id}")

    if socket.assigns.unsaved_changes do
      {:noreply, assign(socket, show_nav_modal: true, confirm_nav_path: path)}
    else
      {:noreply, push_navigate(socket, to: path)}
    end
  end

  def handle_event("create_new", _params, socket) do
    {:noreply, assign(socket, show_create_modal: true)}
  end

  def handle_event("cancel_create", _params, socket) do
    {:noreply, assign(socket, show_create_modal: false)}
  end

  def handle_event("save_new", %{"msg" => msg}, socket) do
    %{beacon_page: %{site: site}} = socket.assigns

    attrs = %{
      "msg" => msg,
      "site" => site,
      "code" => "{:noreply, socket}"
    }

    socket =
      case Content.create_info_handler(site, attrs) do
        {:ok, info_handler} ->
          socket
          |> assign(info_handlers: Content.list_info_handlers(site))
          |> assign_selected(info_handler.id)
          |> assign(show_create_modal: false)
          |> push_navigate(to: beacon_live_admin_path(socket, site, "/info_handlers/#{info_handler.id}"))

        {:error, changeset} ->
          assign(socket, create_form: to_form(changeset))
      end

    {:noreply, socket}
  end

  def handle_event("save_changes", %{"info_handler" => params}, socket) do
    %{selected: info_handler, beacon_page: %{site: site}} = socket.assigns

    socket =
      case Content.update_info_handler(site, info_handler, params) do
        {:ok, updated_info_handler} ->
          socket
          |> assign_info_handler_update(updated_info_handler)
          |> assign_selected(info_handler.id)
          |> assign_form()
          |> assign(unsaved_changes: false)
          |> put_flash(:info, "Info Handler updated successfully")

        {:error, changeset} ->
          changeset = Map.put(changeset, :action, :update)
          assign(socket, form: to_form(changeset))
      end

    {:noreply, socket}
  end

  def handle_event("delete", _params, socket) do
    {:noreply, assign(socket, show_delete_modal: true)}
  end

  def handle_event("delete_cancel", _params, socket) do
    {:noreply, assign(socket, show_delete_modal: false)}
  end

  def handle_event("delete_confirm", _params, socket) do
    %{selected: info_handler, beacon_page: %{site: site}} = socket.assigns

    {:ok, _} = Content.delete_info_handler(site, info_handler)

    socket =
      socket
      |> assign(info_handlers: Content.list_info_handlers(site))
      |> push_patch(to: beacon_live_admin_path(socket, site, "/info_handlers"))

    {:noreply, socket}
  end

  def handle_event("stay_here", _params, socket) do
    {:noreply, assign(socket, show_nav_modal: false, confirm_nav_path: nil)}
  end

  def handle_event("discard_changes", _params, socket) do
    {:noreply, push_navigate(socket, to: socket.assigns.confirm_nav_path)}
  end

  def handle_event("set_code", %{"value" => code}, socket) do
    %{selected: info_handler, beacon_page: %{site: site}, form: form} = socket.assigns

    attrs = Map.merge(form.params, %{"code" => code})
    changeset = Content.change_info_handler(site, info_handler, attrs)

    socket =
      socket
      |> assign_form(changeset)
      |> assign(unsaved_changes: !(changeset.changes == %{}))

    {:noreply, socket}
  end

  defp assign_selected(socket, nil) do
    case socket.assigns.info_handlers do
      [] -> assign(socket, selected: nil)
      [hd | _] -> assign(socket, selected: hd)
    end
  end

  defp assign_selected(socket, handler_id) do
    info_handler = Enum.find(socket.assigns.info_handlers, &(&1.id == handler_id))
    assign(socket, selected: info_handler)
  end

  defp assign_form(socket) do
    form =
      case socket.assigns do
        %{selected: nil} ->
          nil

        %{selected: selected, beacon_page: %{site: site}} ->
          site
          |> Content.change_info_handler(selected)
          |> to_form()
      end

    assign(socket, form: form)
  end

  defp assign_form(socket, changeset) do
    assign(socket, :form, to_form(changeset))
  end

  defp assign_info_handler_update(socket, updated_info_handler) do
    %{id: handler_id} = updated_info_handler

    info_handlers =
      Enum.map(socket.assigns.info_handlers, fn
        %{id: ^handler_id} -> updated_info_handler
        other -> other
      end)

    assign(socket, info_handlers: info_handlers)
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div>
      <.header>
        <%= @page_title %>
        <:actions>
          <.button type="button" id="new-info-handler-button" phx-click="create_new" class="uppercase">
            New Handle Info Callback
          </.button>
        </:actions>
      </.header>

      <.main_content>
        <.modal :if={@show_nav_modal} id="confirm-nav" on_cancel={JS.push("stay_here")} show>
          <p>You've made unsaved changes to this error page!</p>
          <p>Navigating to another error page without saving will cause these changes to be lost.</p>
          <.button type="button" phx-click="stay_here">
            Stay here
          </.button>
          <.button type="button" phx-click="discard_changes">
            Discard changes
          </.button>
        </.modal>

        <.modal :if={@show_create_modal} id="create-modal" on_cancel={JS.push("cancel_create")} show>
          <.simple_form :let={f} for={@create_form} id="create-form" phx-submit="save_new">
            <.input field={f[:msg]} type="text" label="Msg argument for new handle_info callback:" />
            <:actions>
              <.button>Save</.button>
            </:actions>
          </.simple_form>
        </.modal>

        <.modal :if={@show_delete_modal} id="delete-modal" on_cancel={JS.push("delete_cancel")} show>
          <p>Are you sure you want to delete this error page?</p>
          <.button type="button" id="confirm-delete-button" phx-click="delete_confirm">
            Delete
          </.button>
          <.button type="button" phx-click="delete_cancel">
            Cancel
          </.button>
        </.modal>

        <div class="grid items-start grid-cols-1 grid-rows-1 mx-auto gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <div class="h-full lg:overflow-y-auto pb-4 lg:h-[calc(100vh_-_239px)]">
            <.table id="info-handlers" rows={@info_handlers} row_click={fn row -> "select-#{row.id}" end}>
              <:col :let={info_handler} label="msg">
                <%= Map.fetch!(info_handler, :msg) %>
              </:col>
            </.table>
          </div>

          <div :if={@form} class="w-full col-span-2">
            <.form :let={f} for={@form} id="info-handler-form" class="flex items-end gap-4" phx-submit="save_changes">
              <.input label="Message Argument" field={f[:msg]} type="text" />
              <.input type="hidden" field={f[:code]} name="info_handler[code]" id="info_handler-form_code" value={Phoenix.HTML.Form.input_value(f, :code)} />

              <.button phx-disable-with="Saving..." class="ml-auto">Save Changes</.button>
              <.button id="delete-info-handler-button" type="button" phx-click="delete">Delete</.button>
            </.form>

            <div class="w-full mt-10 space-y-8">
              <div class="py-6 rounded-[1.25rem] bg-[#0D1829] [&_.monaco-editor-background]:!bg-[#0D1829] [&_.margin]:!bg-[#0D1829]">
                <LiveMonacoEditor.code_editor
                  path="info_handler_code"
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
