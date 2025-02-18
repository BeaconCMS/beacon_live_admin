defmodule Beacon.LiveAdmin.StationUI.HTML.TabGroup do
  @moduledoc false
  use Phoenix.Component

  alias Phoenix.LiveView.JS

  @base_classes "flex items-center"
  def base_classes, do: @base_classes

  @tab_base_classes ~w"
    relative
    inline-flex
    items-center
    justify-center
    gap-x-1.5
    whitespace-nowrap
    rounded-lg
    bg-transparent
    font-medium
    text-[--sui-brand-primary-text]

    aria-selected:text-[--sui-brand-primary]

    aria-selected:hover:text-[--sui-brand-primary-text]
    aria-selected:hover:after:border-b-[--sui-brand-primary-text]

    after:absolute
    after:inset-x-0
    after:-bottom-0
    after:border-b-2
    after:border-transparent
    after:aria-selected:border-b-[--sui-brand-primary]

    hover:after:border-b-[--sui-brand-primary-text]

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-[--sui-brand-primary-focus]
    focus-visible:ring-offset-4
  "
  def tab_base_classes, do: @tab_base_classes

  @tab_default_classes "text-base"
  def tab_default_classes, do: @tab_default_classes

  @tab_divider_base_classes "w-px bg-[--sui-brand-primary-border]"
  def tab_divider_base_classes, do: @tab_divider_base_classes

  @tab_divider_default_classes "h-5"
  def tab_divider_default_classes, do: @tab_divider_default_classes

  @tab_panel_base_classes "mt-2 [&:not([data-visible])]:hidden"
  def tab_panel_base_classes, do: @tab_panel_base_classes

  attr :class, :any, default: "gap-x-5"
  attr :default_index, :string, default: "0", doc: "the index of the tab that should be active when initially rendered"
  attr :id, :any, required: true
  attr :on_select, :any, default: nil, doc: "the function for handling additional behavior for phx-click on each tab"

  slot :tab, required: true do
    attr :class, :any, doc: @tab_default_classes
    attr :index, :string, doc: "the unique index of the tab for matching with a tab panel (defaults to the zero-based numerical position of the slot)"
  end

  slot :tab_divider do
    attr :class, :any, doc: @tab_divider_default_classes
  end

  slot :tab_panel, required: true do
    attr :class, :any
    attr :index, :string, doc: "the unique index of the tab panel for matching with a tab (defaults to the zero-based numerical position of the slot)"
  end

  def tab_group(assigns) do
    assigns =
      assigns
      |> update(:tab, &set_slot_index/1)
      |> update(:tab_panel, &set_slot_index/1)
      |> update(:default_index, fn current_value, %{tab: tab_list} ->
        if Enum.any?(tab_list, &(&1.index == current_value)) do
          current_value
        else
          List.first(tab_list).index
        end
      end)

    ~H"""
    <div id={@id}>
      <div class={[base_classes(), @class]} role="tablist">
        <%= for {tab, tab_divider} <- padded_zip(@tab, @tab_divider) do %>
          <button
            class={[tab[:class] || tab_default_classes(), tab_base_classes()]}
            id={tab_id(@id, tab.index)}
            type="button"
            role="tab"
            aria-selected={to_string(@default_index == tab.index)}
            aria-controls={tab_panel_id(@id, tab.index)}
            phx-click={show_tab(@id, tab.index) |> JS.exec("data-tab-select")}
            data-tab-select={if is_function(@on_select, 1), do: @on_select.(tab.index), else: %JS{}}
          >
            <%= render_slot(tab) %>
          </button>

          <div :if={tab_divider} class={[tab_divider[:class] || tab_divider_default_classes(), tab_divider_base_classes()]}></div>
        <% end %>
      </div>

      <div
        :for={tab_panel <- @tab_panel}
        class={[tab_panel[:class], tab_panel_base_classes()]}
        id={tab_panel_id(@id, tab_panel.index)}
        role="tabpanel"
        aria-labelledby={tab_id(@id, tab_panel.index)}
        data-visible={@default_index == tab_panel.index}
      >
        <%= render_slot(tab_panel) %>
      </div>
    </div>
    """
  end

  defp padded_zip(list1, list2, padding \\ nil) do
    list2_len = length(list2)

    max_len =
      list1
      |> length()
      |> max(list2_len)

    list2_padding = List.duplicate(padding, max_len - list2_len)

    Enum.zip(list1, list2 ++ list2_padding)
  end

  defp set_slot_index(slot_list) do
    for {slot, index} <- Enum.with_index(slot_list) do
      Map.put_new(slot, :index, to_string(index))
    end
  end

  defp show_tab(js \\ %JS{}, id, tab_index) do
    js
    |> JS.remove_attribute("data-visible", to: "##{id} [role=tabpanel]")
    |> JS.set_attribute({"data-visible", ""}, to: "##{tab_panel_id(id, tab_index)}")
    |> JS.set_attribute({"aria-selected", false}, to: "##{id} [role=tab]")
    |> JS.set_attribute({"aria-selected", true}, to: "##{tab_id(id, tab_index)}")
  end

  defp tab_id(id, tab_index), do: "#{id}-tab-#{tab_index}"
  defp tab_panel_id(id, tab_index), do: "#{id}-tabpanel-#{tab_index}"
end
