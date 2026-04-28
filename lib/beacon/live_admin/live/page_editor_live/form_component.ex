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
     |> assign_cache_ttl(changeset)
     |> assign_new(:show_modal, fn -> nil end)
     |> assign_new(:workspace_layout, fn -> "split" end)
     |> assign_new(:show_settings, fn -> false end)
     |> assign_new(:tailwind_config_url, fn -> RuntimeCSS.css_config(site) end)
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

    {:noreply,
     socket
     |> assign_form(changeset)
     |> assign_cache_ttl(changeset)}
  end

  def handle_event("validate", %{"page" => page_params}, socket) do
    changeset =
      socket.assigns.site
      |> Content.validate_page(socket.assigns.page, page_params)
      |> Map.put(:action, :validate)

    {:noreply,
     socket
     |> assign_form(changeset)
     |> assign_extra_fields(changeset)
     |> assign_cache_ttl(changeset)}
  end

  def handle_event("set_layout", %{"layout" => layout}, socket) do
    {:noreply, assign(socket, :workspace_layout, layout)}
  end

  def handle_event("toggle_settings", _params, socket) do
    {:noreply, assign(socket, :show_settings, !socket.assigns.show_settings)}
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

  defp assign_cache_ttl(socket, changeset) do
    extra = Changeset.get_field(changeset, :extra) || %{}
    assign(socket, :cache_ttl, display_cache_ttl(extra["cache_ttl"]))
  end

  defp display_cache_ttl(nil), do: ""
  defp display_cache_ttl("infinity"), do: "infinity"
  defp display_cache_ttl(n) when is_integer(n), do: Integer.to_string(n)
  defp display_cache_ttl(val) when is_binary(val), do: val
  defp display_cache_ttl(_), do: ""

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

  defp page_editor_opts(language) do
    LiveMonacoEditor.default_opts()
    |> Map.merge(%{
      "language" => language,
      "automaticLayout" => true,
      "handleMouseWheel" => true
    })
    |> Map.update!("scrollbar", fn scrollbar ->
      Map.merge(scrollbar, %{
        "alwaysConsumeMouseWheel" => true,
        "vertical" => "auto",
        "horizontal" => "auto"
      })
    end)
  end

  defp extra_page_fields(site), do: Config.extra_page_fields(site)

  defp extra_page_field(site, extra_fields, mod) do
    name = Content.page_field_name(site, mod)
    html = Content.render_page_field(site, mod, extra_fields[name], __ENV__)
    {:safe, html}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="h-full flex flex-col overflow-hidden">
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
            class="btn-primary"
          >
            Visual Editor
          </.button>
          <.button :if={@live_action in [:new, :edit] && @editor == "visual"} type="button" phx-click="enable_editor" phx-value-editor="code" phx-target={@myself} class="btn-primary">
            Code Editor
          </.button>
          <.button :if={@live_action == :new} phx-disable-with="Saving..." form="page-form" name="save" value="save" class="btn-primary">Create Draft Page</.button>
          <.button :if={@live_action == :edit} phx-disable-with="Saving..." form="page-form" name="save" value="save" class="btn-primary">Save Changes</.button>
          <.button :if={@live_action == :edit} phx-click="show_modal" phx-value-confirm="publish" phx-target={@myself} class="btn-primary">Publish</.button>
          <.button :if={@live_action == :edit and @page_status == :published} phx-click="show_modal" phx-value-confirm="unpublish" phx-target={@myself} class="btn-error">
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
            class="btn-ghost"
            phx-click={JS.push("close_modal", target: @myself)}
          >
            Cancel
          </.button>
          <.button
            type="button"
            class="btn-error"
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

      <%!-- Page settings form (hidden fields + collapsible settings) --%>
      <.form :let={f} for={@form} id="page-form" class="hidden" phx-target={@myself} phx-change="validate" phx-submit="save">
        <.input field={f[:path]} type="hidden" />
        <.input field={f[:title]} type="hidden" />
        <.input field={f[:description]} type="hidden" />
        <.input field={f[:layout_id]} type="hidden" />
        <.input field={f[:format]} type="hidden" />
        <.input field={f[:template]} type="hidden" name="page[template]" id="page-form_template" value={Phoenix.HTML.Form.input_value(f, :template)} />
      </.form>

      <%!-- Editor workspace: side-by-side code editor + preview --%>
      <div class={[
        "mt-2 flex-1 min-h-0 flex flex-col overflow-hidden",
        if(@editor == "visual", do: "hidden")
      ]}>
        <%!-- Workspace toolbar --%>
        <div class="flex items-center gap-1 mb-2">
          <%!-- Panel layout toggles --%>
          <div class="flex items-center gap-0.5 bg-base-200 rounded-lg p-0.5">
            <button
              type="button"
              phx-click="set_layout"
              phx-value-layout="split"
              phx-target={@myself}
              class={["btn btn-xs gap-1", if(@workspace_layout == "split", do: "btn-primary", else: "btn-ghost")]}
              title="Split view"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m-7.5-15h15a1.5 1.5 0 011.5 1.5v12a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 18V6a1.5 1.5 0 011.5-1.5z" />
              </svg>
              <span class="hidden sm:inline">Split</span>
            </button>
            <button
              type="button"
              phx-click="set_layout"
              phx-value-layout="editor"
              phx-target={@myself}
              class={["btn btn-xs gap-1", if(@workspace_layout == "editor", do: "btn-primary", else: "btn-ghost")]}
              title="Editor only"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
              </svg>
              <span class="hidden sm:inline">Editor</span>
            </button>
            <button
              type="button"
              phx-click="set_layout"
              phx-value-layout="preview"
              phx-target={@myself}
              class={["btn btn-xs gap-1", if(@workspace_layout == "preview", do: "btn-primary", else: "btn-ghost")]}
              title="Preview only"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="hidden sm:inline">Preview</span>
            </button>
          </div>

          <div class="flex-1"></div>

          <%!-- Settings toggle --%>
          <button
            type="button"
            phx-click="toggle_settings"
            phx-target={@myself}
            class={["btn btn-xs gap-1", if(@show_settings, do: "btn-primary", else: "btn-ghost")]}
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="hidden sm:inline">Settings</span>
          </button>
        </div>

        <%!-- Settings drawer (slides down above the workspace) --%>
        <div :if={@show_settings} class="mb-2 p-3 bg-base-100 border border-base-300 rounded-lg shadow-sm [&_.fieldset]:mb-0">
          <.form :let={f} for={@form} id="page-settings-form" phx-target={@myself} phx-change="validate">
            <div class="grid grid-cols-[minmax(80px,1fr)_minmax(200px,3fr)] gap-2 mb-2">
              <.input field={f[:path]} type="text" label="Path" class="w-full input input-sm font-mono" />
              <.input field={f[:title]} type="text" label="Title" class="w-full input input-sm" />
            </div>
            <div class="grid grid-cols-3 gap-2 mb-2">
              <.input field={f[:layout_id]} type="select" options={layouts_to_options(@layouts)} label="Layout" class="w-full select select-sm" />
              <.input field={f[:format]} type="select" label="Format" options={template_format_options(@site)} class="w-full select select-sm" />
              <.input
                type="text"
                name="page[extra][cache_ttl]"
                value={@cache_ttl}
                label="Cache TTL"
                id="page-settings-form_extra_cache_ttl"
                placeholder="Site default"
                class="w-full input input-sm"
              />
            </div>
            <div class="mb-2">
              <.input field={f[:description]} type="textarea" label="Description" class="w-full textarea textarea-sm leading-snug" rows="2" placeholder="Page description for SEO" />
            </div>
            <%= if extra_page_fields(@site) != [] do %>
              <div class="border-t border-base-300 pt-2 mt-1">
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 [&_.fieldset]:mb-0 [&_.input]:input-sm [&_.select]:select-sm">
                  <%= for mod <- extra_page_fields(@site) do %>
                    <%= extra_page_field(@site, @extra_fields, mod) %>
                  <% end %>
                </div>
              </div>
            <% end %>
          </.form>
        </div>

        <%!-- Split pane workspace --%>
        <div id="workspace-panes" phx-hook="WorkspaceResize" class="flex flex-1 min-h-0 gap-3 overflow-hidden pb-3">
          <%!-- Code editor pane --%>
          <div class={[
            "flex flex-1 min-w-0 min-h-0 flex-col rounded-xl overflow-hidden bg-[#0D1829] [&_.monaco-editor-background]:!bg-[#0D1829] [&_.margin]:!bg-[#0D1829]",
            if(@workspace_layout == "preview", do: "hidden")
          ]}>
            <%= template_error(@form[:template]) %>
            <div class="flex-1 min-h-0 overflow-hidden">
              <LiveMonacoEditor.code_editor
                path="template"
                class="beacon-page-code-editor"
                style="width: 100%; height: 100%;"
                value={@form[:template].value}
                opts={page_editor_opts(@language)}
                data-format-on-mount="true"
                change="set_template"
                target={@myself}
              />
            </div>
          </div>

          <%!-- Preview pane --%>
          <div class={[
            "flex-1 min-w-0 min-h-0 rounded-xl overflow-hidden border border-base-300 bg-white",
            if(@workspace_layout == "editor", do: "hidden")
          ]}>
            <iframe
              id="editor-preview-iframe"
              src={"/__beacon_live_admin__/preview/#{@site}/page/#{@page.id}"}
              class="w-full h-full border-0"
              title="Page preview"
            >
            </iframe>
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
