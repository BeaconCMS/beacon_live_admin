defmodule Beacon.LiveAdmin.AdminComponents do
  use Beacon.LiveAdmin.Web, :live_component

  attr :socket, :map
  attr :site, :atom
  attr :current_action, :atom
  attr :layout_id, :string

  def layout_menu(assigns) do
    assigns =
      assigns
      |> assign(
        :active_class,
        "inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active"
      )
      |> assign(
        :regular_class,
        "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300"
      )

    ~H"""
    <div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 mb-10">
      <ul class="flex flex-wrap -mb-px">
        <li class="mr-2">
          <.link patch={beacon_live_admin_path(@socket, @site, "/layouts/#{@layout_id}")} class={if(@current_action == :edit, do: @active_class, else: @regular_class)}>
            Edit Layout
          </.link>
        </li>
        <li class="mr-2">
          <.link patch={beacon_live_admin_path(@socket, @site, "/layouts/#{@layout_id}/meta_tags")} class={if(@current_action == :meta_tags, do: @active_class, else: @regular_class)}>
            Meta Tags
          </.link>
        </li>
        <li class="mr-2">
          <.link patch={beacon_live_admin_path(@socket, @site, "/layouts/#{@layout_id}/history")} class={if(@current_action == :history, do: @active_class, else: @regular_class)}>
            History
          </.link>
        </li>
      </ul>
    </div>
    """
  end
end
