defmodule Beacon.LiveAdmin.LiveDataEditorLive.FormComponent do
  use Beacon.LiveAdmin.Web, :live_component

  alias Beacon.LiveAdmin.Content

  def update(%{site: site, live_data: live_data} = assigns, socket) do
    changeset = Content.change_live_data(site, live_data)

    socket =
      socket
      |> assign(assigns)
      |> assign(code: live_data.code)
      |> assign(changed_code: live_data.code)
      |> assign_form(changeset)

    {:ok, socket}
  end

  def update(%{changed_code: changed_code}, socket) do
    {:ok, assign(socket, changed_code: changed_code)}
  end

  defp assign_form(socket, changeset) do
    assign(socket, form: to_form(changeset))
  end

  def handle_event("save", %{"live_data" => live_data_params}, socket) do
    live_data_params = Map.put(live_data_params, "site", socket.assigns.site)
    save_live_data(socket, socket.assigns.live_action, live_data_params)
  end

  defp save_live_data(socket, :new, live_data_params) do
    case Content.create_live_data(socket.assigns.site, live_data_params) do
      {:ok, live_data} ->
        to = beacon_live_admin_path(socket, socket.assigns.site, "/live_data/#{sanitize_path(live_data.path)}")

        {:noreply,
         socket
         |> put_flash(:info, "Live Data created successfully")
         |> push_patch(to: to)}

      {:error, changeset} ->
        changeset = Map.put(changeset, :action, :insert)
        {:noreply, assign_form(socket, changeset)}
    end
  end

  defp save_live_data(socket, :edit, live_data_params) do
    case Content.update_live_data(socket.assigns.site, socket.assigns.live_data, live_data_params) do
      {:ok, live_data} ->
        changeset = Content.change_live_data(socket.assigns.site, live_data)

        {:noreply,
         socket
         |> assign(:live_data, live_data)
         |> assign_form(changeset)
         |> put_flash(:info, "Live Data updated successfully")}

      {:error, changeset} ->
        changeset = Map.put(changeset, :action, :update)
        {:noreply, assign_form(socket, changeset)}
    end
  end

  def render(assigns) do
    ~H"""
    <div>
      <.header>
        <%= @page_title %>
        <:actions>
          <.button phx-disable-with="Saving..." form="live-data-form" class="uppercase">Save Changes</.button>
        </:actions>
      </.header>

      <div class="grid items-start lg:h-[calc(100vh_-_144px)] grid-cols-1 mx-auto mt-4 gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <div class="p-4 bg-white col-span-full lg:col-span-1 rounded-[1.25rem] lg:rounded-t-[1.25rem] lg:rounded-b-none lg:h-full">
          <.form :let={f} for={@form} id="live-data-form" class="space-y-8" phx-target={@myself} phx-submit="save">
            <legend class="text-sm font-bold tracking-widest text-[#445668] uppercase">Live Data settings</legend>
            <div class="flex">
              <p class="text-2xl self-end pb-2">@</p><.input field={f[:name]} type="text" label="Assign" />
            </div>
            <.input field={f[:format]} type="select" options={formats_to_options(@site)} label="Format" />
            <input type="hidden" name="live_data[code]" id="live-data-form_code" value={@changed_code} />
          </.form>
        </div>
        <div class="col-span-full lg:col-span-2">
          <%= template_error(@form[:code]) %>
          <div class="py-6 w-full rounded-[1.25rem] bg-[#0D1829] [&_.monaco-editor-background]:!bg-[#0D1829] [&_.margin]:!bg-[#0D1829]">
            <LiveMonacoEditor.code_editor path="code" class="col-span-full lg:col-span-2" value={@code} opts={Map.merge(LiveMonacoEditor.default_opts(), %{"language" => "html"})} />
          </div>
        </div>
      </div>
    </div>
    """
  end

  defp formats_to_options(site) do
    Enum.map(Content.live_data_formats(site), &{Phoenix.Naming.humanize(&1), &1})
  end

  defp sanitize_path(path) do
    URI.encode_www_form(path)
  end
end
