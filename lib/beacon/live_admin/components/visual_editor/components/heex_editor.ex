defmodule Beacon.LiveAdmin.VisualEditor.Components.HEExEditor do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_component

  alias Beacon.LiveAdmin.VisualEditor
  alias Beacon.LiveAdmin.WebAPI

  def update(%{event: {origin, :element_changed, %{path: path, changed: changed}}}, socket)
      when origin in [Beacon.LiveAdmin.VisualEditor.OpacityControl] do
    updated = Map.get(changed, :updated, %{})
    attrs = Map.get(updated, "attrs", %{})
    deleted_attrs = Map.get(changed, :deleted, [])
    # TODO: live_json? - https://github.com/woutdp/live_svelte?tab=readme-ov-file#live_json
    ast = VisualEditor.update_node(socket.assigns.ast, path, attrs, deleted_attrs)

    # TODO: Don't save immediately. Debounce serializing this to a template
    heex_template = Beacon.Template.HEEx.HEExDecoder.decode(ast)

    if socket.assigns.on_template_change do
      socket.assigns.on_template_change.(heex_template)
    end

    {:ok, assign(socket, ast: ast)}
  end

  def update(assigns, socket) do
    # WebAPI.Page.show(page.site, page)

    page = %{
      id: "192cfc3c-7fc7-4329-aa44-ede411651016",
      path: "/comp",
      format: :heex,
      layout: %{
        id: "02457e88-7dcf-425f-9391-25e1e059f43a",
        title: "dev",
        template: "<%= @inner_content %>\n",
        site: :dev,
        ast: [
          %{
            "attrs" => %{},
            "content" => ["@inner_content"],
            "metadata" => %{"opt" => ~c"="},
            "rendered_html" => "&lt;div&gt;\n  &lt;p&gt;hello&lt;/p&gt;\n&lt;/div&gt;",
            "tag" => "eex"
          }
        ],
        meta_tags: [
          %{"content" => "value", "name" => "layout-meta-tag-one"},
          %{"content" => "value", "name" => "layout-meta-tag-two"}
        ],
        resource_links: [],
        inserted_at: ~U[2025-03-25 16:24:33.500724Z],
        updated_at: ~U[2025-03-25 16:24:33.500724Z]
      },
      site: :dev,
      layout_id: "02457e88-7dcf-425f-9391-25e1e059f43a"
    }

    # {:ok, ast} = Beacon.Template.HEEx.JSONEncoder.encode(:dev, assigns[:template], %{})
    ast = [
      %{
        "attrs" => %{},
        "content" => [%{"attrs" => %{}, "content" => ["hello"], "tag" => "p"}],
        "tag" => "div"
      }
    ]

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

      <.live_component module={Beacon.LiveAdmin.VisualEditor.PropertiesSidebarComponent} id="properties-sidebar" page={@page} ast={@ast} selected_element_path={@selected_element_path} />
    </div>
    """
  end

  def handle_event("select_element", %{"path" => path}, socket) do
    {:noreply, assign(socket, selected_element_path: path)}
  end
end
