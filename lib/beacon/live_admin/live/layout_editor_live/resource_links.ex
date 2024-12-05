defmodule Beacon.LiveAdmin.LayoutEditorLive.ResourceLinks do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Client.Content
  alias Phoenix.HTML.Form

  @default_attributes ~w(rel href)

  def menu_link("/layouts", :resource_links), do: {:submenu, "Layouts"}
  def menu_link(_, _), do: :skip

  def handle_params(%{"id" => id}, _url, socket) do
    %{beacon_page: %{site: site}} = socket.assigns
    beacon_layout = Content.get_layout(site, id)
    changeset = Content.change_layout(site, beacon_layout)

    socket =
      socket
      |> assign(attributes: @default_attributes)
      |> assign(extra_attributes: [])
      |> assign(beacon_layout: beacon_layout)
      |> assign(show_modal: false)
      |> assign(page_title: "Resource Links")
      |> assign_field(changeset)
      |> assign_attributes()

    {:noreply, socket}
  end

  def handle_event("add", _, socket) do
    %{resource_links: resource_links} = socket.assigns

    {:noreply, assign(socket, resource_links: [%{} | resource_links])}
  end

  def handle_event("delete", %{"index" => index}, socket) do
    resource_links =
      case Integer.parse(index) do
        {index, _} -> List.delete_at(socket.assigns.resource_links, index)
        :error -> socket.assigns.resource_links
      end

    {:noreply, assign(socket, resource_links: resource_links)}
  end

  def handle_event("show-new-attribute-modal", _, socket) do
    {:noreply, assign(socket, show_modal: true)}
  end

  def handle_event("hide-new-attribute-modal", _, socket) do
    {:noreply, assign(socket, show_modal: false)}
  end

  def handle_event("save-new-attribute", %{"attribute" => %{"name" => name}}, socket) do
    # Basic validation
    extra_attributes =
      case String.trim(name) do
        "" -> socket.assigns.extra_attributes
        name -> Enum.uniq(socket.assigns.extra_attributes ++ [name])
      end

    socket =
      socket
      |> assign(extra_attributes: extra_attributes, show_modal: false)
      |> assign_attributes()

    {:noreply, socket}
  end

  def handle_event("save", params, socket) do
    %{beacon_layout: beacon_layout} = socket.assigns

    resource_links =
      case params do
        %{"layout" => layout_params} -> coerce_resource_link_params(layout_params)
        _ -> %{"resource_links" => []}
      end

    socket =
      case Content.update_layout(beacon_layout.site, beacon_layout, resource_links) do
        {:ok, layout} ->
          changeset = Content.change_layout(layout.site, layout)

          socket
          |> assign(:beacon_layout, layout)
          |> assign_field(changeset)
          |> assign_attributes()
          |> put_flash(:info, "Layout updated successfully")

        {:error, changeset} ->
          assign_field(socket, changeset)
      end

    {:noreply, socket}
  end

  defp assign_field(socket, changeset) do
    field = to_form(changeset)[:resource_links]
    assign(socket, :field, field)
  end

  def render(assigns) do
    ~H"""
    <div>
      <Beacon.LiveAdmin.AdminComponents.layout_header socket={@socket} flash={@flash} beacon_layout={@beacon_layout} live_action={@live_action} />

      <.header>
        {@page_title}
        <:actions>
          <.button phx-disable-with="Saving..." form="resource-links-form" class="uppercase">Save Changes</.button>
        </:actions>
      </.header>

      <.main_content>
        <div class="flex gap-4">
          <.button type="button" phx-click="add">New Resource Link</.button>
          <.button type="button" phx-click="show-new-attribute-modal">New Attribute</.button>
        </div>

        <div class="mt-8 overflow-x-auto">
          <.form for={%{}} as={:resource_links} id="resource-links-form" class="divide-y divide-gray-100" phx-submit="save">
            <%= for {resource_link, i} <- Enum.with_index(@resource_links) do %>
              <div class="grid items-end grid-flow-col gap-2 py-5 ">
                <%= for attribute <- @attributes do %>
                  <div class="min-w-[150px] shrink-0">
                    <.input
                      type="text"
                      label={if(i == 0, do: attribute, else: nil)}
                      name={input_name(@field, i, attribute)}
                      id={input_id(@field, i, attribute)}
                      value={resource_link[attribute]}
                      errors={[]}
                      phx-debounce="500"
                    />
                  </div>
                <% end %>
                <div class="justify-self-end">
                  <button type="button" class="flex items-center justify-center w-10 h-10" phx-click="delete" phx-value-index={i} aria-label="Delete" title="delete" data-confirm="Are you sure?">
                    <span aria-hidden="true" class="text-red-500 hover:text-red-700 hero-trash"></span>
                  </button>
                </div>
              </div>
            <% end %>
          </.form>
        </div>

        <.modal :if={@show_modal} id="new-attribute-modal" show={true} on_cancel={JS.push("hide-new-attribute-modal")}>
          <.header>New Resource Link attribute</.header>

          <.simple_form :let={f} for={%{}} as={:attribute} phx-submit="save-new-attribute">
            <div class="flex items-center gap-2">
              <%= for preset <- ~w(type crossorigin sizes as) do %>
                <.button phx-click={JS.set_attribute({"value", preset}, to: "#attribute_name")}>{preset}</.button>
              <% end %>
            </div>

            <div>
              <.input type="text" field={f[:name]} placeholder="Custom" label="Custom attribute" />
              <.button class="mt-2">Add custom attribute</.button>
            </div>
          </.simple_form>
        </.modal>
      </.main_content>
    </div>
    """
  end

  defp assign_attributes(socket) do
    # Fetch the resource links from the form field
    form_field = socket.assigns.field
    resource_links = Form.input_value(form_field.form, form_field.field)

    # Aggregate all known resource link attributes
    attributes =
      Enum.uniq(
        socket.assigns.attributes ++
          Enum.flat_map(resource_links, &Map.keys/1) ++ socket.assigns.extra_attributes
      )

    assign(socket, resource_links: resource_links, attributes: attributes)
  end

  # Convert params map %{"0" => %{...}, "1" => %{...}} into a list of maps
  def coerce_resource_link_params(params) do
    field = "resource_links"

    case Map.fetch(params, field) do
      {:ok, map} ->
        list =
          map
          |> Enum.sort_by(&String.to_integer(elem(&1, 0)))
          |> Enum.map(fn {_position, map} -> strip_empty_values(map) end)

        Map.put(params, field, list)

      :error ->
        params
    end
  end

  defp strip_empty_values(map) do
    Map.reject(map, fn {_key, value} -> value in [nil, ""] end)
  end

  defp input_name(form_field, index, attribute) do
    Form.input_name(form_field.form, form_field.field) <> "[#{index}][#{attribute}]"
  end

  defp input_id(formd_field, index, attribute) do
    Form.input_id(formd_field.form, formd_field.field) <> "_#{index}_#{attribute}"
  end
end
