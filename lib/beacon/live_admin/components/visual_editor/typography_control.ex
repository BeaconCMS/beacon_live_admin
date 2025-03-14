defmodule Beacon.LiveAdmin.VisualEditor.TypographyControl do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_component
  import Beacon.LiveAdmin.VisualEditor.Components.InputWithUnits
  import Beacon.LiveAdmin.VisualEditor.Components.ToggleGroup
  alias Beacon.LiveAdmin.VisualEditor
  alias Beacon.LiveAdmin.VisualEditor.Components.ControlSection
  alias Beacon.LiveAdmin.VisualEditor.Css.Typography
  require Logger
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
    {"Default", "default"},
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
    Logger.info("############## values: #{inspect(values)}")
    {:ok,
     socket
     |> assign(assigns)
     |> assign_form(values)}
  end

  def render(assigns) do
    assigns =
      assigns
      |> assign(:align_options, Enum.map(@text_align_options, fn {label, value} ->
        %{
          value: value,
          label: label,
          icon: case value do
            "start" -> :align_start
            "center" -> :align_center
            "end" -> :align_end
            "justify" -> :align_justify
            "default" -> {:align_start, class: "opacity-30"}
          end
        }
      end))

    ~H"""
    <div id={@id}>
      <.live_component module={ControlSection} id={@id <> "-section"} label="Typography">
        <form phx-change="update_typography" phx-target={@myself} class="space-y-4">
          <div class="grid grid-cols-2 items-center gap-x-2">
            <label class="text-xs">Font Family</label>
            <select name="font_family" class="w-full py-0.5 px-2 bg-gray-100 border-gray-100 rounded-md leading-5 text-sm">
              <option :for={{label, value} <- @font_family_options} value={value} selected={@form.params["font_family"] == value}>
                <%= label %>
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 items-center gap-x-2">
            <label class="text-xs">Font Weight</label>
            <select name="font_weight" class="w-full py-0.5 px-2 bg-gray-100 border-gray-100 rounded-md leading-5 text-sm">
              <option :for={{label, value} <- @font_weight_options} value={value} selected={@form.params["font_weight"] == value}>
                <%= label %>
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 items-center gap-x-2">
            <label class="text-xs">Text Color</label>
            <select name="text_color" class="w-full py-0.5 px-2 bg-gray-100 border-gray-100 rounded-md leading-5 text-sm">
              <option :for={{label, value} <- @text_color_options} value={value} selected={@form.params["text_color"] == value}>
                <%= label %>
              </option>
            </select>
          </div>

          <div class="flex gap-1">
            <div class="flex-1 min-w-0">
              <label class="text-xs block mb-1">Size</label>
              <.input_with_units
                name="font_size"
                value={@form.params["font_size"]}
                value_unit={@form.params["font_size_unit"]}
                sizes={@font_sizes}
                units={@css_units}
                size="sm"
              />
            </div>

            <div class="flex-1 min-w-0">
              <label class="text-xs block mb-1">Height</label>
              <.input_with_units
                name="line_height"
                value={@form.params["line_height"]}
                value_unit={@form.params["line_height_unit"]}
                sizes={@line_height_sizes}
                units={@css_units}
                size="sm"
              />
            </div>
          </div>

          <div class="flex items-start gap-x-2">
            <div class="flex-1">
              <label class="text-xs block mb-1">Align</label>
              <.toggle_group name="text_align" options={@align_options} selected={@form.params["text_align"]}>
                <:label :let={align}>
                  <%= if is_tuple(align.icon) do %>
                    <.dynamic_icon name={elem(align.icon, 0)} class={["mx-auto", elem(align.icon, 1)[:class]]} />
                  <% else %>
                    <.dynamic_icon name={align.icon} class="mx-auto" />
                  <% end %>
                </:label>
              </.toggle_group>
            </div>
            <div>
              <label class="text-xs block mb-1">Spacing</label>
              <.input_with_units
                name="letter_spacing"
                value={@form.params["letter_spacing"]}
                value_unit={@form.params["letter_spacing_unit"]}
                sizes={@letter_spacing_sizes}
                units={@css_units}
                size="sm"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 items-center gap-x-2">
            <label class="text-xs">Decoration</label>
            <select name="text_decoration" class="w-full py-0.5 px-2 bg-gray-100 border-gray-100 rounded-md leading-5 text-sm">
              <option :for={{label, value} <- @text_decoration_options} value={value} selected={@form.params["text_decoration"] == value}>
                <%= label %>
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 items-center gap-x-2">
            <label class="text-xs">Transform</label>
            <select name="text_transform" class="w-full py-0.5 px-2 bg-gray-100 border-gray-100 rounded-md leading-5 text-sm">
              <option :for={{label, value} <- @text_transform_options} value={value} selected={@form.params["text_transform"] == value}>
                <%= label %>
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 items-center gap-x-2">
            <label class="text-xs">Style</label>
            <select name="font_style" class="w-full py-0.5 px-2 bg-gray-100 border-gray-100 rounded-md leading-5 text-sm">
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
    Logger.info("############## new_classes: #{inspect(new_classes)}")
    classes =
      socket.assigns.element
      |> VisualEditor.delete_classes(~r/^font-(sans|serif|mono)$/)
      |> VisualEditor.delete_classes(~r/^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/)
      |> VisualEditor.delete_classes(~r/^text-(black|white|gray-\d+)$/)
      |> VisualEditor.delete_classes(~r/^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|\[.+?\])$/)
      |> VisualEditor.delete_classes(~r/^leading-(none|tight|snug|normal|relaxed|loose|\[.+\])$/)
      |> VisualEditor.delete_classes(~r/^tracking-(tighter|tight|normal|wide|wider|widest|\[.+\])$/)
      |> VisualEditor.delete_classes(~r/^text-(start|center|end|justify)$/)
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

  defp dynamic_icon(assigns) do
    ~H"""
    <%= apply(__MODULE__, :"#{@name}_icon", [assigns]) %>
    """
  end

  def align_end_icon(assigns) do
    ~H"""
      <svg
        class="w-4 h-4 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="21" y1="6" x2="3" y2="6" />
        <line x1="21" y1="10" x2="6" y2="10" />
        <line x1="21" y1="14" x2="3" y2="14" />
        <line x1="21" y1="18" x2="6" y2="18" />
      </svg>
    """
  end

  def align_start_icon(assigns) do
    ~H"""
      <svg
        class="w-4 h-4 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="21" y1="6" x2="3" y2="6" />
        <line x1="17" y1="10" x2="3" y2="10" />
        <line x1="21" y1="14" x2="3" y2="14" />
        <line x1="17" y1="18" x2="3" y2="18" />
      </svg>
    """
  end

  def align_center_icon(assigns) do
    ~H"""
      <svg
        class="w-4 h-4 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="21" y1="6" x2="3" y2="6" />
        <line x1="18" y1="10" x2="6" y2="10" />
        <line x1="21" y1="14" x2="3" y2="14" />
        <line x1="18" y1="18" x2="6" y2="18" />
      </svg>
    """
  end

  def align_justify_icon(assigns) do
    ~H"""
      <svg
        class="w-4 h-4 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="21" y1="6" x2="3" y2="6" />
        <line x1="21" y1="10" x2="3" y2="10" />
        <line x1="21" y1="14" x2="3" y2="14" />
        <line x1="21" y1="18" x2="3" y2="18" />
      </svg>
    """
  end
end
