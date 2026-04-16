defmodule Beacon.LiveAdmin.EventHandlerEditorLive.Index do
  @moduledoc false
  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Client.Content

  @action_types [
    {"Navigation", [
      %{type: "navigate", label: "Navigate", fields: ["to"]},
      %{type: "patch", label: "Patch URL", fields: ["to"]},
      %{type: "redirect", label: "Redirect", fields: ["to"]},
      %{type: "open_url", label: "Open External URL", fields: ["url"]},
      %{type: "scroll_to", label: "Scroll To", fields: ["target"]},
      %{type: "dismiss", label: "Dismiss", fields: []}
    ]},
    {"Data", [
      %{type: "submit", label: "GraphQL Mutation", fields: ["endpoint", "query", "result"]},
      %{type: "fetch", label: "GraphQL Query", fields: ["endpoint", "query", "result"]}
    ]},
    {"State", [
      %{type: "set_state", label: "Set State", fields: ["key", "value"]},
      %{type: "toggle_state", label: "Toggle State", fields: ["key"]}
    ]},
    {"DOM", [
      %{type: "show", label: "Show Element", fields: ["target"]},
      %{type: "hide", label: "Hide Element", fields: ["target"]},
      %{type: "toggle", label: "Toggle Element", fields: ["target"]},
      %{type: "add_class", label: "Add Class", fields: ["target", "class"]},
      %{type: "remove_class", label: "Remove Class", fields: ["target", "class"]},
      %{type: "toggle_class", label: "Toggle Class", fields: ["target", "class"]},
      %{type: "set_attribute", label: "Set Attribute", fields: ["target", "attr", "value"]},
      %{type: "remove_attribute", label: "Remove Attribute", fields: ["target", "attr"]},
      %{type: "transition", label: "CSS Transition", fields: ["target", "class"]},
      %{type: "focus", label: "Focus Element", fields: ["target"]}
    ]},
    {"Feedback", [
      %{type: "flash", label: "Flash Message", fields: ["kind", "message"]},
      %{type: "dispatch_event", label: "Dispatch Event", fields: ["event"]},
      %{type: "push_event", label: "Push Event", fields: ["event"]},
      %{type: "track", label: "Track Analytics", fields: ["event"]}
    ]},
    {"Forms", [
      %{type: "validate", label: "Validate Form", fields: ["form"]}
    ]},
    {"Control", [
      %{type: "conditional", label: "Conditional", fields: ["test"]},
      %{type: "sequence", label: "Sequence", fields: []},
      %{type: "custom", label: "Custom Handler", fields: ["handler"]}
    ]}
  ]

  def menu_link(_, :index), do: {:root, "Event Handlers"}

  def handle_params(params, _uri, socket) do
    %{beacon_page: %{site: site}} = socket.assigns

    socket =
      socket
      |> assign(page_title: "Event Handlers")
      |> assign(unsaved_changes: false)
      |> assign(show_create_modal: false)
      |> assign(show_nav_modal: false)
      |> assign(show_delete_modal: false)
      |> assign(action_types: @action_types)
      |> assign(create_form: to_form(%{}, as: :event_handler))
      |> assign_new(:event_handlers, fn -> Content.list_event_handlers(site) end)
      |> assign_selected(params["id"])
      |> assign_form()

    {:noreply, socket}
  end

  def handle_event("select-" <> id, _, socket) do
    %{beacon_page: %{site: site}} = socket.assigns
    path = beacon_live_admin_path(socket, site, "/events/#{id}")

    if socket.assigns.unsaved_changes do
      {:noreply, assign(socket, show_nav_modal: true, confirm_nav_path: path)}
    else
      {:noreply, push_navigate(socket, to: path)}
    end
  end

  def handle_event("set_code", %{"value" => code}, socket) do
    %{selected: selected, beacon_page: %{site: site}, form: form} = socket.assigns
    params = Map.merge(form.params, %{"code" => code})

    changeset =
      site
      |> Content.change_event_handler(selected, params)
      |> Map.put(:action, :validate)

    socket =
      socket
      |> assign_form(changeset)
      |> assign(unsaved_changes: !(changeset.changes == %{}))

    {:noreply, socket}
  end

  def handle_event("toggle_format", _, socket) do
    %{selected: selected, beacon_page: %{site: site}} = socket.assigns

    new_format = if selected.format == :elixir, do: :actions, else: :elixir

    default_actions = %{"version" => 1, "steps" => []}
    default_code = "{:noreply, socket}"

    attrs =
      case new_format do
        :actions -> %{format: :actions, actions: selected.actions || default_actions, code: selected.code || default_code}
        :elixir -> %{format: :elixir, code: selected.code || default_code}
      end

    case Content.update_event_handler(site, selected, attrs) do
      {:ok, updated} ->
        socket =
          socket
          |> assign_event_handler_update(updated)
          |> assign_selected(updated.id)
          |> assign_form()
          |> put_flash(:info, "Switched to #{new_format} format")

        {:noreply, socket}

      {:error, _changeset} ->
        {:noreply, put_flash(socket, :error, "Failed to switch format")}
    end
  end

  def handle_event("add_action", %{"type" => type}, socket) do
    %{selected: selected, beacon_page: %{site: site}} = socket.assigns

    actions = selected.actions || %{"version" => 1, "steps" => []}
    new_step = %{"action" => type}
    updated_actions = Map.update!(actions, "steps", &(&1 ++ [new_step]))

    case Content.update_event_handler(site, selected, %{actions: updated_actions}) do
      {:ok, updated} ->
        socket =
          socket
          |> assign_event_handler_update(updated)
          |> assign(selected: updated)
          |> assign(unsaved_changes: false)

        {:noreply, socket}

      {:error, _} ->
        {:noreply, socket}
    end
  end

  def handle_event("remove_action", %{"index" => index_str}, socket) do
    %{selected: selected, beacon_page: %{site: site}} = socket.assigns
    index = String.to_integer(index_str)

    actions = selected.actions || %{"version" => 1, "steps" => []}
    updated_steps = List.delete_at(actions["steps"], index)
    updated_actions = Map.put(actions, "steps", updated_steps)

    case Content.update_event_handler(site, selected, %{actions: updated_actions}) do
      {:ok, updated} ->
        socket =
          socket
          |> assign_event_handler_update(updated)
          |> assign(selected: updated)

        {:noreply, socket}

      {:error, _} ->
        {:noreply, socket}
    end
  end

  def handle_event("update_action", %{"index" => index_str} = params, socket) do
    %{selected: selected, beacon_page: %{site: site}} = socket.assigns
    index = String.to_integer(index_str)

    actions = selected.actions || %{"version" => 1, "steps" => []}
    step = Enum.at(actions["steps"], index, %{})

    updated_step =
      params
      |> Map.drop(["index", "_target"])
      |> Enum.reduce(step, fn {key, value}, acc -> Map.put(acc, key, value) end)

    updated_steps = List.replace_at(actions["steps"], index, updated_step)
    updated_actions = Map.put(actions, "steps", updated_steps)

    case Content.update_event_handler(site, selected, %{actions: updated_actions}) do
      {:ok, updated} ->
        socket =
          socket
          |> assign_event_handler_update(updated)
          |> assign(selected: updated)

        {:noreply, socket}

      {:error, _} ->
        {:noreply, socket}
    end
  end

  def handle_event("validate", params, socket) do
    %{beacon_page: %{site: site}, form: form} = socket.assigns

    changeset =
      site
      |> Content.change_event_handler(form.source.data, params["event_handler"])
      |> Map.put(:action, :validate)

    {:noreply, assign_form(socket, changeset)}
  end

  def handle_event("create_new", _, socket) do
    {:noreply, assign(socket, show_create_modal: true)}
  end

  def handle_event("save_new", params, socket) do
    %{beacon_page: %{site: site}} = socket.assigns
    %{"event_handler" => %{"name" => name}} = params

    attrs = %{
      "name" => name,
      "site" => site,
      "code" => "{:noreply, socket}",
      "format" => "elixir"
    }

    socket =
      case Content.create_event_handler(site, attrs) do
        {:ok, %{id: event_handler_id}} ->
          socket
          |> assign(event_handlers: Content.list_event_handlers(site))
          |> assign_selected(event_handler_id)
          |> assign(show_create_modal: false)
          |> push_navigate(to: beacon_live_admin_path(socket, site, "/events/#{event_handler_id}"))

        {:error, changeset} ->
          assign(socket, create_form: to_form(changeset))
      end

    {:noreply, socket}
  end

  def handle_event("save_changes", %{"event_handler" => params}, socket) do
    %{selected: selected, beacon_page: %{site: site}} = socket.assigns

    attrs = %{code: params["code"], name: params["name"]}

    socket =
      case Content.update_event_handler(site, selected, attrs) do
        {:ok, updated_event_handler} ->
          socket
          |> assign_event_handler_update(updated_event_handler)
          |> assign_selected(selected.id)
          |> assign_form()
          |> assign(unsaved_changes: false)
          |> put_flash(:info, "Event Handler updated successfully")

        {:error, changeset} ->
          changeset = Map.put(changeset, :action, :update)
          assign(socket, form: to_form(changeset))
      end

    {:noreply, socket}
  end

  def handle_event("delete", _, socket) do
    {:noreply, assign(socket, show_delete_modal: true)}
  end

  def handle_event("delete_confirm", _, socket) do
    %{selected: event_handler, beacon_page: %{site: site}} = socket.assigns
    {:ok, _} = Content.delete_event_handler(site, event_handler)

    socket =
      socket
      |> assign(event_handlers: Content.list_event_handlers(site))
      |> push_patch(to: beacon_live_admin_path(socket, site, "/events"))

    {:noreply, socket}
  end

  def handle_event("delete_cancel", _, socket), do: {:noreply, assign(socket, show_delete_modal: false)}
  def handle_event("stay_here", _, socket), do: {:noreply, assign(socket, show_nav_modal: false, confirm_nav_path: nil)}
  def handle_event("discard_changes", _, socket), do: {:noreply, push_navigate(socket, to: socket.assigns.confirm_nav_path)}
  def handle_event("cancel_create", _, socket), do: {:noreply, assign(socket, show_create_modal: false)}

  defp assign_selected(socket, nil) do
    case socket.assigns.event_handlers do
      [] -> assign(socket, selected: nil, changed_code: "")
      [hd | _] -> assign(socket, selected: hd, changed_code: hd.code || "")
    end
  end

  defp assign_selected(socket, id) when is_binary(id) do
    selected = Enum.find(socket.assigns.event_handlers, &(&1.id == id))
    assign(socket, selected: selected, changed_code: (selected && selected.code) || "")
  end

  defp assign_form(socket) do
    form =
      case socket.assigns do
        %{selected: nil} -> nil
        %{selected: selected, beacon_page: %{site: site}} ->
          site |> Content.change_event_handler(selected) |> to_form()
      end

    assign(socket, form: form)
  end

  defp assign_form(socket, changeset), do: assign(socket, :form, to_form(changeset))

  defp assign_event_handler_update(socket, updated) do
    %{id: id} = updated

    event_handlers =
      Enum.map(socket.assigns.event_handlers, fn
        %{id: ^id} -> updated
        other -> other
      end)

    assign(socket, event_handlers: event_handlers)
  end

  defp selected_format(selected) do
    case selected do
      %{format: :actions} -> :actions
      _ -> :elixir
    end
  end

  def render(assigns) do
    ~H"""
    <div>
      <.header>
        <%= @page_title %>
        <:actions>
          <.button type="button" id="new-event-handler-button" phx-click="create_new" class="btn-primary">
            New Event Handler
          </.button>
        </:actions>
      </.header>

      <.main_content>
        <.modal :if={@show_nav_modal} id="confirm-nav" on_cancel={JS.push("stay_here")} show>
          <p>You've made unsaved changes to this event handler!</p>
          <.button type="button" phx-click="stay_here" class="btn-ghost">Stay here</.button>
          <.button type="button" phx-click="discard_changes" class="btn-error">Discard changes</.button>
        </.modal>

        <.modal :if={@show_create_modal} id="create-modal" on_cancel={JS.push("cancel_create")} show>
          <:title>New Event Handler</:title>
          <.form :let={f} for={@create_form} id="create-form" phx-submit="save_new" class="px-4">
            <.input field={f[:name]} type="text" label="Event name:" />
            <.button class="btn-primary mt-4">Save</.button>
          </.form>
        </.modal>

        <.modal :if={@show_delete_modal} id="delete-modal" on_cancel={JS.push("delete_cancel")} show>
          <p>Are you sure you want to delete this event handler?</p>
          <.button type="button" id="confirm-delete-button" phx-click="delete_confirm" class="btn-error">Delete</.button>
          <.button type="button" phx-click="delete_cancel" class="btn-ghost">Cancel</.button>
        </.modal>

        <div class="grid items-start grid-cols-1 grid-rows-1 mx-auto gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <div class="h-full lg:overflow-y-auto pb-4 lg:h-[calc(100vh_-_239px)]">
            <.table id="event-handlers" rows={@event_handlers} row_click={fn row -> "select-#{row.id}" end}>
              <:col :let={event_handler} label="Name"><%= Map.fetch!(event_handler, :name) %></:col>
              <:col :let={event_handler} label="Format">
                <span class={"px-2 py-0.5 text-xs rounded-full #{if event_handler.format == :actions, do: "bg-indigo-100 text-indigo-700", else: "bg-gray-100 text-gray-600 bg-base-100 "}"}>
                  <%= event_handler.format %>
                </span>
              </:col>
            </.table>
          </div>

          <div :if={@form && @selected} class="w-full col-span-2">
            <.form :let={f} for={@form} id="event-handler-form" class="flex items-end gap-4" phx-change="validate" phx-submit="save_changes">
              <.input label="Name" field={f[:name]} type="text" />
              <input type="hidden" name="event_handler[code]" id="event_handler-form_code" value={Phoenix.HTML.Form.input_value(f, :code)} />
              <.button phx-disable-with="Saving..." class="btn-primary ml-auto">Save Changes</.button>
              <.button id="delete-event-handler-button" type="button" phx-click="delete" class="btn-error">Delete</.button>
            </.form>

            <div class="mt-4 flex items-center gap-4">
              <span class="text-sm font-medium text-base-content/80">Format:</span>
              <button type="button" phx-click="toggle_format"
                class={"px-3 py-1.5 text-sm rounded-lg border transition-colors #{if selected_format(@selected) == :elixir, do: "bg-gray-100 border-gray-300 bg-base-100 ", else: "bg-indigo-50 border-indigo-300 text-indigo-700"}"}>
                <%= if selected_format(@selected) == :elixir, do: "Elixir Code", else: "Actions (Declarative)" %>
                <span class="ml-1 text-xs opacity-60">click to switch</span>
              </button>
            </div>

            <%= if selected_format(@selected) == :elixir do %>
              <div class="mt-2 flex gap-x-4 text-sm text-base-content/60">
                <span>Variables available:</span>
                <span class="font-mono">event_params socket</span>
              </div>
              <%= template_error(@form[:code]) %>
              <div class="w-full mt-4 space-y-8">
                <div class="py-6 rounded-[1.25rem] bg-[#0D1829] [&_.monaco-editor-background]:!bg-[#0D1829] [&_.margin]:!bg-[#0D1829]">
                  <LiveMonacoEditor.code_editor
                    path="event_handler_code"
                    class="col-span-full lg:col-span-2"
                    value={@selected.code || ""}
                    change="set_code"
                    opts={Map.merge(LiveMonacoEditor.default_opts(), %{"language" => "elixir"})}
                  />
                </div>
              </div>
            <% else %>
              <div class="mt-4 space-y-3">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-semibold text-base-content/80">Action Steps</h3>
                </div>

                <div class="space-y-2">
                  <%= for {step, index} <- Enum.with_index((@selected.actions || %{"steps" => []})["steps"] || []) do %>
                    <div class="flex items-start gap-2 p-3 bg-base-100 border border-base-300 rounded-lg">
                      <span class="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-indigo-100 text-primary text-xs font-bold">
                        <%= index + 1 %>
                      </span>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                          <span class="text-sm font-medium text-base-content"><%= step["action"] %></span>
                          <%= for {key, value} <- Map.drop(step, ["action"]) do %>
                            <span class="text-xs text-base-content/60"><%= key %>: <span class="font-mono"><%= inspect(value) %></span></span>
                          <% end %>
                        </div>
                        <div class="mt-2 flex gap-2 flex-wrap">
                          <%= for field <- action_fields(step["action"]) do %>
                            <input
                              type="text"
                              name={field}
                              value={step[field] || ""}
                              placeholder={field}
                              phx-blur="update_action"
                              phx-value-index={index}
                              class="text-xs px-2 py-1 border border-gray-300  rounded bg-base-200 text-base-content"
                            />
                          <% end %>
                        </div>
                      </div>
                      <button type="button" phx-click="remove_action" phx-value-index={index}
                        class="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors">
                        <.icon name="hero-x-mark" class="w-4 h-4" />
                      </button>
                    </div>
                  <% end %>
                </div>

                <div class="border-t border-base-300 pt-3">
                  <h4 class="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2">Add Action</h4>
                  <div class="space-y-2">
                    <%= for {group_name, actions} <- @action_types do %>
                      <div>
                        <span class="text-xs font-medium text-base-content/40"><%= group_name %></span>
                        <div class="flex flex-wrap gap-1 mt-1">
                          <%= for action <- actions do %>
                            <button type="button" phx-click="add_action" phx-value-type={action.type}
                              class="px-2 py-1 text-xs bg-gray-100 bg-base-100 hover:bg-indigo-100 text-base-content/80 rounded transition-colors">
                              <%= action.label %>
                            </button>
                          <% end %>
                        </div>
                      </div>
                    <% end %>
                  </div>
                </div>
              </div>
            <% end %>
          </div>
        </div>
      </.main_content>
    </div>
    """
  end

  defp action_fields(type) do
    all_types = Enum.flat_map(@action_types, fn {_, actions} -> actions end)
    case Enum.find(all_types, &(&1.type == type)) do
      %{fields: fields} -> fields
      nil -> []
    end
  end
end
