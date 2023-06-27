defmodule Beacon.LiveAdmin.PageEditorLive.FormComponent do
  use Beacon.LiveAdmin.Web, :live_component
  alias Beacon.LiveAdmin
  alias Beacon.LiveAdmin.Content

  @impl true
  def update(%{site: site, page: page} = assigns, socket) do
    changeset = Content.change_page(site, page)
    layouts = Content.list_layouts(site)

    {:ok,
     socket
     |> assign(assigns)
     |> assign_form(changeset)
     |> assign(:layouts, layouts)
     |> assign(:language, language(page.format))
     |> assign(:template, page.template)
     |> assign(:changed_template, page.template)}
  end

  def update(%{changed_template: changed_template}, socket) do
    {:ok, assign(socket, :changed_template, changed_template)}
  end

  defp assign_form(socket, changeset) do
    assign(socket, :form, to_form(changeset))
  end

  @impl true
  def handle_event(
        "validate",
        %{"_target" => ["page", "format"], "page" => %{"format" => format}},
        socket
      ) do
    socket = LiveMonacoEditor.change_language(socket, language(format), to: "template")
    {:noreply, socket}
  end

  def handle_event("validate", %{"page" => page_params}, socket) do
    changeset = Content.validate_page(socket.assigns.site, socket.assigns.page, page_params)
    {:noreply, assign_form(socket, changeset)}
  end

  def handle_event("save", %{"page" => page_params}, socket) do
    page_params = Map.put(page_params, "site", socket.assigns.site)
    save_page(socket, socket.assigns.action, page_params)
  end

  defp save_page(socket, :new, page_params) do
    case Content.create_page(socket.assigns.site, page_params) do
      {:ok, page} ->
        to = beacon_live_admin_path(socket, socket.assigns.site, "/pages/#{page.id}")

        {:noreply,
         socket
         |> put_flash(:info, "Page created successfully")
         |> push_patch(to: to)}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign_form(socket, changeset)}
    end
  end

  defp save_page(socket, :edit, page_params) do
    case Content.update_page(socket.assigns.site, socket.assigns.page, page_params) do
      {:ok, _page} ->
        {:noreply,
         socket
         |> put_flash(:info, "Page updated successfully")}

      {:error, %Ecto.Changeset{} = changeset} ->
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
          <.button :if={@action == :new} phx-disable-with="Saving..." form="page-form" class="uppercase">
            <.icon name="hero-document-plus" /> Create Draft Page
          </.button>
          <.button :if={@action == :edit} phx-disable-with="Saving..." form="page-form" class="uppercase">
            <.icon name="hero-document-plus" /> Save Changes
          </.button>
        </:actions>
      </.header>

      <div class="mx-auto grid grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <div class="mt-10 p-4 rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
          <.form :let={f} for={@form} id="page-form" class="space-y-8" phx-target={@myself} phx-change="validate" phx-submit="save">
            <.input field={f[:path]} type="text" label="Path" />
            <.input field={f[:title]} type="text" label="Title" />
            <.input field={f[:description]} type="textarea" label="Description" />
            <.input field={f[:layout_id]} type="select" options={layouts_to_options(@layouts)} label="Layout" />
            <.input field={f[:format]} type="select" label="Format" options={template_format_options(@site)} />
            <.input field={f[:template]} type="hidden" value={@changed_template} />
          </.form>
        </div>
        <div class="col-span-2">
          <div class="w-full mt-10 space-y-8">
            <div class="py-3 bg-[#282c34] rounded-lg">
              <LiveMonacoEditor.code_editor path="template" style="min-height: 1000px; width: 100%;" value={@template} opts={Map.merge(LiveMonacoEditor.default_opts(), %{"language" => @language})} />
            </div>
          </div>
        </div>
      </div>
    </div>
    """
  end

  defp layouts_to_options(layouts) do
    Enum.map(layouts, &{&1.title, &1.id})
  end

  defp template_format_options(site) do
    config = LiveAdmin.config!(site)

    Keyword.new(config.template_formats, fn {identifier, description} ->
      {String.to_atom(description), identifier}
    end)
  end

  defp language("heex" = _format), do: "html"
  defp language(:heex), do: "html"
  defp language(format), do: to_string(format)
end
