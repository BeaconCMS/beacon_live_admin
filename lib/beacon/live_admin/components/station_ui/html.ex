defmodule Beacon.LiveAdmin.StationUI.HTML do
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
