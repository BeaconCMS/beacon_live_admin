defmodule Beacon.LiveAdmin.PageEditorLive.Revisions do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Content

  @impl true
  def menu_link("/pages", :revisions), do: {:submenu, "Pages"}
  def menu_link(_, _), do: :skip

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign(socket, events: [])}
  end

  @impl true
  def handle_params(%{"id" => id}, _url, socket) do
    events = Content.list_page_events(socket.assigns.beacon_page.site, id)
    {:noreply, assign(socket, events: events, page_id: id)}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div>
      <Beacon.LiveAdmin.AdminComponents.page_menu socket={@socket} site={@beacon_page.site} current_action={@live_action} page_id={@page_id} />

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

          <ol :if={event.snapshot} class="space-y-3">
            <li>
              <h4 class="text-gray-600 text-bold">Path</h4>
              <%= event.snapshot.page.path %>
            </li>
            <li>
              <h4 class="text-gray-600">Title</h4>
              <%= event.snapshot.page.title %>
            </li>
            <li>
              <h4 class="text-gray-600">Description</h4>
              <%= event.snapshot.page.description %>
            </li>
            <li>
              <h4 class="text-gray-600">Format</h4>
              <%= event.snapshot.page.format %>
            </li>
            <li>
              <h4 class="text-gray-600">Body</h4>
              <div class="w-full mt-2">
                <div class="py-3 bg-[#282c34] rounded-lg">
                  <LiveMonacoEditor.code_editor
                    path={event.snapshot.id}
                    style="min-height: 200px; width: 100%;"
                    value={event.snapshot.page.template}
                    opts={Map.merge(LiveMonacoEditor.default_opts(), %{"language" => "html", "readOnly" => "true"})}
                  />
                </div>
              </div>
            </li>
            <li>
              <h4 class="text-gray-600">Meta Tags</h4>
              <%= render_meta_tags(event.snapshot.page.meta_tags) %>
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
end
