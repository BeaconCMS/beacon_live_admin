defmodule Beacon.LiveAdmin.ComponentEditorLive.FormComponent do
  use Beacon.LiveAdmin.Web, :live_component
  alias Beacon.LiveAdmin.Content

  alias Beacon.Content.ComponentAttr

  @impl true
  def mount(socket) do
    {:ok, close_attr_modal(socket)}
  end

  @impl true
  def update(%{site: site, component: component} = assigns, socket) do
    attrs_forms =
      case assigns.live_action do
        :new ->
          []

        :edit ->
          Enum.map(component.attrs, &build_attr_form(site, &1, %{component_id: component.id}))
      end

    changeset = Content.change_component(site, component)

    {:ok,
     socket
     |> assign(assigns)
     |> assign_form(changeset)
     |> assign(:attrs_forms, attrs_forms)}
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

    attrs = Enum.map(socket.assigns.attrs_forms, & Ecto.Changeset.apply_changes(&1.source) |> Map.from_struct())

    component_params = Map.put(component_params, "attrs", attrs)

    save_component(socket, socket.assigns.live_action, component_params)
  end

  def handle_event("delete", %{"attr_id" => attr_id}, socket) do
    %{attrs_forms: attrs_forms} = socket.assigns

    attrs_forms = Enum.reject(attrs_forms, &(&1.data.id == attr_id))

    {:noreply, assign(socket, :attrs_forms, attrs_forms)}
  end

  def handle_event("show_attr_modal", %{"attr_id" => attr_id}, socket) do
    %{attrs_forms: attrs_forms} = socket.assigns

    attr_form = Enum.find(attrs_forms, &(&1.data.id == attr_id))

    {:noreply,
     socket
     |> assign(
       show_attr_modal: true,
       attr_form: attr_form,
       modal_title: "Edit Attribute",
       modal_action: :edit_attr
     )}
  end

  def handle_event("show_attr_modal", _, socket) do
    %{component: component, site: site} = socket.assigns

    component_attr = %ComponentAttr{id: Ecto.UUID.generate(), component_id: component.id}

    attr_form = build_attr_form(site, component_attr, %{})

    {:noreply,
     socket
     |> assign(
       show_attr_modal: true,
       attr_form: attr_form,
       modal_title: "Add Attribute",
       modal_action: :new_attr
     )}
  end

  def handle_event("close_modal", _, socket) do
    {:noreply, close_attr_modal(socket)}
  end

  def handle_event("validate_attr", %{"component_attr" => component_attr_params}, socket) do
    %{attr_form: attr_form, site: site} = socket.assigns

    component_attr_params = format_struct_name_input(component_attr_params)
    component_attr_params = format_options_input(component_attr_params)

    attr_form = build_attr_form(site, attr_form.data, component_attr_params, :validate)

    {:noreply, assign(socket, :attr_form, attr_form)}
  end

  def handle_event("add_attr", %{"component_attr" => component_attr_params}, socket) do
    %{
      site: site,
      attr_form: attr_form,
      attrs_forms: attrs_forms,
      modal_action: modal_action
    } = socket.assigns

    component_attr_params = format_struct_name_input(component_attr_params)
    component_attr_params = format_options_input(component_attr_params)

    changeset =
      site
      |> Content.change_component_attr(attr_form.data, component_attr_params)
      |> Map.put(:action, :validate)

    if changeset.valid? do
      form_id = "form-#{changeset.data.component_id}-#{changeset.data.id}"
      updated_component_attr_form = to_form(changeset, id: form_id)

      attrs_forms = update_attrs_forms(attrs_forms, modal_action, updated_component_attr_form, form_id)

      {:noreply,
       socket
       |> assign(:attrs_forms, attrs_forms)
       |> close_attr_modal()}
    else
      attr_form = build_attr_form(site, attr_form.data, component_attr_params, :validate)

      {:noreply, assign(socket, :attr_form, attr_form)}
    end
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

  defp build_attr_form(site, attr_or_changeset, params, action \\ nil) do
    changeset =
      Content.change_component_attr(site, attr_or_changeset, params) |> Map.put(:action, action)

    to_form(changeset, id: "form-#{changeset.data.component_id}-#{changeset.data.id}")
  end

  defp close_attr_modal(socket) do
    assign(socket,
      show_attr_modal: false,
      attr_form: nil,
      modal_title: nil,
      modal_action: nil
    )
  end

  def update_attrs_forms(attrs_forms, :new_attr, updated_attr_form, _form_id) do
    attrs_forms ++ [updated_attr_form]
  end

  def update_attrs_forms(attrs_forms, :edit_attr, updated_attr_form, form_id) do
    Enum.map(attrs_forms, fn
      %{id: ^form_id} -> updated_attr_form
      component_attr_form -> component_attr_form
    end)
  end

  defp format_struct_name_input(component_attr_params) do
    case component_attr_params["struct_name"] do
      nil -> Map.put(component_attr_params, "struct_name", nil)
      _ -> component_attr_params
    end
  end

  def format_options_input(component_attr_params) do
    attr_opts = []

    attr_opts =
      attr_opts
      |> option_required(component_attr_params["opts_required"])
      |> option_default(component_attr_params["opts_default"])
      |> option_values(component_attr_params["opts_values"])
      |> option_doc(component_attr_params["opts_doc"])

    Map.put(component_attr_params, "opts", attr_opts)
  end

  defp option_required(attr_opts, "false"), do: attr_opts

  defp option_required(attr_opts, "true") do
    Keyword.merge(attr_opts, required: true)
  end

  defp option_default(attr_opts, ""), do: attr_opts

  defp option_default(attr_opts, opts_default) do
    Keyword.merge(attr_opts, default: opts_default)
  end

  defp option_values(attr_opts, ""), do: attr_opts

  defp option_values(attr_opts, opts_values) do
    values = split_string_into_list(opts_values)

    Keyword.merge(attr_opts, values: values)
  end

  defp split_string_into_list(string) do
    ~r/[\s,]+/
    |> Regex.split(string)
    |> Enum.reject(&(&1 == ""))
  end

  defp option_doc(attr_opts, ""), do: attr_opts

  defp option_doc(attr_opts, opts_doc) do
    Keyword.merge(attr_opts, doc: opts_doc)
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div>
      <Beacon.LiveAdmin.AdminComponents.component_header socket={@socket} flash={@flash} component={@component} live_action={@live_action} />

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
            <.input field={f[:example]} type="text" label="Example" />
            <input type="hidden" name="component[template]" id="component-form_template" value={Phoenix.HTML.Form.input_value(f, :template)} />
          </.form>

          <.table id="attrs" rows={@attrs_forms} row_click={fn attr_form -> JS.push("show_attr_modal", value: %{attr_id: attr_data(attr_form.source, :id)}, target: @myself) end}>
            <:col :let={attr_form} label="Component Attributes"><%= attr_data(attr_form.source, :name) %></:col>
            <:action :let={attr_form}>
              <.link
                phx-click="show_attr_modal"
                phx-value-attr_id={attr_data(attr_form.source, :id)}
                phx-target={@myself}
                title="Edit attribute"
                aria-label="Edit attribute"
                class="flex items-center justify-center w-10 h-10 group"
              >
                <.icon name="hero-pencil-square text-[#61758A] hover:text-[#304254]" />
              </.link>
            </:action>

            <:action :let={attr_form}>
              <.link
                phx-click={JS.push("delete", value: %{attr_id: attr_data(attr_form.source, :id)})}
                phx-target={@myself}
                aria-label="Delete attribute"
                title="Delete attribute"
                class="flex items-center justify-center w-10 h-10"
                data-confirm="Are you sure?"
              >
                <.icon name="hero-trash text-[#F23630] hover:text-[#AE182D]" />
              </.link>
            </:action>
          </.table>

          <.button class="mt-4" phx-click={JS.push("show_attr_modal", target: @myself)}>Add new Attribute</.button>
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

      <.modal :if={@show_attr_modal} id="attr-modal" on_cancel={JS.push("close_modal", target: @myself)} show>
        <p class="text-2xl font-bold mb-12"><%= @modal_title %></p>
        <.form :let={f} id="new-path-form" for={@attr_form} phx-change="validate_attr" phx-submit="add_attr" phx-target={@myself} class="space-y-8">
          <.input type="hidden" name={f[:component_id].name} value={f[:component_id].value} />
          <.input field={f[:name]} type="text" phx-debounce="100" label="Attr Name" />
          <.input field={f[:type]} type="select" options={types_to_options()} label="Type" />
          <.input :if={f[:type].value == "struct"} field={f[:struct_name]} type="text" phx-debounce="100" placeholder="MyApp.Users.User" label="Struct Name" />

          <legend class="text-sm font-bold tracking-widest text-[#445668] uppercase">Options</legend>
          <.input field={f[:opts_required]} type="checkbox" value={opts_required_value(f)} label="Required attribute" />
          <.input field={f[:opts_default]} type="text" phx-debounce="100" value={opts_default_value(f)} label="Default Attribute" />
          <.input field={f[:opts_values]} type="text" phx-debounce="100" value={opts_values_value(f)} label="Accepted values" placeholder="value1, value2, ..." />
          <.input field={f[:opts_doc]} type="text" phx-debounce="100" value={opts_doc_value(f)} label="Attribute doc" />

          <div class="flex mt-8 gap-x-[20px]">
            <.button type="submit">Ok</.button>
            <.button type="button" phx-click={JS.push("close_modal", target: @myself)}>Cancel</.button>
          </div>
        </.form>
      </.modal>
    </div>
    """
  end

  defp attr_data(source, field), do: Ecto.Changeset.get_field(source, field)

  defp categories_to_options(site) do
    Enum.map(Content.component_categories(site), &{Phoenix.Naming.humanize(&1), &1})
  end

  defp types_to_options do
    ~w(any string atom boolean integer float list map global struct)a
    |> Enum.map(&{Phoenix.Naming.humanize(&1), &1})
  end

  def opts_required_value(form) do
    form
    |> get_field_opts()
    |> Keyword.get(:required, false)
  end

  def opts_default_value(form) do
    form
    |> get_field_opts()
    |> Keyword.get(:default, "")

    #   |> inspect()
  end

  def opts_values_value(form) do
    form
    |> get_field_opts()
    |> Keyword.get(:values, [])
    |> Enum.join(", ")
  end

  def opts_doc_value(form) do
    form
    |> get_field_opts()
    |> Keyword.get(:doc, "")
  end

  def get_field_opts(form) do
    form
    |> Phoenix.HTML.Form.input_value(:opts)
    |> maybe_binary_to_term()
  end

  defp maybe_binary_to_term(opts) when is_binary(opts), do: :erlang.binary_to_term(opts)
  defp maybe_binary_to_term(opts), do: opts
end
