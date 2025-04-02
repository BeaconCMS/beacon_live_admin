defmodule Beacon.LiveAdmin.VisualEditor.OpacityControl do
  @moduledoc false
  # https://tailwindcss.com/docs/opacity

  use Beacon.LiveAdmin.Web, :live_component
  alias Beacon.LiveAdmin.VisualEditor
  alias Beacon.LiveAdmin.VisualEditor.Components.ControlSection

  def render(assigns) do
    ~H"""
    <div id={@id}>
      <.live_component module={ControlSection} id={@id <> "-section"} label="Opacity">
        <.form for={@form} phx-target={@myself} phx-change="update" phx-throttle="1000">
          <.input field={@form[:value]} type="range" min="0" max="100" step="5" />
        </.form>
      </.live_component>
    </div>
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

  def handle_event("update", %{"value" => opacity}, socket) do
    if validate(opacity) == :ok do
      class = VisualEditor.merge_class(socket.assigns.element, "opacity-#{opacity}")

      socket.assigns.on_element_change.(
        socket.assigns.element["path"],
        %{updated: %{"attrs" => %{"class" => class}}}
      )

      {:noreply, assign_form(socket, opacity)}
    else
      {:noreply, socket}
    end
  end

  defp validate(opacity) do
    opacity = String.to_integer(opacity)
    if opacity >= 0 and opacity <= 100, do: :ok, else: :error
  rescue
    _ -> :error
  end

  defp assign_form(socket, value) do
    form = to_form(%{"value" => value})
    assign(socket, form: form)
  end
end
