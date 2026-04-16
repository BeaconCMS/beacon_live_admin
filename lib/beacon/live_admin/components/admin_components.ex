defmodule Beacon.LiveAdmin.AdminComponents do
  @moduledoc """
  Provides Admin UI components.

  This file contains new components and also overrided Core components.
  """
  use Phoenix.Component

  alias Beacon.LiveAdmin.CoreComponents
  alias Beacon.LiveAdmin.PageBuilder.Table

  use Gettext, backend: Beacon.LiveAdmin.Gettext
  import Beacon.LiveAdmin.Router, only: [beacon_live_admin_path: 3]

  defdelegate header(assigns), to: CoreComponents
  defdelegate flash_group(assigns), to: CoreComponents
  defdelegate hide_modal(assigns), to: CoreComponents
  defdelegate show(selector), to: CoreComponents
  defdelegate show(js, selector), to: CoreComponents
  defdelegate hide(selector), to: CoreComponents
  defdelegate hide(js, selector), to: CoreComponents
  defdelegate translate_errors(errors, field), to: CoreComponents
  defdelegate translate_error(error), to: CoreComponents
  defdelegate icon(assigns), to: CoreComponents
  defdelegate button(assigns), to: CoreComponents
  defdelegate modal(assigns), to: CoreComponents
  defdelegate input(assigns), to: CoreComponents
  defdelegate error(assigns), to: CoreComponents
  defdelegate show_modal(id), to: CoreComponents
  defdelegate show_modal(js, id), to: CoreComponents
  defdelegate preview(assigns), to: Beacon.LiveAdmin.Preview

  @menu_link_active_class "inline-flex items-center px-3.5 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg transition-colors"
  @menu_link_regular_class "inline-flex items-center px-3.5 py-2 text-sm font-medium text-base-content/60 hover:text-base-content hover:bg-base-300 rounded-lg transition-colors"

  @doc """
  Visual Editor for HEEx and HTML templates.
  """
  attr :template, :string, required: true
  attr :components, :list, doc: "List of available components that can be used in the visual editor"
  attr :tailwind_input, :string,
    default: """
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    """
  attr :tailwind_config_url, :string, default: nil
  attr :on_template_change, {:fun, 1},
    default: &Function.identity/1,
    doc: "A function that is called when the template changes, receives the updated template as argument"
  attr :render_node_fun, {:fun, 1},
    default: &Beacon.LiveAdmin.AdminComponents.render_node/1,
    doc: "A function to render a HEEx node"
  attr :encode_layout_fun, {:fun, 0}, default: nil, doc: "A function that returns the layout AST to be used in the visual editor"
  attr :encode_component_fun, {:fun, 1}, default: nil, doc: "A function that takes a component and returns its AST representation"

  def visual_editor(assigns) do
    ~H"""
    <.live_component
      module={Beacon.LiveAdmin.VisualEditor.Components.HEExEditor}
      id="heex-visual-editor"
      components={@components}
      template={@template}
      tailwind_input={@tailwind_input}
      tailwind_config_url={@tailwind_config_url}
      on_template_change={@on_template_change}
      render_node_fun={@render_node_fun}
      encode_layout_fun={@encode_layout_fun}
      encode_component_fun={@encode_component_fun}
    />
    """
  end

  @doc """
  Renders a HEEx node (piece of template template).
  """
  @spec render_node(String.t(), map()) :: String.t()
  def render_node(node, assigns \\ %{}) when is_binary(node) and is_map(assigns) do
    assigns =
      assigns
      |> Map.new()
      |> Map.put_new(:__changed__, %{})

    {:ok, ast} = compile_template(node)
    {rendered, _} = Code.eval_quoted(ast, [assigns: assigns], __ENV__)

    rendered
    |> Phoenix.HTML.Safe.to_iodata()
    |> IO.iodata_to_binary()
  end

  defp compile_template(template, file \\ "nofile") do
    opts = [
      engine: Phoenix.LiveView.TagEngine,
      line: 1,
      indentation: 0,
      file: file,
      caller: __ENV__,
      source: template,
      trim: true,
      tag_handler: Phoenix.LiveView.HTMLEngine
    ]

    {:ok, EEx.compile_string(template, opts)}
  rescue
    error -> {:error, error}
  end

  @doc false
  attr :socket, :map
  attr :flash, :map
  attr :beacon_layout, :map
  attr :live_action, :atom

  def layout_header(assigns) do
    ~H"""
    <Beacon.LiveAdmin.AdminComponents.layout_menu socket={@socket} site={@beacon_layout.site} current_action={@live_action} layout_id={@beacon_layout.id} />
    """
  end

  @doc false
  attr :socket, :map
  attr :site, :atom
  attr :current_action, :atom
  attr :layout_id, :string

  def layout_menu(assigns) do
    assigns =
      assign(assigns,
        active_class: @menu_link_active_class,
        regular_class: @menu_link_regular_class
      )

    ~H"""
    <div class="mb-8">
      <ul class="flex flex-wrap items-center gap-1 p-1 bg-base-200 rounded-lg w-fit">
        <%= layout_menu_items(assigns) %>
      </ul>
    </div>
    """
  end

  defp layout_menu_items(%{current_action: :new} = assigns) do
    ~H"""
    <li><.link patch={beacon_live_admin_path(@socket, @site, "/layouts/#{@layout_id}")} class={@active_class}>Layout</.link></li>
    """
  end

  defp layout_menu_items(assigns) do
    ~H"""
    <li>
      <.link patch={beacon_live_admin_path(@socket, @site, "/layouts/#{@layout_id}")} class={if(@current_action == :edit, do: @active_class, else: @regular_class)}>Layout</.link>
    </li>
    <li>
      <.link patch={beacon_live_admin_path(@socket, @site, "/layouts/#{@layout_id}/meta_tags")} class={if(@current_action == :meta_tags, do: @active_class, else: @regular_class)}>Meta Tags</.link>
    </li>
    <li>
      <.link patch={beacon_live_admin_path(@socket, @site, "/layouts/#{@layout_id}/resource_links")} class={if(@current_action == :resource_links, do: @active_class, else: @regular_class)}>
        Resource Links
      </.link>
    </li>
    <li>
      <.link patch={beacon_live_admin_path(@socket, @site, "/layouts/#{@layout_id}/revisions")} class={if(@current_action == :revisions, do: @active_class, else: @regular_class)}>Revisions</.link>
    </li>
    <li>
      <.link patch={beacon_live_admin_path(@socket, @site, "/layouts/#{@layout_id}/preview")} class={if(@current_action == :preview, do: @active_class, else: @regular_class)}>Preview</.link>
    </li>
    """
  end

  @doc false
  attr :socket, :map
  attr :flash, :map
  attr :page, :any
  attr :live_action, :atom

  def page_header(assigns) do
    ~H"""
    <Beacon.LiveAdmin.AdminComponents.page_menu socket={@socket} site={@page.site} current_action={@live_action} page_id={@page.id} />
    """
  end

  @doc false
  attr :socket, :map
  attr :site, :atom
  attr :current_action, :atom
  attr :page_id, :string

  def page_menu(assigns) do
    assigns =
      assign(assigns,
        active_class: @menu_link_active_class,
        regular_class: @menu_link_regular_class
      )

    ~H"""
    <div class="mb-8">
      <ul class="flex flex-wrap items-center gap-1 p-1 bg-base-200 rounded-lg w-fit">
        <%= page_menu_items(assigns) %>
      </ul>
    </div>
    """
  end

  defp page_menu_items(%{current_action: :new} = assigns) do
    ~H"""
    <li><.link patch={beacon_live_admin_path(@socket, @site, "/pages/#{@page_id}")} class={@active_class}>Page</.link></li>
    """
  end

  defp page_menu_items(assigns) do
    ~H"""
    <li>
      <.link patch={beacon_live_admin_path(@socket, @site, "/pages/#{@page_id}")} class={if(@current_action == :edit, do: @active_class, else: @regular_class)}>Page</.link>
    </li>
    <li>
      <.link patch={beacon_live_admin_path(@socket, @site, "/pages/#{@page_id}/seo")} class={if(@current_action == :seo, do: @active_class, else: @regular_class)}>SEO</.link>
    </li>
    <li>
      <.link patch={beacon_live_admin_path(@socket, @site, "/pages/#{@page_id}/meta_tags")} class={if(@current_action == :meta_tags, do: @active_class, else: @regular_class)}>Meta Tags</.link>
    </li>
    <li>
      <.link patch={beacon_live_admin_path(@socket, @site, "/pages/#{@page_id}/schema")} class={if(@current_action == :schema, do: @active_class, else: @regular_class)}>Schema</.link>
    </li>
    <li>
      <.link patch={beacon_live_admin_path(@socket, @site, "/pages/#{@page_id}/variants")} class={if(@current_action == :variants, do: @active_class, else: @regular_class)}>Variants</.link>
    </li>
    <li>
      <.link patch={beacon_live_admin_path(@socket, @site, "/pages/#{@page_id}/revisions")} class={if(@current_action == :revisions, do: @active_class, else: @regular_class)}>Revisions</.link>
    </li>
    <li>
      <.link patch={beacon_live_admin_path(@socket, @site, "/pages/#{@page_id}/preview")} class={if(@current_action == :preview, do: @active_class, else: @regular_class)}>Preview</.link>
    </li>
    """
  end

  @doc false
  attr :socket, :map
  attr :flash, :map
  attr :component, :any
  attr :live_action, :atom

  def component_header(assigns) do
    ~H"""
    <Beacon.LiveAdmin.AdminComponents.component_menu socket={@socket} site={@component.site} current_action={@live_action} component_id={@component.id} />
    """
  end

  @doc false
  attr :socket, :map
  attr :site, :atom
  attr :current_action, :atom
  attr :component_id, :string

  def component_menu(assigns) do
    assigns =
      assign(assigns,
        active_class: @menu_link_active_class,
        regular_class: @menu_link_regular_class
      )

    ~H"""
    <div class="mb-8">
      <ul class="flex flex-wrap items-center gap-1 p-1 bg-base-200 rounded-lg w-fit">
        <%= component_menu_items(assigns) %>
      </ul>
    </div>
    """
  end

  defp component_menu_items(%{current_action: :new} = assigns) do
    ~H"""
    <li><.link patch={beacon_live_admin_path(@socket, @site, "/components/#{@component_id}")} class={@active_class}>Component</.link></li>
    """
  end

  defp component_menu_items(assigns) do
    ~H"""
    <li>
      <.link patch={beacon_live_admin_path(@socket, @site, "/components/#{@component_id}")} class={if(@current_action == :edit, do: @active_class, else: @regular_class)}>Component</.link>
    </li>
    <li>
      <.link patch={beacon_live_admin_path(@socket, @site, "/components/#{@component_id}/slots")} class={if(@current_action == :slots, do: @active_class, else: @regular_class)}>Slots</.link>
    </li>
    """
  end

  @doc """
  Renders a thumbnail image.
  """
  attr :source, :string, default: nil

  def thumbnail(assigns) do
    ~H"""
    <image src={@source} width="50" height="50" />
    """
  end

  # These delegate to CoreComponents (now aligned with Phoenix 1.8.5)
  defdelegate flash(assigns), to: CoreComponents
  defdelegate simple_form(assigns), to: CoreComponents
  defdelegate table(assigns), to: CoreComponents
  defdelegate list(assigns), to: CoreComponents
  defdelegate back(assigns), to: CoreComponents

  @doc """
  Renders a rounded panel container for main content.
  """
  slot :inner_block, required: true
  attr :class, :string, default: ""

  def main_content(assigns) do
    ~H"""
    <div class={"#{@class} card bg-base-100 shadow-sm border border-base-300 px-4 py-3 mt-6"}>
      <%= render_slot(@inner_block) %>
    </div>
    """
  end

  @doc """
  Renders a search input text to filter table results.
  """
  attr :table, Beacon.LiveAdmin.PageBuilder.Table, required: true
  attr :placeholder, :string

  def table_search(assigns) do
    ~H"""
    <.simple_form :let={f} for={%{}} as={:search} phx-change="beacon:table-search" phx-submit="beacon:table-search">
      <.input type="search" field={f[:query]} value={@table.query} autofocus={true} placeholder={@placeholder || "Search"} />
    </.simple_form>
    """
  end

  @doc """
  Renders a select input to sort table results.
  """
  attr :table, Beacon.LiveAdmin.PageBuilder.Table, required: true
  attr :options, :list, required: true

  def table_sort(assigns) do
    ~H"""
    <.simple_form :let={f} for={%{}} as={:sort} phx-change="beacon:table-sort">
      <div class="flex items-center gap-2 justify-end">
        <label for="sort_sort_by" class="text-sm font-medium text-base-content">Sort by</label>
        <.input type="select" field={f[:sort_by]} value={@table.sort_by} options={@options} />
      </div>
    </.simple_form>
    """
  end

  @doc """
  Renders pagination to navigate table results.
  """
  attr :socket, Phoenix.LiveView.Socket, required: true
  attr :page, Beacon.LiveAdmin.PageBuilder.Page, required: true
  attr :limit, :integer, default: 11

  def table_pagination(assigns) do
    assigns = assign(assigns, :table, assigns.page.table)

    ~H"""
    <div :if={@table && @table.page_count > 1} class="flex items-center justify-center pt-6 pb-4">
      <div class="join">
        <.link
          :if={@table.current_page > 1}
          patch={Table.prev_path(@socket, @page)}
          class="join-item btn btn-sm"
        >
          <.icon name="hero-chevron-left-solid" class="w-4 h-4" />
        </.link>
        <button :if={@table.current_page == 1} class="join-item btn btn-sm btn-disabled">
          <.icon name="hero-chevron-left-solid" class="w-4 h-4" />
        </button>

        <%= for page <- Beacon.LiveAdmin.PageBuilder.Table.nav_pages(@table.current_page, @table.page_count, @limit) do %>
          <span :if={is_integer(page)}>
            <.link
              patch={Table.goto_path(@socket, @page, page)}
              class={["join-item btn btn-sm", if(@table.current_page == page, do: "btn-primary", else: "")]}
            >
              <%= page %>
            </.link>
          </span>
          <button :if={page == :sep} class="join-item btn btn-sm btn-disabled">...</button>
        <% end %>

        <.link
          :if={@table.current_page < @table.page_count}
          patch={Table.next_path(@socket, @page)}
          class="join-item btn btn-sm"
        >
          <.icon name="hero-chevron-right-solid" class="w-4 h-4" />
        </.link>
        <button :if={@table.current_page == @table.page_count} class="join-item btn btn-sm btn-disabled">
          <.icon name="hero-chevron-right-solid" class="w-4 h-4" />
        </button>
      </div>
    </div>
    """
  end

  @doc """
  Renders a select input with the available sites to select.
  """
  attr :selected_site, :string, default: ""
  attr :options, :list, default: []

  def site_selector(assigns) do
    ~H"""
    <div class="pr-2">
      <.form id="site-selector-form" for={%{}} phx-change="change-site">
        <.input type="select" name="site" options={@options} value={@selected_site} />
      </.form>
    </div>
    """
  end
end
