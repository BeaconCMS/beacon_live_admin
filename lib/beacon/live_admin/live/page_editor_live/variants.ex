defmodule Beacon.LiveAdmin.PageEditorLive.Variants do
  @moduledoc false
  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Content

  def menu_link("/pages", :variants), do: {:submenu, "Pages"}
  def menu_link(_, _), do: :skip

  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  def handle_params(%{"id" => id} = params, _url, socket) do
    page = Content.get_page(socket.assigns.beacon_page.site, id)

    index =
      params
      |> Map.get("index", "0")
      |> String.to_integer()

    variants =
      Enum.with_index(page.variants, fn variant, index ->
        variant
        |> Map.from_struct()
        |> Map.put(:index, index)
      end)

    socket =
      assign(socket,
        page: page,
        variants: variants,
        language: language(page.format),
        template: Enum.at(variants, index).template
      )

    {:noreply, socket}
  end

  def handle_event("add", _, socket) do
    new_variant = %{
      name: "New Variant",
      weight: 0,
      template: IO.inspect(socket.assigns.page.template),
      index: length(socket.assigns.variants)
    }

    {:noreply, assign(socket, variants: socket.assigns.variants ++ [new_variant])}
  end

  def handle_event("select-" <> index, _, socket) do
    %{page: page} = socket.assigns
    path = beacon_live_admin_path(socket, page.site, "/pages/#{page.id}/variants/#{index}")

    {:noreply, push_redirect(socket, to: path)}
  end

  def handle_event("variant_editor_lost_focus", %{"value" => _template}, socket) do
    {:noreply, socket}
  end

  def render(assigns) do
    ~H"""
    <div>
      <Beacon.LiveAdmin.AdminComponents.page_menu socket={@socket} site={@beacon_page.site} current_action={@live_action} page_id={@page.id} />

      <div class="mx-auto grid grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <div>
          <.button type="button" phx-click="add">
            New Variant
          </.button>
          <.table id="variants" rows={@variants} row_click={fn row -> "select-#{row.index}" end}>
            <:col :let={variant} :for={{attr, suffix} <- [{:name, ""}, {:weight, " (%)"}]} label={"#{attr}#{suffix}"}>
              <%= variant[attr] %>
            </:col>
          </.table>
        </div>

        <div class="w-full col-span-2">
          <div class="w-full mt-10 space-y-8">
            <div class="py-3 bg-[#282c34] rounded-lg">
              <LiveMonacoEditor.code_editor path="variant" style="min-height: 1000px; width: 100%;" value={@template} opts={Map.merge(LiveMonacoEditor.default_opts(), %{"language" => @language})} />
            </div>
          </div>
        </div>
      </div>
    </div>
    """
  end

  defp language("heex" = _format), do: "html"
  defp language(:heex), do: "html"
  defp language(format), do: to_string(format)
end
