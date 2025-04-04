defmodule Beacon.LiveAdmin.VisualEditor.LayoutControl do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_component
  import Beacon.LiveAdmin.VisualEditor.Components.InputWithUnits
  alias Beacon.LiveAdmin.VisualEditor
  alias Beacon.LiveAdmin.VisualEditor.Components.ControlSection
  alias Beacon.LiveAdmin.VisualEditor.Css.Layout

  @display_options [
    {"Block", "block"},
    {"Inline", "inline"},
    {"Inline Block", "inline-block"},
    {"None", "hidden"},
    {"Flex", "flex"},
    {"Inline Flex", "inline-flex"}
  ]

  @flex_direction_options [
    {"Row", "row"},
    {"Row Reverse", "row-reverse"},
    {"Column", "col"},
    {"Column Reverse", "col-reverse"}
  ]

  @flex_wrap_options [
    {"No Wrap", "nowrap"},
    {"Wrap", "wrap"},
    {"Wrap Reverse", "wrap-reverse"}
  ]

  @align_items_options [
    {"Start", "start"},
    {"End", "end"},
    {"Center", "center"},
    {"Baseline", "baseline"},
    {"Stretch", "stretch"}
  ]

  @justify_content_options [
    {"Start", "start"},
    {"End", "end"},
    {"Center", "center"},
    {"Space Between", "between"},
    {"Space Around", "around"},
    {"Space Evenly", "evenly"}
  ]

  @align_content_options [
    {"Start", "start"},
    {"End", "end"},
    {"Center", "center"},
    {"Space Between", "between"},
    {"Space Around", "around"},
    {"Space Evenly", "evenly"}
  ]

  @gap_units ~w(px rem em %)
  @gap_sizes [
    {"0", "0"},
    {"1", "1"},
    {"2", "2"},
    {"3", "3"},
    {"4", "4"},
    {"5", "5"},
    {"6", "6"},
    {"8", "8"},
    {"10", "10"},
    {"12", "12"},
    {"16", "16"},
    {"20", "20"},
    {"24", "24"},
    {"32", "32"},
    {"40", "40"},
    {"48", "48"},
    {"56", "56"},
    {"64", "64"}
  ]

  def mount(socket) do
    {:ok,
     assign(socket,
       display_options: @display_options,
       flex_direction_options: @flex_direction_options,
       flex_wrap_options: @flex_wrap_options,
       align_items_options: @align_items_options,
       justify_content_options: @justify_content_options,
       align_content_options: @align_content_options,
       gap_sizes: @gap_sizes,
       gap_units: @gap_units
     )}
  end

  def update(%{element: element} = assigns, socket) do
    values = Layout.extract_layout_properties(element)

    {:ok,
     socket
     |> assign(assigns)
     |> assign_form(values)}
  end

  def render(assigns) do
    assigns =
      assigns
      |> assign(:is_flex?, assigns.form.params["display"] in ["flex", "inline-flex"])

    ~H"""
    <div id={@id}>
      <.live_component module={ControlSection} id={@id <> "-section"} label="Layout">
        <form phx-change="update_layout" phx-target={@myself} class="space-y-4">
          <div class="grid grid-cols-2 items-center gap-x-2">
            <label class="text-xs">Display</label>
            <select name="display" class="w-full py-0.5 px-2 bg-gray-100 border-gray-100 rounded-md leading-5 text-sm">
              <option value=""></option>
              <option :for={{label, value} <- @display_options} value={value} selected={@form.params["display"] == value}>
                <%= label %>
              </option>
            </select>
          </div>

          <%= if @is_flex? do %>
            <div class="grid grid-cols-2 items-center gap-x-2">
              <label class="text-xs">Flex Direction</label>
              <select name="flex_direction" class="w-full py-0.5 px-2 bg-gray-100 border-gray-100 rounded-md leading-5 text-sm">
                <option value=""></option>
                <option :for={{label, value} <- @flex_direction_options} value={value} selected={@form.params["flex_direction"] == value}>
                  <%= label %>
                </option>
              </select>
            </div>

            <div class="grid grid-cols-2 items-center gap-x-2">
              <label class="text-xs">Flex Wrap</label>
              <select name="flex_wrap" class="w-full py-0.5 px-2 bg-gray-100 border-gray-100 rounded-md leading-5 text-sm">
                <option value=""></option>
                <option :for={{label, value} <- @flex_wrap_options} value={value} selected={@form.params["flex_wrap"] == value}>
                  <%= label %>
                </option>
              </select>
            </div>

            <div class="grid grid-cols-2 items-center gap-x-2">
              <label class="text-xs">Align Items</label>
              <select name="align_items" class="w-full py-0.5 px-2 bg-gray-100 border-gray-100 rounded-md leading-5 text-sm">
                <option value=""></option>
                <option :for={{label, value} <- @align_items_options} value={value} selected={@form.params["align_items"] == value}>
                  <%= label %>
                </option>
              </select>
            </div>

            <div class="grid grid-cols-2 items-center gap-x-2">
              <label class="text-xs">Justify Content</label>
              <select name="justify_content" class="w-full py-0.5 px-2 bg-gray-100 border-gray-100 rounded-md leading-5 text-sm">
                <option value=""></option>
                <option :for={{label, value} <- @justify_content_options} value={value} selected={@form.params["justify_content"] == value}>
                  <%= label %>
                </option>
              </select>
            </div>

            <div class="grid grid-cols-2 items-center gap-x-2">
              <label class="text-xs">Align Content</label>
              <select name="align_content" class="w-full py-0.5 px-2 bg-gray-100 border-gray-100 rounded-md leading-5 text-sm">
                <option value=""></option>
                <option :for={{label, value} <- @align_content_options} value={value} selected={@form.params["align_content"] == value}>
                  <%= label %>
                </option>
              </select>
            </div>

            <div class="space-y-4">
              <div class="grid grid-cols-2 items-center gap-x-2">
                <label class="text-xs">Row Gap</label>
                <.input_with_units name="row_gap" value={@form.params["row_gap"]} value_unit={@form.params["row_gap_unit"]} sizes={@gap_sizes} units={@gap_units} size="sm" />
              </div>

              <div class="grid grid-cols-2 items-center gap-x-2">
                <label class="text-xs">Column Gap</label>
                <.input_with_units name="column_gap" value={@form.params["column_gap"]} value_unit={@form.params["column_gap_unit"]} sizes={@gap_sizes} units={@gap_units} size="sm" />
              </div>
            </div>
          <% end %>
        </form>
      </.live_component>
    </div>
    """
  end

  def handle_event("update_layout", params, socket) do
    new_classes = Layout.generate_layout_classes(params)

    classes =
      socket.assigns.element
      |> VisualEditor.delete_classes(~r/^(block|inline|inline-block|hidden|flex|inline-flex)$/)
      |> VisualEditor.delete_classes(~r/^flex-(row|row-reverse|col|col-reverse|wrap|wrap-reverse|nowrap)$/)
      |> VisualEditor.delete_classes(~r/^items-(start|end|center|baseline|stretch)$/)
      |> VisualEditor.delete_classes(~r/^justify-(start|end|center|between|around|evenly)$/)
      |> VisualEditor.delete_classes(~r/^content-(start|end|center|between|around|evenly)$/)
      |> VisualEditor.delete_classes(~r/^(row|col)-gap-(\d+|\[.+\])$/)
      |> VisualEditor.merge_class(Enum.join(new_classes, " "))

    socket.assigns.on_element_change.(socket.assigns.element["path"], %{updated: %{"attrs" => %{"class" => classes}}})

    {:noreply, socket}
  end

  defp assign_form(socket, values) do
    form = to_form(values)
    assign(socket, form: form)
  end
end
