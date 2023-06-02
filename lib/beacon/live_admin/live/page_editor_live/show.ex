defmodule Beacon.LiveAdmin.PageEditorLive.Show do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder

  @impl true
  def menu_link(_), do: :skip

  @impl true
  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_params(%{"id" => id}, _, socket) do
    record = %{
      id: id,
      title: "Title",
      description: "Description"
    }

    {:noreply,
     socket
     |> assign(:page_title, page_title(socket.assigns.live_action))
     |> assign(:record, record)}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.header>
      Page <%= @record.id %>
      <:subtitle>This is a page record from your database.</:subtitle>
      <:actions>
        <.link patch={"/pages/{@page}/show/edit"} phx-click={JS.push_focus()}>
          <.button>Edit page</.button>
        </.link>
      </:actions>
    </.header>

    <.list>
      <:item title="Title"><%= @record.title %></:item>
      <:item title="Description"><%= @record.description %></:item>
    </.list>
    """
  end

  defp page_title(:show), do: "Show Page"
  defp page_title(:edit), do: "Edit Page"
end
