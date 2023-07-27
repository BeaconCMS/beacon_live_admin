defmodule Beacon.LiveAdmin.PageEditorLive.FormComponent do
  use Beacon.LiveAdmin.Web, :live_component
  alias Beacon.LiveAdmin.Config
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
     |> assign(:changed_template, page.template)
     |> assign_extra_fields(changeset)}
  end

  def update(%{changed_template: changed_template}, socket) do
    {:ok, assign(socket, :changed_template, changed_template)}
  end

  defp assign_form(socket, changeset) do
    assign(socket, :form, to_form(changeset))
  end

  defp assign_extra_fields(socket, changeset) do
    params = Ecto.Changeset.get_field(changeset, :extra)

    extra_fields =
      Content.page_extra_fields(
        socket.assigns.page.site,
        socket.assigns.form,
        params,
        changeset.errors
      )

    assign(socket, :extra_fields, extra_fields)
  end

  @impl true
  def handle_event(
        "validate",
        %{"_target" => ["page", "format"], "page" => page_params},
        socket
      ) do
    socket =
      LiveMonacoEditor.change_language(socket, language(page_params["format"]), to: "template")

    changeset = Content.validate_page(socket.assigns.site, socket.assigns.page, page_params)
    {:noreply, assign_form(socket, changeset)}
  end

  def handle_event("validate", %{"page" => page_params}, socket) do
    changeset = Content.validate_page(socket.assigns.site, socket.assigns.page, page_params)

    {:noreply,
     socket
     |> assign_form(changeset)
     |> assign_extra_fields(changeset)}
  end

  def handle_event("save", %{"page" => page_params}, socket) do
    page_params = Map.put(page_params, "site", socket.assigns.site)
    save_page(socket, socket.assigns.live_action, page_params)
  end

  def handle_event("publish", %{"id" => id}, socket) do
    case Content.publish_page(socket.assigns.site, id) do
      {:ok, _} ->
        to = beacon_live_admin_path(socket, socket.assigns.site, "/pages")

        {:noreply,
         socket
         |> put_flash(:info, "Page published successfully")
         |> push_navigate(to: to)}

      {:error, _} ->
        {:noreply,
         socket
         |> put_flash(:error, "Failed to publish page")}
    end
  end

  defp save_page(socket, :new, page_params) do
    case Content.create_page(socket.assigns.site, page_params) do
      {:ok, page} ->
        to = beacon_live_admin_path(socket, socket.assigns.site, "/pages/#{page.id}")

        {:noreply,
         socket
         |> put_flash(:info, "Page created successfully")
         |> push_patch(to: to)}

      {:error, changeset} ->
        {:noreply, assign_form(socket, changeset)}
    end
  end

  defp save_page(socket, :edit, page_params) do
    case Content.update_page(socket.assigns.site, socket.assigns.page, page_params) do
      {:ok, page} ->
        changeset = Content.change_page(socket.assigns.site, page)

        {:noreply,
         socket
         |> assign_form(changeset)
         |> assign_extra_fields(changeset)
         |> put_flash(:info, "Page updated successfully")}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign_form(socket, changeset)}
    end
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div>
      <Beacon.LiveAdmin.AdminComponents.page_menu socket={@socket} site={@site} current_action={@live_action} page_id={@page.id} />

      <.header>
        <%= @page_title %>
        <:actions>
          <.button :if={@live_action == :new} phx-disable-with="Saving..." form="page-form" class="uppercase">Create Draft Page</.button>
          <.button :if={@live_action == :edit} phx-disable-with="Saving..." form="page-form" class="uppercase">Save Changes</.button>
          <.button :if={@live_action == :edit} phx-click={show_modal("publish-confirm-modal")} phx-target={@myself} class="uppercase">Publish</.button>
        </:actions>
      </.header>

      <.modal id="publish-confirm-modal">
        <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Publish Page</h3>
        <div class="mt-2">
          <p class="text-sm text-gray-500">Are you sure you want to publish this page and make it public? Please make sure all changes were saved before publishing it.</p>
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
            phx-value-id={@page.id}
            phx-target={@myself}
          >
            Publish
          </button>
        </div>
      </.modal>

      <div class="mx-auto grid grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <div class="mt-10 p-4 rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
          <.form :let={f} for={@form} id="page-form" class="space-y-8" phx-target={@myself} phx-change="validate" phx-submit="save">
            <.input field={f[:path]} type="text" label="Path" />
            <.input field={f[:title]} type="text" label="Title" />
            <.input field={f[:description]} type="textarea" label="Description" />
            <.input field={f[:layout_id]} type="select" options={layouts_to_options(@layouts)} label="Layout" />
            <.input field={f[:format]} type="select" label="Format" options={template_format_options(@site)} />
            <.input field={f[:template]} type="hidden" value={@changed_template} />

            <%= for mod <- extra_page_fields(@site) do %>
              <%= extra_page_field(@site, @extra_fields, mod) %>
            <% end %>
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
    template_formats = Config.template_formats(site)

    Keyword.new(template_formats, fn {identifier, description} ->
      {String.to_atom(description), identifier}
    end)
  end

  defp language("heex" = _format), do: "html"
  defp language(:heex), do: "html"
  defp language(format), do: to_string(format)

  defp extra_page_fields(site), do: Config.extra_page_fields(site)

  defp extra_page_field(site, extra_fields, mod) do
    env = __ENV__
    name = Content.page_field_name(site, mod)
    html = Content.render_page_field(site, mod, extra_fields[name], env)
    {:safe, html}
  end
end
