defmodule Beacon.LiveAdmin.HomeLive do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder

  @impl true
  def menu_link(_live_action) do
    {:ok, "Home"}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div>Home</div>
    <pre><code><%= inspect(@live_action, pretty: true) %></code></pre>
    <pre><code><%= inspect(Phoenix.Router.routes(DemoWeb.Router), pretty: true) %></code></pre>
    """
  end
end
