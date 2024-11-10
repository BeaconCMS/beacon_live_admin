defmodule Beacon.LiveAdmin.PropertiesSidebarComponent do
  # In Phoenix apps, the line is typically: use MyAppWeb, :live_component
  use Phoenix.LiveComponent
  use Beacon.LiveAdmin.Web, :live_component
  alias Beacon.LiveAdmin.PropertiesSidebarSectionComponent
  require Logger

  defmodule Attribute do
    use Ecto.Schema
    import Ecto.Changeset

    # Define an embedded schema (no database backing)
    embedded_schema do
      field :name, :string
      field :value, :string
    end

    # Function to create and validate changeset
    def changeset(attrs) do
      %__MODULE__{}
      |> cast(attrs, [:name, :value])
      |> validate_required([:name, :value])
    end
  end


  def mount(socket) do
    socket = assign(socket, :new_attributes, [])
    {:ok, socket}
  end

  def update(assigns, socket) do
    selected_ast_element = case assigns.selected_ast_element_id do
      "root" -> %{ "tag" => "root", "attrs" => %{}, "content" => assigns.page.ast }
      xpath -> find_ast_element(assigns.page.ast, xpath)
    end

    socket =
      assign(socket,
        selected_ast_element: selected_ast_element,
        attributes_editable: selected_ast_element["tag"] not in ["eex", "eex_block"]
      )

    {:ok, assign(socket, assigns)}
  end

  def find_ast_element(_nodes, nil), do: nil
  def find_ast_element(nodes, xpath) do
    parts = String.split(xpath, ".") |> Enum.map(&String.to_integer/1)
    find_ast_element_recursive(nodes, parts)
  end

  defp find_ast_element_recursive(nodes, [index | []]), do: Enum.at(nodes, index)
  defp find_ast_element_recursive(nodes, [index | rest]) do
    case Enum.at(nodes, index) do
      nil -> nil
      node -> find_ast_element_recursive(node["content"], rest)
    end
  end

  @spec handle_event(<<_::104, _::_*24>>, any(), %{
          :assigns => atom() | %{:new_attributes => list(), optional(any()) => any()},
          optional(any()) => any()
        }) :: {:noreply, map()}
  def handle_event("add_attribute", _params, socket) do
    new_attribute = Attribute.changeset(%{"name" => "", "value" => ""})
    new_attributes = socket.assigns.new_attributes ++ [new_attribute]
    Logger.debug("############################## Adding new attribute")
    Logger.debug("############################## New attributes: #{inspect(new_attributes)}")
    {:noreply, assign(socket, :new_attributes, new_attributes)}
  end

  def handle_event("delete_attribute", %{"index" => index}, socket) do
    new_attributes = List.delete_at(socket.assigns.new_attributes, String.to_integer(index))
    {:noreply, assign(socket, :new_attributes, new_attributes)}
  end

  @spec render(
          atom()
          | %{:page => atom() | %{:ast => any(), optional(any()) => any()}, :selected_ast_element_id => nil | binary(), optional(any()) => any()}
        ) :: Phoenix.LiveView.Rendered.t()
  def render(assigns) do
    ~H"""
      <div class="mt-4 w-64 bg-white" data-testid="right-sidebar">
        <div class="sticky top-0 overflow-y-auto h-screen">
          <%= if @selected_ast_element do %>
            <div class="border-b text-lg font-medium leading-5 p-4 relative">
              <%= @selected_ast_element["tag"] %>
              <.go_to_parent_button selected_ast_element_id={assigns.selected_ast_element_id} socket={@socket}/>
              <.close_button />
            </div>

            <%= if @attributes_editable do %>
              <%!-- Editable attributes --%>
              <%!-- <%= for {{name, value}, index} <- Enum.with_index(@selected_ast_element["attrs"]) do %>
                <.live_component module={PropertiesSidebarSectionComponent} id="class-section"  attribute_changeset={changeset} parent={@myself} edit_name={false} index={index} />
              <% end %> --%>

              <%!-- New attributes --%>
              <%= for {changeset, index} <- Enum.with_index(@new_attributes) do %>
                <.live_component module={PropertiesSidebarSectionComponent} id={"new-attribute-section-#{index}"} parent={@myself} attribute_changeset={changeset} edit_name={true} index={index} />
              <% end %>
            <% end %>
            <div class="p-4">
              <.add_attribute_button parent={@myself}/>
            </div>
          <% end %>
        </div>
      </div>
    """
  end

  def close_button(assigns) do
    ~H"""
      <button type="button" class="absolute p-2 top-2 right-1" phx-click="reset_selection">
        <span class="sr-only">Close</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-6 h-6 hover:text-blue-700 active:text-blue-900"
        >
          <path
            fill-rule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    """
  end

  def go_to_parent_button(assigns) do
    ~H"""
      <%= if @selected_ast_element_id !== "root" do %>
        <.svelte name="components/GoToParentButton" class="contents" socket={@socket}/>
      <% end %>
    """
  end

  def add_attribute_button(assigns) do
    ~H"""
      <button
        type="button"
        class="bg-blue-500 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-2 px-4 rounded outline-2 w-full"
        phx-click="add_attribute"
        phx-target={@parent}>+ Add attribute</button>
    """
  end
end
