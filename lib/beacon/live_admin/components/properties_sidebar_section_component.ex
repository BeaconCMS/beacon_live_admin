# FIXME: we could remove this component for now
defmodule Beacon.LiveAdmin.PropertiesSidebarSectionComponent do
  use Beacon.LiveAdmin.Web, :live_component

  def update(assigns, socket) do
    # dbg(assigns)
    {:ok, assign(socket, assigns) |> assign(:form, to_form(assigns.attribute_changeset))}
  end

  def render(assigns) do
    ~H"""
    <section class="p-4 border-b border-b-gray-100 border-solid">
      <.form for={@form} phx-submit="check_and_save">
        <header class="flex items-center text-sm mb-2 font-medium">
          <div class="w-full flex items-center justify-between gap-x-1 p-1 font-semibold group">
            <span class="flex-grow">
              <span class="hover:text-blue-700 active:text-blue-900">
                <%= if @edit_name do %>
                  <.input field={@form[:name]} type="text" class="w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm" />
                <% else %>
                  <%= @attribute_changeset[:name] %>
                <% end %>
              </span>
            </span>
            <.delete_button index={@index} parent={@parent} />
            <.toggle_button />
          </div>
        </header>
        <.input field={@form[:value]} type="text" class="w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm" />
      </.form>
    </section>
    """
  end

  defp delete_button(assigns) do
    ~H"""
    <button type="button" class="ml-4" title="Delete attribute" phx-click="delete_attribute" phx-value-index={@index} phx-target={@parent}>
      <span class="hero-trash text-red hover:text-red"></span>
    </button>
    """
  end

  defp toggle_button(assigns) do
    ~H"""
    <button type="button">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 stroke-slate-500 fill-slate-500 group-hover:stroke-current group-hover:fill-current">
        <path fill-rule="evenodd" d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z" clip-rule="evenodd" />
      </svg>
    </button>
    """
  end
end
