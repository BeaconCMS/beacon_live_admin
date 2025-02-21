# TODO: Upgrade to latest when we require LiveView ~> 1.0
# Locked in to https://github.com/DockYard/station-ui/tree/fd45707002b972f93518063f53fc268d8d98cdfb

defmodule Beacon.LiveAdmin.StationUI.HTML do
  @moduledoc false
  defmacro __using__(_) do
    quote do
      import Beacon.LiveAdmin.StationUI.HTML.{
        Avatar,
        Banner,
        Button,
        Accordion,
        Card,
        Footer,
        Form,
        Icon,
        NotificationBadge,
        Input,
        Modal,
        Navbar,
        Pagination,
        Spinner,
        StatusBadge,
        TabGroup,
        Tag,
        Toast,
        Toolbar,
        Tooltip,
        TableHeader,
        TableCell
      }
    end
  end
end
