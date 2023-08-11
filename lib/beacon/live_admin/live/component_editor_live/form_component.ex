defmodule Beacon.LiveAdmin.ComponentEditorLive.FormComponent do
  use Beacon.LiveAdmin.Web, :live_component
  alias Beacon.LiveAdmin.Content

  @impl true
  def update(%{site: site, component: component} = assigns, socket) do
    changeset = Content.change_component(site, component)

    {:ok,
     socket
     |> assign(assigns)
     |> assign(:body, component.body)
     |> assign(:changed_body, component.body)
     |> assign_form(changeset)}
  end

  def update(%{changed_body: changed_body}, socket) do
    {:ok, assign(socket, :changed_body, changed_body)}
  end

  defp assign_form(socket, changeset) do
    assign(socket, :form, to_form(changeset))
  end

  @impl true
  def handle_event("save", %{"component" => component_params}, socket) do
    component_params = Map.put(component_params, "site", socket.assigns.site)
    save_component(socket, socket.assigns.live_action, component_params)
  end

  defp save_component(socket, :new, component_params) do
    case Content.create_component(socket.assigns.site, component_params) do
      {:ok, component} ->
        to = beacon_live_admin_path(socket, socket.assigns.site, "/components/#{component.id}")

        {:noreply,
         socket
         |> put_flash(:info, "Component created successfully")
         |> push_patch(to: to)}

      {:error, changeset} ->
        changeset = Map.put(changeset, :action, :insert)
        {:noreply, assign_form(socket, changeset)}
    end
  end

  defp save_component(socket, :edit, component_params) do
    case Content.update_component(socket.assigns.site, socket.assigns.component, component_params) do
      {:ok, component} ->
        changeset = Content.change_component(socket.assigns.site, component)

        {:noreply,
         socket
         |> assign(:component, component)
         |> assign_form(changeset)
         |> put_flash(:info, "Component updated successfully")}

      {:error, changeset} ->
        changeset = Map.put(changeset, :action, :update)
        {:noreply, assign_form(socket, changeset)}
    end
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div>
      <.header>
        <%= @page_title %>
        <:actions>
          <.button phx-disable-with="Saving..." form="component-form" class="uppercase">Save Changes</.button>
        </:actions>
      </.header>

      <div class="mx-auto grid grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <div class="mt-10 p-4 rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
          <.form :let={f} for={@form} id="component-form" class="space-y-8" phx-target={@myself} phx-submit="save">
            <.input field={f[:name]} type="text" label="Name" />
            <.input field={f[:category]} type="select" options={categories_to_options(@site)} label="Category" />
            <input type="hidden" name="component[body]" id="component-form_body" value={@changed_body} />
          </.form>
        </div>
        <div class="col-span-2">
          <%= template_error(@form[:body]) %>
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

  defp categories_to_options(site) do
    Enum.map(Content.component_categories(site), &{Phoenix.Naming.humanize(&1), &1})
  end
end
