defmodule Beacon.LiveAdmin.VisualEditor.TypographyControl do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_component
  import Beacon.LiveAdmin.VisualEditor.Components.InputWithUnits
  alias Beacon.LiveAdmin.VisualEditor
  alias Beacon.LiveAdmin.VisualEditor.Components.ControlSection
  alias Beacon.LiveAdmin.VisualEditor.Css.Typography

  @font_family_options [
    {"Default", "default"},
    {"Sans", "sans"},
    {"Serif", "serif"},
    {"Mono", "mono"}
  ]

  @font_weight_options [
    {"Default", "default"},
    {"Thin", "thin"},
    {"Extra Light", "extralight"},
    {"Light", "light"},
    {"Normal", "normal"},
    {"Medium", "medium"},
    {"Semi Bold", "semibold"},
    {"Bold", "bold"},
    {"Extra Bold", "extrabold"},
    {"Black", "black"}
  ]

  @text_color_options [
    {"Default", "default"},
    {"Black", "black"},
    {"White", "white"},
    {"Gray 50", "gray-50"},
    {"Gray 100", "gray-100"},
    {"Gray 200", "gray-200"},
    {"Gray 300", "gray-300"},
    {"Gray 400", "gray-400"},
    {"Gray 500", "gray-500"},
    {"Gray 600", "gray-600"},
    {"Gray 700", "gray-700"},
    {"Gray 800", "gray-800"},
    {"Gray 900", "gray-900"}
  ]

  @font_size_options [
    {"Default", "default"},
    {"xs", "xs"},
    {"sm", "sm"},
    {"base", "base"},
    {"lg", "lg"},
    {"xl", "xl"},
    {"2xl", "2xl"},
    {"3xl", "3xl"},
    {"4xl", "4xl"},
    {"5xl", "5xl"},
    {"6xl", "6xl"}
  ]

  @line_height_options [
    {"Default", "default"},
    {"None", "none"},
    {"Tight", "tight"},
    {"Snug", "snug"},
    {"Normal", "normal"},
    {"Relaxed", "relaxed"},
    {"Loose", "loose"}
  ]

  @line_height_units ~w(px rem em %)

  @letter_spacing_options [
    {"Default", "default"},
    {"Tighter", "tighter"},
    {"Tight", "tight"},
    {"Normal", "normal"},
    {"Wide", "wide"},
    {"Wider", "wider"},
    {"Widest", "widest"}
  ]

  @letter_spacing_units ~w(px rem em %)

  @text_align_options [
    {"Default", "default"},
    {"Start", "start"},
    {"Center", "center"},
    {"End", "end"},
    {"Justify", "justify"}
  ]

  @text_decoration_options [
    {"None", "no-underline"},
    {"Underline", "underline"},
    {"Line Through", "line-through"}
  ]

  @text_transform_options [
    {"Default", "default"},
    {"Uppercase", "uppercase"},
    {"Lowercase", "lowercase"},
    {"Capitalize", "capitalize"},
    {"None", "normal-case"}
  ]

  @font_style_options [
    {"Default", "default"},
    {"Normal", "not-italic"},
    {"Italic", "italic"}
  ]

  def mount(socket) do
    {:ok,
     assign(socket,
       font_family_options: @font_family_options,
       font_weight_options: @font_weight_options,
       text_color_options: @text_color_options,
       font_size_options: @font_size_options,
       line_height_options: @line_height_options,
       line_height_units: @line_height_units,
       letter_spacing_options: @letter_spacing_options,
       letter_spacing_units: @letter_spacing_units,
       text_align_options: @text_align_options,
       text_decoration_options: @text_decoration_options,
       text_transform_options: @text_transform_options,
       font_style_options: @font_style_options
     )}
  end

  def update(%{element: element} = assigns, socket) do
    values = Typography.extract_typography_properties(element)

    {:ok,
     socket
     |> assign(assigns)
     |> assign_form(values)}
  end

  def render(assigns) do
    ~H"""
    <div id={@id}>
      <.live_component module={ControlSection} id={@id <> "-section"} label="Typography">
        <form phx-change="update_typography" phx-target={@myself} class="space-y-4">
          <div class="grid grid-cols-2 items-center gap-x-2">
            <label class="text-xs">Font Family</label>
            <select name="font_family" class="w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm">
              <option :for={{label, value} <- @font_family_options} value={value} selected={@form.params["font_family"] == value}>
                <%= label %>
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 items-center gap-x-2">
            <label class="text-xs">Font Weight</label>
            <select name="font_weight" class="w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm">
              <option :for={{label, value} <- @font_weight_options} value={value} selected={@form.params["font_weight"] == value}>
                <%= label %>
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 items-center gap-x-2">
            <label class="text-xs">Text Color</label>
            <select name="text_color" class="w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm">
              <option :for={{label, value} <- @text_color_options} value={value} selected={@form.params["text_color"] == value}>
                <%= label %>
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 items-center gap-x-2">
            <label class="text-xs">Font Size</label>
            <select name="font_size" class="w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm">
              <option :for={{label, value} <- @font_size_options} value={value} selected={@form.params["font_size"] == value}>
                <%= label %>
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 items-center gap-x-2">
            <label class="text-xs">Line Height</label>
            <.input_with_units name="line_height" value={@form.params["line_height"]} value_unit={@form.params["line_height_unit"]} sizes={@line_height_options} units={@line_height_units} />
          </div>

          <div class="grid grid-cols-2 items-center gap-x-2">
            <label class="text-xs">Letter Spacing</label>
            <.input_with_units name="letter_spacing" value={@form.params["letter_spacing"]} value_unit={@form.params["letter_spacing_unit"]} sizes={@letter_spacing_options} units={@letter_spacing_units} />
          </div>

          <div class="grid grid-cols-2 items-center gap-x-2">
            <label class="text-xs">Text Align</label>
            <select name="text_align" class="w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm">
              <option :for={{label, value} <- @text_align_options} value={value} selected={@form.params["text_align"] == value}>
                <%= label %>
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 items-center gap-x-2">
            <label class="text-xs">Text Decoration</label>
            <select name="text_decoration" class="w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm">
              <option :for={{label, value} <- @text_decoration_options} value={value} selected={@form.params["text_decoration"] == value}>
                <%= label %>
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 items-center gap-x-2">
            <label class="text-xs">Text Transform</label>
            <select name="text_transform" class="w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm">
              <option :for={{label, value} <- @text_transform_options} value={value} selected={@form.params["text_transform"] == value}>
                <%= label %>
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 items-center gap-x-2">
            <label class="text-xs">Font Style</label>
            <select name="font_style" class="w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm">
              <option :for={{label, value} <- @font_style_options} value={value} selected={@form.params["font_style"] == value}>
                <%= label %>
              </option>
            </select>
          </div>
        </form>
      </.live_component>
    </div>
    """
  end

  def handle_event("update_typography", params, socket) do
    new_classes = Typography.generate_typography_classes(params)

    classes =
      socket.assigns.element
      |> VisualEditor.delete_classes(~r/^font-(sans|serif|mono)$/)
      |> VisualEditor.delete_classes(~r/^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/)
      |> VisualEditor.delete_classes(~r/^text-(black|white|gray-\d+)$/)
      |> VisualEditor.delete_classes(~r/^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)$/)
      |> VisualEditor.delete_classes(~r/^leading-(none|tight|snug|normal|relaxed|loose|\[.+\])$/)
      |> VisualEditor.delete_classes(~r/^tracking-(tighter|tight|normal|wide|wider|widest|\[.+\])$/)
      |> VisualEditor.delete_classes(~r/^text-(left|center|right|justify)$/)
      |> VisualEditor.delete_classes(~r/^(underline|line-through|no-underline)$/)
      |> VisualEditor.delete_classes(~r/^(uppercase|lowercase|capitalize|normal-case)$/)
      |> VisualEditor.delete_classes(~r/^(italic|not-italic)$/)
      |> VisualEditor.merge_class(Enum.join(new_classes, " "))

    send(self(), {:element_changed, {socket.assigns.element["path"], %{updated: %{"attrs" => %{"class" => classes}}}}})

    {:noreply, socket}
  end

  defp assign_form(socket, values) do
    form = to_form(values)
    assign(socket, form: form)
  end
end
