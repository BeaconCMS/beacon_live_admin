defmodule Beacon.LiveAdmin.PropertiesSidebarSectionComponent do
require Logger
  use Beacon.LiveAdmin.Web, :live_component

  def update(assigns, socket) do
    {:ok,
      socket
      |> assign(assigns)
      |> assign_new(:form, fn -> to_form(assigns.attribute_changeset) end) }
  end

  def handle_event("check_name", %{ "value" => name}, socket) do
    Logger.debug("################################################## check_and_save in child")
    Logger.debug("################################################## check_and_save in child")
    Logger.debug("################################################## check_and_save in child #{inspect(socket.assigns.form)}")
    case String.length(name) do
      0 -> {:noreply, assign(socket, :edit_name, true)}
      _ -> {:noreply, assign(socket, :edit_name, false)}
    end
  end

  def handle_event("check_value", unsigned_params, socket) do
    Logger.debug("################################################## check_and_save in child")
    Logger.debug("################################################## check_and_save in child")
    Logger.debug("################################################## check_and_save in child #{inspect(unsigned_params)}")
    {:noreply, socket}
  end

  def render(assigns) do
    ~H"""
    <section class="p-4 border-b border-b-gray-100 border-solid">
      <.form for={@form}>
        <header class="flex items-center text-sm mb-2 font-medium">
          <div class="w-full flex items-center justify-between gap-x-1 p-1 font-semibold group">
            <span class="flex-grow">
              <span class="hover:text-blue-700 active:text-blue-900">
                <%= if @edit_name do %>
                  <.input
                    id={"name-input-#{@index}"}
                    field={@form[:name]}
                    type="text"
                    phx-blur="check_name"
                    phx-target={@myself}
                    class="w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm" />
                <% else %>
                  <%= Phoenix.HTML.Form.input_value(@form, :name) %>
                <% end %>
              </span>
            </span>
            <.delete_button index={@index} parent={@parent} />
            <.toggle_button />
          </div>
        </header>
        <.input
          id={"name-value-#{@index}"}
          field={@form[:value]}
          type="text"
          phx-blur="check_and_save"
          phx-target={@myself}
          class="w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm" />
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
