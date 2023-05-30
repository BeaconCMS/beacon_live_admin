defmodule Beacon.LiveAdmin.PageEditorPage do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder

  @impl true
  def menu_link(_session) do
    {:ok, "Pages"}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div>PageEditor</div>
    <pre><code><%= inspect(@live_action, pretty: true) %></code></pre>
    """
  end
end
