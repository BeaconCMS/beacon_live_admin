defmodule Beacon.LiveAdmin.VisualEditor.OpacityControl do
  @moduledoc false
  # https://tailwindcss.com/docs/opacity

  use Beacon.LiveAdmin.Web, :live_component
  require Logger
  alias Beacon.LiveAdmin.VisualEditor

  # FIXME: create functions components to reuse shared styles (currently defined in PropertiesSidebarSectionComponent)
  def render(assigns) do
    ~H"""
    <section id={@id} class="p-4 border-b border-b-gray-100 border-solid">
      <.form for={@form} phx-target={@myself} phx-change="update" phx-throttle="1000">
        <.input field={@form[:value]} label="Opacity" type="range" min="0" max="100" step="5" />
      </.form>
    </section>
    """
  end

  # FIXME: avoid remount to preserve state
  def mount(socket) do
    {:ok, assign_form(socket, "")}
  end

  def update(%{element: element} = assigns, socket) do
    opacity = VisualEditor.extract_utility_class_value(element, "opacity", "100")

    {:ok,
     socket
     |> assign(assigns)
     |> assign_form(opacity)}
  end

  # TODO: validate opacity value is valid is valid
  def handle_event("update", %{"value" => opacity}, socket) do
    class = VisualEditor.merge_class(socket.assigns.element, "opacity-#{opacity}")
    send(self(), {:element_changed, {socket.assigns.element["path"], %{updated: %{ "attrs" => %{"class" => class}}}}})
    {:noreply, assign_form(socket, opacity)}
  end

  defp assign_form(socket, value) do
    form = to_form(%{"value" => value})
    assign(socket, form: form)
  end
end
