defmodule Beacon.LiveAdmin.VisualEditor.Components.InputWithUnits do
  @moduledoc false

  use Phoenix.Component

  attr :name, :string, required: true
  attr :value, :string, default: nil
  attr :value_unit, :string, default: nil
  attr :sizes, :list, default: []
  attr :units, :list, default: []
  attr :disabled, :boolean, default: false
  attr :size, :string, values: ["sm", "base"], default: "base"

  def input_with_units(assigns) do
    assigns =
      assigns
      |> assign(:is_custom_unit?, is_nil(assigns.value_unit) or Enum.member?(assigns.units, assigns.value_unit))

    ~H"""
    <div class="relative w-full flex bg-gray-100 border rounded focus-within:ring-2 focus-within:ring-blue-500">
      <input
        id={@name <> "-value-input"}
        type="text"
        name={@name}
        value={@value}
        disabled={@disabled || !@is_custom_unit?}
        phx-hook="PreventEmptyChange"
        class={[
          "w-full px-1 text-sm text-left outline-none focus:outline-none bg-transparent border-none text-xs focus:ring-0",
          !@is_custom_unit? && "text-gray-500",
          @size == "sm" && "py-0.5 leading-5",
          @size == "base" && "py-1 leading-6"
        ]}
      />

      <select
        name={@name <> "_unit"}
        class={[
          "appearance-none bg-none text-right bg-transparent border-none px-0.5 focus:ring-0",
          @size == "sm" && "text-xs py-0.5 leading-5",
          @size == "base" && "text-sm py-1 leading-6"
        ]}
      >
        <option value="" selected={is_nil(@value_unit)}>-</option>
        <%= if length(@sizes) > 0 do %>
          <optgroup label="Sizes">
            <option :for={size <- @sizes} value={get_value(size)} selected={@value_unit == get_value(size)}>
              <%= get_label(size) %>
            </option>
          </optgroup>
        <% end %>
        <%= if length(@units) > 0 do %>
          <optgroup label="Units">
            <option :for={unit <- @units} value={unit} selected={@value_unit == unit}>
              <%= unit %>
            </option>
          </optgroup>
        <% end %>
      </select>
    </div>
    """
  end

  defp get_value({_, value}), do: value
  defp get_value(value), do: value
  defp get_label({label, _}), do: label
  defp get_label(label), do: label
end
