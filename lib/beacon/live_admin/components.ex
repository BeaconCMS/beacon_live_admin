defmodule Beacon.LiveAdmin.Components do
  use Phoenix.Component
  import Beacon.LiveAdmin.Cluster, only: [call: 4]

  @doc false
  def render(assigns, fun) do
    {site, assigns} = Map.pop(assigns, :site)
    {env, assigns} = Map.pop(assigns, :env)
    env = {env.module, env.function, env.file, env.line}
    call(site, BeaconWeb.Components, :render, [fun, assigns, env])
  end

  attr :site, :atom, required: true
  attr :env, :any, required: true
  attr :class, :string, default: nil
  attr :sizes, :string, default: nil
  attr :rest, :global
  attr :sources, :list, default: [], doc: "a list of usage_tags"
  attr :asset, :map, required: true, doc: "a MediaLibrary.Asset struct"

  def image_set(assigns) do
    assigns = %{raw: render(assigns, &BeaconWeb.Components.image_set/1)}

    ~H"""
    <%= {:safe, @raw} %>
    """
  end
end
