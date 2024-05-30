defmodule Beacon.LiveAdmin.ComponentEditorLive.FormComponent do
  use Beacon.LiveAdmin.Web, :live_component
  alias Beacon.LiveAdmin.Content

  @impl true
  def update(%{site: site, component: component} = assigns, socket) do
    changeset = Content.change_component(site, component)

    {:ok,
     socket
     |> assign(assigns)
     |> assign_form(changeset)}
  end

  def update(%{template: value}, socket) do
    params = Map.merge(socket.assigns.form.params, %{"template" => value})
    changeset = Content.change_component(socket.assigns.site, socket.assigns.component, params)
    {:ok, assign_form(socket, changeset)}
  end

  @impl true
  def handle_event("validate", %{"component" => component_params}, socket) do
    changeset =
      socket.assigns.site
      |> Content.change_component(socket.assigns.component, component_params)
      |> Map.put(:action, :validate)

    {:noreply, assign_form(socket, changeset)}
  end

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

  defp assign_form(socket, changeset) do
    assign(socket, :form, to_form(changeset))
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div>
      <.flash_group flash={@flash} />

      <.header>
        <%= @page_title %>
        <:actions>
          <.button phx-disable-with="Saving..." form="component-form" class="uppercase">Save Changes</.button>
        </:actions>
      </.header>

      <div class="grid items-start lg:h-[calc(100vh_-_144px)] grid-cols-1 mx-auto mt-4 gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <div class="p-4 bg-white col-span-full lg:col-span-1 rounded-[1.25rem] lg:rounded-t-[1.25rem] lg:rounded-b-none lg:h-full">
          <.form :let={f} for={@form} id="component-form" class="space-y-8" phx-target={@myself} phx-change="validate" phx-submit="save">
            <legend class="text-sm font-bold tracking-widest text-[#445668] uppercase">Component settings</legend>
            <.input field={f[:name]} type="text" label="Name" />
            <.input field={f[:category]} type="select" options={categories_to_options(@site)} label="Category" />
            <input type="hidden" name="component[template]" id="component-form_template" value={Phoenix.HTML.Form.input_value(f, :template)} />
          </.form>
        </div>
        <div class="col-span-full lg:col-span-2">
          <%= template_error(@form[:template]) %>
          <div class="py-6 w-full rounded-[1.25rem] bg-[#0D1829] [&_.monaco-editor-background]:!bg-[#0D1829] [&_.margin]:!bg-[#0D1829]">
            <LiveMonacoEditor.code_editor
              path="template"
              class="col-span-full lg:col-span-2"
              value={Phoenix.HTML.Form.input_value(@form, :template)}
              change="set_template"
              opts={Map.merge(LiveMonacoEditor.default_opts(), %{"language" => "html"})}
            />
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
