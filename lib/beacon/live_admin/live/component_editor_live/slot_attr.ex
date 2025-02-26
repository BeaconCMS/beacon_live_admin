defmodule Beacon.LiveAdmin.ComponentEditorLive.SlotAttr do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Client.Content

  @impl true
  def menu_link("/components", :attrs), do: {:submenu, "Components"}
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(
        %{"id" => component_id, "slot_id" => slot_id, "attr_id" => attr_id},
        _url,
        socket
      ) do
    component =
      Content.get_component(socket.assigns.beacon_page.site, component_id, preloads: [slots: :attrs])

    component_slot = Enum.find(component.slots, &(&1.id == slot_id))
    slot_attr = Enum.find(component_slot.attrs, &(&1.id == attr_id))

    changeset = Content.change_slot_attr(socket.assigns.beacon_page.site, slot_attr, %{}, [])

    {:noreply,
     socket
     |> assign_form(changeset)
     |> assign(
       component: component,
       slot_id: component_slot.id,
       slot_attr: slot_attr,
       page_title: "Edit Attribute"
     )}
  end

  def handle_params(%{"id" => component_id, "slot_id" => slot_id}, _url, socket) do
    component =
      Content.get_component(socket.assigns.beacon_page.site, component_id, preloads: [slots: :attrs])

    component_slot = Enum.find(component.slots, &(&1.id == slot_id))
    slot_attr = %Beacon.Content.ComponentSlotAttr{slot_id: component_slot.id}

    changeset = Content.change_slot_attr(socket.assigns.beacon_page.site, slot_attr, %{}, [])

    {:noreply,
     socket
     |> assign_form(changeset)
     |> assign(
       component: component,
       slot_id: component_slot.id,
       slot_attr: slot_attr,
       page_title: "Create Attribute"
     )}
  end

  @impl true
  def handle_event("validate", %{"component_slot_attr" => slot_attr_params}, socket) do
    %{component: component, slot_id: slot_id, slot_attr: slot_attr} = socket.assigns

    component_slot = Enum.find(component.slots, &(&1.id == slot_id))
    slot_attr_names = Enum.reject(component_slot.attrs, &(&1.id == slot_attr.id)) |> Enum.map(& &1.name)

    slot_attr_params = format_struct_name_input(slot_attr_params)
    slot_attr_params = format_options_input(slot_attr_params)

    changeset =
      socket.assigns.beacon_page.site
      |> Content.change_slot_attr(slot_attr, slot_attr_params, slot_attr_names)
      |> Map.put(:action, :validate)

    {:noreply, assign_form(socket, changeset)}
  end

  def handle_event("save", %{"component_slot_attr" => slot_attr_params}, socket) do
    slot_attr_params = format_struct_name_input(slot_attr_params)

    slot_attr_params = format_options_input(slot_attr_params)

    save_component(socket, socket.assigns.live_action, slot_attr_params)
  end

  defp format_struct_name_input(slot_attr_params) do
    case slot_attr_params["struct_name"] do
      nil -> Map.put(slot_attr_params, "struct_name", nil)
      _ -> slot_attr_params
    end
  end

  def format_options_input(slot_attr_params) do
    attr_opts = []

    attr_opts =
      attr_opts
      |> option_required(slot_attr_params["opts_required"])
      |> option_default(slot_attr_params["opts_default"])
      |> option_values(slot_attr_params["opts_values"])
      |> option_doc(slot_attr_params["opts_doc"])
      |> option_examples(slot_attr_params["opts_examples"])

    Map.put(slot_attr_params, "opts", attr_opts)
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

  defp save_component(socket, :new, slot_attr_params) do
    %{beacon_page: %{site: site}, component: component, slot_id: slot_id, __beacon_actor__: actor} = socket.assigns

    component_slot = Enum.find(component.slots, &(&1.id == slot_id))
    slot_attr_names = Enum.map(component_slot.attrs, & &1.name)

    case Content.create_slot_attr(site, actor, slot_attr_params, slot_attr_names) do
      {:ok, _slot_attr} ->
        to = beacon_live_admin_path(socket, site, "/components/#{component.id}/slots/#{slot_id}")

        {:noreply,
         socket
         |> put_flash(:info, "Slot Attribute created successfully")
         |> push_navigate(to: to)}

      {:error, changeset} ->
        changeset = Map.put(changeset, :action, :insert)
        {:noreply, assign_form(socket, changeset)}
    end
  end

  defp save_component(socket, :edit, slot_attr_params) do
    %{
      beacon_page: %{site: site},
      __beacon_actor__: actor,
      component: component,
      slot_id: slot_id,
      slot_attr: slot_attr
    } = socket.assigns

    component_slot = Enum.find(component.slots, &(&1.id == slot_id))
    slot_attr_names = Enum.reject(component_slot.attrs, &(&1.id == slot_attr.id)) |> Enum.map(& &1.name)

    case Content.update_slot_attr(site, actor, slot_attr, slot_attr_params, slot_attr_names) do
      {:ok, _slot_attr} ->
        to = beacon_live_admin_path(socket, site, "/components/#{component.id}/slots/#{slot_id}")

        {:noreply,
         socket
         |> put_flash(:info, "Slot Attribute updated successfully")
         |> push_navigate(to: to)}

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
    <.modal id="edit-attr-modal" on_cancel={JS.navigate(beacon_live_admin_path(@socket, @beacon_page.site, "/components/#{@component.id}/slots/#{@slot_id}"))} show>
      <:title><%= @page_title %></:title>
      <.form :let={f} id="new-path-form" for={@form} phx-change="validate" phx-submit="save" class="space-y-4 text-sm px-4">
        <.input type="hidden" name={f[:slot_id].name} value={f[:slot_id].value} />
        <.input field={f[:name]} type="text" phx-debounce="100" label="Attr Name" class="text-sm p-1 m-2 focus:ring-2" />
        <.input field={f[:type]} type="select" options={types_to_options()} label="Type" class="text-sm p-1 m-2 focus:ring-2" />
        <.input :if={f[:type].value == "struct"} field={f[:struct_name]} type="text" phx-debounce="100" placeholder="MyApp.Users.User" label="Struct Name" class="text-sm p-1 m-2 focus:ring-2" />

        <legend class="text-sm font-bold tracking-widest text-[#445668] uppercase">Options</legend>
        <.input field={f[:opts_required]} type="select" options={["false", "true"]} value={opts_required_value(f)} label="Required" class="text-sm p-1 m-2 focus:ring-2" />
        <.input field={f[:opts_default]} type="text" phx-debounce="100" value={opts_default_value(f)} label="Default" class="text-sm p-1 m-2 focus:ring-2" />
        <.input
          field={f[:opts_values]}
          type="text"
          phx-debounce="100"
          value={opts_values_value(f)}
          label="Accepted values"
          placeholder={"[\"string 1\", :atom_2, 123, %{}, [], ...]"}
          class="text-sm p-1 m-2 focus:ring-2"
        />
        <.input field={f[:opts_doc]} type="text" phx-debounce="100" value={opts_doc_value(f)} label="Attribute doc" class="text-sm p-1 m-2 focus:ring-2" />
        <.input field={f[:opts_examples]} type="text" phx-debounce="500" value={opts_examples_value(f)} label="Examples" class="text-sm p-1 m-2 focus:ring-2" />

        <div class="flex mt-8 gap-x-[20px]">
          <.button type="submit">Save</.button>
          <.button type="button" class="sui-secondary" phx-click={JS.navigate(beacon_live_admin_path(@socket, @beacon_page.site, "/components/#{@component.id}/slots/#{@slot_id}"))}>Cancel</.button>
        </div>
      </.form>
    </.modal>
    """
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
end
