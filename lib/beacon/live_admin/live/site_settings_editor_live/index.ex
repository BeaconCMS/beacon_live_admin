defmodule Beacon.LiveAdmin.SiteSettingsEditorLive.Index do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Client.Content

  @impl true
  def menu_link(_, action) when action in [:index, :edit], do: {:root, "Site Settings"}

  @impl true
  def handle_params(params, _uri, socket) do
    %{beacon_page: %{site: site}} = socket.assigns

    socket =
      socket
      |> assign(page_title: "Site Settings")
      |> assign(unsaved_changes: false)
      |> assign(show_nav_modal: false)
      |> assign_new(:site_settings, fn -> Content.list_site_settings(site) end)
      |> assign_selected(params["key"])
      |> assign_form()

    {:noreply, socket}
  end

  @impl true
  def handle_event("select-" <> key, _, socket) do
    %{beacon_page: %{site: site}} = socket.assigns

    path = beacon_live_admin_path(socket, site, "/settings/#{key}")

    if socket.assigns.unsaved_changes do
      {:noreply, assign(socket, show_nav_modal: true, confirm_nav_path: path)}
    else
      {:noreply, push_navigate(socket, to: path)}
    end
  end

  def handle_event("set_template", %{"value" => template}, socket) do
    %{selected: selected, beacon_page: %{site: site}, form: form} = socket.assigns

    params = Map.merge(form.params, %{"template" => template})
    changeset = Content.change_site_setting(site, selected, params)

    socket =
      socket
      |> assign_form(changeset)
      |> assign(unsaved_changes: !(changeset.changes == %{}))

    {:noreply, socket}
  end

  def handle_event("save_changes", %{"site_setting" => params}, socket) do
    %{selected: selected, beacon_page: %{site: site}} = socket.assigns

    attrs = %{template: params["template"]}

    socket =
      case Content.update_site_setting(site, selected, attrs) do
        {:ok, updated_setting} ->
          socket
          |> assign_setting_update(updated_setting)
          |> assign_selected(updated_setting.key)
          |> assign_form()
          |> assign(unsaved_changes: false)
          |> put_flash(:info, "Site setting updated successfully")

        {:error, changeset} ->
          changeset = Map.put(changeset, :action, :update)
          assign(socket, form: to_form(changeset))
      end

    {:noreply, socket}
  end

  def handle_event("stay_here", _params, socket) do
    {:noreply, assign(socket, show_nav_modal: false, confirm_nav_path: nil)}
  end

  def handle_event("discard_changes", _params, socket) do
    {:noreply, push_navigate(socket, to: socket.assigns.confirm_nav_path)}
  end

  defp assign_selected(socket, nil) do
    case socket.assigns.site_settings do
      [] -> assign(socket, selected: nil)
      [hd | _] -> assign(socket, selected: hd)
    end
  end

  defp assign_selected(socket, key) when is_binary(key) do
    selected = Enum.find(socket.assigns.site_settings, &(to_string(&1.key) == key))
    assign(socket, selected: selected)
  end

  defp assign_selected(socket, key) when is_atom(key) do
    selected = Enum.find(socket.assigns.site_settings, &(&1.key == key))
    assign(socket, selected: selected)
  end

  defp assign_form(socket) do
    form =
      case socket.assigns do
        %{selected: nil} ->
          nil

        %{selected: selected, beacon_page: %{site: site}} ->
          site
          |> Content.change_site_setting(selected)
          |> to_form()
      end

    assign(socket, form: form)
  end

  defp assign_form(socket, changeset) do
    assign(socket, :form, to_form(changeset))
  end

  defp assign_setting_update(socket, updated_setting) do
    %{key: setting_key} = updated_setting

    site_settings =
      Enum.map(socket.assigns.site_settings, fn
        %{key: ^setting_key} -> updated_setting
        other -> other
      end)

    assign(socket, site_settings: site_settings)
  end

  defp editor_language(setting) do
    case setting.format do
      :heex -> "html"
      :text -> "plaintext"
      _ -> "plaintext"
    end
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div>
      <.header>
        <%= @page_title %>
      </.header>

      <.main_content>
        <.modal :if={@show_nav_modal} id="confirm-nav" on_cancel={JS.push("stay_here")} show>
          <p>You've made unsaved changes to this setting!</p>
          <p>Navigating to another setting without saving will cause these changes to be lost.</p>
          <.button type="button" phx-click="stay_here" class="sui-secondary">
            Stay here
          </.button>
          <.button type="button" phx-click="discard_changes" class="sui-primary-destructive">
            Discard changes
          </.button>
        </.modal>

        <div class="grid items-start grid-cols-1 grid-rows-1 mx-auto gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <div class="h-full lg:overflow-y-auto pb-4 lg:h-[calc(100vh_-_239px)]">
            <.table id="site-settings" rows={@site_settings} row_click={fn row -> "select-#{row.key}" end}>
              <:col :let={setting} label="key">
                <%= Map.fetch!(setting, :key) %>
              </:col>
            </.table>
          </div>

          <div :if={@form} class="w-full col-span-2">
            <.form :let={f} for={@form} id="site-setting-form" class="flex items-end gap-4" phx-submit="save_changes">
              <.input label="Key" field={f[:key]} type="text" disabled readonly />
              <.input label="Format" field={f[:format]} type="text" disabled readonly />
              <.input type="hidden" field={f[:template]} name="site_setting[template]" id="site_setting-form_template" value={Phoenix.HTML.Form.input_value(f, :template)} />

              <.button phx-disable-with="Saving..." class="sui-primary ml-auto">Save Changes</.button>
            </.form>

            <div :if={@selected.description} class="mt-4 text-sm text-slate-600">
              <span class="font-medium">Description:</span> <%= @selected.description %>
            </div>

            <div class="w-full mt-6 space-y-8">
              <%= template_error(@form[:template]) %>
              <div class="py-6 rounded-[1.25rem] bg-[#0D1829] [&_.monaco-editor-background]:!bg-[#0D1829] [&_.margin]:!bg-[#0D1829]">
                <LiveMonacoEditor.code_editor
                  path="site_setting_template"
                  class="col-span-full lg:col-span-2"
                  value={@selected.template}
                  change="set_template"
                  opts={Map.merge(LiveMonacoEditor.default_opts(), %{"language" => editor_language(@selected)})}
                />
              </div>
            </div>
          </div>
        </div>
      </.main_content>
    </div>
    """
  end
end
