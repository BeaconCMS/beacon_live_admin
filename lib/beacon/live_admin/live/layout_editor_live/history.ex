defmodule Beacon.LiveAdmin.LayoutEditorLive.History do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Content

  @impl true
  def menu_link(_), do: :skip

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign(socket, events: [])}
  end

  @impl true
  def handle_params(%{"id" => id}, _url, socket) do
    events = Content.list_layout_events(socket.assigns.beacon_page.site, id)
    {:noreply, assign(socket, events: events, layout_id: id)}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div>
      <Beacon.LiveAdmin.AdminComponents.layout_menu socket={@socket} site={@beacon_page.site} current_action={@live_action} layout_id={@layout_id} />

      <ol class="relative border-l border-gray-200">
        <li :for={{event, idx} <- Enum.with_index(@events)} class="mb-10 ml-6">
          <span class="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
            <.icon :if={event.event == :published} name="hero-eye-solid" class="h-4 w-4 text-blue-800" />
            <.icon :if={event.event == :created} name="hero-document-plus-solid" class="h-4 w-4 text-blue-800" />
          </span>
          <h3 class="flex items-center mb-1 text-lg font-semibold text-gray-900">
            <%= Phoenix.Naming.humanize(event.event) %> <span class="text-sm text-gray-500 ml-2"><%= format_datetime(event.inserted_at) %></span>
            <span :if={idx == 0} class="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-3">Latest</span>
          </h3>

          <ol :if={event.snapshot}>
            <li>
              <h4 class="text-gray-600">Title</h4>
              <%= event.snapshot.layout.title %>
            </li>
            <li class="mt-4">
              <h4 class="text-gray-600">Body</h4>
              <div class="w-full mt-2">
                <div class="py-3 bg-[#282c34] rounded-lg">
                  <LiveMonacoEditor.code_editor
                    path={event.snapshot.id}
                    style="min-height: 200px; width: 100%;"
                    value={event.snapshot.layout.body}
                    opts={Map.merge(LiveMonacoEditor.default_opts(), %{"language" => "html", "readOnly" => "true"})}
                  />
                </div>
              </div>
            </li>
            <li class="mt-4">
              <h4 class="text-gray-600">Meta Tags</h4>
              <%= format_meta_tags(event.snapshot.layout.meta_tags) %>
            </li>
          </ol>
        </li>
      </ol>
    </div>
    """
  end

  defp format_datetime(datetime) do
    Calendar.strftime(datetime, "%B %d, %Y")
  end

  defp format_meta_tags(meta_tags) do
    # TODO: custom attributes
    meta_tags =
      Enum.map(meta_tags, fn meta_tag ->
        %{name: meta_tag["name"], property: meta_tag["property"], content: meta_tag["content"]}
      end)

    assigns = %{meta_tags: meta_tags}

    ~H"""
    <.table id="meta_tags" rows={@meta_tags}>
      <:col :let={meta_tag} label="name">
        <%= meta_tag.name %>
      </:col>

      <:col :let={meta_tag} label="property">
        <%= meta_tag.property %>
      </:col>

      <:col :let={meta_tag} label="content">
        <%= meta_tag.content %>
      </:col>
    </.table>
    """
  end
end
