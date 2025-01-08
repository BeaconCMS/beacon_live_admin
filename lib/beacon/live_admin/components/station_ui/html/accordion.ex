defmodule Beacon.LiveAdmin.StationUI.HTML.Accordion do
  use Phoenix.Component

  import Beacon.LiveAdmin.StationUI.HTML.Icon, only: [icon: 1]
  alias Phoenix.LiveView.JS

  @header_default_classes "text-base sm:text-lg md:text-xl"
  defp header_default_classes, do: @header_default_classes

  @content_default_classes "text-base md:text-lg"
  defp content_default_classes, do: @content_default_classes

  @doc """
  The accordion component renders a list of items with child content that can be expanded or collapsed.

  ## Example

  <.accordion>
    <:header>
      Title something 1
    </:header>
    <:content>
      Content something 1
    </:content>
  </.accordion>

  Suggested size classes for `header` (default: md):

  sm: "p-1 text-base sm:text-lg gap-x-0.5"
  md: "p-1 text-base sm:text-lg md:text-xl md:py-1 md:pr-1 md:pl-1.5 md:gap-x-1"
  lg: "p-1 text-base sm:text-lg md:text-xl lg:text-2xl md:py-1 md:pr-1 md:pl-1.5 lg:pl-2 md:gap-x-1 lg:gap-x-1.5"
  xl: "p-1 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl md:pt-1 md:pb-0 md:pr-1 md:pl-1.5 lg:pl-4 sm:gap-x-3 md:gap-x-4 lg:gap-x-5"

  Suggested size classes for `content` (default: md):

  sm: "text-base"
  md: "grid transition-grid-rows text-base md:text-lg"
  lg: "md:text-lg lg:text-xl"
  xl: "md:text-lg lg:text-xl xl:text-2xl"
  """

  attr :id, :string
  attr :rest, :global

  slot :header, required: true do
    attr :button_id, :string
    attr :class, :string, doc: @header_default_classes
  end

  slot :content, required: true do
    attr :class, :string, doc: @content_default_classes
  end

  def accordion(assigns) do
    assigns =
      assigns
      |> assign_new(:id, fn -> :rand.uniform(9999) end)
      |> assign(:items, assigns.header |> Enum.zip(assigns.content) |> Enum.with_index())

    ~H"""
    <div class="grid gap-2" id={"accordion-#{@id}"}>
      <div :for={{{header, content}, index} <- @items} class="relative grid gap-1">
        <% # Accordion Trigger %>
        <button
          id={header[:button_id]}
          class={[
            "group flex w-full min-w-min cursor-pointer items-center whitespace-nowrap bg-transparent font-semibold outline-none transition hover:bg-slate-50 focus-visible:ring-4 focus-visible:ring-purple-600 focus-visible:rounded-lg active:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-300",
            "pl-3 pr-2 py-1 gap-x-2 md:pl-4 md:pr-3 md:gap-x-4",
            header[:class] || header_default_classes()
          ]}
          type="button"
          id={"accordion-trigger-#{@id}-#{index}"}
          aria-controls={"accordion-#{@id}-#{index}"}
          aria-expanded="false"
          phx-click={
            JS.toggle_attribute({"aria-expanded", "true", "false"})
            |> then(fn js ->
              Enum.reduce(Enum.to_list(0..(length(@items) - 1)) -- [index], js, fn item_index, js ->
                js
                |> JS.set_attribute({"aria-expanded", "false"},
                  to: "#accordion-trigger-#{@id}-#{item_index}"
                )
                |> JS.hide(to: "#accordion-#{@id}-#{item_index}", transition: "fade-out-scale")
                |> JS.remove_class("rotate-180", to: "#accordion-chevron-#{@id}-#{item_index}")
              end)
            end)
            |> JS.focus(to: "#accordion-#{@id}-#{index}")
            |> JS.toggle(
              to: "#accordion-#{@id}-#{index}",
              in: "fade-in-scale",
              out: "fade-out-scale",
              display: "grid"
            )
            |> JS.toggle_class("rotate-180", to: "#accordion-chevron-#{@id}-#{index}")
          }
        >
          <span class="flex h-10 w-10 items-center justify-center text-violet-600 group-disabled:text-slate-300 md:h-12 md:w-12">
            <.icon name="hero-folder-solid" aria-hidden="true" class="h-8 w-8 md:h-10 md:w-10" />
          </span>

          <span><%= render_slot(header) %></span>

          <span
            aria-hidden="true"
            class="flex justify-center items-center ml-auto [&_path]:transition-transform h-6 w-6 sm:h-[34px] sm:w-[34px] md:h-10 md:w-10"
          >
            <svg
              id={"accordion-chevron-#{@id}-#{index}"}
              xmlns="http://www.w3.org/2000/svg"
              width="38"
              height="38"
              viewBox="0 0 38 38"
              fill="none"
              class="h-4 w-4 rotate-0 fill-slate-800 transition-transform duration-300 sm:h-5 sm:w-5 md:h-6 md:w-6"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M27.9435 24.1436C27.2015 24.8855 25.9985 24.8855 25.2565 24.1436L19 17.8871L12.7435 24.1436C12.0015 24.8855 10.7985 24.8855 10.0565 24.1436C9.3145 23.4016 9.3145 22.1985 10.0565 21.4565L17.6565 13.8565C18.3985 13.1145 19.6015 13.1145 20.3435 13.8565L27.9435 21.4565C28.6855 22.1985 28.6855 23.4016 27.9435 24.1436Z"
              />
            </svg>
          </span>
        </button>

        <% #  Accordion Content %>
        <div
          id={"accordion-#{@id}-#{index}"}
          class={[
            "grid px-3 pt-1 hidden transition-grid-rows md:px-4",
            content[:class] || content_default_classes()
          ]}
          role="region"
        >
          <div class="overflow-hidden">
            <%= render_slot(content) %>
          </div>
        </div>
      </div>
    </div>
    """
  end
end
