defmodule Beacon.LiveAdmin.LiveDataEditorLive.Index do
  @moduledoc false
  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Content

  on_mount {Beacon.LiveAdmin.Hooks.Authorized, {:live_data, :index}}

  def menu_link(_, :index), do: {:root, "Live Data"}
  def menu_link(_, :new), do: {:root, "Live Data"}
  def menu_link(_, :edit), do: {:root, "Live Data"}

  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  def handle_params(%{"query" => query}, _uri, socket) do
    %{beacon_page: %{site: site}} = socket.assigns
    live_data_paths = Content.live_data_paths_for_site(site, query: query)

    {:noreply, assign(socket, live_data_paths: live_data_paths)}
  end

  def handle_params(params, _uri, socket) do
    %{beacon_page: %{site: site}, live_action: live_action} = socket.assigns

    socket =
      socket
      |> assign(live_data_paths: Content.live_data_paths_for_site(site))
      |> assign(show_new_path_modal: live_action == :new)
      |> assign(show_edit_path_modal: live_action == :edit)
      |> assign(show_delete_path_modal: live_action == :delete)
      |> assign_edit_path_form(params["path"])
      |> assign_selected(params["path"])

    {:noreply, socket}
  end

  def handle_event("search", %{"search" => %{"query" => query}}, socket) do
    %{beacon_page: %{site: site}} = socket.assigns
    path = beacon_live_admin_path(socket, site, "/live_data?query=#{query}")

    {:noreply, push_patch(socket, to: path)}
  end

  def handle_event("submit_path", %{"path" => path}, socket) do
    %{beacon_page: %{site: site}} = socket.assigns

    socket =
      case Content.create_live_data(site, %{path: path, site: site}) do
        {:ok, live_data} ->
          socket
          |> assign(live_data_paths: Content.live_data_paths_for_site(site))
          |> push_navigate(
            to:
              beacon_live_admin_path(socket, site, "/live_data/#{sanitize_path(live_data.path)}")
          )

        {:error, _changeset} ->
          socket
      end

    {:noreply, socket}
  end

  def handle_event("edit_path", params, socket) do
    %{beacon_page: %{site: site}, selected: selected} = socket.assigns
    %{"live_data" => %{"path" => path}} = params

    # TODO: remove this after https://github.com/BeaconCMS/beacon/issues/395 is resolved
    path = String.trim_leading(path, "/")

    {:ok, _live_data} = Content.update_live_data_path(site, selected, path)

    path = beacon_live_admin_path(socket, socket.assigns.beacon_page.site, "/live_data")
    {:noreply, push_navigate(socket, to: path, replace: true)}
  end

  def handle_event("delete_path", _params, socket) do
    %{beacon_page: %{site: site}, selected: selected} = socket.assigns

    {:ok, _live_data} = Content.delete_live_data(site, selected)

    path = beacon_live_admin_path(socket, socket.assigns.beacon_page.site, "/live_data")
    {:noreply, push_navigate(socket, to: path, replace: true)}
  end

  def handle_event("close_modal", _params, socket) do
    path = beacon_live_admin_path(socket, socket.assigns.beacon_page.site, "/live_data")
    {:noreply, push_navigate(socket, to: path, replace: true)}
  end

  defp assign_edit_path_form(socket, nil), do: assign(socket, edit_path_form: to_form(%{}))

  defp assign_edit_path_form(socket, path) do
    form =
      {%{}, %{path: :string}}
      |> Ecto.Changeset.cast(%{path: path}, [:path])
      |> Ecto.Changeset.validate_required([:path])
      |> to_form(as: :live_data)

    assign(socket, edit_path_form: form)
  end

  defp assign_selected(socket, nil), do: assign(socket, selected: nil)

  defp assign_selected(%{assigns: %{live_action: action}} = socket, _)
       when action in [:index, :new],
       do: assign(socket, selected: nil)

  defp assign_selected(socket, path) do
    %{beacon_page: %{site: site}} = socket.assigns
    assign(socket, selected: Content.get_live_data(site, path))
  end

  def render(assigns) do
    ~H"""
    <.header>
      <p id="header-page-title">Live Data</p>
      <:actions>
        <.link id="header-new-path-button" patch={beacon_live_admin_path(@socket, @beacon_page.site, "/live_data/new")}>
          <.button class="uppercase">New Path</.button>
        </.link>
      </:actions>
    </.header>

    <.simple_form :let={f} id="live-data-path-search" for={%{}} as={:search} phx-change="search">
      <.input field={f[:query]} type="search" autofocus={true} placeholder="Search by path (showing up to 20 results)" />
    </.simple_form>

    <.main_content class="h-[calc(100vh_-_210px)]">
      <.table id="live_data" rows={@live_data_paths} row_click={fn live_data_path -> JS.navigate(beacon_live_admin_path(@socket, @beacon_page.site, "/live_data/#{sanitize_path(live_data_path)}")) end}>
        <:col :let={live_data_path} label="Path"><%= live_data_path %></:col>
        <:action :let={live_data_path}>
          <div class="sr-only">
            <.link navigate={beacon_live_admin_path(@socket, @beacon_page.site, "/live_data/edit/#{sanitize_path(live_data_path)}")}>Edit</.link>
          </div>
          <.link
            patch={beacon_live_admin_path(@socket, @beacon_page.site, "/live_data/edit/#{sanitize_path(live_data_path)}")}
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
      <p class="text-2xl font-bold mb-12">New Path</p>
      <.form id="new-path-form" for={%{}} phx-submit="submit_path">
        <.input type="text" name="path" placeholder="project/:project_id/comments" value="" />
        <div class="flex mt-8 gap-x-[20px]">
          <.button type="submit">Create</.button>
          <.button type="button" phx-click={JS.push("close_modal")}>Cancel</.button>
        </div>
      </.form>
    </.modal>

    <.modal :if={@show_edit_path_modal} id="edit-path-modal" on_cancel={JS.push("close_modal")} show>
      <p class="text-2xl font-bold mb-12">Edit Path</p>
      <.form id="edit-path-form" for={@edit_path_form} phx-submit="edit_path">
        <.input field={@edit_path_form[:path]} type="text" />
        <div class="flex mt-8 gap-x-[20px]">
          <.button type="submit">Update</.button>
          <.button type="button" phx-click={JS.push("close_modal")}>Cancel</.button>
          <.button type="button" class="!bg-red-600" phx-click="delete_path">Delete</.button>
        </div>
      </.form>
    </.modal>
    """
  end

  defp sanitize_path(path) do
    URI.encode_www_form(path)
  end
end
