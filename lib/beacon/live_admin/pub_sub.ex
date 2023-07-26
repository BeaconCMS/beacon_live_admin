defmodule Beacon.LiveAdmin.PubSub do
  @pubsub __MODULE__

  defp topic, do: "beacon:live_admin:cluster"

  def subscribe, do: Phoenix.PubSub.subscribe(@pubsub, topic())

  def notify_sites_changed(source) do
    local_broadcast(topic(), {source, :sites_changed})
  end

  defp local_broadcast(topic, message) when is_binary(topic) do
    Phoenix.PubSub.local_broadcast(@pubsub, topic, message)
  end
end
