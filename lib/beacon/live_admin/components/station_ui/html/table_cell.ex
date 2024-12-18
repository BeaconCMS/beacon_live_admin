defmodule Beacon.LiveAdmin.StationUI.HTML.TableCell do
  use Phoenix.Component

  attr :class, :string, default: ""

  slot :container, required: true do
    attr :class, :string
  end

  slot :metadata do
    attr :class, :string
  end

  slot :support do
    attr :class, :string
  end

  def table_cell(assigns) do
    ~H"""
    <div
      class={[
        "inline-flex items-center self-start justify-center px-3 py-0.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-purple-500 min-w-96",
        @class
      ]}
      role="cell"
      tabindex="0"
    >
      <div class={["flex flex-col flex-1 text-slate-800"]}>
        <div class={["flex items-center justify-between"]}>
          <div :for={container <- @container} class={["flex items-center gap-x-1", container[:class]]}>
            <%= render_slot(container) %>
          </div>
          <div :for={metadata <- @metadata} class={metadata[:class]}>
            <%= render_slot(metadata) %>
          </div>
        </div>
        <div :for={support <- @support} class={["text-gray-500", support[:class]]}>
          <%= render_slot(support) %>
        </div>
      </div>
    </div>
    """
  end
end
