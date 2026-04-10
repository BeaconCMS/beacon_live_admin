defmodule Beacon.LiveAdmin.RuntimeCSS do
  @moduledoc false

  import Beacon.LiveAdmin.Cluster, only: [call: 4]

  def css_config(site) when is_atom(site) do
    call(site, Beacon.RuntimeCSS, :config, [site])
  end
end
