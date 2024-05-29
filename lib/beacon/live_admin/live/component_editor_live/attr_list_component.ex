defmodule Beacon.LiveAdmin.ComponentEditorLive.AttrListComponent do
  use Beacon.LiveAdmin.Web, :live_component

  alias Beacon.Content.ComponentAttr
  alias Beacon.LiveAdmin.ComponentEditorLive.FormComponent

  def render(assigns) do
    ~H"""
    <div class="mt-4 py-4 rounded-lg">
      <div class="space-y-5 mx-auto max-w-7xl space-y-4">
        <div id={"#{@component_id}-attrs"}>
          <label class="block text-sm font-semibold leading-6 text-zinc-800 mb-2">Component Attributes</label>
          <div :for={form <- @attrs} id={"component#{@component_id}-attr#{form.id}"}>
            <.form for={form} phx-change="validate" phx-submit="blur" phx-target={@myself} class="min-w-0 flex-1 drag-ghost:opacity-0" phx-value-id={form.data.id}>
              <div class="mt-1 mb-4 space-y-8 bg-white">
                <div class="flex">
                  <div class="flex-auto block text-sm leading-6 text-zinc-900">
                    <input type="hidden" name={form[:component_id].name} value={form[:component_id].value} />

                    <div class="mb-1">
                      <label class="block text-sm leading-6 text-zinc-800">Attr Name</label>
                      <.input field={form[:name]} type="text" phx-target={@myself} phx-debounce="500" phx-blur={JS.dispatch("submit", to: "##{form.id}")} />
                    </div>

                    <div class="mb-1">
                      <label class="block text-sm leading-6 text-zinc-800">Type</label>
                      <.input field={form[:type]} type="text" phx-target={@myself} phx-debounce="500" phx-blur={JS.dispatch("submit", to: "##{form.id}")} />
                    </div>

                    <div class="mb-1">
                      <label class="block text-sm leading-6 text-zinc-800">Options</label>
                      <.input
                        field={form[:opts]}
                        type="text"
                        value={inspect(Phoenix.HTML.Form.input_value(form, :opts))}
                        phx-target={@myself}
                        phx-debounce="500"
                        phx-blur={JS.dispatch("submit", to: "##{form.id}")}
                      />
                    </div>
                  </div>

                  <button
                    :if={form.data.id}
                    type="button"
                    class="w-10 -mt-1 flex-none"
                    phx-click={
                      JS.push("delete", target: @myself, value: %{id: form.data.id})
                      |> hide("#component#{@component_id}-attr#{form.data.id}")
                    }
                  >
                    <.icon name="hero-x-mark" />
                  </button>
                </div>
              </div>
            </.form>
          </div>
        </div>

        <.button phx-click={JS.push("new", target: @myself, value: %{component_id: @component_id})} class="mt-4">
          Add new attribute
        </.button>
      </div>
    </div>
    """
  end

  def update(%{component: component} = _assigns, socket) do
    attr_forms = Enum.map(component.attrs, &build_attr_form(&1, %{component_id: component.id}))

    {:ok, assign(socket, component_id: component.id, attrs: attr_forms)}
  end

  def handle_event("new", %{"component_id" => component_id}, %{assigns: %{attrs: []}} = socket) do
    socket = update(socket, :attrs, fn attrs -> [build_empty_form(component_id)] end)

    {:noreply, socket}
  end

  def handle_event("new", %{"component_id" => component_id}, socket) do
    last_form_attr = socket.assigns.attrs |> Enum.reverse() |> hd()

    socket =
      if last_form_attr.id == "form-#{component_id}-" do
        socket
      else
        update(socket, :attrs, fn attrs -> attrs ++ [build_empty_form(component_id)] end)
      end

    {:noreply, socket}
  end

  def handle_event("validate", %{"component_attr" => attr_params} = params, socket) do
    attr = %ComponentAttr{id: params["id"] || nil, component_id: attr_params["component_id"]}
    attr_form = build_attr_form(attr, attr_params, :validate)

    attr_form_id = attr_form.id

    updated_attrs_form =
      Enum.map(socket.assigns.attrs, fn
        %{id: ^attr_form_id} -> attr_form
        attr -> attr
      end)

    if attr_form.source.valid? do
      send_attrs_to_parent(updated_attrs_form)
    end

    socket = update(socket, :attrs, fn _attrs -> updated_attrs_form end)

    {:noreply, socket}
  end

  def handle_event("blur", %{"id" => attr_id, "component_attr" => attr_params}, socket) do
    attr = %ComponentAttr{id: attr_id, component_id: attr_params["component_id"]}
    attr_form = build_attr_form(attr, attr_params, :validate)

    attr_form_id = attr_form.id

    updated_attrs_form =
      Enum.map(socket.assigns.attrs, fn
        %{id: ^attr_form_id} -> attr_form
        attr -> attr
      end)

    if attr_form.source.valid? do
      send_attrs_to_parent(updated_attrs_form)
    end

    socket = update(socket, :attrs, fn _attrs -> updated_attrs_form end)

    {:noreply, socket}
  end

  def handle_event("blur", %{"component_attr" => attr_params}, socket) do
    attr = %ComponentAttr{id: Ecto.UUID.generate(), component_id: attr_params["component_id"]}
    attr_form = build_attr_form(attr, attr_params, :validate)

    socket =
      update(socket, :attrs, fn attrs ->
        {_, attrs} = List.pop_at(attrs, -1)

        attrs ++ [attr_form]
      end)

    updated_attrs_form = socket.assigns.attrs

    if attr_form.source.valid? do
      send_attrs_to_parent(updated_attrs_form)
    end

    {:noreply, socket}
  end

  def handle_event("delete", %{"id" => attr_id}, socket) do
    updated_attrs_form = Enum.reject(socket.assigns.attrs, fn attr -> attr.data.id == attr_id end)

    send_attrs_to_parent(updated_attrs_form)

    {:noreply, update(socket, :attrs, fn _attrs -> updated_attrs_form end)}
  end

  defp build_attr_form(attr_or_changeset, params, action \\ nil) do
    changeset =
      attr_or_changeset
      |> Beacon.Content.change_component_attr(params)
      |> Map.put(:action, action)

    to_form(changeset, id: "form-#{changeset.data.component_id}-#{changeset.data.id}")
  end

  defp build_empty_form(component_id) do
    build_attr_form(%ComponentAttr{component_id: component_id}, %{})
  end

  defp send_attrs_to_parent(attr_forms) do
    valid_attr_forms = filter_valid_attrs_forms(attr_forms)

    send_update(FormComponent,
      id: "components-form-edit",
      attr_forms: valid_attr_forms
    )
  end

  defp filter_valid_attrs_forms(attr_forms) do
    Enum.filter(attr_forms, & &1.source.valid?)
  end
end
