defmodule Beacon.LiveAdmin.VisualEditor.ClassControl do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_component
  alias Beacon.LiveAdmin.VisualEditor.Components.ControlSection
  alias Beacon.LiveAdmin.VisualEditor

  def render(assigns) do
    ~H"""
    <div id={@id}>
      <.live_component module={ControlSection} id={@id <> "-section"} label="Classes">
        <input type="text" class="w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm" id={"#{@id}-input"} phx-hook="VisualEditorClassInput" data-target={@id} />
        <div class="pt-3">
          <div :for={css_class <- @classes} class="inline-flex items-center rounded-full bg-slate-700 text-white text-xs px-3 pr-0 m-1 leading-4">
            <%= css_class %>
            <button
              class="p-2 rounded-full inline-block bg-slate-700 text-white hover:text-blue-400 active:text-blue-500"
              type="button"
              phx-click="delete_class"
              phx-value-class={css_class}
              phx-target={@myself}
            >
              <span class="sr-only">Delete class:</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3">
                <path
                  fill-rule="evenodd"
                  d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </.live_component>
    </div>
    """
  end

  def mount(socket) do
    {:ok, socket}
  end

  def update(assigns, socket) do
    %{element: element} = assigns

    classes =
      element
      |> VisualEditor.element_class()
      |> String.split(" ", trim: true)

    {:ok,
     socket
     |> assign(assigns)
     |> assign(classes: classes)}
  end

  def handle_event("add_class", %{"value" => new_class}, socket) do
    class = VisualEditor.merge_class(socket.assigns.element, new_class)
    send(self(), {:element_changed, {socket.assigns.element["path"], %{updated: %{"attrs" => %{"class" => class}}}}})
    {:noreply, socket}
  end

  def handle_event("delete_class", %{"class" => deleted_class}, socket) do
    class =
      socket.assigns.classes
      |> Enum.reject(&(&1 == deleted_class))
      |> Enum.join(" ")

    send(self(), {:element_changed, {socket.assigns.element["path"], %{updated: %{"attrs" => %{"class" => class}}}}})

    {:noreply, socket}
  end
end
