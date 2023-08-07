defmodule Beacon.LiveAdmin.PageEditorLive.Edit do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Content

  @impl true
  def menu_link("/pages", :edit), do: {:submenu, "Pages"}
  def menu_link(_, _), do: :skip

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign(socket, page: nil)}
  end

  @impl true
  def handle_params(%{"id" => id}, _url, socket) do
    page = Content.get_page(socket.assigns.beacon_page.site, id)
    {:noreply, assign(socket, page_title: "Edit Page", page: page)}
  end

  @impl true
  def handle_event("template_editor_lost_focus", %{"value" => value}, socket) do
    send_update(Beacon.LiveAdmin.PageEditorLive.FormComponent,
      id: "page-editor-form-edit",
      changed_template: value
    )

    {:noreply, socket}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.live_component
      module={Beacon.LiveAdmin.PageEditorLive.FormComponent}
      id="page-editor-form-edit"
      site={@beacon_page.site}
      page_title={@page_title}
      live_action={@live_action}
      page={@page}
      patch="/pages"
    />
    """
  end

  def template_error(field) do
    {message, compilation_error} =
      case field.errors do
        [{message, [compilation_error: compilation_error]} | _] -> {message, compilation_error}
        [{message, _}] -> {message, nil}
        _ -> {nil, nil}
      end

    assigns = %{
      message: message,
      compilation_error: compilation_error
    }

    ~H"""
    <.error :if={@message}><%= @message %></.error>
    <code :if={@compilation_error} class="mt-3 text-sm text-rose-600 phx-no-feedback:hidden">
      <pre><%= @compilation_error %></pre>
    </code>
    """
  end
end
