defmodule Beacon.LiveAdmin.VisualEditor.Components.HEExEditor do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_component

  alias Beacon.LiveAdmin.VisualEditor

  def update(%{event: {origin, :element_changed, %{path: path, payload: payload}}}, socket) do
    dbg(:update_element_changed)

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

  def update(assigns, %{assigns: %{ast: _ast}} = socket) do
    {:ok, socket}
  end

  def update(assigns, socket) do
    init(assigns, socket)
  end

  defp init(assigns, socket) do
    dbg(:init)

    template = assigns[:template] || ""
    render_node_fun = assigns[:render_node_fun] || fn _node -> "" end

    # WebAPI.Page.show(page.site, page)

    page = %{
      id: "192cfc3c-7fc7-4329-aa44-ede411651016",
      path: "/comp",
      # format: :heex,
      layout: %{
        # id: "02457e88-7dcf-425f-9391-25e1e059f43a",
        # title: "dev",
        # template: "<%= @inner_content %>\n",
        # site: :dev,
        ast: [
          %{
            "attrs" => %{},
            "content" => ["@inner_content"],
            "metadata" => %{"opt" => ~c"="},
            "rendered_html" => "&lt;div&gt;\n  &lt;p&gt;hello&lt;/p&gt;\n&lt;/div&gt;",
            "tag" => "eex"
          }
        ]
        # meta_tags: [
        #   %{"content" => "value", "name" => "layout-meta-tag-one"},
        #   %{"content" => "value", "name" => "layout-meta-tag-two"}
        # ],
        # resource_links: [],
        # inserted_at: ~U[2025-03-25 16:24:33.500724Z],
        # updated_at: ~U[2025-03-25 16:24:33.500724Z]
      }
      # site: :dev,
      # layout_id: "02457e88-7dcf-425f-9391-25e1e059f43a"
    }

    {:ok, ast} = Beacon.LiveAdmin.VisualEditor.HEEx.JSONEncoder.encode(template, render_node_fun)

    tailwind_input =
      IO.iodata_to_binary([
        "@tailwind base;",
        "\n",
        "@tailwind components;",
        "\n",
        "@tailwind utilities;",
        "\n"
      ])

    {:ok,
     socket
     |> assign(assigns)
     |> assign(page: page, ast: ast, tailwind_input: tailwind_input, selected_element_path: nil)}
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
            pageInfo: @page,
            pageAst: @ast,
            tailwindConfig: "http://localhost:4001/dev/__beacon_assets__/css_config",
            tailwindInput: @tailwind_input,
            selectedAstElementId: @selected_element_path
          }
        }
        socket={@socket}
      />

      <.live_component
        module={Beacon.LiveAdmin.VisualEditor.PropertiesSidebarComponent}
        id="properties-sidebar"
        page={@page}
        ast={@ast}
        selected_element_path={@selected_element_path}
        heex_editor={@myself}
      />
    </div>
    """
  end

  def handle_event("select_element", %{"path" => path}, socket) do
    {:noreply, assign(socket, selected_element_path: path)}
  end
end
