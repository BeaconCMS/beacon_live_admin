defmodule Beacon.LiveAdmin.RuntimeTailwind do
  import Beacon.LiveAdmin.Cluster, only: [call: 4]

  def config(site) when is_atom(site) do
    # I don't know how to do this automatically.
    # This would read the file each time, which is far from ideal.
    # Any way, read the PR description for an even better way
    # I don't have a solution for.
    call(site, Beacon.RuntimeTailwind, :load!, [])
    call(site, Beacon.RuntimeTailwind, :fetch, []) |> IO.inspect(label: "Tailwind Config")
  end
end
