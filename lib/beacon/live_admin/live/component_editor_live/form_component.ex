defmodule Beacon.LiveAdmin.ComponentEditorLive.FormComponent do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_component
  import Ecto.Changeset, only: [get_field: 2]

  alias Beacon.LiveAdmin.Client.Content
  alias Beacon.Content.ComponentAttr

  @impl true
  def mount(socket) do
    {:ok, close_attr_modal(socket)}
  end

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

  def update(%{body: value}, socket) do
    params = Map.merge(socket.assigns.form.params, %{"body" => value})
    changeset = Content.change_component(socket.assigns.site, socket.assigns.component, params)

    {:ok, assign_form(socket, changeset)}
  end

  def update(%{example: value}, socket) do
    params = Map.merge(socket.assigns.form.params, %{"example" => value})
    changeset = Content.change_component(socket.assigns.site, socket.assigns.component, params)

    {:ok, assign_form(socket, changeset)}
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
        to = beacon_live_admin_path(socket, socket.assigns.site, "/components/#{component.id}")

        {:noreply,
         socket
         |> put_flash(:info, "Component updated successfully")
         |> push_patch(to: to)}

      {:error, changeset} ->
        changeset = Map.put(changeset, :action, :update)
        {:noreply, assign_form(socket, changeset)}
    end
  end

  @impl true
  def handle_event("validate", %{"component" => %{"attrs" => attrs} = component_params}, socket) do
    updated_attr_params =
      Enum.map(attrs, fn {index, attr} ->
        component_attr_params = format_struct_name_input(attr)
        component_attr_params = format_options_input(component_attr_params)
        {index, component_attr_params}
      end)
      |> Enum.into(%{})

    component_params = Map.put(component_params, "attrs", updated_attr_params)

    changeset =
      socket.assigns.site
      |> Content.change_component(socket.assigns.component, component_params)
      |> Map.put(:action, :validate)

    {:noreply, assign_form(socket, changeset)}
  end

  def handle_event("validate", %{"component" => component_params}, socket) do
    component_params = Map.put(component_params, "attrs", [])

    changeset =
      socket.assigns.site
      |> Content.change_component(socket.assigns.component, component_params)
      |> Map.put(:action, :validate)

    {:noreply, assign_form(socket, changeset)}
  end

  def handle_event("save", %{"component" => %{"attrs" => attrs} = component_params}, socket) do
    component_params = Map.put(component_params, "site", socket.assigns.site)

    updated_attr_params =
      Enum.map(attrs, fn {index, attr} ->
        component_attr_params = format_struct_name_input(attr)
        component_attr_params = format_options_input(component_attr_params)
        {index, component_attr_params}
      end)
      |> Enum.into(%{})

    component_params = Map.put(component_params, "attrs", updated_attr_params)

    save_component(socket, socket.assigns.live_action, component_params)
  end

  def handle_event("save", %{"component" => component_params}, socket) do
    component_params = Map.put(component_params, "site", socket.assigns.site)

    component_params = Map.put(component_params, "attrs", [])

    save_component(socket, socket.assigns.live_action, component_params)
  end

  def handle_event("delete_attr", %{"attr_id" => attr_id}, socket) do
    %{form: component_form, site: site, component: component} = socket.assigns

    updated_attr_params =
      component_form
      |> get_component_attrs_from_form()
      |> Enum.reject(&(&1.id == attr_id))
      |> Enum.map(&Map.from_struct/1)

    changeset =
      Content.change_component(site, component, %{
        "name" => get_field(component_form.source, :name),
        "category" => get_field(component_form.source, :category),
        "body" => get_field(component_form.source, :body),
        "example" => get_field(component_form.source, :example),
        "template" => get_field(component_form.source, :template),
        "attrs" => updated_attr_params
      })

    {:noreply, assign_form(socket, changeset)}
  end

  def handle_event("show_attr_modal", %{"attr_id" => attr_id}, socket) do
    component_attr =
      socket.assigns.form
      |> get_component_attrs_from_form()
      |> Enum.find(&(&1.id == attr_id))

    attr_form = build_attr_form(socket.assigns.site, component_attr, %{}, socket.assigns.form)

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
    component_attr = %ComponentAttr{
      id: Ecto.UUID.generate(),
      component_id: socket.assigns.component.id
    }

    attr_form = build_attr_form(socket.assigns.site, component_attr, %{}, socket.assigns.form)

    {:noreply,
     socket
     |> assign(
       show_attr_modal: true,
       attr_form: attr_form,
       modal_title: "Add Attribute",
       modal_action: :new_attr
     )}
  end

  def handle_event("validate_attr", %{"component_attr" => component_attr_params}, socket) do
    component_attr_params = format_struct_name_input(component_attr_params)
    component_attr_params = format_options_input(component_attr_params)

    attr_form =
      build_attr_form(
        socket.assigns.site,
        socket.assigns.attr_form.data,
        component_attr_params,
        socket.assigns.form,
        :validate
      )

    {:noreply, assign(socket, :attr_form, attr_form)}
  end

  def handle_event("add_attr", %{"component_attr" => component_attr_params}, socket) do
    %{site: site, attr_form: attr_form, modal_action: modal_action, form: form} = socket.assigns

    component_attr_params = format_struct_name_input(component_attr_params)
    component_attr_params = format_options_input(component_attr_params)

    component_attr_names = get_field(form.source, :attrs) |> Enum.reject(&(&1.id == attr_form.data.id)) |> Enum.map(& &1.name)

    changeset =
      site
      |> Content.change_component_attr(attr_form.data, component_attr_params, component_attr_names)
      |> Map.put(:action, :validate)

    if changeset.valid? do
      updated_component_attr_form = to_form(changeset)

      changeset = update_component_form(socket, modal_action, updated_component_attr_form)

      {:noreply,
       socket
       |> assign_form(changeset)
       |> close_attr_modal()}
    else
      attr_form = build_attr_form(site, attr_form.data, component_attr_params, form, :validate)

      {:noreply, assign(socket, :attr_form, attr_form)}
    end
  end

  def handle_event("close_modal", _, socket) do
    {:noreply, close_attr_modal(socket)}
  end

  defp assign_form(socket, changeset) do
    assign(socket, :form, to_form(changeset))
  end

  defp build_attr_form(site, attr_or_changeset, params, component_form, action \\ nil) do
    component_attr_names = get_field(component_form.source, :attrs) |> Enum.reject(&(&1.id == attr_or_changeset.id)) |> Enum.map(& &1.name)

    changeset =
      site
      |> Content.change_component_attr(attr_or_changeset, params, component_attr_names)
      |> Map.put(:action, action)

    to_form(changeset)
  end

  defp close_attr_modal(socket) do
    assign(socket,
      show_attr_modal: false,
      attr_form: nil,
      modal_title: nil,
      modal_action: nil
    )
  end

  def update_component_form(socket, :new_attr, updated_attr_form) do
    %{site: site, form: form, component: component} = socket.assigns

    updated_attr_params =
      form
      |> get_component_attrs_from_form()
      |> Enum.map(&Map.from_struct/1)

    attr_params = Ecto.Changeset.apply_changes(updated_attr_form.source) |> Map.from_struct()

    updated_attr_params = updated_attr_params ++ [attr_params]

    Content.change_component(site, component, %{
      "name" => get_field(form.source, :name),
      "category" => get_field(form.source, :category),
      "body" => get_field(form.source, :body),
      "example" => get_field(form.source, :example),
      "template" => get_field(form.source, :template),
      "attrs" => updated_attr_params
    })
  end

  def update_component_form(socket, :edit_attr, updated_attr_form) do
    %{site: site, form: form, component: component} = socket.assigns

    attr_params = Ecto.Changeset.apply_changes(updated_attr_form.source) |> Map.from_struct()

    updated_attr_params =
      form
      |> get_component_attrs_from_form()
      |> Enum.map(fn component_attr ->
        if component_attr.id == attr_params.id,
          do: attr_params,
          else: Map.from_struct(component_attr)
      end)

    Content.change_component(site, component, %{
      "name" => get_field(form.source, :name),
      "category" => get_field(form.source, :category),
      "body" => get_field(form.source, :body),
      "example" => get_field(form.source, :example),
      "template" => get_field(form.source, :template),
      "attrs" => updated_attr_params
    })
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
      |> option_examples(component_attr_params["opts_examples"])

    Map.put(component_attr_params, "opts", attr_opts)
  end

  defp option_required(attr_opts, "false"), do: attr_opts

  defp option_required(attr_opts, "true") do
    Keyword.merge(attr_opts, required: true)
  end

  defp option_default(attr_opts, ""), do: attr_opts

  defp option_default(attr_opts, opts_default) do
    opts_default = eval_string_value(opts_default)
    Keyword.merge(attr_opts, default: opts_default)
  end

  defp option_examples(attr_opts, ""), do: attr_opts

  defp option_examples(attr_opts, opts_examples) do
    opts_examples = eval_string_value(opts_examples)
    Keyword.merge(attr_opts, examples: opts_examples)
  end

  defp option_values(attr_opts, ""), do: attr_opts

  defp option_values(attr_opts, opts_values) do
    opts_values = eval_string_value(opts_values)
    Keyword.merge(attr_opts, values: opts_values)
  end

  defp option_doc(attr_opts, ""), do: attr_opts

  defp option_doc(attr_opts, opts_doc) do
    Keyword.merge(attr_opts, doc: opts_doc)
  end

  defp eval_string_value(opts_default) do
    {term, _} = Code.eval_string(opts_default)

    if is_struct(term) do
      %struct_name{} = term

      term |> Map.from_struct() |> Map.merge(%{__struct__: struct_name})
    else
      term
    end
  rescue
    _exception -> "#{opts_default}"
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div>
      <Beacon.LiveAdmin.AdminComponents.component_header socket={@socket} flash={@flash} component={@component} live_action={@live_action} />

      <.header>
        {@page_title}
        <:actions>
          <.button phx-disable-with="Saving..." form="component-form" class="uppercase">Save Changes</.button>
        </:actions>
      </.header>

      <div class="grid items-start lg:h-[calc(100vh_-_144px)] grid-cols-1 mx-auto mt-4 gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <div class="p-4 bg-white col-span-full lg:col-span-1 rounded-[1.25rem] lg:rounded-t-[1.25rem] lg:rounded-b-none lg:h-full">
          <.form :let={f} for={@form} id="component-form" class="space-y-8" phx-target={@myself} phx-change="validate" phx-submit="save">
            <legend class="text-sm font-bold tracking-widest text-[#445668] uppercase">Component settings</legend>
            <.input field={f[:name]} phx-debounce="100" type="text" label="Name" />
            <.input field={f[:category]} type="select" options={categories_to_options(@site)} label="Category" />
            <.error :for={msg <- Enum.map(f[:attrs].errors, &translate_error(&1))}>{msg}</.error>
            <input type="hidden" name="component[body]" id="component-form_body" value={Phoenix.HTML.Form.input_value(f, :body)} />
            <input type="hidden" name="component[template]" id="component-form_template" value={Phoenix.HTML.Form.input_value(f, :template)} />
            <input type="hidden" name="component[example]" id="component-form_example" value={Phoenix.HTML.Form.input_value(f, :example)} />

            <.inputs_for :let={f_attr} field={f[:attrs]}>
              <.input type="hidden" field={f_attr[:id]} />
              <.input type="hidden" field={f_attr[:name]} />
              <.input type="hidden" field={f_attr[:type]} options={types_to_options()} />
              <.input :if={f_attr[:type].value == "struct"} type="hidden" field={f_attr[:struct_name]} />
              <.input type="hidden" field={f_attr[:opts_required]} value={opts_required_value(f_attr)} />
              <.input type="hidden" field={f_attr[:opts_default]} value={opts_default_value(f_attr)} />
              <.input type="hidden" field={f_attr[:opts_values]} value={opts_values_value(f_attr)} />
              <.input type="hidden" field={f_attr[:opts_doc]} value={opts_doc_value(f_attr)} />
              <.input type="hidden" field={f_attr[:opts_examples]} value={opts_examples_value(f_attr)} />
            </.inputs_for>
          </.form>

          <.table id="attrs" rows={get_component_attrs_from_form(@form)} row_click={fn attr -> JS.push("show_attr_modal", value: %{attr_id: attr.id}, target: @myself) end}>
            <:col :let={attr} label="Component Attributes">{attr.name}</:col>
            <:action :let={attr}>
              <.link
                phx-click="show_attr_modal"
                phx-value-attr_id={attr.id}
                phx-target={@myself}
                title="Edit attribute"
                aria-label="Edit attribute"
                class="flex items-center justify-center w-10 h-10 group"
              >
                <.icon name="hero-pencil-square text-[#61758A] hover:text-[#304254]" />
              </.link>
            </:action>

            <:action :let={attr}>
              <.link
                phx-click={JS.push("delete_attr", value: %{attr_id: attr.id})}
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
        <div class="col-span-full lg:col-span-2 space-y-6">
          <div>
            <.label for={@form[:body].id}>Body</.label>
            {template_error(@form[:body])}
            <div class="py-6 w-full rounded-[1.25rem] bg-[#0D1829] [&_.monaco-editor-background]:!bg-[#0D1829] [&_.margin]:!bg-[#0D1829]">
              <LiveMonacoEditor.code_editor
                path="body"
                class="col-span-full lg:col-span-2"
                value={Phoenix.HTML.Form.input_value(@form, :body)}
                change="set_body"
                opts={Map.merge(LiveMonacoEditor.default_opts(), %{"language" => "elixir"})}
              />
            </div>
          </div>

          <div>
            <.label for={@form[:template].id}>Template</.label>
            {template_error(@form[:template])}
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

          <div>
            <.label for={@form[:example].id}>Example</.label>
            {template_error(@form[:example])}
            <div class="py-6 w-full rounded-[1.25rem] bg-[#0D1829] [&_.monaco-editor-background]:!bg-[#0D1829] [&_.margin]:!bg-[#0D1829]">
              <LiveMonacoEditor.code_editor
                path="example"
                class="col-span-full lg:col-span-2"
                value={Phoenix.HTML.Form.input_value(@form, :example)}
                change="set_example"
                opts={Map.merge(LiveMonacoEditor.default_opts(), %{"language" => "html"})}
              />
            </div>
          </div>
        </div>
      </div>

      <.modal :if={@show_attr_modal} id="attr-modal" on_cancel={JS.push("close_modal", target: @myself)} show>
        <p class="text-2xl font-bold mb-12">{@modal_title}</p>
        <.form :let={f} id="new-path-form" for={@attr_form} phx-change="validate_attr" phx-submit="add_attr" phx-target={@myself} class="space-y-8">
          <.input type="hidden" name={f[:component_id].name} value={f[:component_id].value} />
          <.input field={f[:name]} type="text" phx-debounce="100" label="Attr Name" />
          <.input field={f[:type]} type="select" options={types_to_options()} label="Type" />
          <.input :if={f[:type].value == "struct"} field={f[:struct_name]} type="text" phx-debounce="100" placeholder="MyApp.Users.User" label="Struct Name" />

          <legend class="text-sm font-bold tracking-widest text-[#445668] uppercase">Options</legend>
          <.input field={f[:opts_required]} type="select" options={["false", "true"]} value={opts_required_value(f)} label="Required" />
          <.input field={f[:opts_default]} type="text" phx-debounce="100" value={opts_default_value(f)} label="Default" />
          <.input field={f[:opts_values]} type="text" phx-debounce="100" value={opts_values_value(f)} label="Accepted values" placeholder='["string 1", :atom_2, 123, %{}, [], ...]' />
          <.input field={f[:opts_doc]} type="text" phx-debounce="100" value={opts_doc_value(f)} label="Attribute doc" />
          <.input field={f[:opts_examples]} type="text" phx-debounce="500" value={opts_examples_value(f)} label="Examples" />

          <div class="flex mt-8 gap-x-[20px]">
            <.button type="submit">Ok</.button>
            <.button type="button" phx-click={JS.push("close_modal", target: @myself)}>Cancel</.button>
          </div>
        </.form>
      </.modal>
    </div>
    """
  end

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
    |> to_string()
  end

  def opts_default_value(form) do
    opts = get_field_opts(form)

    if :default in Keyword.keys(opts) do
      default_opts = Keyword.get(opts, :default)

      cond do
        default_opts == "" ->
          "\"\""

        is_binary(default_opts) ->
          default_opts

        is_struct(default_opts) ->
          %struct_name{} = default_opts
          "%#{struct_name}{}"

        true ->
          inspect(default_opts)
      end
    else
      ""
    end
  end

  def opts_examples_value(form) do
    examples_value =
      form
      |> get_field_opts()
      |> Keyword.get(:examples, "")

    cond do
      is_binary(examples_value) ->
        examples_value

      is_list(examples_value) ->
        Enum.reduce(examples_value, [], fn
          %{__struct__: struct_name}, acc -> ["%#{struct_name}{}" | acc]
          value, acc -> [value | acc]
        end)
        |> Enum.reverse()
        |> inspect()

      true ->
        inspect(examples_value)
    end
  end

  def opts_values_value(form) do
    values =
      form
      |> get_field_opts()
      |> Keyword.get(:values, "")

    cond do
      is_binary(values) ->
        values

      is_list(values) ->
        Enum.reduce(values, [], fn
          %{__struct__: struct_name}, acc -> ["%#{struct_name}{}" | acc]
          value, acc -> [value | acc]
        end)
        |> Enum.reverse()
        |> inspect()

      true ->
        inspect(values)
    end
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

  defp get_component_attrs_from_form(form), do: get_field(form.source, :attrs)
end
