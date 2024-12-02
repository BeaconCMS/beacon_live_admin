defmodule Beacon.LiveAdmin.VisualEditor.KeyValueControl do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_component
  require Logger
  # FIXME: create functions components to reuse shared styles (currently defined in PropertiesSidebarSectionComponent)
  def render(assigns) do
    ~H"""
    <section id={@id} class="p-4 border-b border-b-gray-100 border-solid">
      <form phx-change="update" phx-target={@myself}>
        <input
          class={"#{if !@edit_name, do: "hidden"} w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm"}
          placeholder="Name"
          name="name"
          value={@name}
          phx-blur="name_blur"
          phx-target={@myself}
        />
        <%= if !@edit_name do %>
          <label class="mb-2 block font-medium capitalize text-sm/5 text-[#304254]">
            <%= @name %>
          </label>
        <% end %>
        <div class="pt-3">
          <input class="w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm" placeholder="Value" name="value" value={@value} phx-blur="value_blur" phx-target={@myself} />
        </div>
      </form>
    </section>
    """
  end

  def update(assigns, socket) do
    name = Map.get(assigns, :name, "")
    value = Map.get(assigns, :value, "")

    {:ok,
     assign(socket, assigns)
     |> assign(edit_name: name == "", name: name, value: value)}
  end

  def handle_event("name_blur", _, socket) do
    %{name: name} = socket.assigns
    {:noreply, socket |> assign(:edit_name, name == "")}
  end

  def handle_event("value_blur", _, socket) do
    %{name: name, value: value} = socket.assigns

    if value != "" do
      send(self(), {:updated_element, {socket.assigns.element["path"], %{"attrs" => %{name => value}}}})
      send_update(Beacon.LiveAdmin.PropertiesSidebarComponent, id: "properties_sidebar", add_new_attribute: false)
    end

    {:noreply, socket}
  end

  def handle_event("update", %{"name" => name, "value" => value}, socket) do
    {:noreply, assign(socket, name: name, value: value)}
  end
end
