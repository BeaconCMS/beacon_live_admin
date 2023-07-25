defmodule Beacon.LiveAdmin.AdminComponents do
  use Beacon.LiveAdmin.Web, :live_component

  @menu_link_active_class "inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active"
  @menu_link_regular_class "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300"

  attr :socket, :map
  attr :site, :atom
  attr :current_action, :atom
  attr :layout_id, :string

  def layout_menu(assigns) do
    assigns = assign(assigns, active_class: @menu_link_active_class, regular_class: @menu_link_regular_class)

    ~H"""
    <div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 mb-10">
      <ul class="flex flex-wrap -mb-px">
        <%= layout_menu_items(assigns) %>
      </ul>
    </div>
    """
  end

  defp layout_menu_items(%{current_action: :new} = assigns) do
    ~H"""
    <li class="mr-2"><.link patch={beacon_live_admin_path(@socket, @site, "/layouts/#{@layout_id}")} class={@active_class}>Layout</.link></li>
    """
  end

  defp layout_menu_items(assigns) do
    ~H"""
    <li class="mr-2">
      <.link patch={beacon_live_admin_path(@socket, @site, "/layouts/#{@layout_id}")} class={if(@current_action == :edit, do: @active_class, else: @regular_class)}>Layout</.link>
    </li>
    <li class="mr-2">
      <.link patch={beacon_live_admin_path(@socket, @site, "/layouts/#{@layout_id}/meta_tags")} class={if(@current_action == :meta_tags, do: @active_class, else: @regular_class)}>Meta Tags</.link>
    </li>
    <li class="mr-2">
      <.link patch={beacon_live_admin_path(@socket, @site, "/layouts/#{@layout_id}/history")} class={if(@current_action == :history, do: @active_class, else: @regular_class)}>History</.link>
    </li>
    """
  end

  attr :socket, :map
  attr :site, :atom
  attr :current_action, :atom
  attr :page_id, :string

  def page_menu(assigns) do
    assigns = assign(assigns, active_class: @menu_link_active_class, regular_class: @menu_link_regular_class)

    ~H"""
    <div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 mb-10">
      <ul class="flex flex-wrap -mb-px">
        <%= page_menu_items(assigns) %>
      </ul>
    </div>
    """
  end

  defp page_menu_items(%{current_action: :new} = assigns) do
    ~H"""
    <li class="mr-2"><.link patch={beacon_live_admin_path(@socket, @site, "/pages/#{@page_id}")} class={@active_class}>Page</.link></li>
    """
  end

  defp page_menu_items(assigns) do
    ~H"""
    <li class="mr-2">
      <.link patch={beacon_live_admin_path(@socket, @site, "/pages/#{@page_id}")} class={if(@current_action == :edit, do: @active_class, else: @regular_class)}>Page</.link>
    </li>
    <li class="mr-2">
      <.link patch={beacon_live_admin_path(@socket, @site, "/pages/#{@page_id}/meta_tags")} class={if(@current_action == :meta_tags, do: @active_class, else: @regular_class)}>Meta Tags</.link>
    </li>
    <li class="mr-2">
      <.link patch={beacon_live_admin_path(@socket, @site, "/pages/#{@page_id}/schema")} class={if(@current_action == :schema, do: @active_class, else: @regular_class)}>Schema</.link>
    </li>
    <li class="mr-2">
      <.link patch={beacon_live_admin_path(@socket, @site, "/pages/#{@page_id}/history")} class={if(@current_action == :history, do: @active_class, else: @regular_class)}>History</.link>
    </li>
    """
  end
end
