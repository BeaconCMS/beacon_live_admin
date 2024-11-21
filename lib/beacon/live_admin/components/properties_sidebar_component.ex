defmodule Beacon.LiveAdmin.VisualEditor.Element do
  use Ecto.Schema
  import Ecto.Changeset

  embedded_schema do
    embeds_many :attributes, Beacon.LiveAdmin.VisualEditor.Attribute, on_replace: :delete
  end

  # def changeset(element, attrs \\ %{}) do
  #   %__MODULE__{}
  #   |> cast(attrs, [])
  #   |> cast_embed(:attributes,
  #     sort_param: :attributes_sort,
  #     drop_param: :attributes_drop
  #   )
  # end
end

defmodule Beacon.LiveAdmin.VisualEditor.Attribute do
  use Ecto.Schema
  import Ecto.Changeset

  embedded_schema do
    field :name, :string
    field :value, :string
  end

  def changeset(attribute, attrs \\ %{}) do
    %__MODULE__{}
    |> cast(attrs, [:name, :value])
    |> validate_required([:name, :value])
  end
end

defmodule Beacon.LiveAdmin.PropertiesSidebarComponent do
  use Beacon.LiveAdmin.Web, :live_component
  alias Beacon.LiveAdmin.PropertiesSidebarSectionComponent
  alias Beacon.LiveAdmin.VisualEditor.Element
  alias Beacon.LiveAdmin.VisualEditor.Attribute

  def mount(socket) do
    # FIXME: populate existing/current element attributes
    # changeset =
    #   Element.changeset(%Element{}, %{
    #     attributes: [
    #       %{name: "class", value: "bg-red-500"}
    #     ]
    #   })

    {:ok,
     socket
     # FIXME: remove `:new_attributes`
     |> assign(new_attributes: [])
    }
    #  |> assign_form(changeset)}
  end

  def update(assigns, socket) do
    selected_ast_element =
      case assigns.selected_ast_element_id do
        "root" -> %{"tag" => "root", "attrs" => %{}, "content" => assigns.page.ast}
        xpath -> find_ast_element(assigns.page.ast, xpath)
      end

    {:ok,
     socket
     |> assign(assigns)
     |> assign(
       selected_ast_element: selected_ast_element,
       attributes_editable: selected_ast_element["tag"] not in ["eex", "eex_block"]
     )}
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

  def handle_event("add_attribute", _params, socket) do
    new_attribute = Attribute.changeset(%{"name" => "", "value" => ""})
    # changeset =
    #   Element.changeset(%Element{}, %{
    #     attributes: [
    #       %{name: "nameeee", value: "valueeee"}
    #     ]
    #   })
    new_attributes = socket.assigns.new_attributes ++ [new_attribute]
    # dbg(new_attributes)
    {:noreply, assign(socket, :new_attributes, new_attributes)}
  end

  # def handle_event("delete_attribute", %{"index" => index}, socket) do
  #   new_attributes = List.delete_at(socket.assigns.new_attributes, String.to_integer(index))
  #   {:noreply, assign(socket, :new_attributes, new_attributes)}
  # end

  def handle_event("validate", %{"element" => element_params} = p, socket) do
    changeset = Element.changeset(%Element{}, element_params)
    {:noreply, assign_form(socket, changeset)}
  end

  def render(assigns) do
    ~H"""
    <div class="mt-4 w-64 bg-white" data-testid="right-sidebar">
      <div class="sticky top-0 overflow-y-auto h-screen">
        <%= if @selected_ast_element do %>
          <div class="border-b text-lg font-medium leading-5 p-4 relative">
            <%= @selected_ast_element["tag"] %>
            <.go_to_parent_button selected_ast_element_id={assigns.selected_ast_element_id} socket={@socket} />
            <.close_button />
          </div>

          <%= if @attributes_editable do %>
            <%!-- <.simple_form for={@form} id="element-form" phx-target={@myself} phx-change="validate" phx-submit="save">
              <.inputs_for :let={f_attribute} field={@form[:attributes]}>
                <input type="hidden" name="element[attributes_sort][]" value={f_attribute.index} />
                <.input field={f_attribute[:name]} type="text" label="Name" />
                <.input field={f_attribute[:value]} type="text" label="Value" />
                <button type="button" name="element[attributes_drop][]" value={f_attribute.index} phx-click={JS.dispatch("change")}>
                  Delete <.icon name="hero-x-mark-solid" class="w-6 h-6 relative top-2" />
                </button>
              </.inputs_for>
              <input type="hidden" name="element[attributes_drop][]" />
              <button type="button" name="element[attributes_sort][]" value="new" phx-click={JS.dispatch("change")}>
                Add
              </button>
            </.simple_form> --%>

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
            <.add_attribute_button parent={@myself} />
          </div>
        <% end %>
      </div>
    </div>
    """
  end

  defp assign_form(socket, %Ecto.Changeset{} = changeset) do
    assign(socket, :form, to_form(changeset))
  end

  defp close_button(assigns) do
    ~H"""
    <button type="button" class="absolute p-2 top-2 right-1" phx-click="reset_selection">
      <span class="sr-only">Close</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 hover:text-blue-700 active:text-blue-900">
        <path
          fill-rule="evenodd"
          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    """
  end

  defp go_to_parent_button(assigns) do
    ~H"""
    <%= if @selected_ast_element_id !== "root" do %>
      <.svelte name="components/GoToParentButton" class="contents" socket={@socket} />
    <% end %>
    """
  end

  defp add_attribute_button(assigns) do
    ~H"""
    <button type="button" class="bg-blue-500 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-2 px-4 rounded outline-2 w-full" phx-click="add_attribute" phx-target={@parent}>
      + Add attribute
    </button>
    """
  end
end
