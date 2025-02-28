defmodule Beacon.LiveAdmin.LiveDataEditorLive.Assigns do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Client.Content

  def menu_link("/live_data", :assigns), do: {:submenu, "Live Data"}
  def menu_link(_, _), do: :skip

  def handle_params(params, _url, socket) do
    %{beacon_page: %{site: site}} = socket.assigns

    socket =
      socket
      |> assign(live_data: Content.get_live_data_by(site, id: params["live_data_id"]))
      |> assign(unsaved_changes: false)
      |> assign(show_nav_modal: false)
      |> assign(show_create_modal: false)
      |> assign(show_delete_modal: false)
      |> assign(new_assign_form: to_form(%{"key" => ""}))
      |> assign(page_title: "Live Data")
      |> assign_selected(params["assign_id"])
      |> assign_form()

    {:noreply, socket}
  end

  def handle_event("select-" <> assign_id, _, socket) do
    %{live_data: %{site: site} = live_data, unsaved_changes: unsaved_changes} = socket.assigns

    path = beacon_live_admin_path(socket, site, "/live_data/#{live_data.id}/assigns/#{assign_id}")

    if unsaved_changes do
      {:noreply, assign(socket, show_nav_modal: true, confirm_nav_path: path)}
    else
      {:noreply, push_navigate(socket, to: path)}
    end
  end

  def handle_event("live_data_assign_editor_lost_focus", %{"value" => value}, socket) do
    %{selected: selected, live_data: %{site: site}, form: form} = socket.assigns

    changeset =
      site
      |> Content.change_live_data_assign(selected, %{
        "value" => value,
        "key" => form.params["key"] || Map.fetch!(form.data, :key),
        "format" => form.params["format"] || Map.fetch!(form.data, :format)
      })
      |> Map.put(:action, :validate)

    socket =
      socket
      |> assign(form: to_form(changeset))
      |> assign(changed_value: value)
      |> assign(unsaved_changes: !(changeset.changes == %{}))

    {:noreply, socket}
  end

  def handle_event("validate", %{"live_data_assign" => params}, socket) do
    %{selected: selected, live_data: %{site: site}} = socket.assigns

    changeset =
      site
      |> Content.change_live_data_assign(selected, params)
      |> Map.put(:action, :validate)

    socket =
      socket
      |> assign(form: to_form(changeset))
      |> assign(unsaved_changes: !(changeset.changes == %{}))

    {:noreply, socket}
  end

  def handle_event("set_value", %{"value" => value}, socket) do
    %{selected: selected, beacon_page: %{site: site}, form: form} = socket.assigns

    params = Map.merge(form.params, %{"value" => value})
    changeset = Content.change_live_data_assign(site, selected, params)

    socket =
      socket
      |> assign_form(changeset)
      |> assign(unsaved_changes: !(changeset.changes == %{}))

    {:noreply, socket}
  end

  def handle_event("save_changes", %{"live_data_assign" => params}, socket) do
    %{selected: selected, live_data: %{site: site} = live_data, __beacon_actor__: actor} = socket.assigns

    attrs = %{key: params["key"], value: params["value"], format: params["format"]}

    socket =
      case Content.update_live_data_assign(site, actor, selected, attrs) do
        {:ok, live_data_assign} ->
          path =
            beacon_live_admin_path(
              socket,
              site,
              "/live_data/#{live_data.id}/assigns/#{live_data_assign.id}"
            )

          socket
          |> assign(live_data: Content.get_live_data_by(site, id: live_data.id))
          |> assign_form()
          |> assign(unsaved_changes: false)
          |> push_patch(to: path)

        {:error, changeset} ->
          changeset = Map.put(changeset, :action, :update)
          assign(socket, form: to_form(changeset))
      end

    {:noreply, socket}
  end

  def handle_event("show_create_modal", _params, socket) do
    {:noreply, assign(socket, show_create_modal: true)}
  end

  def handle_event("submit_new", params, socket) do
    %{live_data: %{site: site} = live_data, selected: selected, __beacon_actor__: actor} = socket.assigns
    selected = selected || %{id: nil}

    attrs = %{key: params["key"], value: "Your value here", format: :text}
    # TODO: handle errors
    {:ok, updated_live_data} = Content.create_assign_for_live_data(site, actor, live_data, attrs)

    socket =
      socket
      |> assign(live_data: updated_live_data)
      |> assign_selected(selected.id)

    {:noreply, assign(socket, show_create_modal: false)}
  end

  def handle_event("delete", _, socket) do
    {:noreply, assign(socket, show_delete_modal: true)}
  end

  def handle_event("delete_confirm", _, socket) do
    %{selected: selected, live_data: %{site: site} = live_data, __beacon_actor__: actor} = socket.assigns

    {:ok, _} = Content.delete_live_data_assign(site, actor, selected)

    {:noreply,
     push_navigate(socket,
       to: beacon_live_admin_path(socket, site, "/live_data/#{live_data.id}/assigns")
     )}
  end

  def handle_event("create_cancel", _, socket) do
    {:noreply, assign(socket, show_create_modal: false)}
  end

  def handle_event("delete_cancel", _, socket) do
    {:noreply, assign(socket, show_delete_modal: false)}
  end

  def handle_event("stay_here", _params, socket) do
    {:noreply, assign(socket, show_nav_modal: false, confirm_nav_path: nil)}
  end

  def handle_event("discard_changes", _params, socket) do
    {:noreply, push_navigate(socket, to: socket.assigns.confirm_nav_path)}
  end

  def render(assigns) do
    ~H"""
    <div>
      <.header>
        <%= @page_title %>
        <:actions>
          <.button type="button" phx-click="show_create_modal">New Live Data Assign</.button>
        </:actions>
      </.header>
      <.main_content>
        <.modal :if={@show_nav_modal} id="confirm-nav" on_cancel={JS.push("stay_here")} show>
          <p>You've made unsaved changes to this assign!</p>
          <p>Navigating to another assign without saving will cause these changes to be lost.</p>
          <.button type="button" phx-click="stay_here" class="sui-secondary">
            Stay here
          </.button>
          <.button type="button" phx-click="discard_changes" class="sui-primary-destructive">
            Discard changes
          </.button>
        </.modal>

        <.modal :if={@show_delete_modal} id="confirm-delete" on_cancel={JS.push("delete_cancel")} show>
          <p class="mb-2">Are you sure you want to delete this assign?</p>
          <div class="flex justify-end w-full gap-4 mt-10">
            <.button id="delete-confirm" type="button" phx-click="delete_confirm" class="sui-primary-destructive">
              Delete
            </.button>
            <.button type="button" phx-click="delete_cancel" class="sui-secondary">
              Cancel
            </.button>
          </div>
        </.modal>

        <.modal :if={@show_create_modal} id="create-modal" on_cancel={JS.push("create_cancel")} show>
          <:title>New Assign</:title>
          <.form id="new-assign-form" for={@new_assign_form} phx-submit="submit_new" class="px-4 pt-4">
            <.input type="text" field={@new_assign_form[:key]} placeholder="assign_key" />
            <div class="flex mt-8 gap-x-[20px]">
              <.button type="submit">Create</.button>
              <.button type="button" phx-click={JS.push("create_cancel")} class="sui-secondary">Cancel</.button>
            </div>
          </.form>
        </.modal>

        <div class="grid items-start grid-cols-1 grid-rows-1 mx-auto gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <div class="h-full lg:overflow-y-auto pb-4 lg:h-[calc(100vh_-_239px)]">
            <div class="text-xl flex gap-x-6">
              <div>Path:</div>
              <div><%= @live_data.path %></div>
            </div>
            <.table :if={@selected} id="assigns" rows={@live_data.assigns} row_click={fn assign -> "select-#{assign.id}" end}>
              <:col :let={assign} label="assign">
                @<%= assign.key %>
              </:col>
            </.table>
          </div>

          <div :if={@form} class="w-full col-span-2">
            <.form :let={f} id="edit-assign-form" for={@form} class="flex items-end gap-4" phx-change="validate" phx-submit="save_changes">
              <.input label="Key" field={f[:key]} type="text" />
              <.input label="Format" field={f[:format]} type="select" options={["elixir", "text"]} />
              <input type="hidden" name="live_data_assign[value]" id="live_data_assign-form_value" value={Phoenix.HTML.Form.input_value(f, :value)} />

              <.button phx-disable-with="Saving..." class="sui-primary ml-auto">Save Changes</.button>
              <.button type="button" phx-click="delete" class="sui-primary-destructive">Delete</.button>
            </.form>
            <div :if={@form[:format].value in [:elixir, "elixir"]} class="mt-4 flex gap-x-4">
              <div>Variables available:</div>
              <div><%= variables_available(@live_data.path) %></div>
            </div>
            <%= template_error(@form[:value]) %>
            <div class="w-full mt-10 space-y-8">
              <div class="py-6 rounded-[1.25rem] bg-[#0D1829] [&_.monaco-editor-background]:!bg-[#0D1829] [&_.margin]:!bg-[#0D1829]">
                <LiveMonacoEditor.code_editor
                  path="live_data_assign"
                  class="col-span-full lg:col-span-2"
                  value={@selected.value}
                  change="set_value"
                  opts={Map.merge(LiveMonacoEditor.default_opts(), %{"language" => "elixir"})}
                />
              </div>
            </div>
          </div>
        </div>
      </.main_content>
    </div>
    """
  end

  defp assign_selected(socket, nil) do
    case socket.assigns.live_data.assigns do
      [] ->
        assign(socket, selected: nil, changed_value: "")

      [live_data_assign | _] ->
        assign(socket, selected: live_data_assign, changed_value: live_data_assign.value)
    end
  end

  defp assign_selected(socket, id) do
    %{live_data: live_data} = socket.assigns
    selected = Enum.find(live_data.assigns, &(&1.id == id))

    if selected do
      assign(socket, selected: selected, changed_value: selected.value)
    else
      path =
        beacon_live_admin_path(
          socket,
          socket.assigns.beacon_page.site,
          "/live_data/#{live_data.id}/assigns"
        )

      socket
      |> assign(selected: nil)
      |> push_navigate(to: path, replace: true)
    end
  end

  defp assign_form(socket) do
    form =
      case socket.assigns do
        %{selected: nil} ->
          nil

        %{selected: selected, live_data: %{site: site}} ->
          site
          |> Content.change_live_data_assign(selected)
          |> to_form()
      end

    assign(socket, form: form)
  end

  defp assign_form(socket, changeset) do
    assign(socket, :form, to_form(changeset))
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
