defmodule Beacon.LiveAdmin.PageEditorLive.FormComponent do
  use Beacon.LiveAdmin.Web, :live_component

  alias Beacon.LiveAdmin.Config
  alias Beacon.LiveAdmin.Content
  alias Beacon.LiveAdmin.WebAPI

  @impl true
  def update(%{site: site, page: page} = assigns, socket) do
    page = Map.put_new(page, :path, "/")

    changeset =
      case socket.assigns do
        %{form: form} ->
          form.source

        _ ->
          Content.change_page(site, page)
      end

    layouts = Content.list_layouts(site)

    %{data: builder_page} = WebAPI.Page.show(site, page)

    {:ok,
     socket
     |> assign(assigns)
     |> assign_form(changeset)
     |> assign(:layouts, layouts)
     |> assign(:language, language(page.format))
     |> assign(:template, page.template)
     |> assign(:changed_template, page.template)
     |> assign(:builder_page, builder_page)
     |> assign_new(:visual_mode, fn -> false end)
     |> assign_extra_fields(changeset)}
  end

  def update(%{template: value}, socket) do
    params = Map.merge(socket.assigns.form.params, %{"template" => value})
    changeset = Content.change_page(socket.assigns.site, socket.assigns.page, params)
    {:ok, assign_form(socket, changeset)}
  end

  @impl true
  def handle_event(
        "validate",
        %{"_target" => ["page", "format"], "page" => page_params},
        socket
      ) do
    socket =
      LiveMonacoEditor.change_language(socket, language(page_params["format"]), to: "template")

    changeset =
      socket.assigns.site
      |> Content.validate_page(socket.assigns.page, page_params)
      |> Map.put(:action, :validate)

    {:noreply, assign_form(socket, changeset)}
  end

  def handle_event("validate", %{"page" => page_params}, socket) do
    changeset =
      socket.assigns.site
      |> Content.validate_page(socket.assigns.page, page_params)
      |> Map.put(:action, :validate)

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
         |> push_navigate(to: to, replace: true)}

      {:error, changeset} ->
        changeset = Map.put(changeset, :action, :publish)
        {:noreply, assign_form(socket, changeset)}
    end
  end

  def handle_event("enable_visual_mode", _params, socket) do
    {:noreply, assign(socket, visual_mode: true)}
  end

  def handle_event("disable_visual_mode", _params, socket) do
    {:noreply, assign(socket, visual_mode: false)}
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
        changeset = Map.put(changeset, :action, :insert)
        {:noreply, assign_form(socket, changeset)}
    end
  end

  defp save_page(socket, :edit, page_params) do
    case Content.update_page(socket.assigns.site, socket.assigns.page, page_params) do
      {:ok, page} ->
        changeset = Content.change_page(socket.assigns.site, page)

        {:noreply,
         socket
         |> assign(:page, page)
         |> assign_form(changeset)
         |> assign_extra_fields(changeset)
         |> put_flash(:info, "Page updated successfully")}

      {:error, changeset} ->
        changeset = Map.put(changeset, :action, :update)
        {:noreply, assign_form(socket, changeset)}
    end
  end

  defp assign_form(socket, changeset) do
    assign(socket, :form, to_form(changeset))
  end

  defp assign_extra_fields(socket, changeset) do
    params = Ecto.Changeset.get_field(changeset, :extra)

    extra_fields =
      Content.page_extra_fields(
        socket.assigns.site,
        socket.assigns.form,
        params,
        changeset.errors
      )

    assign(socket, :extra_fields, extra_fields)
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

  defp compile_stylesheet(%{site: site, template: template}) when is_binary(template),
    do: Beacon.LiveAdmin.Layouts.page_stylesheet(site, template)

  defp compile_stylesheet(%{site: _, template: _}), do: ""

  @impl true
  def render(assigns) do
    ~H"""
    <div>
      <style>
        <%= compile_stylesheet(@page) %>
      </style>

      <Beacon.LiveAdmin.AdminComponents.page_header socket={@socket} flash={@flash} page={@page} live_action={@live_action} />

      <.header>
        <%= @page_title %>
        <:actions>
          <.button :if={@live_action == :new} phx-disable-with="Saving..." form="page-form" class="uppercase">Create Draft Page</.button>
          <.button :if={!@visual_mode} phx-click="enable_visual_mode" phx-target={@myself} form="page-form" class="uppercase">Visual Editor</.button>
          <.button :if={@visual_mode} phx-click="disable_visual_mode" phx-target={@myself} form="page-form" class="uppercase">Code Editor</.button>
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
            class="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            phx-click={JS.exec("data-cancel", to: "#publish-confirm-modal")}
          >
            Cancel
          </button>
          <button
            type="button"
            class="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-500 sm:w-auto"
            phx-click="publish"
            phx-value-id={@page.id}
            phx-target={@myself}
          >
            Confirm
          </button>
        </div>
      </.modal>

      <.svelte :if={@visual_mode} name="components/UiBuilder" class="relative overflow-x-hidden" props={%{components: @components, page: @builder_page}} socket={@socket} />

      <div :if={!@visual_mode} class="grid items-start lg:h-[calc(100vh_-_144px)] grid-cols-1 mx-auto mt-4 gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <div class="p-4 bg-white col-span-full lg:col-span-1 rounded-[1.25rem] lg:rounded-t-[1.25rem] lg:rounded-b-none lg:h-full">
          <.form :let={f} for={@form} id="page-form" class="space-y-8" phx-target={@myself} phx-change="validate" phx-submit="save">
            <legend class="text-sm font-bold tracking-widest text-[#445668] uppercase">Page settings</legend>
            <.input field={f[:path]} type="text" label="Path" class="!text-red-500" />
            <.input field={f[:title]} type="text" label="Title" />
            <.input field={f[:description]} type="textarea" label="Description" />
            <.input field={f[:layout_id]} type="select" options={layouts_to_options(@layouts)} label="Layout" />
            <.input field={f[:format]} type="select" label="Format" options={template_format_options(@site)} />
            <input type="hidden" name="page[template]" id="page-form_template" value={@changed_template} />

            <%= for mod <- extra_page_fields(@site) do %>
              <%= extra_page_field(@site, @extra_fields, mod) %>
            <% end %>
          </.form>
        </div>
        <div class="col-span-full lg:col-span-2">
          <%= template_error(@form[:template]) %>
          <div class="py-6 w-full rounded-[1.25rem] bg-[#0D1829] [&_.monaco-editor-background]:!bg-[#0D1829] [&_.margin]:!bg-[#0D1829]">
            <LiveMonacoEditor.code_editor path="template" class="col-span-full lg:col-span-2" value={@template} opts={Map.merge(LiveMonacoEditor.default_opts(), %{"language" => @language})} />
          </div>
        </div>
      </div>
    </div>
    """
  end
end
