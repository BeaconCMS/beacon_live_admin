defmodule Beacon.LiveAdmin.ConfigError do
  @moduledoc """
  Raised when some option in `Beacon.LiveAdmin.Config` is invalid.

  If you are seeing this error, check `application.ex` where your admin instance config is defined.
  Description and examples of each allowed configuration option can be found in `Beacon.LiveAdmin.Config.new/1`
  """

  defexception message: "error in Beacon.LiveAdmin.Config"
end

defmodule Beacon.LiveAdmin.ClusterError do
  @moduledoc """
  Raised when there is an error in calling a remove Beacon function through the cluster.

  If you're seeing this error, make sure the node running the site is connected to the cluster.
  """

  defexception message: "Error in cluster"
end

defmodule Beacon.LiveAdmin.PageNotFoundError do
  @moduledoc false
  defexception [:message, plug_status: 404]
end
