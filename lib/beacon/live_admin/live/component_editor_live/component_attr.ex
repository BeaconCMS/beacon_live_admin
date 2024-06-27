defmodule Beacon.LiveAdmin.ComponentEditorLive.ComponentAttr do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Content

  @impl true
  # TODO: check the correct menu link for thsi modal
  def menu_link("/components", :attrs), do: {:submenu, "Components"}
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(%{"id" => component_id, "attr_id" => attr_id}, _url, socket) do
    component = Content.get_component(socket.assigns.beacon_page.site, component_id)
    component_attr = Enum.find(component.attrs, &(&1.id == attr_id))

    changeset =
      Content.change_component_attr(socket.assigns.beacon_page.site, component_attr, %{})

    {:noreply,
     socket
     |> assign_form(changeset)
     |> assign(
       component_id: component.id,
       component_attr: component_attr,
       page_title: "Edit Attribute"
     )}
  end

  def handle_params(%{"id" => component_id}, _url, socket) do
    component = Content.get_component(socket.assigns.beacon_page.site, component_id)
    component_attr = %Beacon.Content.ComponentAttr{component_id: component.id}

    changeset =
      Content.change_component_attr(socket.assigns.beacon_page.site, component_attr, %{})

    {:noreply,
     socket
     |> assign_form(changeset)
     |> assign(
       component_id: component.id,
       component_attr: component_attr,
       page_title: "Create Attribute"
     )}
  end

  @impl true
  def handle_event("validate", %{"component_attr" => component_attr_params}, socket) do
    component_attr_params = format_struct_name_input(component_attr_params)

    component_attr_params = format_options_input(component_attr_params)

    changeset =
      socket.assigns.beacon_page.site
      |> Content.change_component_attr(socket.assigns.component_attr, component_attr_params)
      |> Map.put(:action, :validate)

    {:noreply, assign_form(socket, changeset)}
  end

  def handle_event("save", %{"component_attr" => component_attr_params}, socket) do
    component_attr_params = format_struct_name_input(component_attr_params)

    component_attr_params = format_options_input(component_attr_params)

    save_component(socket, socket.assigns.live_action, component_attr_params)
  end

  defp format_struct_name_input(component_attr_params) do
    case component_attr_params["struct_name"] do
      nil ->  Map.put(component_attr_params, "struct_name", nil)
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
    attr_opts |> Keyword.merge([required: true])
  end

  defp option_default(attr_opts, ""), do: attr_opts
  defp option_default(attr_opts, opts_default) do
    attr_opts |> Keyword.merge([default: opts_default])
  end

  defp option_values(attr_opts, ""), do: attr_opts
  defp option_values(attr_opts, opts_values) do
    values = split_string_into_list(opts_values)

    attr_opts |> Keyword.merge([values: values])
  end

  defp option_doc(attr_opts, ""), do: attr_opts
  defp option_doc(attr_opts, opts_doc) do
    attr_opts |> Keyword.merge([doc: opts_doc])
  end

  defp save_component(socket, :new, component_attr_params) do
    %{beacon_page: %{site: site}, component_id: component_id} = socket.assigns

    case Content.create_component_attr(site, component_attr_params) do
      {:ok, _component_attr} ->
        to = beacon_live_admin_path(socket, site, "/components/#{component_id}")

        {:noreply,
         socket
         |> put_flash(:info, "Component Attribute created successfully")
         |> push_patch(to: to)}

      {:error, changeset} ->
        changeset = Map.put(changeset, :action, :insert)
        {:noreply, assign_form(socket, changeset)}
    end
  end

  defp save_component(socket, :edit, component_attr_params) do
    %{beacon_page: %{site: site}, component_id: component_id, component_attr: component_attr} =
      socket.assigns

    case Content.update_component_attr(site, component_attr, component_attr_params) do
      {:ok, _component_attr} ->
        to = beacon_live_admin_path(socket, site, "/components/#{component_id}")

        {:noreply,
         socket
         |> put_flash(:info, "Component Attribute updated successfully")
         |> push_patch(to: to)}

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
    <.modal id="edit-attr-modal" on_cancel={JS.navigate(beacon_live_admin_path(@socket, @beacon_page.site, "/components/#{@component_id}"))} show>
      <p class="text-2xl font-bold mb-12"><%= @page_title %></p>
      <.form :let={f} id="new-path-form" for={@form} phx-change="validate" phx-submit="save" class="space-y-8">
        <.input type="hidden" name={f[:component_id].name} value={f[:component_id].value} />
        <.input field={f[:name]} type="text" phx-debounce="100" label="Attr Name" />
        <.input field={f[:type]} type="select" options={types_to_options()} label="Type" />
        <.input :if={f[:type].value == "struct"} field={f[:struct_name]} type="text" phx-debounce="100" label="Struct Name" />

        <legend class="text-sm font-bold tracking-widest text-[#445668] uppercase">Options</legend>
        <.input field={f[:opts_required]} type="checkbox" value={opts_required_value(f)} label="Required attribute" />
        <.input field={f[:opts_default]} type="text" phx-debounce="100" value={opts_default_value(f)} label="Default Attribute" />
        <.input field={f[:opts_values]} type="text" phx-debounce="100" value={opts_values_value(f)} label="Accepted values" placeholder="value1, value2, ..." />
        <.input field={f[:opts_doc]} type="text" phx-debounce="100" value={opts_doc_value(f)} label="Attribute doc" />

        <div class="flex mt-8 gap-x-[20px]">
          <.button type="submit">Save</.button>
          <.button type="button" phx-click={JS.navigate(beacon_live_admin_path(@socket, @beacon_page.site, "/components/#{@component_id}"))}>Cancel</.button>
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
  end

  def opts_default_value(form) do
    form
    |> get_field_opts()
    |> Keyword.get(:default, "")
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

  defp split_string_into_list(string) do
    ~r/[\s,]+/
    |> Regex.split(string)
    |> Enum.reject(&(&1 == ""))
  end
end
