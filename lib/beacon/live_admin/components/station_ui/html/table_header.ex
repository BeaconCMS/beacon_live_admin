defmodule Beacon.LiveAdmin.StationUI.HTML.TableHeader do
  @moduledoc false
  use Phoenix.Component

  attr :class, :string, default: ""

  slot :label, required: true do
    attr :class, :string
  end

  slot :button do
    attr :class, :string
  end

  def table_header(assigns) do
    ~H"""
    <div
      class={[
        "inline-flex items-center self-start justify-center px-3 py-0.5",
        @class
      ]}
      role="columnheader"
    >
      <span
        :for={label <- @label}
        class={[
          "font-medium",
          label[:class]
        ]}
      >
        <%= render_slot(label) %>
      </span>
      <button
        :for={button <- @button}
        class={[
          "p-3 rounded-lg outline-none appearance-none focus-visible:ring-2 focus-visible:ring-purple-500",
          button[:class]
        ]}
      >
        <%= render_slot(button) %>
      </button>
    </div>
    """
  end
end
