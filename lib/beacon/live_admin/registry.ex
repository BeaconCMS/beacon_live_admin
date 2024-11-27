defmodule Beacon.LiveAdmin.Registry do
  @moduledoc false

  def child_spec(_arg) do
    Registry.child_spec(keys: :unique, name: __MODULE__)
  end

  def via(key), do: {:via, Registry, {__MODULE__, key}}

  def via(key, value), do: {:via, Registry, {__MODULE__, key, value}}

  def lookup(key) do
    __MODULE__
    |> Registry.lookup(key)
    |> List.first()
  end
end
