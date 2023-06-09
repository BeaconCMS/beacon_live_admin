defmodule Beacon.LiveAdmin.PageEditorLive.New do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder

  @impl true
  def menu_link(_), do: :skip

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign(socket, page_title: "Create New Page", page: %Beacon.Pages.Page{})}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.live_component
      module={Beacon.LiveAdmin.PageEditorLive.FormComponent}
      id={:new}
      site={@beacon_page.site}
      title={@page_title}
      action={@live_action}
      page={@page}
      patch={"/pages"}
    />
    """
  end
end
