defmodule Beacon.LiveAdmin.LayoutEditorLive.MetaTags do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Client.Content
  alias Beacon.LiveAdmin.MetaTagsComponent

  @impl true
  def menu_link("/layouts", :meta_tags), do: {:submenu, "Layouts"}
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(%{"id" => id}, _url, socket) do
    site = socket.assigns.beacon_page.site
    layout = Content.get_layout(site, id)
    changeset = Content.change_layout(site, layout)

    {:noreply,
     socket
     |> assign(:beacon_layout, layout)
     |> assign(page_title: "Meta Tags")
     |> assign_field(changeset)}
  end

  @impl true
  def handle_info({MetaTagsComponent, {:save, %{"layout" => params}}}, socket) do
    meta_tags = MetaTagsComponent.coerce_meta_tag_params(params)
    save(socket.assigns.beacon_layout, meta_tags, socket)
  end

  def handle_info({MetaTagsComponent, {:save, _}}, socket) do
    save(socket.assigns.beacon_layout, %{"meta_tags" => []}, socket)
  end

  def save(layout, meta_tags, socket) do
    %{__beacon_actor__: actor} = socket.assigns

    case Content.update_layout(layout.site, actor, layout, meta_tags) do
      {:ok, layout} ->
        changeset = Content.change_layout(layout.site, layout)

        {:noreply,
         socket
         |> assign(:beacon_layout, layout)
         |> assign_field(changeset)
         |> put_flash(:info, "Layout updated successfully")}

      {:error, :not_authorized} ->
        {:noreply, put_flash(socket, :error, "Not authorized to update Layout")}

      {:error, changeset} ->
        {:noreply, assign_field(socket, changeset)}
    end
  end

  defp assign_field(socket, changeset) do
    field = to_form(changeset)[:meta_tags]
    assign(socket, :field, field)
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div>
      <Beacon.LiveAdmin.AdminComponents.layout_header socket={@socket} flash={@flash} beacon_layout={@beacon_layout} live_action={@live_action} />
      <.live_component module={MetaTagsComponent} id="layout-meta-tags" site={@beacon_layout.site} page_title={@page_title} live_action={@live_action} field={@field} meta_tags={@beacon_layout.meta_tags} />
    </div>
    """
  end
end
