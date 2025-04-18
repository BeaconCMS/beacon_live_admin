defmodule Beacon.LiveAdmin.VisualEditor.Components.HEExEditor do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_component
  alias Beacon.LiveAdmin.VisualEditor

  def update(%{event: {:element_changed, %{path: path, payload: payload}}}, socket) do
    updated = Map.get(payload, :updated, %{})
    attrs = Map.get(updated, "attrs", %{})
    deleted_attrs = Map.get(payload, :deleted, [])
    # TODO: live_json? - https://github.com/woutdp/live_svelte?tab=readme-ov-file#live_json
    ast = VisualEditor.update_node(socket.assigns.ast, path, attrs, deleted_attrs)

    if socket.assigns.on_template_change do
      # TODO: Don't save immediately. Debounce serializing this to a template
      heex_template = Beacon.LiveAdmin.VisualEditor.HEEx.HEExDecoder.decode(ast)
      socket.assigns.on_template_change.(heex_template)
    end

    {:ok, assign(socket, ast: ast)}
  end

  # already initialized
  def update(_assigns, %{assigns: %{ast: _ast}} = socket) do
    {:ok, socket}
  end

  def update(assigns, socket) do
    init(assigns, socket)
  end

  defp init(assigns, socket) do
    template = assigns[:template] || ""
    render_node_fun = assigns[:render_node_fun] || fn heex -> heex end

    ast = Beacon.LiveAdmin.VisualEditor.HEEx.JSONEncoder.maybe_encode(template, render_node_fun)

    layout_ast =
      case assigns[:encode_layout_fun] do
        nil -> nil
        fun -> fun.()
      end

    {:ok,
     socket
     |> assign(assigns)
     |> assign(ast: ast, layout_ast: layout_ast, selected_element_path: nil)}
  end

  def render(assigns) do
    ~H"""
    <div id={@id} class="flex">
      <.svelte
        name="components/UiBuilder"
        class="mt-4 relative flex-1"
        props={
          %{
            components: @components,
            pageAst: @ast,
            layoutAst: @layout_ast,
            tailwindInput: @tailwind_input,
            tailwindConfig: @tailwind_config_url,
            selectedAstElementId: @selected_element_path
          }
        }
        socket={@socket}
      />

      <.live_component module={Beacon.LiveAdmin.VisualEditor.PropertiesSidebarComponent} id="properties-sidebar" ast={@ast} selected_element_path={@selected_element_path} heex_editor={@myself} />
    </div>
    """
  end

  def handle_event("select_element", %{"path" => path}, socket) do
    {:noreply, assign(socket, selected_element_path: path)}
  end

  def handle_event("render_component_in_page", %{"component_id" => id}, socket) do
    component = Enum.find(socket.assigns.components, fn component -> component.id == id end)
    ast = socket.assigns.encode_component_fun.(component)
    {:reply, %{"ast" => ast}, socket}
  end

  def handle_event("update_page_ast", %{"ast" => ast}, socket) do
    heex_template = Beacon.LiveAdmin.VisualEditor.HEEx.HEExDecoder.decode(ast)
    socket.assigns.on_template_change.(heex_template)

    {:noreply, assign(socket, ast: ast)}
  end
end
