defmodule Beacon.LiveAdmin.VisualEditor.SpaceControl do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_component
  import Beacon.LiveAdmin.VisualEditor.Components.InputWithUnits
  alias Beacon.LiveAdmin.VisualEditor
  alias Beacon.LiveAdmin.VisualEditor.Components.ControlSection
  alias Beacon.LiveAdmin.VisualEditor.Css.Space

  @space_units ~w(px rem em %)
  @space_sizes ~w(0 1 2 3 4 5 6 8 10 12 16 20 24 32 40 48 56 64)

  def mount(socket) do
    {:ok,
     assign(socket,
       space_sizes: @space_sizes,
       space_units: @space_units
     )}
  end

  def update(%{element: element} = assigns, socket) do
    values = Space.extract_space_properties(element)

    {:ok,
     socket
     |> assign(assigns)
     |> assign_form(values)}
  end

  def render(assigns) do
    ~H"""
    <div id={@id}>
      <.live_component module={ControlSection} id={@id <> "-section"} label="Space">
        <div class="space-y-4">
          <div>
            <label class="text-xs">Margin</label>
            <form phx-change="update_margin" phx-target={@myself} class="space-y-2 mt-1">
              <div class="w-full grid grid-cols-2 gap-1">
                <div class="flex items-center gap-1">
                  <span><.icon name="hero-arrow-long-up" /></span>
                  <.input_with_units name="margin_top" value={@form.params["margin_top"]} value_unit={@form.params["margin_top_unit"]} sizes={@space_sizes} units={@space_units} />
                </div>
                <div class="flex items-center gap-1">
                  <span><.icon name="hero-arrow-long-right" /></span>
                  <.input_with_units name="margin_right" value={@form.params["margin_right"]} value_unit={@form.params["margin_right_unit"]} sizes={@space_sizes} units={@space_units} />
                </div>
                <div class="flex items-center gap-1">
                  <span><.icon name="hero-arrow-long-down" /></span>
                  <.input_with_units name="margin_bottom" value={@form.params["margin_bottom"]} value_unit={@form.params["margin_bottom_unit"]} sizes={@space_sizes} units={@space_units} />
                </div>
                <div class="flex items-center gap-1">
                  <span><.icon name="hero-arrow-long-left" /></span>
                  <.input_with_units name="margin_left" value={@form.params["margin_left"]} value_unit={@form.params["margin_left_unit"]} sizes={@space_sizes} units={@space_units} />
                </div>
              </div>
            </form>
          </div>

          <div>
            <label class="text-xs">Padding</label>
            <form phx-change="update_padding" phx-target={@myself} class="space-y-2 mt-1">
              <div class="w-full grid grid-cols-2 gap-1">
                <div class="flex items-center gap-1">
                  <span><.icon name="hero-arrow-long-up" /></span>
                  <.input_with_units name="padding_top" value={@form.params["padding_top"]} value_unit={@form.params["padding_top_unit"]} sizes={@space_sizes} units={@space_units} />
                </div>
                <div class="flex items-center gap-1">
                  <span><.icon name="hero-arrow-long-right" /></span>
                  <.input_with_units name="padding_right" value={@form.params["padding_right"]} value_unit={@form.params["padding_right_unit"]} sizes={@space_sizes} units={@space_units} />
                </div>
                <div class="flex items-center gap-1">
                  <span><.icon name="hero-arrow-long-down" /></span>
                  <.input_with_units name="padding_bottom" value={@form.params["padding_bottom"]} value_unit={@form.params["padding_bottom_unit"]} sizes={@space_sizes} units={@space_units} />
                </div>
                <div class="flex items-center gap-1">
                  <span><.icon name="hero-arrow-long-left" /></span>
                  <.input_with_units name="padding_left" value={@form.params["padding_left"]} value_unit={@form.params["padding_left_unit"]} sizes={@space_sizes} units={@space_units} />
                </div>
              </div>
            </form>
          </div>
        </div>
      </.live_component>
    </div>
    """
  end

  def handle_event("update_margin", params, socket) do
    update_classes(socket, params, "margin")
  end

  def handle_event("update_padding", params, socket) do
    update_classes(socket, params, "padding")
  end

  defp update_classes(socket, params, type) do
    new_classes = Space.generate_space_classes(params, type)

    classes =
      socket.assigns.element
      |> VisualEditor.delete_classes(~r/^#{type}-[trbl]?-(\d+|auto|\[.+\])$/)
      |> VisualEditor.merge_class(Enum.join(new_classes, " "))

    send(self(), {:element_changed, {socket.assigns.element["path"], %{updated: %{"attrs" => %{"class" => classes}}}}})

    {:noreply, socket}
  end

  defp assign_form(socket, values) do
    form = to_form(values)
    assign(socket, form: form)
  end
end
