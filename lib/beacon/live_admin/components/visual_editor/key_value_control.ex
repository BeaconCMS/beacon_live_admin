defmodule Beacon.LiveAdmin.VisualEditor.KeyValueControl do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_component

  # FIXME: create functions components to reuse shared styles (currently defined in PropertiesSidebarSectionComponent)
  def render(assigns) do
    ~H"""
    <div id={@id}>
      <.form :let={f} for={@form} as={@as} phx-target={@myself} phx-blur="update">
        <.input field={f[:name]} label="Name" />
        <%!-- phx-debounce="blur" /> --%>
        <.input field={f[:value]} label="Value" phx-debounce="update" />
        <%!-- phx-debounce="blur" /> --%>
      </.form>
    </div>
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

  # TODO: validate k/v is valid
  # TODO: required `value` before sending? to avoid invalid html
  def handle_event("update", attrs, socket) do
    dbg(attrs)
    # %{"name" => name, "value" => value} = Map.get(attrs, Atom.to_string(socket.assigns.as), %{})
    # %{path: path} = socket.assigns
    # send(self(), {:updated_element, {socket.assigns.element["path"], %{"attrs" => %{name => value}}}})
    # {:noreply, assign_form(socket, name, value)}
    {:noreply, socket}
  end

  defp assign_form(socket, name, value) do
    form = to_form(%{"name" => name, "value" => value})
    assign(socket, form: form)
  end
end
