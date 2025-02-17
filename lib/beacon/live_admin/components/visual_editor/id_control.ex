defmodule Beacon.LiveAdmin.VisualEditor.IdControl do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_component
  import Beacon.LiveAdmin.VisualEditor.Components
  alias Beacon.LiveAdmin.VisualEditor.Id
  alias Ecto.Changeset

  def render(assigns) do
    ~H"""
    <div id={@id}>
      <.control_section label="ID">
        <.form :let={f} for={@form} id={@id <> "-form"} phx-target={@myself} phx-submit="save" phx-change="validate">
          <.input field={f[:value]} placeholder="ID" class="w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm" />
        </.form>
      </.control_section>
    </div>
    """
  end

  def update(assigns, socket) do
    %{element: element} = assigns
    element_id = get_in(element, ["attrs", "id"]) || ""
    changeset = Id.changeset(%{value: element_id})

    {:ok,
     socket
     |> assign(assigns)
     |> assign_form(changeset)}
  end

  def handle_event("validate", %{"id" => params}, socket) do
    changeset =
      params
      |> Id.changeset()
      |> Map.put(:action, :validate)

    {:noreply, assign_form(socket, changeset)}
  end

  def handle_event("save", %{"id" => params}, socket) do
    changeset =
      params
      |> Id.changeset()
      |> Changeset.apply_action(:update)

    case changeset do
      {:ok, id} ->
        changes = %{updated: %{"attrs" => %{"id" => id.value}}}
        send(self(), {:element_changed, {socket.assigns.element["path"], changes}})
        {:noreply, socket}

      {:error, changeset} ->
        {:noreply, assign_form(socket, changeset)}
    end
  end

  defp assign_form(socket, changeset) do
    assign(socket, :form, changeset)
  end
end

defmodule Beacon.LiveAdmin.VisualEditor.Id do
  @moduledoc false
  use Ecto.Schema
  use Phoenix.Component
  import Ecto.Changeset

  embedded_schema do
    field :value, :string
  end

  # TODO: validations
  def changeset(params) do
    changeset(%__MODULE__{}, params)
  end

  def changeset(id, params) do
    id
    |> cast(params, ~w(value)a)
    |> validate_change(:value, fn :value, value ->
      if String.contains?(value, " ") do
        [value: "cannot contain spaces"]
      else
        []
      end
    end)
  end

  def build_form(params) do
    params
    |> changeset()
    |> to_form()
  end
end
