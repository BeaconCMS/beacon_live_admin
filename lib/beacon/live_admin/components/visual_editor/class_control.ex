defmodule Beacon.LiveAdmin.VisualEditor.ClassControl do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_component

  # FIXME: create functions components to reuse shared styles (currently defined in PropertiesSidebarSectionComponent)
  def render(assigns) do
    ~H"""
    <div>
      <.form for={@form} phx-target={@myself} phx-change="update">
        <.input field={@form[:value]} label="Class" />
      </.form>
    </div>
    """
  end

  # FIXME: avoid remount to preserve state
  def mount(socket) do
    dbg(:mount)
    {:ok, assign_form(socket, "")}
  end

  def update(%{element: element}, socket) do
    path = Map.get(element, "path", "")
    class = get_in(element, ["attrs", "class"]) || ""

    {:ok,
     socket
     |> assign(path: path)
     |> assign_form(class)}
  end

  def update(assigns, socket) do
    {:ok, assign(socket, assigns)}
  end

  # TODO: validate class is valid
  def handle_event("update", %{"value" => class}, socket) do
    %{path: path} = socket.assigns
    send(self(), {:updated_element, %{path: path, attrs: %{"class" => class}}})
    {:noreply, assign_form(socket, class)}
  end

  defp assign_form(socket, class) do
    form = to_form(%{"value" => class})
    assign(socket, form: form)
  end
end
