defmodule Beacon.LiveAdmin.VisualEditor.KeyValueControl do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_component
  alias Beacon.LiveAdmin.VisualEditor.ControlSection

  defmodule FormData do
    use Ecto.Schema

    embedded_schema do
      field :name, :string
      field :value, :string
    end
  end


  def render(assigns) do
    ~H"""
    <div id={@id}>
      <.live_component module={ControlSection} label={if !@editing && @name !== "", do: @name} name={@name} path={@element["path"]} id={"#{@id}-section"}>
        <:header_buttons>
          <button
            type="button"
            class="rounded-full inline-block hover:text-blue-400 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            phx-click="start_edit"
            phx-target={@myself}
          >
            <span class="sr-only">Edit attribute</span>
            <.icon name="hero-pencil-square" class="w-5 h-5" />
          </button>
        </:header_buttons>
        <%= if @editing do %>
          <.form
            :let={f}
            for={@form}
            phx-submit="save"
            phx-change="handle_change"
            phx-target={@myself}>
          <%!-- <form phx-submit="save" phx-change="handle_change" phx-target={@myself}> --%>
            <.input
              field={f[:name]}
              placeholder="Name"
              name="name"
              class="w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm" />

            <.input field={f[:value]} placeholder="Value" name="value" class="mt-3 w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm"  />

            <%!-- <input class="w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm" placeholder="Name" name="name" value={@name} /> --%>
            <%!-- <input class="mt-3 w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm" placeholder="Value" name="value" value={@value} /> --%>
            <div class="mt-3 grid grid-cols-2 gap-x-2">
              <.button type="submit" class="bg-blue-500 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-2 px-4 rounded outline-2">Save</.button>
              <.button type="reset" name="cancel" class="bg-red-500 hover:bg-red-700 active:bg-red-800 text-white font-bold py-2 px-4 rounded outline-2">Cancel</.button>
              <%!-- <button type="submit" class="bg-blue-500 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-2 px-4 rounded outline-2">Save</button> --%>
              <%!-- <button type="reset" name="cancel" class="bg-red-500 hover:bg-red-700 active:bg-red-800 text-white font-bold py-2 px-4 rounded outline-2">Cancel</button> --%>
            </div>
          </.form>
        <% else %>
          <%= if @name != "" do %>
            <input class="w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm cursor-not-allowed" placeholder="Value" name="value" disabled value={@value} />
          <% end %>
          <%= if @name == "" and @value == "" do %>
            <button type="button" class="bg-blue-500 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-2 px-4 rounded outline-2 w-full" phx-click="add_new_attribute" phx-target={@myself}>
              + Add attribute
            </button>
          <% end %>
        <% end %>
      </.live_component>
    </div>
    """
  end

  def mount(socket) do
    {:ok, assign(socket, editing: false)}
  end

  def update(assigns, socket) do
    name = Map.get(assigns, :name, "")
    value = Map.get(assigns, :value, "")
    form_data = %FormData{name: name, value: value}
    changeset = changeset(form_data)
    {:ok,
     assign(socket, assigns)
     |> assign(form: to_form(changeset), name: name, value: value)}
  end

  def handle_event("add_new_attribute", _params, socket) do
    {:noreply, assign(socket, :editing, true)}
  end

  def handle_event("start_edit", _params, socket) do
    {:noreply, assign(socket, :editing, true)}
  end

  def handle_event("handle_change", %{"_target" => ["cancel"]}, socket) do
    {:noreply, assign(socket, :editing, false)}
  end

  # def handle_event("handle_change", %{"new_attribute" => params}, socket) do
  #   existing_attrs = socket.assigns.element["attrs"] || %{}
  #   form_data = %FormData{name: params["name"], value: params["value"]}
  #   changeset = changeset(form_data, existing_attrs)
  #   {:noreply, assign(socket, changeset: changeset)}
  # end

  def handle_event("handle_change", _attrs, socket) do
    {:noreply, socket}
  end



  # def handle_event("save", %{"name" => name, "value" => value}, socket) do
  #   name = String.trim(name)
  #   value = String.trim(value)
  #   if can_save(name, socket) do
  #     changes = %{updated: %{"attrs" => %{name => value}}}
  #     changes = if name != socket.assigns.name, do: Map.put_new(changes, :deleted, [socket.assigns.name])
  #     send(self(), {:element_changed, {socket.assigns.element["path"], changes}})
  #     {:noreply, socket |> assign(:editing, false)}
  #   else
  #     {:noreply, socket}
  #   end
  # end

  def handle_event("save", params, socket) do
    existing_attrs = socket.assigns.element["attrs"] || %{}
    changeset = changeset(%FormData{name: params["name"], value: params["value"]}, existing_attrs)
    if changeset.valid? do
      dbg("Changeset is valid. #{inspect(changeset)}")
      %{name: name, value: value} = changeset.data
      changes = %{updated: %{"attrs" => %{name => value}}}
      changes =
        if name != socket.assigns.name do
          Map.put_new(changes, :deleted, [socket.assigns.name])
        else
          changes
        end
      send(self(), {:element_changed, {socket.assigns.element["path"], changes}})
      {:noreply, assign(socket, editing: false, name: name, value: value, form: to_form(changeset))}
    else
      {:noreply, assign(socket, changeset: changeset)}
    end
  end

  # defp can_save(name, socket) do
  #   name != "" && !Map.has_key?(socket.assigns.element["attrs"], name)
  # end

  defp changeset(form_data, existing_attrs \\ %{}) do
    form_data
    |> Ecto.Changeset.cast(Map.from_struct(form_data), [:name, :value])
    |> Ecto.Changeset.validate_required([:name, :value])
    |> Ecto.Changeset.validate_change(:name, fn :name, name ->
      if Map.has_key?(existing_attrs, name) && name != form_data.name do
        [name: "Attribute name already exists"]
      else
        []
      end
    end)
  end
end
