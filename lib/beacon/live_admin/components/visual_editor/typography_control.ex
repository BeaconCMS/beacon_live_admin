defmodule Beacon.LiveAdmin.VisualEditor.TypographyControl do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_component
  import Beacon.LiveAdmin.VisualEditor.Components.InputWithUnits
  import Beacon.LiveAdmin.VisualEditor.Components.ToggleGroup
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

  @font_sizes [
    {"-", "default"},
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

  @line_height_sizes [
    {"Default", "default"},
    {"None", "none"},
    {"Tight", "tight"},
    {"Snug", "snug"},
    {"Normal", "normal"},
    {"Relaxed", "relaxed"},
    {"Loose", "loose"}
  ]

  @css_units ~w(px rem em %)

  @letter_spacing_sizes [
    {"Default", "default"},
    {"Tighter", "tighter"},
    {"Tight", "tight"},
    {"Normal", "normal"},
    {"Wide", "wide"},
    {"Wider", "wider"},
    {"Widest", "widest"}
  ]

  @text_align_options [
    {"Start", "start"},
    {"Center", "center"},
    {"End", "end"},
    {"Justify", "justify"}
  ]

  @text_decoration_options [
    {"None", "no-underline"},
    {"Underline", "underline"},
    {"Strike", "line-through"}
  ]

  @text_transform_options [
    {"Upper", "uppercase"},
    {"Cap", "capitalize"},
    {"Lower", "lowercase"}
  ]

  @font_style_options [
    {"Normal", "not-italic"},
    {"Italic", "italic"}
  ]

  def mount(socket) do
    {:ok,
     assign(socket,
       font_family_options: @font_family_options,
       font_weight_options: @font_weight_options,
       font_sizes: @font_sizes,
       line_height_sizes: @line_height_sizes,
       css_units: @css_units,
       letter_spacing_sizes: @letter_spacing_sizes,
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
            <label class="text-xs">Family</label>
            <select name="font_family" class="w-full py-0.5 px-2 bg-gray-100 border-gray-100 rounded-md leading-5 text-sm">
              <option :for={{label, value} <- @font_family_options} value={value} selected={@form.params["font_family"] == value}>
                <%= label %>
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 items-center gap-x-2">
            <label class="text-xs">Weight</label>
            <select name="font_weight" class="w-full py-0.5 px-2 bg-gray-100 border-gray-100 rounded-md leading-5 text-sm">
              <option :for={{label, value} <- @font_weight_options} value={value} selected={@form.params["font_weight"] == value}>
                <%= label %>
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 items-center gap-x-2">
            <label class="text-xs">Color</label>
            <div class="flex">
              <.live_component module={Beacon.LiveAdmin.VisualEditor.Components.ColorPicker} id="text-color-picker" name="text_color" value={@form.params["text_color"]} />
            </div>
          </div>

          <div class="flex gap-1">
            <div class="flex-1 min-w-0">
              <label class="text-xs block mb-1">Size</label>
              <.input_with_units name="font_size" value={@form.params["font_size"]} value_unit={@form.params["font_size_unit"]} sizes={@font_sizes} units={@css_units} size="sm" />
            </div>

            <div class="flex-1 min-w-0">
              <label class="text-xs block mb-1">Height</label>
              <.input_with_units name="line_height" value={@form.params["line_height"]} value_unit={@form.params["line_height_unit"]} sizes={@line_height_sizes} units={@css_units} size="sm" />
            </div>
          </div>

          <div class="flex items-start gap-x-2">
            <div class="flex-1">
              <label class="text-xs block mb-1">Align</label>
              <.toggle_group name="text_align" options={align_options(@text_align_options)} selected={@form.params["text_align"]}>
                <:label :let={align}>
                  <.dynamic_icon name={align.icon} class="mx-auto" />
                </:label>
              </.toggle_group>
            </div>
            <div>
              <label class="text-xs block mb-1">Spacing</label>
              <.input_with_units name="letter_spacing" value={@form.params["letter_spacing"]} value_unit={@form.params["letter_spacing_unit"]} sizes={@letter_spacing_sizes} units={@css_units} size="sm" />
            </div>
          </div>

          <div class="flex gap-x-2">
            <.toggle_group name="text_decoration" options={decoration_options(@text_decoration_options)} selected={@form.params["text_decoration"]}>
              <:label :let={decoration}>
                <.icon name={decoration.icon} class="w-3 h-3" />
              </:label>
            </.toggle_group>

            <.toggle_group name="text_transform" options={transform_options(@text_transform_options)} selected={@form.params["text_transform"]}>
              <:label :let={transform}>
                <.dynamic_icon name={transform.icon} class="w-3 h-3" />
              </:label>
            </.toggle_group>

            <.toggle_group name="font_style" options={font_style_options(@font_style_options)} selected={@form.params["font_style"]}>
              <:label :let={style}>
                <.icon name={style.icon} class="w-3 h-3" />
              </:label>
            </.toggle_group>
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
      |> VisualEditor.delete_classes(~r/^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|\[\d+(?:\.\d+)?(?:px|rem|em|%)\])$/)
      |> VisualEditor.delete_classes(
        ~r/^text-(\[[#][0-9A-Fa-f]{6}\]|(?:red|blue|green|yellow|purple|gray|black|white|current|transparent)(?:-\d+)?)$/
      )
      |> VisualEditor.delete_classes(~r/^leading-(none|tight|snug|normal|relaxed|loose|\[.+\])$/)
      |> VisualEditor.delete_classes(~r/^tracking-(tighter|tight|normal|wide|wider|widest|\[.+\])$/)
      |> VisualEditor.delete_classes(~r/^text-(start|center|end|justify)$/)
      |> VisualEditor.delete_classes(~r/^(underline|line-through|no-underline)$/)
      |> VisualEditor.delete_classes(~r/^(uppercase|lowercase|capitalize|normal-case)$/)
      |> VisualEditor.delete_classes(~r/^(italic|not-italic)$/)
      |> VisualEditor.merge_class(Enum.join(new_classes, " "))

    socket.assigns.on_element_change.(socket.assigns.element["path"], %{updated: %{"attrs" => %{"class" => classes}}})

    {:noreply, socket}
  end

  defp assign_form(socket, values) do
    form = to_form(values)
    assign(socket, form: form)
  end

  defp dynamic_icon(assigns) do
    ~H"""
    <%= apply(__MODULE__, :"#{@name}_icon", [assigns]) %>
    """
  end

  def align_end_icon(assigns) do
    ~H"""
    <svg class="w-4 h-4 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="21" y1="10" x2="6" y2="10" />
      <line x1="21" y1="14" x2="3" y2="14" />
      <line x1="21" y1="18" x2="6" y2="18" />
    </svg>
    """
  end

  def align_start_icon(assigns) do
    ~H"""
    <svg class="w-4 h-4 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="17" y1="10" x2="3" y2="10" />
      <line x1="21" y1="14" x2="3" y2="14" />
      <line x1="17" y1="18" x2="3" y2="18" />
    </svg>
    """
  end

  def align_center_icon(assigns) do
    ~H"""
    <svg class="w-4 h-4 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="18" y1="10" x2="6" y2="10" />
      <line x1="21" y1="14" x2="3" y2="14" />
      <line x1="18" y1="18" x2="6" y2="18" />
    </svg>
    """
  end

  def align_justify_icon(assigns) do
    ~H"""
    <svg class="w-4 h-4 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="21" y1="10" x2="3" y2="10" />
      <line x1="21" y1="14" x2="3" y2="14" />
      <line x1="21" y1="18" x2="3" y2="18" />
    </svg>
    """
  end

  defp transform_options(options) do
    Enum.map(options, fn {label, value} ->
      %{
        value: value,
        label: label,
        icon:
          case value do
            "uppercase" -> :transform_uppercase
            "lowercase" -> :transform_lowercase
            "capitalize" -> :transform_capitalize
          end
      }
    end)
  end

  def transform_uppercase_icon(assigns) do
    ~H"""
    <svg class="w-4 h-5 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M1.5 10.811 4.31 5.19l2.812 5.622M2.202 9.406h4.217M9.933 8h3.162a1.406 1.406 0 1 1 0 2.811H9.933V5.19h2.81a1.406 1.406 0 1 1 0 2.811"
      >
      </path>
    </svg>
    """
  end

  def transform_lowercase_icon(assigns) do
    ~H"""
    <svg class="w-4 h-5 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3.937 11.25a2.437 2.437 0 1 0 0-4.875 2.437 2.437 0 0 0 0 4.875ZM6.375 6.375v4.875M12.063 11.25a2.437 2.437 0 1 0 0-4.875 2.437 2.437 0 0 0 0 4.875ZM9.625 4.75v6.5"
      >
      </path>
    </svg>
    """
  end

  def transform_capitalize_icon(assigns) do
    ~H"""
    <svg class="w-4 h-5 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M1.5 10.889 4.389 5.11l2.889 5.778M2.222 9.444h4.334M12.333 10.889a2.167 2.167 0 1 0 0-4.334 2.167 2.167 0 0 0 0 4.334ZM14.5 6.556v4.333"
      >
      </path>
    </svg>
    """
  end

  defp font_style_options(options) do
    Enum.map(options, fn {label, value} ->
      %{
        value: value,
        label: label,
        icon:
          case value do
            "italic" -> "hero-italic"
            "not-italic" -> "hero-x-mark"
          end
      }
    end)
  end

  defp decoration_options(options) do
    Enum.map(options, fn {label, value} ->
      %{
        value: value,
        label: label,
        icon:
          case value do
            "underline" -> "hero-underline"
            "line-through" -> "hero-strikethrough"
            "no-underline" -> "hero-x-mark"
          end
      }
    end)
  end

  defp align_options(options) do
    Enum.map(options, fn {label, value} ->
      %{
        value: value,
        label: label,
        icon:
          case value do
            "start" -> :align_start
            "center" -> :align_center
            "end" -> :align_end
            "justify" -> :align_justify
          end
      }
    end)
  end
end
