defmodule Beacon.LiveAdmin.PageEditorLive.Revisions do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Content

  @impl true
  def menu_link("/pages", :revisions), do: {:submenu, "Pages"}
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(%{"id" => id}, _url, socket) do
    socket =
      assign(socket,
        page_id: id,
        events: Content.list_page_events(socket.assigns.beacon_page.site, id),
        show_modal: false,
        modal_content: nil,
        modal_language: nil
      )
      |> assign(page_title: "Revisions")

    {:noreply, socket}
  end

  @impl true
  def handle_event("show_modal", params, socket) do
    %{snapshot: %{page: page}} = Enum.find(socket.assigns.events, &(&1.id == params["event_id"]))

    {content, language} =
      case params do
        %{"variant_id" => variant_id} ->
          variant = Enum.find(page.variants, &(&1.id == variant_id))
          {variant.template, language(page.format)}

        %{"event_handler_id" => event_handler_id} ->
          event_handler = Enum.find(page.event_handlers, &(&1.id == event_handler_id))
          {event_handler.code, "elixir"}
      end

    {:noreply, assign(socket, show_modal: true, modal_content: content, modal_language: language)}
  end

  def handle_event("hide_modal", _, socket) do
    {:noreply, assign(socket, show_modal: false, modal_content: nil, modal_language: nil)}
  end

  def handle_event("modal_editor_lost_focus", _, socket), do: {:noreply, socket}
  def handle_event(<<"template-", _::binary>>, _, socket), do: {:noreply, socket}
  def handle_event(<<"schema-", _::binary>>, _, socket), do: {:noreply, socket}

  @impl true
  def render(assigns) do
    ~H"""
    <div class="content">
      <Beacon.LiveAdmin.AdminComponents.page_header socket={@socket} flash={@flash} page={@page} live_action={@live_action} />

      <.header>
        <%= @page_title %>
      </.header>

      <.main_content class="h-auto">
        <ol class="relative mt-4 ml-4 border-l border-gray-200">
          <%= for event <- @events do %>
            <.revision event={event} />
          <% end %>
        </ol>

        <.modal :if={@show_modal} id="modal" on_cancel={JS.push("hide_modal")} show>
          <div class="w-full mt-2">
            <div class="py-6 rounded-[1.25rem] bg-[#0D1829] [&_.monaco-editor-background]:!bg-[#0D1829] [&_.margin]:!bg-[#0D1829]">
              <LiveMonacoEditor.code_editor
                path="modal"
                class="col-span-full lg:col-span-2"
                value={@modal_content}
                opts={Map.merge(LiveMonacoEditor.default_opts(), %{"language" => @modal_language, "readOnly" => "true"})}
              />
            </div>
          </div>
        </.modal>
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
          <h4 class="text-gray-600 text-bold">Path</h4>
          <%= @event.snapshot.page.path %>
        </li>
        <li>
          <h4 class="text-gray-600">Title</h4>
          <%= @event.snapshot.page.title %>
        </li>
        <li>
          <h4 class="text-gray-600">Description</h4>
          <%= @event.snapshot.page.description %>
        </li>
        <li>
          <h4 class="text-gray-600">Format</h4>
          <%= @event.snapshot.page.format %>
        </li>
        <li>
          <h4 class="text-gray-600">Template</h4>
          <div class="w-full mt-2">
            <div class="py-6 rounded-[1.25rem] bg-[#0D1829] [&_.monaco-editor-background]:!bg-[#0D1829] [&_.margin]:!bg-[#0D1829]">
              <LiveMonacoEditor.code_editor
                path={"template-" <> @event.snapshot.id}
                class="col-span-full lg:col-span-2 max-h-60"
                value={@event.snapshot.page.template}
                opts={Map.merge(LiveMonacoEditor.default_opts(), %{"language" => language(@event.snapshot.page.format), "readOnly" => "true"})}
              />
            </div>
          </div>
        </li>
        <li>
          <h4 class="text-gray-600">Schema</h4>
          <div class="w-full mt-2">
            <div class="py-6 rounded-[1.25rem] bg-[#0D1829] [&_.monaco-editor-background]:!bg-[#0D1829] [&_.margin]:!bg-[#0D1829]">
              <LiveMonacoEditor.code_editor
                path={"schema-" <> @event.snapshot.id}
                class="col-span-full lg:col-span-2 max-h-60"
                value={Jason.encode!(@event.snapshot.page.raw_schema, pretty: true)}
                opts={Map.merge(LiveMonacoEditor.default_opts(), %{"language" => "json", "readOnly" => "true"})}
              />
            </div>
          </div>
        </li>
        <li>
          <h4 class="text-gray-600">Meta Tags</h4>
          <%= render_meta_tags(@event.snapshot.page.meta_tags) %>
        </li>
        <li>
          <h4 class="text-gray-600">Variants</h4>
          <.variants_table variants={variants(@event.snapshot.page)} event_id={@event.id} />
        </li>
        <li>
          <h4 class="text-gray-600">Event Handlers</h4>
          <.event_handlers_table event_handlers={event_handlers(@event.snapshot.page)} event_id={@event.id} />
        </li>
      </ol>
    </li>
    """
  end

  attr :variants, :list
  attr :event_id, :string

  def variants_table(assigns) do
    ~H"""
    <.table :if={@variants != []} id="variants" rows={@variants}>
      <:col :let={variant} label="name">
        <%= variant.name %>
      </:col>
      <:col :let={variant} label="weight">
        <%= variant.weight %>
      </:col>
      <:col :let={variant} label="template">
        <.link class="text-blue-600 hover:underline" phx-click={JS.push("show_modal", value: %{event_id: @event_id, variant_id: variant.id})}>
          Click here
        </.link>
      </:col>
    </.table>
    """
  end

  attr :event_handlers, :list
  attr :event_id, :string

  def event_handlers_table(assigns) do
    ~H"""
    <.table :if={@event_handlers != []} id="event-handlers" rows={@event_handlers}>
      <:col :let={event_handler} label="name">
        <%= event_handler.name %>
      </:col>
      <:col :let={event_handler} label="code">
        <.link class="text-blue-600 hover:underline" phx-click={JS.push("show_modal", value: %{event_id: @event_id, event_handler_id: event_handler.id})}>
          Click here
        </.link>
      </:col>
    </.table>
    """
  end

  ## UTILS

  defp format_datetime(datetime) do
    Calendar.strftime(datetime, "%B %d, %Y")
  end

  defp render_meta_tags(meta_tags) do
    attributes =
      meta_tags
      |> Enum.flat_map(fn meta_tag -> Map.keys(meta_tag) end)
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

  defp variants(%{variants: variants}) when is_list(variants), do: variants
  defp variants(_page), do: []

  defp event_handlers(%{event_handlers: event_handlers}) when is_list(event_handlers),
    do: event_handlers

  defp event_handlers(_page), do: []

  defp language("heex"), do: "html"
  defp language(:heex), do: "html"
  defp language(format), do: to_string(format)
end
