defmodule Beacon.LiveAdmin.VisualEditor.Components.ToggleGroup do
  @moduledoc false
  # A reusable toggle group component that allows for customizable label content.
  #
  # Example usage:
  # ```heex
  # <.toggle_group name="style" options={@style_options} selected={@selected_style}>
  #   <:label :let={style}>
  #     <%= style.label %>
  #   </:label>
  # </.toggle_group>
  #
  # <.toggle_group name="alignment" options={@align_options} selected={@selected_align}>
  #   <:label :let={align}>
  #     <.icon name={align.icon} class="mx-auto" />
  #   </:label>
  # </.toggle_group>
  # ```

  use Phoenix.Component

  attr :name, :string, required: true
  attr :options, :list, required: true
  attr :selected, :string, required: true
  attr :class, :string, default: nil
  slot :label, required: true, doc: "Content for each toggle button"

  def toggle_group(assigns) do
    ~H"""
    <div class={["flex h-fit", @class]} id={"toggle-group-#{@name}"} phx-hook="ToggleGroup">
      <input type="radio" name={@name} value="default" class="hidden" checked={@selected == "default"} />
      <div class="flex flex-1">
        <label
          :for={option <- @options}
          class={[
            "text-center px-1.5 py-1 text-sm cursor-pointer flex-1",
            "first:rounded-l last:rounded-r",
            "border-y border-r border-gray-300 first:border-l",
            @selected == option.value && "bg-blue-500 text-white relative z-10",
            @selected != option.value && "bg-gray-100 hover:bg-gray-200"
          ]}
        >
          <input type="radio" name={@name} value={option.value} class="hidden" checked={@selected == option.value} />
          <%= render_slot(@label, option) %>
        </label>
      </div>
    </div>
    """
  end
end
