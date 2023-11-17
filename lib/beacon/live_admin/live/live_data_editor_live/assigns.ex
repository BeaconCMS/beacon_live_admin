defmodule Beacon.LiveAdmin.LiveDataEditorLive.Assigns do
  @moduledoc false
  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Content

  def menu_link("/live_data", :assigns), do: {:submenu, "Live Data"}
  def menu_link(_, _), do: :skip

  # For switching between selected assigns, first load has already happened
  def handle_params(params, _url, %{assigns: %{live_data: [_ | _]}} = socket) do
    socket =
      socket
      |> assign_selected(params["assign"])
      |> assign_form()

    {:noreply, socket}
  end

  # For the first page load
  def handle_params(params, _url, socket) do
    socket =
      socket
      |> assign(live_data_path: URI.decode_www_form(params["path"]))
      |> assign_live_data()
      |> assign(unsaved_changes: false)
      |> assign(show_nav_modal: false)
      |> assign(show_delete_modal: false)
      |> assign(page_title: "LiveData Assigns")
      |> assign_selected(params["assign"])
      |> assign_form()

    {:noreply, socket}
  end

  def handle_event("select-" <> assign, _, socket) do
    %{beacon_page: %{site: site}, live_data_path: live_data_path} = socket.assigns

    path =
      beacon_live_admin_path(
        socket,
        site,
        "/live_data/#{sanitize_path(live_data_path)}/#{assign}"
      )

    if socket.assigns.unsaved_changes do
      {:noreply, assign(socket, show_nav_modal: true, confirm_nav_path: path)}
    else
      {:noreply, push_redirect(socket, to: path)}
    end
  end

  def handle_event("live_data_editor_lost_focus", %{"value" => code}, socket) do
    %{selected: selected, beacon_page: %{site: site}, form: form} = socket.assigns

    changeset =
      site
      |> Content.change_live_data(selected, %{
        "code" => code,
        "assign" => form.params["assign"] || Map.fetch!(form.data, :assign),
        "format" => form.params["format"] || Map.fetch!(form.data, :format)
      })
      |> Map.put(:action, :validate)

    socket =
      socket
      |> assign(form: to_form(changeset))
      |> assign(changed_code: code)
      |> assign(unsaved_changes: !(changeset.changes == %{}))

    {:noreply, socket}
  end

  def handle_event("validate", %{"live_data" => params}, socket) do
    %{selected: selected, beacon_page: %{site: site}} = socket.assigns

    changeset =
      site
      |> Content.change_live_data(selected, params)
      |> Map.put(:action, :validate)

    socket =
      socket
      |> assign(form: to_form(changeset))
      |> assign(unsaved_changes: !(changeset.changes == %{}))

    {:noreply, socket}
  end

  def handle_event("save_changes", %{"live_data" => params}, socket) do
    %{selected: selected, beacon_page: %{site: site}, live_data_path: live_data_path} =
      socket.assigns

    attrs = %{assign: params["assign"], format: params["format"], code: params["code"]}

    socket =
      case Content.update_live_data(site, selected, attrs) do
        {:ok, live_data} ->
          path =
            beacon_live_admin_path(
              socket,
              site,
              "/live_data/#{sanitize_path(live_data_path)}/#{live_data.assign}"
            )

          socket
          |> assign_live_data()
          |> assign_form()
          |> assign(unsaved_changes: false)
          |> push_patch(to: path)

        {:error, changeset} ->
          changeset = Map.put(changeset, :action, :update)
          assign(socket, form: to_form(changeset))
      end

    {:noreply, socket}
  end

  def handle_event("create_new", _params, socket) do
    %{beacon_page: %{site: site}, live_data_path: live_data_path} = socket.assigns
    selected = socket.assigns.selected || %{id: nil}

    attrs = %{assign: "foo", format: :text, code: "bar", site: site, path: live_data_path}
    {:ok, live_data} = Content.create_live_data(site, attrs)

    socket =
      socket
      |> assign_live_data()
      |> assign_selected(selected.assign)

    {:noreply, socket}
  end

  def handle_event("delete", _, socket) do
    {:noreply, assign(socket, show_delete_modal: true)}
  end

  def handle_event("delete_confirm", _, socket) do
    %{selected: selected, beacon_page: %{site: site}, live_data_path: live_data_path} =
      socket.assigns

    path = beacon_live_admin_path(socket, site, "/live_data/#{sanitize_path(live_data_path)}")

    {:ok, _} = Content.delete_live_data(site, selected)

    {:noreply, push_redirect(socket, to: path)}
  end

  def handle_event("delete_cancel", _, socket) do
    {:noreply, assign(socket, show_delete_modal: false)}
  end

  def handle_event("stay_here", _params, socket) do
    {:noreply, assign(socket, show_nav_modal: false, confirm_nav_path: nil)}
  end

  def handle_event("discard_changes", _params, socket) do
    {:noreply, push_redirect(socket, to: socket.assigns.confirm_nav_path)}
  end

  def render(assigns) do
    ~H"""
    <div>
      <.header>
        <%= @page_title %>
        <:actions>
          <.button type="button" phx-click="create_new">New Live Data Assign</.button>
        </:actions>
      </.header>
      <.main_content class="h-[calc(100vh_-_223px)]">
        <.modal :if={@show_nav_modal} id="confirm-nav" on_cancel={JS.push("stay_here")} show>
          <p>You've made unsaved changes to this assign!</p>
          <p>Navigating to another assign without saving will cause these changes to be lost.</p>
          <.button type="button" phx-click="stay_here">
            Stay here
          </.button>
          <.button type="button" phx-click="discard_changes">
            Discard changes
          </.button>
        </.modal>

        <.modal :if={@show_delete_modal} id="confirm-delete" on_cancel={JS.push("delete_cancel")} show>
          <p class="mb-2">Are you sure you want to delete this assign?</p>
          <div class="flex justify-end w-full gap-4 mt-10">
            <.button type="button" phx-click="delete_confirm">
              Delete
            </.button>
            <.button type="button" phx-click="delete_cancel">
              Cancel
            </.button>
          </div>
        </.modal>

        <div class="grid items-start grid-cols-1 grid-rows-1 mx-auto gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <div class="h-full lg:overflow-y-auto pb-4 lg:h-[calc(100vh_-_239px)]">
            <div class="text-xl flex gap-x-6">
              <div>Path:</div>
              <div><%= @live_data_path %></div>
            </div>
            <.table :if={@selected} id="assigns" rows={@live_data} row_click={fn data -> "select-#{data.assign}" end}>
              <:col :let={live_data} label="assign">
                @<%= live_data.assign %>
              </:col>
            </.table>
          </div>

          <div :if={@form} class="w-full col-span-2">
            <.form :let={f} for={@form} class="flex items-end gap-4" phx-change="validate" phx-submit="save_changes">
              <.input label="Assign" field={f[:assign]} type="text" />
              <.input label="Format" field={f[:format]} type="select" options={["elixir", "text"]} />

              <input type="hidden" name="live_data[code]" id="live_data-form_code" value={@changed_code} />

              <.button phx-disable-with="Saving..." class="ml-auto">Save Changes</.button>
              <.button type="button" phx-click="delete" class="">Delete</.button>
            </.form>
            <div :if={@form[:format].value in [:elixir, "elixir"]} class="mt-4 flex gap-x-4">
              <div>Variables available:</div>
              <div><%= variables_available(@live_data_path) %></div>
            </div>
            <%= template_error(@form[:code]) %>
            <div class="w-full mt-10 space-y-8">
              <div class="py-6 rounded-[1.25rem] bg-[#0D1829] [&_.monaco-editor-background]:!bg-[#0D1829] [&_.margin]:!bg-[#0D1829]">
                <LiveMonacoEditor.code_editor path="live_data" class="col-span-full lg:col-span-2" value={@selected.code} opts={Map.merge(LiveMonacoEditor.default_opts(), %{"language" => "elixir"})} />
              </div>
            </div>
          </div>
        </div>
      </.main_content>
    </div>
    """
  end

  defp assign_selected(socket, nil) do
    case socket.assigns.live_data do
      [] -> assign(socket, selected: nil, changed_code: "")
      [live_data | _] -> assign(socket, selected: live_data, changed_code: live_data.code)
    end
  end

  defp assign_selected(socket, assign) do
    selected = Enum.find(socket.assigns.live_data, &(&1.assign == assign))

    assign(socket,
      selected: selected,
      changed_template: selected.code,
      changed_code: selected.code
    )
  end

  defp assign_form(socket) do
    form =
      case socket.assigns do
        %{selected: nil} ->
          nil

        %{selected: selected, beacon_page: %{site: site}} ->
          site
          |> Content.change_live_data(selected)
          |> to_form()
      end

    assign(socket, form: form)
  end

  defp assign_live_data(socket) do
    %{beacon_page: %{site: site}, live_data_path: path} = socket.assigns

    assign(socket, live_data: Content.live_data_for_path(site, path))
  end

  defp sanitize_path(path) do
    URI.encode_www_form(path)
  end

  defp variables_available(path) do
    path
    |> String.split("/", trim: true)
    |> Enum.filter(&String.starts_with?(&1, ":"))
    |> Enum.map(fn ":" <> param -> param end)
    |> Kernel.++(["params"])
    |> Enum.join(" ")
  end
end
