defmodule Beacon.LiveAdmin.PageEditorLive.Variants do
  @moduledoc false
  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Content

  def menu_link("/pages", :variants), do: {:submenu, "Pages"}
  def menu_link(_, _), do: :skip

  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  def handle_params(params, _url, %{assigns: %{page: %{}}} = socket) do
    {:noreply, assign_selected(socket, params["variant"])}
  end

  def handle_params(params, _url, socket) do
    page = Content.get_page(socket.assigns.beacon_page.site, params["page"], [:variants])
    changeset = Ecto.Changeset.change({%{}, %{name: :string, weight: :integer}})

    socket =
      socket
      |> assign(page: page)
      |> assign(variant_changeset: changeset)
      |> assign(language: language(page.format))
      |> assign(page_title: "Variants")
      |> assign_selected(params["variant"])

    {:noreply, socket}
  end

  def handle_event("select-" <> variant_id, _, socket) do
    %{page: page} = socket.assigns
    path = beacon_live_admin_path(socket, page.site, "/pages/#{page.id}/variants/#{variant_id}")

    {:noreply, push_redirect(socket, to: path)}
  end

  def handle_event("variant_editor_lost_focus", %{"value" => _template}, socket) do
    {:noreply, socket}
  end

  def handle_event("save_changes", %{"variant" => params}, socket) do
    %{page: page, selected: selected, beacon_page: %{site: site}} = socket.assigns

    attrs = %{name: params["name"], weight: params["weight"]}
    {:ok, updated_page} = Content.update_variant_for_page(site, page, selected, attrs)

    socket =
      socket
      |> assign(page: updated_page)
      |> assign_selected(params["variant"])

    {:noreply, socket}
  end

  def handle_event("create_new", _params, socket) do
    %{page: page, beacon_page: %{site: site}} = socket.assigns

    attrs = %{name: "New Variant", weight: 0, template: page.template}
    {:ok, updated_page} = Content.create_variant_for_page(site, page, attrs)

    {:noreply, assign(socket, page: updated_page)}
  end

  def render(assigns) do
    ~H"""
    <div>
      <Beacon.LiveAdmin.AdminComponents.page_menu socket={@socket} site={@beacon_page.site} current_action={@live_action} page_id={@page.id} />

      <.header>
        <%= @page_title %>
      </.header>

      <div class="mx-auto grid grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <div>
          <.button type="button" phx-click="create_new">
            New Variant
          </.button>
          <.table id="variants" rows={@page.variants} row_click={fn row -> "select-#{row.id}" end}>
            <:col :let={variant} :for={{attr, suffix} <- [{:name, ""}, {:weight, " (%)"}]} label={"#{attr}#{suffix}"}>
              <%= Map.fetch!(variant, attr) %>
            </:col>
          </.table>
        </div>

        <div class="w-full col-span-2">
          <.form :let={f} for={to_form(@variant_changeset, as: :variant)} class="flex items-center" phx-submit="save_changes">
            <div class="text-4xl mr-4 w-max">
              Name
            </div>
            <div class="w-1/2">
              <.input field={f[:name]} type="text" value={@selected.name} />
            </div>
            <div class="text-4xl mx-4 w-max">
              Weight
            </div>
            <div class="w-1/12">
              <.input field={f[:weight]} type="number" value={@selected.weight} min="0" max="100" />
            </div>
            <.button phx-disable-with="Saving..." class="ml-4 w-1/6 uppercase">Save Changes</.button>
          </.form>
          <div class="w-full mt-10 space-y-8">
            <div class="py-3 bg-[#282c34] rounded-lg">
              <LiveMonacoEditor.code_editor
                path="variant"
                style="min-height: 1000px; width: 100%;"
                value={@selected.template}
                opts={Map.merge(LiveMonacoEditor.default_opts(), %{"language" => @language})}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    """
  end

  defp assign_selected(socket, nil) do
    case socket.assigns.page.variants do
      [] -> assign(socket, selected: %{name: "", weight: "", template: ""})
      [variant | _] -> assign(socket, selected: variant)
    end
  end

  defp assign_selected(socket, variant_id) do
    selected = Enum.find(socket.assigns.page.variants, &(&1.id == variant_id))
    assign(socket, selected: selected)
  end

  defp language("heex" = _format), do: "html"
  defp language(:heex), do: "html"
  defp language(format), do: to_string(format)
end
