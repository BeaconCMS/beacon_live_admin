defmodule Beacon.LiveAdmin.MetaTagsComponent do
  use Beacon.LiveAdmin.Web, :live_component

  alias Phoenix.HTML.Form

  @default_attributes ["name", "property", "content"]

  @impl true
  def mount(socket) do
    {:ok,
     assign(socket,
       attributes: @default_attributes,
       extra_attributes: [],
       new_attribute_modal_visible?: false
     )}
  end

  @impl true
  def update(assigns, socket) do
    socket =
      socket
      |> assign(assigns)
      |> assign_attributes()

    {:ok, socket}
  end

  defp assign_attributes(socket) do
    # Fetch the meta tags from the form field
    form_field = socket.assigns.field
    meta_tags = Form.input_value(form_field.form, form_field.field)

    # Aggregate all known meta tag attributes
    attributes =
      Enum.uniq(
        socket.assigns.attributes ++
          Enum.flat_map(meta_tags, &Map.keys/1) ++ socket.assigns.extra_attributes
      )

    assign(socket, meta_tags: meta_tags, attributes: attributes)
  end

  @impl true
  def handle_event("add", _, socket) do
    meta_tags = [%{} | socket.assigns.meta_tags]
    {:noreply, assign(socket, :meta_tags, meta_tags)}
  end

  def handle_event("delete", %{"index" => index}, socket) do
    meta_tags =
      case Integer.parse(index) do
        {index, _} -> List.delete_at(socket.assigns.meta_tags, index)
        :error -> socket.assigns.meta_tags
      end

    {:noreply, assign(socket, :meta_tags, meta_tags)}
  end

  def handle_event("show-new-attribute-modal", _, socket) do
    {:noreply, assign(socket, :new_attribute_modal_visible?, true)}
  end

  def handle_event("hide-new-attribute-modal", _, socket) do
    {:noreply, assign(socket, :new_attribute_modal_visible?, false)}
  end

  def handle_event("save-new-attribute", %{"attribute" => %{"name" => name}}, socket) do
    # Basic validation
    extra_attributes =
      case String.trim(name) do
        "" -> socket.assigns.extra_attributes
        name -> Enum.uniq(socket.assigns.extra_attributes ++ [name])
      end

    {:noreply,
     socket
     |> assign(extra_attributes: extra_attributes, new_attribute_modal_visible?: false)
     |> assign_attributes()}
  end

  def handle_event("save", params, socket) do
    send(self(), {__MODULE__, {:save, params}})
    {:noreply, socket}
  end

  # Convert params map %{"0" => %{...}, "1" => %{...}} into a list of maps
  def coerce_meta_tag_params(params) do
    field = "meta_tags"

    case Map.fetch(params, field) do
      {:ok, map} ->
        list = Enum.sort_by(map, fn {key, _value} -> String.to_integer(key) end)
        Map.put(params, field, Keyword.values(list))

      :error ->
        params
    end
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div>
      <.header>
        <%= @page_title %>
        <:actions>
          <.button phx-disable-with="Saving..." form="meta-tags-form" class="uppercase">Save Changes</.button>
        </:actions>
      </.header>

      <div>
        <.button type="button" phx-click="add" phx-target={@myself}>New Meta Tag</.button>
        <.button type="button" phx-click="show-new-attribute-modal" phx-target={@myself}>New Meta Attribute</.button>
      </div>

      <div class="mt-8 overflow-x-auto">
        <.form for={%{}} as={:meta_tags} id="meta-tags-form" class="space-y-2" phx-target={@myself} phx-submit="save">
          <%= for {meta_tag, i} <- Enum.with_index(@meta_tags) do %>
            <div class="flex items-end gap-2 my-2">
              <%= for attribute <- @attributes do %>
                <div class="min-w-[150px] shrink-0">
                  <.input
                    type="text"
                    label={if(i == 0, do: attribute, else: nil)}
                    name={input_name(@field, i, attribute)}
                    id={input_id(@field, i, attribute)}
                    value={meta_tag[attribute]}
                    errors={[]}
                    phx-debounce="500"
                  />
                </div>
              <% end %>

              <.button type="button" phx-target={@myself} phx-click="delete" phx-value-index={i} data-confirm="Are you sure?">Delete</.button>
            </div>
          <% end %>
        </.form>
      </div>

      <.modal :if={@new_attribute_modal_visible?} id="new-attribute-modal" show={true} on_cancel={JS.push("hide-new-attribute-modal")}>
        <.header>New meta tag attribute</.header>

        <.simple_form :let={f} for={%{}} as={:attribute} phx-target={@myself} phx-submit="save-new-attribute">
          <div class="flex items-center gap-2">
            <%= for preset <- ~w(http-equiv charset itemprop) do %>
              <.button phx-click={JS.set_attribute({"value", preset}, to: "#attribute_name")}><%= preset %></.button>
            <% end %>
          </div>

          <div>
            <.input type="text" field={f[:name]} placeholder="Custom" label="Custom attribute" />
            <.button class="mt-2">Add custom attribute</.button>
          </div>
        </.simple_form>
      </.modal>
    </div>
    """
  end

  defp input_name(form_field, index, attribute) do
    Form.input_name(form_field.form, form_field.field) <> "[#{index}][#{attribute}]"
  end

  defp input_id(formd_field, index, attribute) do
    Form.input_id(formd_field.form, formd_field.field) <> "_#{index}_#{attribute}"
  end
end
