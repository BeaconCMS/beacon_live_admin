defmodule Beacon.LiveAdmin.PageEditorLive.MetaTags do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Content
  alias Beacon.LiveAdmin.MetaTagsComponent

  @impl true
  def menu_link("/pages", :meta_tags), do: {:submenu, "Pages"}
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(%{"id" => id}, _url, socket) do
    site = socket.assigns.beacon_page.site
    page = Content.get_page(site, id)
    changeset = Content.change_page(site, page)

    {:noreply,
     socket
     |> assign(:page, page)
     |> assign(page_title: "Meta Tags")
     |> assign_field(changeset)}
  end

  @impl true
  def handle_info({MetaTagsComponent, {:save, %{"page" => params}}}, socket) do
    meta_tags = MetaTagsComponent.coerce_meta_tag_params(params)
    save(socket.assigns.page, meta_tags, socket)
  end

  def handle_info({MetaTagsComponent, {:save, _}}, socket) do
    save(socket.assigns.page, %{"meta_tags" => []}, socket)
  end

  def save(page, meta_tags, socket) do
    case Content.update_page(page.site, page, meta_tags) do
      {:ok, page} ->
        changeset = Content.change_page(page.site, page)

        {:noreply,
         socket
         |> assign(:page, page)
         |> assign_field(changeset)
         |> put_flash(:info, "Page updated successfully")}

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
      <Beacon.LiveAdmin.AdminComponents.page_header socket={@socket} flash={@flash} page={@page} live_action={@live_action} />
      <.live_component module={MetaTagsComponent} id="page-meta-tags" page_title={@page_title} site={@page.site} live_action={@live_action} field={@field} meta_tags={@page.meta_tags} />
    </div>
    """
  end
end
