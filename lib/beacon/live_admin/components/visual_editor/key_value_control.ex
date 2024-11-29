defmodule Beacon.LiveAdmin.VisualEditor.KeyValueControl do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_component
  require Logger
  # FIXME: create functions components to reuse shared styles (currently defined in PropertiesSidebarSectionComponent)
  def render(assigns) do
    ~H"""
    <section id={@id} class="p-4 border-b border-b-gray-100 border-solid">
      <.form :let={f} for={@form} as={@as} phx-target={@myself} phx-blur="update">
        <.input
          class="w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm"
          field={f[:name]}
          label="Name"
          phx-blur="name_blur"
          phx-target={@myself}/>
        <.input
          class="w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm"
          field={f[:value]}
          label="Value"
          phx-blur="value_blur"
           phx-target={@myself}/>
      </.form>
    </section>
    """
  end

  # FIXME: avoid remount to preserve state
  def mount(socket) do
    {:ok, assign_form(socket, "", "")}
  end

  def update(%{index: index, element: element, id: id}, socket) do
    as = String.to_atom("kv_#{index}")
    path = Map.get(element, "path", "")

    {:ok,
     socket
     |> assign(as: as, path: path, id: id)
     |> assign_form("", "")}
  end

  def update(assigns, socket) do
    {:ok, assign(socket, assigns)}
  end

  def handle_event("name_blur", attrs, socket) do
    Logger.debug("##################################")
    Logger.debug("########### name_blur ###############")
    Logger.debug("##################################")
    dbg(attrs)
    {:noreply, socket}
  end

  def handle_event("value_blur", attrs, socket) do
    Logger.debug("##################################")
    Logger.debug("########### value_blur ###############")
    Logger.debug("##################################")
    dbg(attrs)
    {:noreply, socket}
  end

  # TODO: validate k/v is valid
  # TODO: required `value` before sending? to avoid invalid html
  def handle_event("update", attrs, socket) do
    dbg(attrs)
    # %{"name" => name, "value" => value} = Map.get(attrs, Atom.to_string(socket.assigns.as), %{})
    # %{path: path} = socket.assigns
    # send(self(), {:updated_element, %{path: path, attrs: %{name => value}}})
    # {:noreply, assign_form(socket, name, value)}
    {:noreply, socket}
  end

  defp assign_form(socket, name, value) do
    form = to_form(%{"name" => name, "value" => value})
    assign(socket, form: form)
  end
end
