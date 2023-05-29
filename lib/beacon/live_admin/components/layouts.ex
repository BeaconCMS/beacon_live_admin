defmodule Beacon.LiveAdmin.Layouts do
  use Beacon.LiveAdmin.Web, :html

  embed_templates "layouts/*"

  def render("admin.html", assigns), do: admin(assigns)
end
