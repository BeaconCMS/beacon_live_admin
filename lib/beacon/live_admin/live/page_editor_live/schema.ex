defmodule Beacon.LiveAdmin.PageEditorLive.Schema do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Content

  @impl true
  def menu_link("/layouts", :schema), do: {:submenu, "Layouts"}
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(%{"id" => id}, _url, socket) do
    site = socket.assigns.beacon_page.site
    page = Content.get_page(site, id)
    changeset = Content.change_page(site, page)

    {:noreply,
     socket
     |> assign(:page, page)
     |> assign_form(changeset)
     |> assign(:raw_schema, Jason.encode!(page.raw_schema, pretty: true))}
  end

  @impl true
  def handle_event("raw_schema_editor_lost_focus", %{"value" => value}, socket) do
    {:noreply, assign(socket, :raw_schema, value)}
  end

  @impl true
  def handle_event("save", _, socket) do
    page = socket.assigns.page
    attrs = %{"raw_schema" => socket.assigns.raw_schema}

    case Content.update_page(page.site, page, attrs) do
      {:ok, page} ->
        changeset = Content.change_page(page.site, page)
        {:noreply, assign_form(socket, changeset)}

      {:error, changeset} ->
        {:noreply, assign_form(socket, changeset)}
    end
  end

  defp assign_form(socket, changeset) do
    assign(socket, :form, to_form(changeset))
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div>
      <Beacon.LiveAdmin.AdminComponents.page_menu socket={@socket} site={@page.site} current_action={@live_action} page_id={@page.id} />

      <.header>
        <:actions>
          <.button phx-disable-with="Saving..." phx-click="save" class="uppercase">Save Changes</.button>
        </:actions>
      </.header>

      <div class="w-full mt-10 space-y-8">
        <div class="py-6 rounded-[1.25rem] bg-[#0D1829] [&_.monaco-editor-background]:!bg-[#0D1829] [&_.margin]:!bg-[#0D1829]">
          <LiveMonacoEditor.code_editor path="raw_schema" style="min-height: 350px; width: 100%;" value={@raw_schema} opts={Map.merge(LiveMonacoEditor.default_opts(), %{"language" => "json"})} />
        </div>
      </div>
      <.error :for={msg <- Enum.map(@form[:raw_schema].errors, &translate_error/1)}><%= msg %></.error>
    </div>
    """
  end
end
