defmodule Beacon.LiveAdmin.LiveDataEditorLive.Index do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Client.Content

  def menu_link(_, :index), do: {:root, "Live Data"}
  def menu_link(_, :new), do: {:root, "Live Data"}
  def menu_link(_, :edit), do: {:root, "Live Data"}

  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  def handle_params(%{"query" => query}, _uri, socket) do
    %{beacon_page: %{site: site}} = socket.assigns
    live_data_paths = Content.live_data_for_site(site, query: query)

    {:noreply, assign(socket, live_data_list: live_data_paths)}
  end

  def handle_params(params, _uri, socket) do
    %{beacon_page: %{site: site}, live_action: live_action} = socket.assigns

    socket =
      socket
      |> assign(live_data_list: Content.live_data_for_site(site))
      |> assign(show_new_path_modal: live_action == :new)
      |> assign(show_edit_path_modal: live_action == :edit)
      |> assign(show_delete_path_modal: live_action == :delete)
      |> assign_edit_path_form(params["live_data_id"])
      |> assign_selected(params["live_data_id"])

    {:noreply, socket}
  end

  def handle_event("search", %{"search" => %{"query" => query}}, socket) do
    %{beacon_page: %{site: site}} = socket.assigns
    path = beacon_live_admin_path(socket, site, "/live_data?query=#{query}")

    {:noreply, push_patch(socket, to: path)}
  end

  def handle_event("submit_path", %{"path" => path}, socket) do
    %{beacon_page: %{site: site}, __beacon_actor__: actor} = socket.assigns

    socket =
      case Content.create_live_data(site, actor, %{path: path, site: site}) do
        {:ok, live_data} ->
          socket
          |> assign(live_data_list: Content.live_data_for_site(site))
          |> push_navigate(to: beacon_live_admin_path(socket, site, "/live_data/#{live_data.id}/assigns"))

        {:error, _changeset} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_event("edit_path", params, socket) do
    %{beacon_page: %{site: site}, selected: selected, __beacon_actor__: actor} = socket.assigns
    %{"path" => path} = params

    {:ok, _live_data} = Content.update_live_data_path(site, actor, selected, path)

    path = beacon_live_admin_path(socket, socket.assigns.beacon_page.site, "/live_data")
    {:noreply, push_navigate(socket, to: path, replace: true)}
  end

  def handle_event("delete_path", _params, socket) do
    %{beacon_page: %{site: site}, selected: selected, __beacon_actor__: actor} = socket.assigns

    {:ok, _live_data} = Content.delete_live_data(site, actor, selected)

    path = beacon_live_admin_path(socket, socket.assigns.beacon_page.site, "/live_data")
    {:noreply, push_navigate(socket, to: path, replace: true)}
  end

  def handle_event("close_modal", _params, socket) do
    path = beacon_live_admin_path(socket, socket.assigns.beacon_page.site, "/live_data")
    {:noreply, push_navigate(socket, to: path, replace: true)}
  end

  defp assign_edit_path_form(socket, _id), do: assign(socket, edit_path_form: to_form(%{}))

  defp assign_selected(socket, nil = _id), do: assign(socket, selected: nil)

  defp assign_selected(%{assigns: %{live_action: action}} = socket, _id)
       when action in [:index, :new],
       do: assign(socket, selected: nil)

  defp assign_selected(socket, id) do
    %{beacon_page: %{site: site}} = socket.assigns
    assign(socket, selected: Content.get_live_data_by(site, id: id))
  end

  def render(assigns) do
    ~H"""
    <.header>
      <p id="header-page-title">Live Data</p>
      <:actions>
        <.link id="header-new-path-button" patch={beacon_live_admin_path(@socket, @beacon_page.site, "/live_data/new")}>
          <.button class="sui-primary uppercase">New Path</.button>
        </.link>
      </:actions>
    </.header>

    <.simple_form :let={f} id="live-data-path-search" for={%{}} as={:search} phx-change="search">
      <.input field={f[:query]} type="search" autofocus={true} placeholder="Search by path (showing up to 20 results)" />
    </.simple_form>

    <.main_content>
      <.table id="live_data" rows={@live_data_list} row_click={&JS.navigate(beacon_live_admin_path(@socket, @beacon_page.site, "/live_data/#{&1.id}/assigns"))} row_id={&"live-data-table-row-#{&1.id}"}>
        <:col :let={live_data} label="Path"><%= live_data.path %></:col>
        <:action :let={live_data}>
          <div class="sr-only">
            <.link id={"edit-live-data-" <> live_data.id} navigate={beacon_live_admin_path(@socket, @beacon_page.site, "/live_data/#{live_data.id}")} title="Edit live data">
              Edit
            </.link>
          </div>
          <.link
            patch={beacon_live_admin_path(@socket, @beacon_page.site, "/live_data/#{live_data.id}")}
            title="Edit live data"
            aria-label="Edit live data"
            class="flex items-center justify-center w-10 h-10 group"
          >
            <.icon name="hero-pencil-square text-[#61758A] hover:text-[#304254]" />
          </.link>
        </:action>
      </.table>
    </.main_content>

    <.modal :if={@show_new_path_modal} id="new-path-modal" on_cancel={JS.push("close_modal")} show>
      <:title>New Path</:title>
      <.form id="new-path-form" for={%{}} phx-submit="submit_path" class="px-4 pt-4">
        <.input type="text" name="path" placeholder="/project/:project_id/comments" value="" />
        <div class="flex mt-8 gap-x-[20px]">
          <.button type="submit">Create</.button>
          <.button type="button" phx-click={JS.push("close_modal")} class="sui-secondary">Cancel</.button>
        </div>
      </.form>
    </.modal>

    <.modal :if={@show_edit_path_modal} id="edit-path-modal" on_cancel={JS.push("close_modal")} show>
      <:title>Edit Path</:title>
      <.form id="edit-path-form" for={@edit_path_form} phx-submit="edit_path" class="px-4 pt-4">
        <.input field={@edit_path_form[:path]} type="text" />
        <div class="flex mt-8 gap-x-[20px]">
          <.button type="submit">Update</.button>
          <.button type="button" phx-click={JS.push("close_modal")} class="sui-secondary">Cancel</.button>
          <.button type="button" phx-click="delete_path" class="sui-primary-destructive">Delete</.button>
        </div>
      </.form>
    </.modal>
    """
  end
end
