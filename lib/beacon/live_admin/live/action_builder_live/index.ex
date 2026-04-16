defmodule Beacon.LiveAdmin.ActionBuilderLive.Index do
  @moduledoc """
  Standalone action builder page for creating and testing action documents.

  Provides a visual builder for declarative action primitives with:
  - Grouped action palette (Navigation, Data, State, DOM, Feedback, Forms, Control)
  - Step sequence with inline field editing
  - JSON preview of the generated action document
  - Validation feedback
  """
  use Beacon.LiveAdmin.PageBuilder

  @action_groups [
    {"Navigation", [
      %{type: "navigate", label: "Navigate", desc: "Client-side navigation", fields: ["to"]},
      %{type: "patch", label: "Patch URL", desc: "Update URL without remount", fields: ["to"]},
      %{type: "redirect", label: "Redirect", desc: "Full HTTP redirect", fields: ["to"]},
      %{type: "open_url", label: "Open URL", desc: "Open external URL", fields: ["url"]},
      %{type: "scroll_to", label: "Scroll To", desc: "Scroll to element", fields: ["target"]},
      %{type: "dismiss", label: "Dismiss", desc: "Close modal/overlay", fields: []}
    ]},
    {"Data", [
      %{type: "submit", label: "Submit (Mutation)", desc: "Execute GraphQL mutation", fields: ["endpoint", "query", "result"]},
      %{type: "fetch", label: "Fetch (Query)", desc: "Execute GraphQL query", fields: ["endpoint", "query", "result"]}
    ]},
    {"State", [
      %{type: "set_state", label: "Set State", desc: "Set a page state variable", fields: ["key", "value"]},
      %{type: "toggle_state", label: "Toggle State", desc: "Toggle a boolean state", fields: ["key"]}
    ]},
    {"DOM", [
      %{type: "show", label: "Show", desc: "Show element", fields: ["target"]},
      %{type: "hide", label: "Hide", desc: "Hide element", fields: ["target"]},
      %{type: "toggle", label: "Toggle", desc: "Toggle visibility", fields: ["target"]},
      %{type: "add_class", label: "Add Class", desc: "Add CSS class", fields: ["target", "class"]},
      %{type: "remove_class", label: "Remove Class", desc: "Remove CSS class", fields: ["target", "class"]},
      %{type: "toggle_class", label: "Toggle Class", desc: "Toggle CSS class", fields: ["target", "class"]},
      %{type: "set_attribute", label: "Set Attr", desc: "Set HTML attribute", fields: ["target", "attr", "value"]},
      %{type: "remove_attribute", label: "Remove Attr", desc: "Remove HTML attribute", fields: ["target", "attr"]},
      %{type: "transition", label: "Transition", desc: "CSS transition", fields: ["target", "class"]},
      %{type: "focus", label: "Focus", desc: "Focus element", fields: ["target"]}
    ]},
    {"Feedback", [
      %{type: "flash", label: "Flash", desc: "Show flash message", fields: ["kind", "message"]},
      %{type: "dispatch_event", label: "Dispatch Event", desc: "Fire custom event", fields: ["event"]},
      %{type: "push_event", label: "Push Event", desc: "Push to hooks", fields: ["event"]},
      %{type: "track", label: "Track", desc: "Analytics event", fields: ["event"]}
    ]},
    {"Forms", [
      %{type: "validate", label: "Validate", desc: "Validate form", fields: ["form"]}
    ]},
    {"Control", [
      %{type: "conditional", label: "If/Then/Else", desc: "Conditional branching", fields: ["test"]},
      %{type: "sequence", label: "Sequence", desc: "Nested step sequence", fields: []},
      %{type: "custom", label: "Custom Handler", desc: "Call native handler", fields: ["handler"]}
    ]}
  ]

  def menu_link(_, :index), do: {:root, "Action Builder"}

  def handle_params(_params, _uri, socket) do
    socket =
      socket
      |> assign(page_title: "Action Builder")
      |> assign(action_groups: @action_groups)
      |> assign(steps: [])
      |> assign(validation_result: nil)

    {:noreply, socket}
  end

  def handle_event("add_action", %{"type" => type}, socket) do
    new_step = %{"action" => type}
    {:noreply, assign(socket, steps: socket.assigns.steps ++ [new_step])}
  end

  def handle_event("remove_action", %{"index" => index_str}, socket) do
    index = String.to_integer(index_str)
    {:noreply, assign(socket, steps: List.delete_at(socket.assigns.steps, index))}
  end

  def handle_event("update_field", %{"index" => index_str} = params, socket) do
    index = String.to_integer(index_str)
    step = Enum.at(socket.assigns.steps, index, %{})

    updated =
      params
      |> Map.drop(["index", "_target"])
      |> Enum.reduce(step, fn {k, v}, acc -> Map.put(acc, k, v) end)

    steps = List.replace_at(socket.assigns.steps, index, updated)
    {:noreply, assign(socket, steps: steps)}
  end

  def handle_event("move_up", %{"index" => index_str}, socket) do
    index = String.to_integer(index_str)

    if index > 0 do
      steps = swap(socket.assigns.steps, index, index - 1)
      {:noreply, assign(socket, steps: steps)}
    else
      {:noreply, socket}
    end
  end

  def handle_event("move_down", %{"index" => index_str}, socket) do
    index = String.to_integer(index_str)

    if index < length(socket.assigns.steps) - 1 do
      steps = swap(socket.assigns.steps, index, index + 1)
      {:noreply, assign(socket, steps: steps)}
    else
      {:noreply, socket}
    end
  end

  def handle_event("validate_document", _, socket) do
    doc = %{"version" => 1, "steps" => socket.assigns.steps}

    result =
      case Beacon.Actions.Validator.validate(doc) do
        :ok -> {:ok, "Document is valid"}
        {:error, errors} -> {:error, errors}
      end

    {:noreply, assign(socket, validation_result: result)}
  end

  defp swap(list, i, j) do
    a = Enum.at(list, i)
    b = Enum.at(list, j)
    list |> List.replace_at(i, b) |> List.replace_at(j, a)
  end

  defp action_fields(type) do
    @action_groups
    |> Enum.flat_map(fn {_, actions} -> actions end)
    |> Enum.find(&(&1.type == type))
    |> case do
      %{fields: fields} -> fields
      nil -> []
    end
  end

  def render(assigns) do
    ~H"""
    <div>
      <.header>
        <%= @page_title %>
        <:actions>
          <.button type="button" phx-click="validate_document" class="btn-primary">
            Validate
          </.button>
        </:actions>
      </.header>

      <.main_content>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <%!-- Action Palette --%>
          <div class="lg:col-span-1 space-y-4">
            <h3 class="text-sm font-semibold text-base-content/80">Action Palette</h3>
            <%= for {group_name, actions} <- @action_groups do %>
              <div>
                <h4 class="text-xs font-medium uppercase tracking-wider text-base-content/60 mb-1.5"><%= group_name %></h4>
                <div class="space-y-1">
                  <%= for action <- actions do %>
                    <button type="button" phx-click="add_action" phx-value-type={action.type}
                      class="w-full flex items-center gap-2 px-3 py-2 text-sm bg-base-100 hover:bg-indigo-50 border border-base-300 rounded-lg transition-colors text-left">
                      <span class="font-medium text-base-content"><%= action.label %></span>
                      <span class="text-xs text-base-content/40 ml-auto"><%= action.desc %></span>
                    </button>
                  <% end %>
                </div>
              </div>
            <% end %>
          </div>

          <%!-- Step Sequence --%>
          <div class="lg:col-span-2 space-y-4">
            <h3 class="text-sm font-semibold text-base-content/80">
              Steps (<%= length(@steps) %>)
            </h3>

            <%= if @validation_result do %>
              <div class={"p-3 rounded-lg text-sm #{case @validation_result do {:ok, _} -> "bg-success/10 text-green-700"; {:error, _} -> "bg-error/10 text-red-700" end}"}>
                <%= case @validation_result do %>
                  <% {:ok, msg} -> %><%= msg %>
                  <% {:error, errors} -> %>
                    <ul class="list-disc list-inside space-y-1">
                      <%= for error <- errors do %>
                        <li><%= error %></li>
                      <% end %>
                    </ul>
                <% end %>
              </div>
            <% end %>

            <%= if @steps == [] do %>
              <div class="text-center py-12 border-2 border-dashed border-gray-300  rounded-lg">
                <p class="text-base-content/60">Click an action from the palette to add steps</p>
              </div>
            <% else %>
              <div class="space-y-2">
                <%= for {step, index} <- Enum.with_index(@steps) do %>
                  <div class="flex items-start gap-2 p-3 bg-base-100 border border-base-300 rounded-lg group">
                    <div class="flex flex-col gap-1 flex-shrink-0">
                      <button type="button" phx-click="move_up" phx-value-index={index}
                        class="text-gray-300 hover:text-gray-600 transition-colors disabled:opacity-30"
                        disabled={index == 0}>
                        <.icon name="hero-chevron-up-mini" class="w-4 h-4" />
                      </button>
                      <span class="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-100 text-primary text-xs font-bold">
                        <%= index + 1 %>
                      </span>
                      <button type="button" phx-click="move_down" phx-value-index={index}
                        class="text-gray-300 hover:text-gray-600 transition-colors disabled:opacity-30"
                        disabled={index == length(@steps) - 1}>
                        <.icon name="hero-chevron-down-mini" class="w-4 h-4" />
                      </button>
                    </div>
                    <div class="flex-1 min-w-0">
                      <span class="text-sm font-semibold text-base-content"><%= step["action"] %></span>
                      <div class="mt-2 flex gap-2 flex-wrap">
                        <%= for field <- action_fields(step["action"]) do %>
                          <div class="flex flex-col">
                            <label class="text-xs text-base-content/60 mb-0.5"><%= field %></label>
                            <input
                              type="text"
                              name={field}
                              value={step[field] || ""}
                              placeholder={field}
                              phx-blur="update_field"
                              phx-value-index={index}
                              class="text-xs px-2 py-1.5 border border-gray-300  rounded bg-base-200 text-base-content w-40"
                            />
                          </div>
                        <% end %>
                      </div>
                    </div>
                    <button type="button" phx-click="remove_action" phx-value-index={index}
                      class="flex-shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all">
                      <.icon name="hero-x-mark" class="w-4 h-4" />
                    </button>
                  </div>
                <% end %>
              </div>
            <% end %>

            <%!-- JSON Preview --%>
            <div class="mt-6">
              <h4 class="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-2">JSON Preview</h4>
              <pre class="p-4 bg-base-200 border border-base-300 rounded-lg text-xs font-mono text-base-content/80 overflow-x-auto"><%= Jason.encode!(%{"version" => 1, "steps" => @steps}, pretty: true) %></pre>
            </div>
          </div>
        </div>
      </.main_content>
    </div>
    """
  end
end
