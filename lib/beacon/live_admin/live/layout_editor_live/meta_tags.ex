defmodule Beacon.LiveAdmin.LayoutEditorLive.MetaTags do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Content
  alias Phoenix.HTML.Form

  @default_attributes ["name", "property", "content"]

  @impl true
  def menu_link(_), do: :skip

  @impl true
  def mount(_params, _session, socket) do
    {:ok,
     assign(socket,
       attributes: @default_attributes,
       extra_attributes: [],
       new_attribute_modal_visible?: false
     )}
  end

  @impl true
  def handle_params(%{"id" => id}, _url, socket) do
    site = socket.assigns.beacon_page.site
    beacon_layout = Content.get_layout(site, id)
    changeset = Content.change_layout(site, beacon_layout)

    {:noreply,
     socket
     |> assign(
       attributes: @default_attributes,
       extra_attributes: [],
       new_attribute_modal_visible?: false,
       beacon_layout: beacon_layout,
       meta_tags: beacon_layout.meta_tags
     )
     |> assign_field(changeset)
     |> assign_attributes()}
  end

  defp assign_field(socket, changeset) do
    form = to_form(changeset)
    assign(socket, :field, form[:meta_tags])
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

  def handle_event("save", %{"layout" => layout_params}, socket) do
    beacon_layout = socket.assigns.beacon_layout
    meta_tags = coerce_meta_tag_param(layout_params, "meta_tags") |> dbg

    case Content.update_layout(beacon_layout.site, beacon_layout, meta_tags) do
      {:ok, beacon_layout} ->
        changeset = Content.change_layout(beacon_layout.site, beacon_layout)

        {:noreply,
         socket
         |> assign(:beacon_layout, beacon_layout)
         |> assign_field(changeset)
         |> assign_attributes()}

      {:error, changeset} ->
        {:noreply,
         socket
         |> assign_field(changeset)
         |> assign_attributes()}
    end
  end

  # Convert params map %{"0" => %{...}, "1" => %{...}} into a list of maps
  def coerce_meta_tag_param(params, field) do
    case Map.fetch(params, field) do
      {:ok, map} ->
        list = Enum.sort_by(map, fn {key, _value} -> String.to_integer(key) end)
        Map.put(params, field, Keyword.values(list))

      :error ->
        params
    end
  end

  defp input_name(form_field, index, attribute) do
    Form.input_name(form_field.form, form_field.field) <> "[#{index}][#{attribute}]"
  end

  defp input_id(formd_field, index, attribute) do
    Form.input_id(formd_field.form, formd_field.field) <> "_#{index}_#{attribute}"
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div>
      <Beacon.LiveAdmin.AdminComponents.layout_menu socket={@socket} site={@beacon_layout.site} current_action={@live_action} layout_id={@beacon_layout.id} />

      <.header>
        <:actions>
          <.button phx-disable-with="Saving..." form="meta-tags-form" class="uppercase">Save Changes</.button>
        </:actions>
      </.header>

      <div>
        <.button type="button" phx-click="add">New Meta Tag</.button>
        <.button type="button" phx-click="show-new-attribute-modal">New Meta Attribute</.button>
      </div>

      <div class="overflow-x-auto mt-8">
        <.form for={%{}} as={:meta_tags} id="meta-tags-form" class="space-y-2" phx-submit="save">
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

              <.button type="button" phx-click="delete" phx-value-index={i} data-confirm="Are you sure?">Delete</.button>
            </div>
          <% end %>
        </.form>
      </div>

      <.modal :if={@new_attribute_modal_visible?} id="new-attribute-modal" show={true} on_cancel={JS.push("hide-new-attribute-modal")}>
        <.header>New meta tag attribute</.header>

        <.simple_form :let={f} for={%{}} as={:attribute} phx-submit="save-new-attribute">
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
end
