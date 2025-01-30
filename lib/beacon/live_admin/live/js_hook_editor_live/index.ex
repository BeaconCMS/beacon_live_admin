defmodule Beacon.LiveAdmin.JSHookEditorLive.Index do
  @moduledoc false
  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Client.Content

  def menu_link(_, :index), do: {:root, "JS Hooks"}

  def handle_params(params, _uri, socket) do
    %{beacon_page: %{site: site}} = socket.assigns

    socket =
      socket
      |> assign(page_title: "JS Hooks")
      |> assign(unsaved_changes: false)
      |> assign(show_create_modal: false)
      |> assign(show_nav_modal: false)
      |> assign(show_delete_modal: false)
      |> assign(create_form: to_form(%{}, as: :js_hook))
      |> assign_new(:js_hooks, fn -> Content.list_js_hooks(site) end)
      |> assign_selected(params["id"])
      |> assign_form()

    {:noreply, socket}
  end

  def handle_event("select-" <> id, _, socket) do
    %{beacon_page: %{site: site}} = socket.assigns

    path = beacon_live_admin_path(socket, site, "/hooks/#{id}")

    if socket.assigns.unsaved_changes do
      {:noreply, assign(socket, show_nav_modal: true, confirm_nav_path: path)}
    else
      {:noreply, push_navigate(socket, to: path)}
    end
  end

  def handle_event("set_code", %{"value" => code}, socket) do
    %{selected: selected, beacon_page: %{site: site}, form: form} = socket.assigns

    params = Map.put(form.params, "code", code)

    changeset =
      site
      |> Content.change_js_hook(selected, params)
      |> Map.put(:action, :validate)

    socket =
      socket
      |> assign_form(changeset)
      |> assign(unsaved_changes: !(changeset.changes == %{}))

    {:noreply, socket}
  end

  def handle_event("validate", params, socket) do
    %{beacon_page: %{site: site}, form: form} = socket.assigns

    changeset =
      site
      |> Content.change_js_hook(form.source.data, params["js_hook"])
      |> Map.put(:action, :validate)

    {:noreply, assign_form(socket, changeset)}
  end

  def handle_event("create_new", _, socket) do
    {:noreply, assign(socket, show_create_modal: true)}
  end

  def handle_event("save_new", params, socket) do
    %{beacon_page: %{site: site}} = socket.assigns
    %{"js_hook" => %{"name" => name}} = params

    attrs = %{
      site: site,
      name: name,
      code: Content.default_hook_code(site, name)
    }

    socket =
      case Content.create_js_hook(site, attrs) do
        {:ok, %{id: js_hook_id}} ->
          socket
          |> assign(js_hooks: Content.list_js_hooks(site))
          |> assign_selected(js_hook_id)
          |> assign(show_create_modal: false)
          |> push_navigate(to: beacon_live_admin_path(socket, site, "/hooks/#{js_hook_id}"))

        {:error, changeset} ->
          assign(socket, create_form: to_form(changeset))
      end

    {:noreply, socket}
  end

  def handle_event("save_changes", %{"js_hook" => params}, socket) do
    %{selected: selected, beacon_page: %{site: site}} = socket.assigns

    socket =
      case Content.update_js_hook(site, selected, params) do
        {:ok, updated_js_hook} ->
          socket
          |> assign_js_hook_update(updated_js_hook)
          |> assign_selected(selected.id)
          |> assign_form()
          |> assign(unsaved_changes: false)
          |> put_flash(:info, "JS Hook updated successfully")

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
    %{selected: js_hook, beacon_page: %{site: site}} = socket.assigns

    {:ok, _} = Content.delete_js_hook(site, js_hook)

    socket =
      socket
      |> assign(js_hooks: Content.list_js_hooks(site))
      |> push_patch(to: beacon_live_admin_path(socket, site, "/hooks"))

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
    case socket.assigns.js_hooks do
      [] -> assign(socket, selected: nil)
      [hd | _] -> assign(socket, selected: hd)
    end
  end

  defp assign_selected(socket, id) when is_binary(id) do
    selected = Enum.find(socket.assigns.js_hooks, &(&1.id == id))
    assign(socket, selected: selected)
  end

  defp assign_form(socket) do
    form =
      case socket.assigns do
        %{selected: nil} ->
          nil

        %{selected: selected, beacon_page: %{site: site}} ->
          site
          |> Content.change_js_hook(selected)
          |> to_form()
      end

    assign(socket, form: form)
  end

  defp assign_form(socket, changeset) do
    assign(socket, form: to_form(changeset))
  end

  defp assign_js_hook_update(socket, updated_js_hook) do
    %{id: js_hook_id} = updated_js_hook

    js_hooks =
      Enum.map(socket.assigns.js_hooks, fn
        %{id: ^js_hook_id} -> updated_js_hook
        other -> other
      end)

    assign(socket, js_hooks: js_hooks)
  end

  def render(assigns) do
    ~H"""
    <div>
      <.header>
        <%= @page_title %>
        <:actions>
          <.button type="button" id="new-js-hook-button" phx-click="create_new" class="sui-primary uppercase">
            New JS Hook
          </.button>
        </:actions>
      </.header>

      <.main_content>
        <.modal :if={@show_nav_modal} id="confirm-nav" on_cancel={JS.push("stay_here")} show>
          <p>You've made unsaved changes to this JS Hook!</p>
          <p>Navigating to another hook without saving will cause these changes to be lost.</p>
          <.button type="button" phx-click="stay_here" class="sui-secondary">
            Stay here
          </.button>
          <.button type="button" phx-click="discard_changes" class="sui-primary-destructive">
            Discard changes
          </.button>
        </.modal>

        <.modal :if={@show_create_modal} id="create-modal" on_cancel={JS.push("cancel_create")} show>
          <:title>New JS Hook</:title>
          <.form :let={f} for={@create_form} id="create-form" phx-submit="save_new" class="px-4">
            <.input field={f[:name]} type="text" label="Hook name:" />
            <.button class="sui-primary mt-4">Save</.button>
          </.form>
        </.modal>

        <.modal :if={@show_delete_modal} id="delete-modal" on_cancel={JS.push("delete_cancel")} show>
          <p>Are you sure you want to delete this JS Hook?</p>
          <.button type="button" id="confirm-delete-button" phx-click="delete_confirm" class="sui-primary-destructive">
            Delete
          </.button>
          <.button type="button" phx-click="delete_cancel" class="sui-secondary">
            Cancel
          </.button>
        </.modal>

        <div class="grid items-start grid-cols-1 grid-rows-1 mx-auto gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <div class="h-full lg:overflow-y-auto pb-4 lg:h-[calc(100vh_-_239px)]">
            <.table id="js-hooks" rows={@js_hooks} row_click={fn row -> "select-#{row.id}" end}>
              <:col :let={js_hook} label="name">
                <%= Map.fetch!(js_hook, :name) %>
              </:col>
            </.table>
          </div>

          <div :if={@form} class="w-full col-span-2">
            <.form :let={f} for={@form} id="js-hook-form" class="flex items-start gap-4 mb-2" phx-change="validate" phx-submit="save_changes">
              <.input label="Name" field={f[:name]} type="text" />
              <input type="hidden" name="js_hook[code]" id="js_hook-form_code" value={Phoenix.HTML.Form.input_value(f, :code)} />
              <.button phx-disable-with="Saving..." class="sui-primary ml-auto">Save Changes</.button>
              <.button id="delete-js-hook-button" type="button" phx-click="delete" class="sui-primary-destructive">Delete</.button>
            </.form>

            <div class="w-full mt-2 space-y-8">
              <%= template_error(@form[:code]) %>
              <div class="py-6 rounded-[1.25rem] bg-[#0D1829] [&_.monaco-editor-background]:!bg-[#0D1829] [&_.margin]:!bg-[#0D1829]">
                <LiveMonacoEditor.code_editor
                  path="js_hook_code"
                  class="col-span-full lg:col-span-2"
                  value={@selected.code}
                  change="set_code"
                  opts={Map.merge(LiveMonacoEditor.default_opts(), %{"language" => "javascript"})}
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
