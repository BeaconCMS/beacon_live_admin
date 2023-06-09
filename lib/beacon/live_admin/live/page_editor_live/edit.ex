defmodule Beacon.LiveAdmin.PageEditorLive.Edit do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder

  @impl true
  def menu_link(_), do: :skip

  @impl true
  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.header>
      EDIT
    </.header>
    """
  end
end
