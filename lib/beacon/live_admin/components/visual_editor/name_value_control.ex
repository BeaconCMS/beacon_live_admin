defmodule Beacon.LiveAdmin.VisualEditor.NameValueControl do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_component
  import Beacon.LiveAdmin.VisualEditor.Components
  alias Beacon.LiveAdmin.VisualEditor.NameValue
  alias Ecto.Changeset

  def render(assigns) do
    ~H"""
    <div id={@id}>
      <.control_section>
        <:header>
          <button :if={!@attribute.editing} type="button" phx-target={@myself} phx-click="edit">
            <.icon name="hero-pencil-square" class="w-5 h-5 text-blue-500" />
          </button>

          <button type="button" phx-target={@myself} phx-click="remove">
            <.icon name="hero-trash" class="w-5 h-5 text-red-500" />
          </button>
        </:header>

        <.form :let={f} for={@form} id={@id <> "-form"} phx-target={@myself} phx-submit="save" phx-change="validate">
          <.input
            field={f[:name]}
            placeholder="Name"
            class={"w-full mb-2 py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm #{if !@attribute.editing, do: "cursor-not-allowed"}"}
            disabled={!@attribute.editing}
          />
          <.input
            field={f[:value]}
            placeholder="Value"
            class={"w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm #{if !@attribute.editing, do: "cursor-not-allowed"}"}
            disabled={!@attribute.editing}
          />

          <.button :if={@attribute.editing} phx-disable-with="Saving..." class="">Save</.button>
          <.button :if={@attribute.editing} type="button" phx-target={@myself} phx-click="discard">Discard</.button>
        </.form>
      </.control_section>
    </div>
    """
  end

  def update(assigns, socket) do
    %{attribute: attribute} = assigns
    changeset = NameValue.changeset(%{name: attribute.name, value: attribute.value})

    {:ok,
     socket
     |> assign(assigns)
     |> assign_form(changeset)}
  end

  def handle_event("validate", %{"name_value" => params}, socket) do
    changeset =
      params
      |> NameValue.changeset()
      |> Map.put(:action, :validate)

    {:noreply, assign_form(socket, changeset)}
  end

  def handle_event("save", %{"name_value" => params}, socket) do
    changeset =
      params
      |> NameValue.changeset()
      |> Changeset.apply_action(:update)

    case changeset do
      {:ok, name_value} ->
        %{path: path, attribute: attribute} = socket.assigns

        cond do
          name_value.name != attribute.name ->
            changes = %{updated: %{"attrs" => %{name_value.name => name_value.value}}, deleted: [attribute.name]}
            send(self(), {:element_changed, {path, changes}})

          name_value.value != attribute.value ->
            changes = %{updated: %{"attrs" => %{name_value.name => name_value.value}}}
            send(self(), {:element_changed, {path, changes}})

          # nothing has changed so we skip it to save resources
          :else ->
            :skip
        end

        {:noreply, socket}

      {:error, changeset} ->
        {:noreply, assign_form(socket, changeset)}
    end
  end

  def handle_event("edit", _, socket) do
    send_update(socket.assigns.parent, %{edit_attribute: socket.assigns.attribute})
    {:noreply, socket}
  end

  def handle_event("remove", _, socket) do
    %{path: path, attribute: attribute} = socket.assigns
    send(self(), {:element_changed, {path, %{deleted: [attribute.name]}}})
    {:noreply, socket}
  end

  def handle_event("discard", _, socket) do
    send_update(socket.assigns.parent, %{discard_attribute: socket.assigns.attribute})
    {:noreply, socket}
  end

  defp assign_form(socket, changeset) do
    assign(socket, :form, changeset)
  end
end

defmodule Beacon.LiveAdmin.VisualEditor.NameValue do
  use Ecto.Schema
  use Phoenix.Component
  import Ecto.Changeset

  embedded_schema do
    field :name, :string
    field :value, :string
  end

  # TODO: validations
  def changeset(params) do
    changeset(%__MODULE__{}, params)
  end

  def changeset(name_value, params) do
    name_value
    |> cast(params, ~w(name value)a)
    |> validate_required([:name])
  end

  def build_form(params) do
    params
    |> changeset()
    |> to_form()
  end
end
