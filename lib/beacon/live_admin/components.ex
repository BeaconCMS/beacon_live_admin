defmodule Beacon.LiveAdmin.Components do
  use Phoenix.Component
  import Beacon.LiveAdmin.CoreComponents, only: [error: 1]
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

  @doc """
  Display an error message for template/body fields.
  """
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
