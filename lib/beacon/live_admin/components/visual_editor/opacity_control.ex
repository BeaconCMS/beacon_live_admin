defmodule Beacon.LiveAdmin.VisualEditor.OpacityControl do
  @moduledoc false
  # https://tailwindcss.com/docs/opacity

  use Beacon.LiveAdmin.Web, :live_component
require Logger
  # FIXME: create functions components to reuse shared styles (currently defined in PropertiesSidebarSectionComponent)
  def render(assigns) do
    ~H"""
    <div>
      <.form for={@form} phx-target={@myself} phx-change="update">
        <.input field={@form[:value]} label="Opacity" type="range" min="0" max="100" step="5" />
      </.form>
    </div>
    """
  end

  # FIXME: avoid remount to preserve state
  def mount(socket) do
    {:ok, assign_form(socket, "")}
  end

  # def update(%{element: element}, socket) do
  #   path = Map.get(element, "path", "")

  #   # TODO: extract opacity value from `class`
  #   _class = get_in(element, ["attrs", "class"]) || ""
  #   opacity = "100"
  #   dbg(element)
  #   dbg(path)
  #   {:ok,
  #    socket
  #    |> assign(path: path)
  #    |> assign_form(opacity)}
  # end

  # TODO: validate opacity value is valid is valid
  def handle_event("update", %{"value" => opacity}, socket) do
    Logger.debug("#########################################################")
    Logger.debug("#########################################################")
    Logger.debug("#########################################################")
    Logger.debug("#########################################################")
    Logger.debug("################## handle_event(update) #################")
    dbg(socket)
    %{path: path} = socket.assigns
    class = build_class(opacity)
    send(self(), {:updated_element, %{path: path, attrs: %{"class" => class}}})
    {:noreply, assign_form(socket, opacity)}
  end

  defp build_class(opacity) do
    "opacity-#{opacity}"
  end

  defp assign_form(socket, value) do
    form = to_form(%{"value" => value})
    assign(socket, form: form)
  end
end
