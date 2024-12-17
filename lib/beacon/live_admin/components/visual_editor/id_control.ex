defmodule Beacon.LiveAdmin.VisualEditor.IdControl do
  @moduledoc false

  # FIXME: implement IdControl

  use Beacon.LiveAdmin.Web, :live_component
  import Beacon.LiveAdmin.VisualEditor.Components
  # alias Beacon.LiveAdmin.VisualEditor

  def render(assigns) do
    ~H"""
    <div id={@id}>
      <.control_section label="ID">
        <%= @element_id %>
      </.control_section>
    </div>
    """
  end

  def mount(socket) do
    {:ok, socket}
  end

  def update(assigns, socket) do
    %{element: element} = assigns
    # element_id = VisualEditor.element_id(element)
    element_id = "todo"

    {:ok,
     socket
     |> assign(assigns)
     |> assign(element_id: element_id)}
  end
end
