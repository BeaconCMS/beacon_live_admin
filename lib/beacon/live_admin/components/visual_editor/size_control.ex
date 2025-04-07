defmodule Beacon.LiveAdmin.VisualEditor.SizeControl do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_component
  import Beacon.LiveAdmin.VisualEditor.Components.InputWithUnits
  alias Beacon.LiveAdmin.VisualEditor
  alias Beacon.LiveAdmin.VisualEditor.Components.ControlSection
  alias Beacon.LiveAdmin.VisualEditor.Css.Size

  @units ~w(px % em rem svw svh lvw lvh ch)
  @sizes ~w(3xs 2xs xs sm md lg xl 2xl 3xl 4xl 5xl 6xl 7xl auto full screen dvw dvh min max fit)
  @aspect_ratio_values ~w(square video auto)

  def mount(socket) do
    {:ok,
     assign(socket,
       sizes: @sizes,
       units: @units ++ [""],
       aspect_ratio_values: @aspect_ratio_values
     )}
  end

  def update(%{element: element} = assigns, socket) do
    values = Size.extract_size_properties(element)

    {:ok,
     socket
     |> assign(assigns)
     |> assign_form(values)}
  end

  def render(assigns) do
    ~H"""
    <div id={@id}>
      <.live_component module={ControlSection} id={@id <> "-section"} label="Size">
        <form phx-change="update_size" phx-target={@myself} class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-xs block mb-1">Width</label>
              <.input_with_units name="width" value={@form.params["width"]} value_unit={@form.params["width_unit"]} sizes={@sizes} units={@units} size="sm" />
            </div>
            <div>
              <label class="text-xs block mb-1">Height</label>
              <.input_with_units name="height" value={@form.params["height"]} value_unit={@form.params["height_unit"]} sizes={@sizes} units={@units} size="sm" />
            </div>
            <div>
              <label class="text-xs block mb-1">Min Width</label>
              <.input_with_units name="min_width" value={@form.params["min_width"]} value_unit={@form.params["min_width_unit"]} sizes={@sizes} units={@units} size="sm" />
            </div>
            <div>
              <label class="text-xs block mb-1">Min Height</label>
              <.input_with_units name="min_height" value={@form.params["min_height"]} value_unit={@form.params["min_height_unit"]} sizes={@sizes} units={@units} size="sm" />
            </div>
            <div>
              <label class="text-xs block mb-1">Max Width</label>
              <.input_with_units name="max_width" value={@form.params["max_width"]} value_unit={@form.params["max_width_unit"]} sizes={@sizes} units={@units} size="sm" />
            </div>
            <div>
              <label class="text-xs block mb-1">Max Height</label>
              <.input_with_units name="max_height" value={@form.params["max_height"]} value_unit={@form.params["max_height_unit"]} sizes={@sizes} units={@units} size="sm" />
            </div>
          </div>
          <div>
            <label class="text-xs block mb-1">Aspect Ratio</label>
            <.input_with_units name="aspect_ratio" value={@form.params["aspect_ratio"]} value_unit={@form.params["aspect_ratio_unit"]} sizes={@aspect_ratio_values} units={[]} size="sm" />
          </div>
        </form>
      </.live_component>
    </div>
    """
  end

  def handle_event("update_size", params, socket) do
    update_classes(socket, params)
  end

  defp update_classes(socket, params) do
    new_classes = Size.generate_size_classes(params)

    classes =
      socket.assigns.element
      |> VisualEditor.delete_classes(~r/^w-(\[[^\]]+\]|[a-z0-9-]+)$/)
      |> VisualEditor.delete_classes(~r/^h-(\[[^\]]+\]|[a-z0-9-]+)$/)
      |> VisualEditor.delete_classes(~r/^min-w-(\[[^\]]+\]|[a-z0-9-]+)$/)
      |> VisualEditor.delete_classes(~r/^min-h-(\[[^\]]+\]|[a-z0-9-]+)$/)
      |> VisualEditor.delete_classes(~r/^max-w-(\[[^\]]+\]|[a-z0-9-]+)$/)
      |> VisualEditor.delete_classes(~r/^max-h-(\[[^\]]+\]|[a-z0-9-]+)$/)
      |> VisualEditor.delete_classes(~r/^aspect-.*$/)
      |> VisualEditor.merge_class(Enum.join(new_classes, " "))

    socket.assigns.on_element_change.(socket.assigns.element["path"], %{updated: %{"attrs" => %{"class" => classes}}})

    {:noreply, socket}
  end

  defp assign_form(socket, values) do
    form = to_form(values)
    assign(socket, form: form)
  end
end
