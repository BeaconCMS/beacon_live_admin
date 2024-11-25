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
