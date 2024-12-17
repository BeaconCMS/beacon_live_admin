defmodule Beacon.LiveAdmin.ErrorPageEditorLive.Index do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Client.Content

  @impl true
  def menu_link(_, :index), do: {:root, "Error Pages"}

  @impl true
  def handle_params(params, _uri, socket) do
    %{beacon_page: %{site: site}} = socket.assigns

    socket =
      socket
      |> assign(page_title: "Error Pages")
      |> assign(unsaved_changes: false)
      |> assign(show_create_modal: false)
      |> assign(show_nav_modal: false)
      |> assign(show_delete_modal: false)
      |> assign(show_status_change_field: false)
      |> assign(create_form: to_form(%{}, as: :error_page))
      |> assign_new(:error_pages, fn -> Content.list_error_pages(site) end)
      |> assign_new(:layouts, fn -> Content.list_layouts(site) end)
      |> assign_selected(params["status"])
      |> assign_form()

    {:noreply, socket}
  end

  @impl true
  def handle_event("select-" <> status, _, socket) do
    %{beacon_page: %{site: site}} = socket.assigns

    path = beacon_live_admin_path(socket, site, "/error_pages/#{status}")

    if socket.assigns.unsaved_changes do
      {:noreply, assign(socket, show_nav_modal: true, confirm_nav_path: path)}
    else
      {:noreply, push_navigate(socket, to: path)}
    end
  end

  def handle_event("set_template", %{"value" => template}, socket) do
    %{selected: selected, beacon_page: %{site: site}, form: form} = socket.assigns

    params = Map.merge(form.params, %{"template" => template})
    changeset = Content.change_error_page(site, selected, params)

    socket =
      socket
      |> assign_form(changeset)
      |> assign(unsaved_changes: !(changeset.changes == %{}))

    {:noreply, socket}
  end

  def handle_event("create_new", _, socket) do
    {:noreply, assign(socket, show_create_modal: true)}
  end

  def handle_event("change_status", _, socket) do
    {:noreply, assign(socket, show_status_change_field: true)}
  end

  def handle_event("save_new", %{"status" => status}, socket) do
    %{beacon_page: %{site: site}, layouts: layouts} = socket.assigns

    attrs = %{
      "status" => status,
      "site" => site,
      "template" => "Something went wrong",
      "layout_id" => Enum.find(layouts, &(&1.title == "Default")).id
    }

    socket =
      case Content.create_error_page(site, attrs) do
        {:ok, _} ->
          socket
          |> assign(error_pages: Content.list_error_pages(site))
          |> assign_selected(status)
          |> assign(show_create_modal: false)
          |> push_navigate(to: beacon_live_admin_path(socket, site, "/error_pages/#{status}"))

        {:error, changeset} ->
          assign(socket, create_form: to_form(changeset))
      end

    {:noreply, socket}
  end

  def handle_event("save_changes", %{"error_page" => params}, socket) do
    %{selected: selected, beacon_page: %{site: site}} = socket.assigns

    attrs = %{layout_id: params["layout_id"], template: params["template"]}

    socket =
      case Content.update_error_page(site, selected, attrs) do
        {:ok, updated_error_page} ->
          socket
          |> assign_error_page_update(updated_error_page)
          |> assign_selected(selected.status)
          |> assign_form()
          |> assign(unsaved_changes: false)
          |> put_flash(:info, "Error page updated successfully")

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
    %{selected: error_page, beacon_page: %{site: site}} = socket.assigns

    {:ok, _} = Content.delete_error_page(site, error_page)

    socket =
      socket
      |> assign(error_pages: Content.list_error_pages(site))
      |> push_patch(to: beacon_live_admin_path(socket, site, "/error_pages"))

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
    case socket.assigns.error_pages do
      [] -> assign(socket, selected: nil, changed_template: "")
      [hd | _] -> assign(socket, selected: hd, changed_template: hd.template)
    end
  end

  defp assign_selected(socket, status) when is_binary(status) do
    assign_selected(socket, String.to_integer(status))
  end

  defp assign_selected(socket, status) when is_integer(status) do
    selected = Enum.find(socket.assigns.error_pages, &(&1.status == status))
    assign(socket, selected: selected, changed_template: selected.template)
  end

  defp assign_form(socket) do
    form =
      case socket.assigns do
        %{selected: nil} ->
          nil

        %{selected: selected, beacon_page: %{site: site}} ->
          site
          |> Content.change_error_page(selected)
          |> to_form()
      end

    assign(socket, form: form)
  end

  defp assign_form(socket, changeset) do
    assign(socket, :form, to_form(changeset))
  end

  defp assign_error_page_update(socket, updated_error_page) do
    %{id: error_page_id} = updated_error_page

    error_pages =
      Enum.map(socket.assigns.error_pages, fn
        %{id: ^error_page_id} -> updated_error_page
        other -> other
      end)

    assign(socket, error_pages: error_pages)
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div>
      <.header>
        <%= @page_title %>
        <:actions>
          <.button type="button" id="new-error-page-button" phx-click="create_new" class="sui-primary uppercase">
            New Error Page
          </.button>
        </:actions>
      </.header>

      <.main_content>
        <.modal :if={@show_nav_modal} id="confirm-nav" on_cancel={JS.push("stay_here")} show>
          <p>You've made unsaved changes to this error page!</p>
          <p>Navigating to another error page without saving will cause these changes to be lost.</p>
          <.button type="button" class="sui-secondary" phx-click="stay_here">
            Stay here
          </.button>
          <.button type="button" class="sui-primary-destructive" phx-click="discard_changes">
            Discard changes
          </.button>
        </.modal>

        <.modal :if={@show_create_modal} id="create-modal" on_cancel={JS.push("cancel_create")} show>
          <:title>New Error Page</:title>
          <.form :let={f} for={@create_form} id="create-form" phx-submit="save_new" class="px-4">
            <.input field={f[:status]} type="select" label="Status code for new error page:" options={Content.valid_error_statuses(@beacon_page.site)} />
            <.button class="sui-primary mt-4">Save</.button>
          </.form>
        </.modal>

        <.modal :if={@show_delete_modal} id="delete-modal" on_cancel={JS.push("delete_cancel")} show>
          <p>Are you sure you want to delete this error page?</p>
          <.button type="button" id="confirm-delete-button" phx-click="delete_confirm" class="sui-primary-destructive">
            Delete
          </.button>
          <.button type="button" phx-click="delete_cancel" class="sui-secondary">
            Cancel
          </.button>
        </.modal>

        <div class="grid items-start grid-cols-1 grid-rows-1 mx-auto gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <div class="h-full lg:overflow-y-auto pb-4 lg:h-[calc(100vh_-_239px)]">
            <.table id="error-pages" rows={@error_pages} row_click={fn row -> "select-#{row.status}" end}>
              <:col :let={error_page} label="status">
                <%= Map.fetch!(error_page, :status) %>
              </:col>
            </.table>
          </div>

          <div :if={@form} class="w-full col-span-2">
            <.form :let={f} for={@form} id="error-page-form" class="flex items-end gap-4" phx-submit="save_changes">
              <.input label="Status" field={f[:status]} type="text" disabled readonly />
              <.input label="Layout" field={f[:layout_id]} options={Enum.map(@layouts, &{&1.title, &1.id})} value={@selected.layout_id} type="select" />
              <.input type="hidden" field={f[:template]} name="error_page[template]" id="error_page-form_template" value={Phoenix.HTML.Form.input_value(f, :template)} />

              <.button phx-disable-with="Saving..." class="sui-primary ml-auto">Save Changes</.button>
              <.button id="delete-error-page-button" type="button" phx-click="delete" class="sui-primary-destructive">Delete</.button>
            </.form>

            <div class="w-full mt-10 space-y-8">
              <div class="py-6 rounded-[1.25rem] bg-[#0D1829] [&_.monaco-editor-background]:!bg-[#0D1829] [&_.margin]:!bg-[#0D1829]">
                <LiveMonacoEditor.code_editor
                  path="error_page_template"
                  class="col-span-full lg:col-span-2"
                  value={@selected.template}
                  change="set_template"
                  opts={Map.merge(LiveMonacoEditor.default_opts(), %{"language" => "html"})}
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
