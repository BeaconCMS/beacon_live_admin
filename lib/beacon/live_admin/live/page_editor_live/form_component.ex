defmodule Beacon.LiveAdmin.PageEditorLive.FormComponent do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_component

  alias Beacon.LiveAdmin.Client.Config
  alias Beacon.LiveAdmin.Client.Content
  alias Beacon.LiveAdmin.RuntimeCSS
  alias Ecto.Changeset

  @impl true
  def update(%{site: site, page: page} = assigns, socket) do
    changeset =
      case socket.assigns do
        %{form: form} -> Content.change_page(site, page, form.params)
        _ -> Content.change_page(site, page)
      end

    page_status =
      case page.id && Content.get_latest_page_event(site, page.id) do
        nil -> nil
        %{event: event} -> event
      end

    {:ok,
     socket
     |> assign(assigns)
     |> assign_form(changeset)
     |> assign_template(Changeset.get_field(changeset, :template))
     |> assign(:language, language(page.format))
     |> assign(:page_status, page_status)
     |> assign_extra_fields(changeset)
     |> assign_new(:show_modal, fn -> nil end)
     |> assign_new(:tailwind_config_url, fn -> RuntimeCSS.css_config_url(site) end)
     |> assign_new(:tailwind_input, fn ->
       tailwind = [
         "@tailwind base;",
         "\n",
         "@tailwind components;",
         "\n",
         "@tailwind utilities;",
         "\n"
       ]

       site =
         site
         |> Content.list_stylesheets()
         |> Enum.map(fn stylesheet ->
           ["\n", "/* ", stylesheet.name, " */", "\n", stylesheet.content, "\n"]
         end)

       IO.iodata_to_binary(tailwind ++ site)
     end)}
  end

  def update(%{event: :template_changed, template: template}, socket) do
    {:ok, assign_template(socket, template)}
  end

  @impl true
  # ignore change events from the editor field
  def handle_event("validate", %{"_target" => ["live_monaco_editor", "template"]}, socket) do
    {:noreply, socket}
  end

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

  def handle_event("show_modal", %{"confirm" => action} = _params, socket) do
    {:noreply, assign(socket, show_modal: String.to_existing_atom("#{action}_confirm"))}
  end

  def handle_event("close_modal", _params, socket) do
    {:noreply, assign(socket, show_modal: nil)}
  end

  def handle_event("unpublish", _params, socket) do
    %{site: site, page: page} = socket.assigns

    socket =
      case Content.unpublish_page(page) do
        {:ok, _page} -> put_flash(socket, :info, "Page unpublished successfully")
        {:error, _changeset} -> put_flash(socket, :error, "Something went wrong")
      end

    socket =
      socket
      |> assign(show_modal: nil)
      |> assign(page_status: :unpublished)
      |> push_patch(to: beacon_live_admin_path(socket, site, "/pages/#{page.id}"))

    {:noreply, socket}
  end

  def handle_event("save", %{"save" => user_action, "page" => page_params}, socket) do
    save(page_params, user_action, socket)
  end

  def handle_event("save", %{"page" => page_params}, socket) do
    save(page_params, "save", socket)
  end

  def handle_event("enable_editor", %{"editor" => "code"}, socket) do
    socket = LiveMonacoEditor.set_value(socket, socket.assigns.template, to: "template")

    path =
      case socket.assigns.live_action do
        :new -> "/pages/new"
        :edit -> "/pages/#{socket.assigns.page.id}"
      end

    path =
      Beacon.LiveAdmin.Router.beacon_live_admin_path(
        socket,
        socket.assigns.site,
        path,
        %{editor: "code"}
      )

    {:noreply, push_patch(socket, to: path)}
  end

  def handle_event("enable_editor", %{"editor" => "visual"}, socket) do
    path =
      case socket.assigns.live_action do
        :new -> "/pages/new"
        :edit -> "/pages/#{socket.assigns.page.id}"
      end

    path =
      Beacon.LiveAdmin.Router.beacon_live_admin_path(
        socket,
        socket.assigns.site,
        path,
        %{editor: "visual"}
      )

    {:noreply, push_patch(socket, to: path)}
  end

  def handle_event("set_template", %{"value" => template}, socket) do
    {:noreply, assign_template(socket, template)}
  end

  defp save(page_params, user_action, socket) do
    %{site: site, template: template, page: page, live_action: live_action} = socket.assigns
    page_params = Map.merge(page_params, %{"site" => site, "template" => template})

    save_result =
      case live_action do
        :new -> Content.create_page(site, page_params)
        :edit -> Content.update_page(site, page, page_params)
      end

    maybe_publish_fn =
      case user_action do
        "save" -> fn _, _ -> {:ok, []} end
        "publish" -> &Content.publish_page/2
      end

    with {:ok, page} <- save_result,
         {:ok, _} <- maybe_publish_fn.(site, page.id) do
      {:noreply,
       socket
       |> assign(page: page, show_modal: nil)
       |> update(:page_status, &if(user_action == "publish", do: :published, else: &1))
       |> put_flash(:info, "Page #{String.trim_trailing(user_action, "e")}ed successfully")
       |> push_navigate(to: beacon_live_admin_path(socket, site, "/pages/#{page.id}", %{editor: socket.assigns.editor}))}
    else
      {:error, changeset} ->
        changeset = Map.put(changeset, :action, :save)
        {:noreply, assign_form(socket, changeset)}
    end
  end

  defp assign_form(socket, changeset) do
    assign(socket, :form, to_form(changeset))
  end

  defp assign_template(socket, template) do
    params = Map.merge(socket.assigns.form.params, %{"template" => template})
    changeset = Content.change_page(socket.assigns.site, socket.assigns.page, params)

    socket
    |> assign_form(changeset)
    |> assign(:template, template)
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
    name = Content.page_field_name(site, mod)
    html = Content.render_page_field(site, mod, extra_fields[name], __ENV__)
    {:safe, html}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div>
      <Beacon.LiveAdmin.AdminComponents.page_header socket={@socket} flash={@flash} page={@page} live_action={@live_action} />

      <.header>
        <div class="flex gap-x-6">
          <div><%= @page_title %></div>
          <.page_status status={@page_status} />
        </div>
        <:actions>
          <.button
            :if={@live_action in [:new, :edit] && @editor == "code" && @page.format == :heex}
            type="button"
            phx-click="enable_editor"
            phx-value-editor="visual"
            phx-target={@myself}
            class="sui-primary uppercase"
          >
            Visual Editor
          </.button>
          <.button :if={@live_action in [:new, :edit] && @editor == "visual"} type="button" phx-click="enable_editor" phx-value-editor="code" phx-target={@myself} class="sui-primary uppercase">
            Code Editor
          </.button>
          <.button :if={@live_action == :new} phx-disable-with="Saving..." form="page-form" name="save" value="save" class="sui-primary uppercase">Create Draft Page</.button>
          <.button :if={@live_action == :edit} phx-disable-with="Saving..." form="page-form" name="save" value="save" class="sui-primary uppercase">Save Changes</.button>
          <.button :if={@live_action == :edit} phx-click="show_modal" phx-value-confirm="publish" phx-target={@myself} class="sui-primary uppercase">Publish</.button>
          <.button :if={@live_action == :edit and @page_status == :published} phx-click="show_modal" phx-value-confirm="unpublish" phx-target={@myself} class="sui-primary-destructive uppercase">
            Unpublish
          </.button>
        </:actions>
      </.header>

      <.modal :if={@show_modal == :publish_confirm} id="publish-confirm-modal" on_cancel={JS.push("close_modal", target: @myself)} show>
        <:title>Publish Page</:title>
        <div class="mt-2">
          <p class="text-sm text-gray-500">Are you sure you want to publish this page and make it public? Any unsaved changes on this page will also be saved and published.</p>
        </div>
        <div class="py-4">
          <button
            type="button"
            class="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            phx-click={JS.push("close_modal", target: @myself)}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="page-form"
            class="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-500 sm:w-auto"
            name="save"
            value="publish"
          >
            Confirm
          </button>
        </div>
      </.modal>

      <.modal :if={@show_modal == :unpublish_confirm} id="unpublish-confirm-modal" on_cancel={JS.push("close_modal", target: @myself)} show>
        <:title>Unpublish Page</:title>
        <div class="mt-2">
          <p class="text-sm text-gray-500">Are you sure you want to unpublish this page?  Requests to this path will show your site's 404 Error Page.</p>
        </div>
        <div class="py-4">
          <.button
            type="button"
            class="sui-secondary inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            phx-click={JS.push("close_modal", target: @myself)}
          >
            Cancel
          </.button>
          <.button
            type="button"
            class="sui-primary-destructive inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-500 sm:w-auto"
            phx-click="unpublish"
            phx-target={@myself}
          >
            Confirm
          </.button>
        </div>
      </.modal>

      <.visual_editor
        :if={@editor == "visual"}
        template={@template}
        components={@components}
        tailwind_input={@tailwind_input}
        tailwind_config_url={@tailwind_config_url}
        on_template_change={&send_update(@myself, event: :template_changed, template: &1)}
        render_node_fun={fn node -> Beacon.LiveAdmin.Client.HEEx.render(@site, node, @page_assigns) end}
        encode_layout_fun={fn -> encode_layout(@page, @page_assigns) end}
        encode_component_fun={fn component -> encode_component(@site, component, @page_assigns) end}
      />

      <div class={[
        "grid items-start grid-cols-1 mx-auto mt-4 gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3 h-auto",
        if(@editor == "visual", do: "hidden")
      ]}>
        <div class="p-4 bg-white col-span-full lg:col-span-1 rounded-[1.25rem] lg:rounded-t-[1.25rem] lg:rounded-b-none lg:h-full">
          <.form :let={f} for={@form} id="page-form" class="space-y-8" phx-target={@myself} phx-change="validate" phx-submit="save">
            <legend class="text-sm font-bold tracking-widest text-[#445668] uppercase">Page settings</legend>
            <.input field={f[:path]} type="text" label="Path" class="!text-red-500" />
            <.input field={f[:title]} type="text" label="Title" />
            <.input field={f[:description]} type="textarea" label="Description" />
            <.input field={f[:layout_id]} type="select" options={layouts_to_options(@layouts)} label="Layout" />
            <.input field={f[:format]} type="select" label="Format" options={template_format_options(@site)} />
            <.input field={f[:template]} type="hidden" name="page[template]" id="page-form_template" value={Phoenix.HTML.Form.input_value(f, :template)} />

            <%= for mod <- extra_page_fields(@site) do %>
              <%= extra_page_field(@site, @extra_fields, mod) %>
            <% end %>
          </.form>
        </div>
        <div class="col-span-full lg:col-span-2">
          <%= template_error(@form[:template]) %>
          <div class="py-6 w-full rounded-[1.25rem] bg-[#0D1829] [&_.monaco-editor-background]:!bg-[#0D1829] [&_.margin]:!bg-[#0D1829]">
            <LiveMonacoEditor.code_editor
              path="template"
              class="col-span-full lg:col-span-2"
              value={@form[:template].value}
              opts={Map.merge(LiveMonacoEditor.default_opts(), %{"language" => @language})}
              change="set_template"
              target={@myself}
            />
          </div>
        </div>
      </div>
    </div>
    """
  end

  defp page_status(%{status: :published} = assigns) do
    ~H"""
    <div class="rounded-md bg-lime-400 text-sm px-4 py-1 flex items-center">
      <div>Published</div>
    </div>
    """
  end

  defp page_status(assigns) do
    ~H"""
    <div class="rounded-md bg-yellow-300 text-sm px-4 py-1 flex items-center">
      <div>Draft</div>
    </div>
    """
  end

  defp encode_layout(%{site: site, template: page_template, layout: %{template: layout_template}}, page_assigns) do
    assigns = Map.put(page_assigns, :inner_content, page_template)

    Beacon.LiveAdmin.VisualEditor.HEEx.JSONEncoder.maybe_encode(layout_template, fn node ->
      Beacon.LiveAdmin.Client.HEEx.render(site, node, assigns)
    end)
  end

  defp encode_layout(_, _), do: []

  defp encode_component(site, component, page_assigns) when is_atom(site) and is_map(component) do
    template = component[:example] || ""

    Beacon.LiveAdmin.VisualEditor.HEEx.JSONEncoder.maybe_encode(template, fn node ->
      Beacon.LiveAdmin.Client.HEEx.render(site, node, page_assigns)
    end)
  end

  defp encode_component(_site, _component, _page_assigns), do: []
end
