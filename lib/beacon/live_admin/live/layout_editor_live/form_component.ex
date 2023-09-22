defmodule Beacon.LiveAdmin.LayoutEditorLive.FormComponent do
  use Beacon.LiveAdmin.Web, :live_component
  alias Beacon.LiveAdmin.Content

  @impl true
  def update(%{site: site, beacon_layout: beacon_layout} = assigns, socket) do
    changeset = Content.change_layout(site, beacon_layout)

    {:ok,
     socket
     |> assign(assigns)
     |> assign_form(changeset)
     |> assign(:template, beacon_layout.template)
     |> assign(:changed_template, beacon_layout.template)
     |> assign(:status, layout_status(beacon_layout))}
  end

  def update(%{changed_template: changed_template}, socket) do
    {:ok, assign(socket, :changed_template, changed_template)}
  end

  defp layout_status(%{site: nil, id: nil}), do: nil

  defp layout_status(%{site: site, id: id}),
    do: Beacon.LiveAdmin.Content.get_latest_layout_event(site, id).event

  defp assign_form(socket, changeset) do
    assign(socket, :form, to_form(changeset))
  end

  @impl true
  def handle_event("validate", %{"layout" => layout_params}, socket) do
    changeset =
      socket.assigns.site
      |> Content.change_layout(socket.assigns.beacon_layout, layout_params)
      |> Map.put(:action, :validate)

    {:noreply, assign_form(socket, changeset)}
  end

  def handle_event("save", %{"layout" => layout_params}, socket) do
    layout_params = Map.put(layout_params, "site", socket.assigns.site)
    save_layout(socket, socket.assigns.live_action, layout_params)
  end

  def handle_event("publish", %{"id" => id}, socket) do
    case Content.publish_layout(socket.assigns.site, id) do
      {:ok, _} ->
        to = beacon_live_admin_path(socket, socket.assigns.site, "/layouts")

        {:noreply,
         socket
         |> put_flash(:info, "Layout published successfully")
         |> push_redirect(to: to, replace: true)}

      {:error, _} ->
        {:noreply,
         socket
         |> put_flash(:error, "Failed to publish layout")}
    end
  end

  defp save_layout(socket, :new, layout_params) do
    case Content.create_layout(socket.assigns.site, layout_params) do
      {:ok, layout} ->
        to = beacon_live_admin_path(socket, socket.assigns.site, "/layouts/#{layout.id}")

        {:noreply,
         socket
         |> put_flash(:info, "Layout created successfully")
         |> push_patch(to: to)}

      {:error, changeset} ->
        changeset = Map.put(changeset, :action, :insert)
        {:noreply, assign_form(socket, changeset)}
    end
  end

  defp save_layout(socket, :edit, layout_params) do
    case Content.update_layout(socket.assigns.site, socket.assigns.beacon_layout, layout_params) do
      {:ok, layout} ->
        changeset = Content.change_layout(socket.assigns.site, layout)

        {:noreply,
         socket
         |> assign(:layout, layout)
         |> assign_form(changeset)
         |> put_flash(:info, "Layout updated successfully")}

      {:error, changeset} ->
        changeset = Map.put(changeset, :action, :update)
        {:noreply, assign_form(socket, changeset)}
    end
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div>
      <Beacon.LiveAdmin.AdminComponents.layout_menu socket={@socket} site={@site} current_action={@live_action} layout_id={@beacon_layout.id} />

      <.header>
        <%= layout_name(@form.source) %>

        <div class="text-sm text-gray-500">
          <.link patch={beacon_live_admin_path(@socket, @site, "/layouts/#{@beacon_layout.id}/revisions")}>
            <span :if={@status == :created}>
              <.icon name="hero-document-plus-solid" class="w-5 h-5" /> <%= display_status(@status) %>
            </span>
            <span :if={@status == :published}>
              <.icon name="hero-eye-solid" class="w-5 h-5" /> <%= display_status(@status) %>
            </span>
          </.link>
        </div>

        <:actions>
          <.button :if={@live_action == :new} phx-disable-with="Saving..." form="layout-form" class="uppercase">Create Draft Layout</.button>
          <.button :if={@live_action == :edit} phx-disable-with="Saving..." form="layout-form" class="uppercase">Save Changes</.button>
          <.button :if={@live_action == :edit} phx-click={show_modal("publish-confirm-modal")} phx-target={@myself} class="uppercase">Publish</.button>
        </:actions>
      </.header>

      <.modal id="publish-confirm-modal">
        <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Publish Layout</h3>
        <div class="mt-2">
          <p class="text-sm text-gray-500">Are you sure you want to publish this layout and make it public? Please make sure all changes were saved before publishing it.</p>
        </div>
        <div class="py-4">
          <button
            type="button"
            class="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            phx-click={JS.exec("data-cancel", to: "#publish-confirm-modal")}
          >
            Cancel
          </button>
          <button
            type="button"
            class="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-500 sm:w-auto"
            phx-click="publish"
            phx-value-id={@beacon_layout.id}
            phx-target={@myself}
          >
            Confirm
          </button>
        </div>
      </.modal>

      <div class="grid items-start lg:h-[calc(100vh_-_144px)] grid-cols-1 mx-auto mt-4 gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <div class="p-4 bg-white col-span-full lg:col-span-1 rounded-[1.25rem] lg:rounded-t-[1.25rem] lg:rounded-b-none lg:h-full">
          <.form :let={f} for={@form} id="layout-form" class="space-y-8" phx-target={@myself} phx-change="validate" phx-submit="save">
            <legend class="text-sm font-bold tracking-widest text-[#445668] uppercase">Layout Settings</legend>
            <.input field={f[:title]} type="text" label="Title" />
            <input type="hidden" name="layout[template]" id="layout-form_template" value={@changed_template} />
          </.form>
        </div>
        <div class="col-span-full lg:col-span-2">
          <%= template_error(@form[:template]) %>
          <div class="py-6 w-full rounded-[1.25rem] bg-[#0D1829] [&_.monaco-editor-background]:!bg-[#0D1829] [&_.margin]:!bg-[#0D1829]">
            <LiveMonacoEditor.code_editor path="template" class="col-span-full lg:col-span-2" value={@template} opts={Map.merge(LiveMonacoEditor.default_opts(), %{"language" => "html"})} />
          </div>
        </div>
      </div>
    </div>
    """
  end

  defp layout_name(source), do: Ecto.Changeset.get_field(source, :title)

  defp display_status(:published), do: "Published (public)"
  defp display_status(:created), do: "Draft (not public)"
end
