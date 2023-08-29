defmodule Beacon.LiveAdmin.ErrorPageEditorLive.Index do
  @moduledoc false
  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Content

  on_mount({Beacon.LiveAdmin.Hooks.Authorized, {:error_pages, :index}})

  def menu_link(_, :index), do: {:root, "Error Pages"}

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

  def handle_event("select-" <> status, _, socket) do
    %{beacon_page: %{site: site}} = socket.assigns

    path = beacon_live_admin_path(socket, site, "/error_pages/#{status}")

    if socket.assigns.unsaved_changes do
      {:noreply, assign(socket, show_nav_modal: true, confirm_nav_path: path)}
    else
      {:noreply, push_redirect(socket, to: path)}
    end
  end

  def handle_event("error_page_template_editor_lost_focus", %{"value" => template}, socket) do
    %{selected: selected, beacon_page: %{site: site}, form: form} = socket.assigns

    changeset =
      site
      |> Content.change_error_page(selected, %{
        "site" => site,
        "template" => template,
        "status" => form.params["status"] || Map.fetch!(form.data, :status),
        "layout_id" => form.params["layout_id"] || Map.fetch!(form.data, :layout_id)
      })
      |> Map.put(:action, :validate)

    socket =
      socket
      |> assign(form: to_form(changeset))
      |> assign(changed_template: template)
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
          |> push_redirect(to: beacon_live_admin_path(socket, site, "/error_pages/#{status}"))

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
    {:noreply, push_redirect(socket, to: socket.assigns.confirm_nav_path)}
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

  defp assign_error_page_update(socket, updated_error_page) do
    %{id: error_page_id} = updated_error_page

    error_pages =
      Enum.map(socket.assigns.error_pages, fn
        %{id: ^error_page_id} -> updated_error_page
        other -> other
      end)

    assign(socket, error_pages: error_pages)
  end

  def render(assigns) do
    ~H"""
    <div>
      <.header>
        <%= @page_title %>
        <:actions>
          <.button phx-disable-with="Saving..." form="error-page-form" class="uppercase">Save Changes</.button>
        </:actions>
        <:actions>
          <.button type="button" id="delete-error-page-button" phx-click="delete" phx-disable-with="Deleting..." class="uppercase">Delete</.button>
        </:actions>
      </.header>

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
          <.input field={f[:status]} type="select" label="Status code for new error page:" options={Content.valid_error_statuses(@beacon_page.site)} />
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

      <div class="mx-auto grid grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <div>
          <.button type="button" id="new-error-page-button" phx-click="create_new">
            New Error Page
          </.button>
          <.table id="error-pages" rows={@error_pages} row_click={fn row -> "select-#{row.status}" end}>
            <:col :let={error_page} label="status">
              <%= Map.fetch!(error_page, :status) %>
            </:col>
          </.table>
        </div>

        <div :if={@form} class="w-full col-span-2">
          <.form :let={f} for={@form} id="error-page-form" class="items-center" phx-submit="save_changes">
            <div class="flex mb-6">
              <div class="mr-4 text-4xl" id="status-display">
                Status: <%= @selected.status %>
              </div>
            </div>
            <div class="flex mb-6">
              <div class="text-4xl mr-4">
                Layout:
              </div>
              <.input type="select" field={f[:layout_id]} name="error_page[layout_id]" options={Enum.map(@layouts, &{&1.title, &1.id})} value={@selected.layout_id} />
            </div>
            <.input type="hidden" field={f[:template]} name="error_page[template]" id="error_page-form_template" value={@changed_template} />
          </.form>

          <div class="w-full mt-10 space-y-8">
            <div class="py-3 bg-[#282c34] rounded-lg">
              <LiveMonacoEditor.code_editor
                path="error_page_template"
                style="min-height: 1000px; width: 100%;"
                value={@selected.template}
                opts={Map.merge(LiveMonacoEditor.default_opts(), %{"language" => "html"})}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    """
  end
end
