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
     |> assign(:body, beacon_layout.body)
     |> assign(:changed_body, beacon_layout.body)
     |> assign(:status, layout_status(beacon_layout))}
  end

  def update(%{changed_body: changed_body}, socket) do
    {:ok, assign(socket, :changed_body, changed_body)}
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
         |> push_navigate(to: to)}

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
        {:noreply, assign_form(socket, changeset)}
    end
  end

  defp save_layout(socket, :edit, layout_params) do
    case Content.update_layout(socket.assigns.site, socket.assigns.beacon_layout, layout_params) do
      {:ok, layout} ->
        changeset = Content.change_layout(socket.assigns.site, layout)

        {:noreply,
         socket
         |> assign_form(changeset)
         |> put_flash(:info, "Layout updated successfully")}

      {:error, %Ecto.Changeset{} = changeset} ->
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
          <.link patch={beacon_live_admin_path(@socket, @site, "/layouts/#{@beacon_layout.id}/history")}>
            <span :if={@status == :created}>
              <.icon name="hero-document-plus-solid" class="h-5 w-5" /> <%= display_status(@status) %>
            </span>
            <span :if={@status == :published}>
              <.icon name="hero-eye-solid" class="h-5 w-5" /> <%= display_status(@status) %>
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
            class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            phx-click={JS.exec("data-cancel", to: "#publish-confirm-modal")}
          >
            Cancel
          </button>
          <button
            type="button"
            class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:w-auto"
            phx-click="publish"
            phx-value-id={@beacon_layout.id}
            phx-target={@myself}
          >
            Confirm
          </button>
        </div>
      </.modal>

      <div class="mx-auto grid grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <div class="mt-10 p-4 rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
          <.form :let={f} for={@form} id="layout-form" class="space-y-8" phx-target={@myself} phx-change="validate" phx-submit="save">
            <.input field={f[:title]} type="text" label="Title" />
            <.input field={f[:body]} type="hidden" value={@changed_body} />
          </.form>
        </div>
        <div class="col-span-2">
          <div class="w-full mt-10 space-y-8">
            <div class="py-3 bg-[#282c34] rounded-lg">
              <LiveMonacoEditor.code_editor path="body" style="min-height: 1000px; width: 100%;" value={@body} opts={Map.merge(LiveMonacoEditor.default_opts(), %{"language" => "html"})} />
            </div>
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
