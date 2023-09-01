defmodule Beacon.LiveAdmin.PageEditorLive.Variants do
  @moduledoc false
  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Content

  def menu_link("/pages", :variants), do: {:submenu, "Pages"}
  def menu_link(_, _), do: :skip

  # For switching between selected variants, first load has already happened
  def handle_params(params, _url, %{assigns: %{page: %{variants: [_ | _]}}} = socket) do
    {:noreply, assign_selected(socket, params["variant_id"])}
  end

  # For the first page load
  def handle_params(params, _url, socket) do
    page =
      Content.get_page(socket.assigns.beacon_page.site, params["page_id"], preloads: [:variants])

    socket =
      socket
      |> assign(page: page)
      |> assign(unsaved_changes: false)
      |> assign(show_nav_modal: false)
      |> assign(show_delete_modal: false)
      |> assign(language: language(page.format))
      |> assign(page_title: "Variants")
      |> assign_selected(params["variant_id"])
      |> assign_form()

    {:noreply, socket}
  end

  def handle_event("select-" <> variant_id, _, socket) do
    %{page: page} = socket.assigns
    path = beacon_live_admin_path(socket, page.site, "/pages/#{page.id}/variants/#{variant_id}")

    if socket.assigns.unsaved_changes do
      {:noreply, assign(socket, show_nav_modal: true, confirm_nav_path: path)}
    else
      {:noreply, push_redirect(socket, to: path)}
    end
  end

  def handle_event("variant_editor_lost_focus", %{"value" => template}, socket) do
    %{selected: selected, beacon_page: %{site: site}, form: form} = socket.assigns

    changeset =
      site
      |> Content.change_page_variant(selected, %{
        "template" => template,
        "name" => form.params["name"] || Map.fetch!(form.data, :name),
        "weight" => form.params["weight"] || Map.fetch!(form.data, :weight)
      })
      |> Map.put(:action, :validate)

    socket =
      socket
      |> assign(form: to_form(changeset))
      |> assign(changed_template: template)
      |> assign(unsaved_changes: !(changeset.changes == %{}))

    {:noreply, socket}
  end

  def handle_event("validate", %{"page_variant" => params}, socket) do
    %{selected: selected, beacon_page: %{site: site}} = socket.assigns

    changeset =
      site
      |> Content.change_page_variant(selected, params)
      |> Map.put(:action, :validate)

    socket =
      socket
      |> assign(form: to_form(changeset))
      |> assign(unsaved_changes: !(changeset.changes == %{}))

    {:noreply, socket}
  end

  def handle_event("save_changes", %{"page_variant" => params}, socket) do
    %{page: page, selected: selected, beacon_page: %{site: site}} = socket.assigns

    attrs = %{name: params["name"], weight: params["weight"], template: params["template"]}

    socket =
      case Content.update_variant_for_page(site, page, selected, attrs) do
        {:ok, updated_page} ->
          socket
          |> assign(page: updated_page)
          |> assign_selected(selected.id)
          |> assign_form()
          |> assign(unsaved_changes: false)

        {:error, changeset} ->
          changeset = Map.put(changeset, :action, :update)
          assign(socket, form: to_form(changeset))
      end

    {:noreply, socket}
  end

  def handle_event("create_new", _params, socket) do
    %{page: page, beacon_page: %{site: site}} = socket.assigns
    selected = socket.assigns.selected || %{id: nil}

    attrs = %{name: "New Variant", weight: 0, template: page.template}
    {:ok, updated_page} = Content.create_variant_for_page(site, page, attrs)

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
    %{selected: variant, page: page, beacon_page: %{site: site}} = socket.assigns
    path = beacon_live_admin_path(socket, site, "/pages/#{page.id}/variants")

    {:ok, _} = Content.delete_variant_from_page(site, page, variant)

    {:noreply, push_redirect(socket, to: path)}
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

  def render(assigns) do
    ~H"""
    <div>
      <Beacon.LiveAdmin.AdminComponents.page_menu socket={@socket} site={@beacon_page.site} current_action={@live_action} page_id={@page.id} />

      <.header>
        <%= @page_title %>
        <:actions>
          <.button type="button" phx-click="create_new">New Variant</.button>
        </:actions>

      </.header>
      <.main_content class="h-[calc(100vh_-_223px)]">

      <.modal :if={@show_nav_modal} id="confirm-nav" on_cancel={JS.push("stay_here")} show>
        <p>You've made unsaved changes to this variant!</p>
        <p>Navigating to another variant without saving will cause these changes to be lost.</p>
        <.button type="button" phx-click="stay_here">
          Stay here
        </.button>
        <.button type="button" phx-click="discard_changes">
          Discard changes
        </.button>
      </.modal>

      <.modal :if={@show_delete_modal} id="confirm-delete" on_cancel={JS.push("delete_cancel")} show>
        <p class="mb-2">Are you sure you want to delete this variant?</p>
        <p class="mb-2"><b>Note:</b> deleted variants will still be active until the page is re-published!</p>
        <div class="flex justify-end w-full gap-4 mt-10">
          <.button type="button" phx-click="delete_confirm">
            Delete
          </.button>
          <.button type="button" phx-click="delete_cancel">
            Cancel
          </.button>
        </div>

      </.modal>

      <div class="grid items-start grid-cols-1 grid-rows-1 mx-auto gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <div class="h-full lg:overflow-y-auto lg:h-[calc(100vh_-_239px)]">
          <.table :if={@selected} id="variants" rows={@page.variants} row_click={fn row -> "select-#{row.id}" end}>
            <:col :let={variant} :for={{attr, suffix} <- [{:name, ""}, {:weight, " (%)"}]} label={"#{attr}#{suffix}"}>
              <%= Map.fetch!(variant, attr) %>
            </:col>
          </.table>
        </div>

        <div :if={@form} class="w-full col-span-2">
          <.form :let={f} for={@form} class="flex items-end gap-4" phx-change="validate" phx-submit="save_changes">
            <.input label="Name" field={f[:name]} type="text" />
            <.input label="weight" field={f[:weight]} type="number" min="0" max="100" />

            <input type="hidden" name="page_variant[template]" id="page_variant-form_template" value={@changed_template} />

            <.button phx-disable-with="Saving..." class="ml-auto">Save Changes</.button>
            <.button type="button" phx-click="delete" class="">Delete</.button>
          </.form>
          <%= template_error(@form[:template]) %>
          <div class="w-full mt-10 space-y-8">
            <div class="py-6 h-[500px] lg:h-[calc(100vh_-_349px)] rounded-[1.25rem] lg:rounded-t-[1.25rem] lg:rounded-b-none bg-[#0D1829] [&_.monaco-editor-background]:!bg-[#0D1829] [&_.margin]:!bg-[#0D1829]">
              <LiveMonacoEditor.code_editor
                path="variant"
                class="h-full col-span-full lg:col-span-2"
                value={@selected.template}
                opts={Map.merge(LiveMonacoEditor.default_opts(), %{"language" => @language})}
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
    case socket.assigns.page.variants do
      [] -> assign(socket, selected: nil, changed_template: "")
      [variant | _] -> assign(socket, selected: variant, changed_template: variant.template)
    end
  end

  defp assign_selected(socket, variant_id) do
    selected = Enum.find(socket.assigns.page.variants, &(&1.id == variant_id))
    assign(socket, selected: selected, changed_template: selected.template)
  end

  defp assign_form(socket) do
    form =
      case socket.assigns do
        %{selected: nil} ->
          nil

        %{selected: selected, beacon_page: %{site: site}} ->
          site
          |> Content.change_page_variant(selected)
          |> to_form()
      end

    assign(socket, form: form)
  end

  defp language("heex" = _format), do: "html"
  defp language(:heex), do: "html"
  defp language(format), do: to_string(format)
end
