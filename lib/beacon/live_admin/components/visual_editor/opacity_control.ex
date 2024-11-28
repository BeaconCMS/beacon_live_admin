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

  defp find_opacity_class(classes) do
    classes
    |> String.split(" ", trim: true)
    |> Enum.find(fn s -> String.starts_with?(s, "opacity-") end)
  end

  defp extract_opacity(classes) do
    case find_opacity_class(classes) do
      nil -> nil
      class ->
        class
        |> String.split("-")
        |> List.last()
    end
  end

  def update(%{element: element}, socket) do
    path = Map.get(element, "path", "")

    classes = get_in(element, ["attrs", "class"]) || ""
    opacity = extract_opacity(classes) || "100";
    {:ok,
     socket
     |> assign(path: path)
     |> assign(classes: classes)
     |> assign_form(opacity)}
  end

  # TODO: validate opacity value is valid is valid
  def handle_event("update", %{"value" => opacity}, socket) do
    %{path: path, classes: classes} = socket.assigns
    class = build_class(classes, opacity)
    send(self(), {:updated_element, %{path: path, attrs: %{"class" => class}}})
    {:noreply, assign_form(socket, opacity)}
  end

  defp build_class(classes, opacity) do
    other_classes =
      classes
      |> String.split(" ", trim: true)
      |> Enum.reject(fn s -> String.starts_with?(s, "opacity-") end)
    Enum.join(other_classes ++ ["opacity-#{opacity}"], " ")
  end

  defp assign_form(socket, value) do
    form = to_form(%{"value" => value})
    assign(socket, form: form)
  end
end
