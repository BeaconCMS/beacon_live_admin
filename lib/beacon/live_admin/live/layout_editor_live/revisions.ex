defmodule Beacon.LiveAdmin.LayoutEditorLive.Revisions do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Content

  @impl true
  def menu_link("/layouts", :revisions), do: {:submenu, "Layouts"}
  def menu_link(_, _), do: :skip

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign(socket, events: [])}
  end

  @impl true
  def handle_params(%{"id" => id}, _url, socket) do
    events = Content.list_layout_events(socket.assigns.beacon_page.site, id)

    socket =
      socket
      |> assign(page_title: "Revisions")

    {:noreply, assign(socket, events: events, layout_id: id)}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div>
      <Beacon.LiveAdmin.AdminComponents.layout_header socket={@socket} flash={@flash} beacon_layout={@beacon_layout} live_action={@live_action} />
      <.header>
        <%= @page_title %>
      </.header>
      <.main_content class="h-auto">
        <ol class="relative mt-4 ml-4 border-l border-gray-200">
          <%= for event <- @events do %>
            <.revision event={event} />
          <% end %>
        </ol>
      </.main_content>
    </div>
    """
  end

  ## FUNCTION COMPONENTS

  attr :event, :map

  def revision(assigns) do
    ~H"""
    <li class="mb-10 ml-8 group">
      <div class="absolute flex items-center justify-center block w-10 h-10 bg-white rounded-full shadow-md -left-5 ">
        <div class="absolute flex items-center justify-center block w-6 h-6 bg-blue-100 rounded-full">
          <.icon :if={@event.event == :published} name="hero-eye-solid" class="w-4 h-4 text-blue-800" />
          <.icon :if={@event.event == :created} name="hero-document-plus-solid" class="w-4 h-4 text-blue-800" />
        </div>
      </div>

      <h3 class="flex items-center pt-2 mb-1 text-lg font-semibold text-gray-900">
        <%= Phoenix.Naming.humanize(@event.event) %> <span class="ml-2 text-sm text-gray-500"><%= format_datetime(@event.inserted_at) %></span>
        <span class="hidden group-first:block bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-3">Latest</span>
      </h3>

      <ol :if={@event.snapshot} class="space-y-4">
        <li>
          <h4 class="text-gray-600">Title</h4>
          <%= @event.snapshot.layout.title %>
        </li>
        <li>
          <h4 class="text-gray-600">Template</h4>
          <div class="w-full mt-2">
            <div class="py-6 rounded-[1.25rem] bg-[#0D1829] [&_.monaco-editor-background]:!bg-[#0D1829] [&_.margin]:!bg-[#0D1829]">
              <LiveMonacoEditor.code_editor
                path={@event.snapshot.id}
                class="col-span-full lg:col-span-2 max-h-60"
                value={template(@event.snapshot.layout)}
                opts={Map.merge(LiveMonacoEditor.default_opts(), %{"language" => "html", "readOnly" => "true"})}
              />
            </div>
          </div>
        </li>
        <li>
          <h4 class="text-gray-600">Meta Tags</h4>
          <.meta_tags_table layout={@event.snapshot.layout} />
        </li>
        <li>
          <h4 class="text-gray-600">Resource Links</h4>
          <.resource_links_table layout={@event.snapshot.layout} />
        </li>
      </ol>
    </li>
    """
  end

  attr :layout, :map

  def meta_tags_table(assigns) do
    meta_tags = assigns.layout.meta_tags

    attributes =
      meta_tags
      |> Enum.flat_map(&Map.keys/1)
      |> Enum.uniq()
      |> Enum.sort(fn a, b ->
        case {a, b} do
          {"name", _} -> true
          {_, "name"} -> false
          {"property", _} -> true
          {_, "property"} -> false
          {"content", _} -> true
          {_, "content"} -> false
          {a, b} -> a <= b
        end
      end)

    assigns = %{attributes: attributes, meta_tags: meta_tags}

    ~H"""
    <.table id="meta_tags" rows={@meta_tags}>
      <:col :let={meta_tag} :for={attr <- @attributes} label={attr}>
        <%= meta_tag[attr] %>
      </:col>
    </.table>
    """
  end

  attr :layout, :map

  def resource_links_table(assigns) do
    resource_links = resource_links(assigns.layout)

    attributes =
      resource_links
      |> Enum.flat_map(&Map.keys/1)
      |> Enum.uniq()
      |> Enum.sort(fn a, b ->
        case {a, b} do
          {"rel", _} -> true
          {_, "rel"} -> false
          {"href", _} -> true
          {_, "href"} -> false
          {a, b} -> a <= b
        end
      end)

    assigns = %{attributes: attributes, resource_links: resource_links}

    ~H"""
    <.table id="resource_links" rows={@resource_links}>
      <:col :let={resource_link} :for={attr <- @attributes} label={attr}>
        <%= resource_link[attr] %>
      </:col>
    </.table>
    """
  end

  ## UTILS

  defp format_datetime(datetime) do
    Calendar.strftime(datetime, "%B %d, %Y")
  end

  defp template(%{body: body}), do: body
  defp template(%{template: template}), do: template

  defp resource_links(%{resource_links: links}), do: links
  defp resource_links(_layout), do: []
end
