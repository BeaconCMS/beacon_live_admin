defmodule Beacon.LiveAdmin.AdminComponents do
  @moduledoc """
  Provides Admin UI components.

  This file contains new components and also overrided Core components.
  """
  use Phoenix.Component

  alias Phoenix.LiveView.JS
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

  defp icon(assigns), do: Beacon.LiveAdmin.StationUI.HTML.Icon.icon(assigns)
  defp input(assigns), do: Beacon.LiveAdmin.CoreComponents.input(assigns)

  @menu_link_active_class "inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active"
  @menu_link_regular_class "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300"

  @doc """
  Visual Editor for HEEx and HTML templates.

  This component provides a drag-and-drop interface for building and editing
  HEEx templates. It renders a live visual editor with a properties sidebar
  that allows editing component attributes.

  ## Examples

      <.visual_editor
        template={@page_template}
        components={@available_components}
        on_template_change={fn updated_template -> assign(socket, :page_template, updated_template) end}
      />

  """
  attr :template, :string, required: true, doc: "The HEEx/HTML template to edit"

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
    <div class="mb-10 text-sm font-medium text-center text-gray-500 border-b border-gray-200">
      <ul class="flex flex-wrap -mb-px">
        <%= layout_menu_items(assigns) %>
      </ul>
    </div>
    """
  end

  defp layout_menu_items(%{current_action: :new} = assigns) do
    ~H"""
    <li class="mr-2"><.link patch={beacon_live_admin_path(@socket, @site, "/layouts/#{@layout_id}")} class={@active_class}>Layout</.link></li>
    """
  end

  defp layout_menu_items(assigns) do
    ~H"""
    <li class="mr-2">
      <.link patch={beacon_live_admin_path(@socket, @site, "/layouts/#{@layout_id}")} class={if(@current_action == :edit, do: @active_class, else: @regular_class)}>Layout</.link>
    </li>
    <li class="mr-2">
      <.link patch={beacon_live_admin_path(@socket, @site, "/layouts/#{@layout_id}/meta_tags")} class={if(@current_action == :meta_tags, do: @active_class, else: @regular_class)}>Meta Tags</.link>
    </li>
    <li class="mr-2">
      <.link patch={beacon_live_admin_path(@socket, @site, "/layouts/#{@layout_id}/resource_links")} class={if(@current_action == :resource_links, do: @active_class, else: @regular_class)}>
        Resource Links
      </.link>
    </li>
    <li class="mr-2">
      <.link patch={beacon_live_admin_path(@socket, @site, "/layouts/#{@layout_id}/revisions")} class={if(@current_action == :revisions, do: @active_class, else: @regular_class)}>Revisions</.link>
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
    <div class="mb-10 text-sm font-medium text-center text-gray-500 border-b border-gray-200">
      <ul class="flex flex-wrap -mb-px">
        <%= page_menu_items(assigns) %>
      </ul>
    </div>
    """
  end

  defp page_menu_items(%{current_action: :new} = assigns) do
    ~H"""
    <li class="mr-2"><.link patch={beacon_live_admin_path(@socket, @site, "/pages/#{@page_id}")} class={@active_class}>Page</.link></li>
    """
  end

  defp page_menu_items(assigns) do
    ~H"""
    <li class="mr-2">
      <.link patch={beacon_live_admin_path(@socket, @site, "/pages/#{@page_id}")} class={if(@current_action == :edit, do: @active_class, else: @regular_class)}>Page</.link>
    </li>
    <li class="mr-2">
      <.link patch={beacon_live_admin_path(@socket, @site, "/pages/#{@page_id}/meta_tags")} class={if(@current_action == :meta_tags, do: @active_class, else: @regular_class)}>Meta Tags</.link>
    </li>
    <li class="mr-2">
      <.link patch={beacon_live_admin_path(@socket, @site, "/pages/#{@page_id}/schema")} class={if(@current_action == :schema, do: @active_class, else: @regular_class)}>Schema</.link>
    </li>
    <li class="mr-2">
      <.link patch={beacon_live_admin_path(@socket, @site, "/pages/#{@page_id}/variants")} class={if(@current_action == :variants, do: @active_class, else: @regular_class)}>Variants</.link>
    </li>
    <li class="mr-2">
      <.link patch={beacon_live_admin_path(@socket, @site, "/pages/#{@page_id}/revisions")} class={if(@current_action == :revisions, do: @active_class, else: @regular_class)}>Revisions</.link>
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
    <div class="mb-10 text-sm font-medium text-center text-gray-500 border-b border-gray-200">
      <ul class="flex flex-wrap -mb-px">
        <%= component_menu_items(assigns) %>
      </ul>
    </div>
    """
  end

  defp component_menu_items(%{current_action: :new} = assigns) do
    ~H"""
    <li class="mr-2"><.link patch={beacon_live_admin_path(@socket, @site, "/components/#{@component_id}")} class={@active_class}>Component</.link></li>
    """
  end

  defp component_menu_items(assigns) do
    ~H"""
    <li class="mr-2">
      <.link patch={beacon_live_admin_path(@socket, @site, "/components/#{@component_id}")} class={if(@current_action == :edit, do: @active_class, else: @regular_class)}>Component</.link>
    </li>
    <li class="mr-2">
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

  @doc """
  Renders flash notices.

  ## Examples

      <.flash kind={:info} flash={@flash} />
      <.flash kind={:info} phx-mounted={show("#flash")}>Welcome Back!</.flash>
  """
  attr :id, :string, default: "flash", doc: "the optional id of flash container"
  attr :flash, :map, default: %{}, doc: "the map of flash messages to display"
  attr :title, :string, default: nil
  attr :kind, :atom, values: [:info, :error], doc: "used for styling and flash lookup"
  attr :rest, :global, doc: "the arbitrary HTML attributes to add to the flash container"

  slot :inner_block, doc: "the optional inner block that renders the flash message"

  def flash(assigns) do
    ~H"""
    <div
      :if={msg = render_slot(@inner_block) || Phoenix.Flash.get(@flash, @kind)}
      id={@id}
      phx-click={JS.push("lv:clear-flash", value: %{key: @kind}) |> hide("##{@id}")}
      role="alert"
      class={[
        "fixed top-2 right-2 w-80 sm:w-96 z-50 rounded-lg p-3 ring-1",
        @kind == :info && "bg-emerald-50 text-emerald-800 ring-emerald-500 fill-cyan-900",
        @kind == :error && "bg-rose-50 text-rose-900 shadow-md ring-rose-500 fill-rose-900"
      ]}
      {@rest}
    >
      <p :if={@title} class="flex items-center gap-1.5 text-sm font-semibold leading-6">
        <.icon :if={@kind == :info} name="hero-information-circle-mini" class="w-4 h-4" />
        <.icon :if={@kind == :error} name="hero-exclamation-circle-mini" class="w-4 h-4" />
        <%= @title %>
      </p>
      <p class="mt-2 text-sm leading-5"><%= msg %></p>
      <button type="button" class="absolute p-2 group top-1 right-1" aria-label={gettext("close")}>
        <.icon name="hero-x-mark-solid" class="w-5 h-5 opacity-40 group-hover:opacity-70" />
      </button>
    </div>
    """
  end

  @doc """
  Renders a simple form.

  ## Examples

      <.simple_form for={@form} phx-change="validate" phx-submit="save">
        <.input field={@form[:email]} label="Email"/>
        <.input field={@form[:username]} label="Username" />
        <:actions>
          <.button>Save</.button>
        </:actions>
      </.simple_form>
  """
  attr :for, :any, required: true, doc: "the datastructure for the form"
  attr :as, :any, default: nil, doc: "the server side parameter to collect all input under"

  attr :rest, :global,
    include: ~w(autocomplete name rel action enctype method novalidate target),
    doc: "the arbitrary HTML attributes to apply to the form tag"

  slot :inner_block, required: true
  slot :actions, doc: "the slot for form actions, such as a submit button"

  def simple_form(assigns) do
    ~H"""
    <.form :let={f} for={@for} as={@as} {@rest}>
      <div class="mt-10 space-y-8">
        <%= render_slot(@inner_block, f) %>
        <div :for={action <- @actions} class="flex items-center justify-between gap-6 mt-2">
          <%= render_slot(action, f) %>
        </div>
      </div>
    </.form>
    """
  end

  @doc ~S"""
  Renders a table with generic styling.

  ## Examples

      <.table id="users" rows={@users}>
        <:col :let={user} label="id"><%= user.id %></:col>
        <:col :let={user} label="username"><%= user.username %></:col>
      </.table>
  """
  attr :id, :string, required: true
  attr :rows, :list, required: true
  attr :row_id, :any, default: nil, doc: "the function for generating the row id"
  attr :row_click, :any, default: nil, doc: "the function for handling phx-click on each row"

  attr :row_item, :any,
    default: &Function.identity/1,
    doc: "the function for mapping each row before calling the :col and :action slots"

  slot :col, required: true do
    attr :label, :string
  end

  slot :action, doc: "the slot for showing user actions in the last table column"

  def table(assigns) do
    assigns =
      with %{rows: %Phoenix.LiveView.LiveStream{}} <- assigns do
        assign(assigns, row_id: assigns.row_id || fn {id, _item} -> id end)
      end

    ~H"""
    <div class="px-4 overflow-y-auto sm:overflow-visible sm:px-0">
      <table class="w-[40rem] mt-6 sm:w-full">
        <thead class="text-sm leading-6 text-left text-zinc-500">
          <tr>
            <th :for={col <- @col} class="pt-0 pb-4 pl-0 pr-6 font-sans font-semibold uppercase text-sm tracking-[1.68px]"><%= col[:label] %></th>
            <th class="relative p-0 pb-4"><span class="sr-only"><%= gettext("Actions") %></span></th>
          </tr>
        </thead>
        <tbody id={@id} phx-update={match?(%Phoenix.LiveView.LiveStream{}, @rows) && "stream"} class="relative text-sm leading-6 divide-y border-grey-100 divide-grey-100 text-[#111625] font-medium">
          <tr :for={row <- @rows} id={@row_id && @row_id.(row)} class="group hover:bg-[#F0F5F9]">
            <td :for={{col, i} <- Enum.with_index(@col)} phx-click={@row_click && @row_click.(row)} class={["relative p-0", @row_click && "hover:cursor-pointer"]}>
              <div class="block py-4 pr-6">
                <span class="absolute right-0 -inset-y-px -left-3 group-hover:bg-[#F0F5F9] sm:rounded-l-xl" />
                <span class={["relative", i == 0 && "font-semibold text-zinc-900"]}>
                  <%= render_slot(col, @row_item.(row)) %>
                </span>
              </div>
            </td>
            <td :if={@action != []} class="relative p-0 w-14">
              <div class="block py-4 pl-6">
                <div class="flex justify-end">
                  <span class="absolute left-0 -inset-y-px -right-3 group-hover:bg-[#F0F5F9] sm:rounded-r-xl" />
                  <span :for={action <- @action} class="relative text-sm font-medium font-semibold text-right text-zinc-900 hover:text-zinc-700 whitespace-nowrap">
                    <%= render_slot(action, @row_item.(row)) %>
                  </span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    """
  end

  @doc """
  Renders a data list.

  ## Examples

      <.list>
        <:item title="Title"><%= @post.title %></:item>
        <:item title="Views"><%= @post.views %></:item>
      </.list>
  """
  slot :item, required: true do
    attr :title, :string, required: true
  end

  def list(assigns) do
    ~H"""
    <div class="mt-14">
      <dl class="-my-4 divide-y divide-zinc-100">
        <div :for={item <- @item} class="flex gap-4 py-4 text-sm leading-6 sm:gap-8">
          <dt class="flex-none w-1/4 text-zinc-500"><%= item.title %></dt>
          <dd class="text-zinc-700"><%= render_slot(item) %></dd>
        </div>
      </dl>
    </div>
    """
  end

  @doc """
  Renders a back navigation link.

  ## Examples

      <.back navigate={~p"/posts"}>Back to posts</.back>
  """
  attr :navigate, :any, required: true
  slot :inner_block, required: true

  def back(assigns) do
    ~H"""
    <div class="mt-16">
      <.link navigate={@navigate} class="text-sm font-semibold leading-6 text-zinc-900 hover:text-zinc-700">
        <.icon name="hero-arrow-left-solid" class="w-3 h-3" />
        <%= render_slot(@inner_block) %>
      </.link>
    </div>
    """
  end

  @doc """
  Renders a rounded white panel that is pinned to the bottom of the screen and scrolls.

  """
  slot :inner_block, required: true
  attr :class, :string, default: ""

  def main_content(assigns) do
    ~H"""
    <div class={"#{@class} px-4 py-2 mt-6 bg-white col-span-full rounded-[1.1rem]"}>
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
        <label for="sort_sort_by" class="text-sm font-medium text-gray-900">Sort by</label>
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
    <div :if={@table.page_count > 1} class="flex flex-row justify-center space-x-6 pt-8 text-xl font-semibold pt-10 pb-10">
      <.link
        :if={@table.current_page > 1}
        patch={Table.prev_path(@socket, @page)}
        class="border-b-4 border-transparent hover:text-blue-600 hover:border-blue-600 active:text-blue-700 focus:outline-none focus:duration-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:rounded focus-visible:duration-300 transition-link duration-300 only-large"
      >
        <.icon name="hero-arrow-long-left-solid" class="mr-2" /> prev
      </.link>
      <span :if={@table.current_page == 1} class="font-heading font-semibold text-gray-400 cursor-default">
        <.icon name="hero-arrow-long-left-solid" class="mr-2" /> prev
      </span>

      <%= for page <- Beacon.LiveAdmin.PageBuilder.Table.nav_pages(@table.current_page, @table.page_count, @limit) do %>
        <span :if={is_integer(page)}>
          <.link
            patch={Table.goto_path(@socket, @page, page)}
            class={
              if @table.current_page == page,
                do:
                  "px-3 pb-0.5 pt-1.5 border-b-4 border-transparent hover:text-blue-600 hover:border-blue-600 active:text-blue-700 focus:outline-none focus:duration-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:rounded focus-visible:duration-300 transition-link duration-300 only-large text-blue-700 border-blue-700",
                else:
                  "px-3 pb-0.5 pt-1.5 border-b-4 border-transparent hover:text-blue-600 hover:border-blue-600 active:text-blue-700 focus:outline-none focus:duration-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:rounded focus-visible:duration-300 transition-link duration-300 only-large"
            }
          >
            <%= page %>
          </.link>
        </span>
        <span :if={page == :sep}>
          ...
        </span>
      <% end %>

      <.link
        :if={@table.current_page < @table.page_count}
        patch={Table.next_path(@socket, @page)}
        class="border-b-4 border-transparent hover:text-blue-600 hover:border-blue-600 active:text-blue-800 focus:outline-none focus:duration-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:rounded focus-visible:duration-300 transition-link duration-300 only-large"
      >
        next <.icon name="hero-arrow-long-right-solid" class="mr-2" />
      </.link>
      <span :if={@table.current_page == @table.page_count} class="font-heading font-semibold text-gray-400 cursor-default">
        next <.icon name="hero-arrow-long-right-solid" class="mr-2" />
      </span>
    </div>
    """
  end

  @doc """
  Renders a select input with the available sites to select.

  ## Examples

      <.site_selector selected_site="dev" options={[:dev, :dy]} />
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
