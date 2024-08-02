defmodule Beacon.LiveAdmin.MediaLibraryLive.UploadFormComponent do
  @moduledoc false

  use Beacon.LiveAdmin.Web, :live_component
  alias Beacon.LiveAdmin.Config
  alias Beacon.LiveAdmin.MediaLibrary

  @impl true
  def update(assigns, socket) do
    socket =
      socket
      |> assign(assigns)
      |> assign(:uploaded_assets, [])
      |> allow_upload(:asset,
        auto_upload: true,
        progress: &handle_progres/3,
        accept: Config.allowed_media_accept_types(assigns.site),
        max_entries: 1
      )

    {:ok, socket}
  end

  @impl true
  def handle_event("validate", _params, socket) do
    {:noreply, socket}
  end

  defp handle_progres(:asset, entry, socket) do
    if entry.done? do
      uploaded_assets =
        consume_uploaded_entries(socket, :asset, fn %{path: path}, _entry ->
          upload_metadata =
            MediaLibrary.new_upload_metadata(
              socket.assigns.site,
              path,
              name: entry.client_name,
              media_type: entry.client_type,
              size: entry.client_size
            )

          asset = MediaLibrary.upload(socket.assigns.site, upload_metadata)

          {:ok, asset}
        end)

      {:noreply, update(socket, :uploaded_assets, &(&1 ++ uploaded_assets))}
    else
      {:noreply, socket}
    end
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div>
      <.header>Upload</.header>

      <section phx-drop-target={@uploads.asset.ref}>
        <%= for entry <- @uploads.asset.entries do %>
          <article class="upload-entry">
            <progress value={entry.progress} max="100"><%= entry.progress %>%</progress>
          </article>
        <% end %>
      </section>

      <.form for={%{"site" => @site}} as={:assets} id="asset-form" phx-target={@myself} phx-change="validate" phx-submit="save">
        <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10" phx-drop-target={@uploads.asset.ref}>
          <.live_file_input upload={@uploads.asset} tabindex="0" />
        </div>
        <%= for entry <- @uploads.asset.entries do %>
          <%= for err <- upload_errors(@uploads.asset, entry) do %>
            <p class="text-red-600">
              <%= entry.client_name %>
              <%= Phoenix.Naming.humanize(err) %>
            </p>
          <% end %>
          <.button phx-click="cancel-upload" phx-value-ref={entry.ref}>Cancel</.button>
        <% end %>
      </.form>

      <div :if={@uploaded_assets != []}>
        <h3>Successfully uploaded</h3>
        <%= for asset <- @uploaded_assets do %>
          <img :if={MediaLibrary.is_image?(@site, asset)} src={MediaLibrary.url_for(@site, asset)} class="mb-8" />
          <p class="text-green-600"><%= asset.file_name %></p>
        <% end %>
      </div>
    </div>
    """
  end
end
