defmodule Beacon.LiveAdmin.PropertiesSidebarSectionComponent do
  # In Phoenix apps, the line is typically: use MyAppWeb, :live_component
  use Phoenix.LiveComponent
  use Beacon.LiveAdmin.Web, :live_component

  def render(assigns) do
    ~H"""
    <section class="p-4 border-b border-b-gray-100 border-solid">
      <header class="flex items-center text-sm mb-2 font-medium">
        <button
          type="button"
          class="w-full flex items-center justify-between gap-x-1 p-1 font-semibold group"
        >
          <span>
            <span class="hover:text-blue-700 active:text-blue-900">
              <%= if @edit_name do %>
                <input
                  type="text"
                  class="w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm"
                  value={@name}
                  name="name"
                  phx-input="update_attribute_name"
                  phx-value-index={@index}
                  phx-target={@parent}
                />
              <% else %>
                <%= @name %>
              <% end %>
            </span>
            <button type="button" class="ml-4" title="Delete attribute" phx-click="delete_attribute" phx-value-index={@index} phx-target={@parent}>
              <span class="hero-trash text-red hover:text-red"></span>
            </button>
          </span>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-5 h-5 stroke-slate-500 fill-slate-500 group-hover:stroke-current group-hover:fill-current"
            >
              <path
                fill-rule="evenodd"
                d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
        </button>
      </header>
      <input
        type="text"
        class="w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm"
        value={@value}
        name="value"
        phx-input="update_attribute_value"
        phx-value-index={@index}
        phx-target={@parent}
      />
    </section>
    """
  end
end
