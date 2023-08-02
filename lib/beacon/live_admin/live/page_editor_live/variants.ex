defmodule Beacon.LiveAdmin.PageEditorLive.Variants do
  @moduledoc false
  use Beacon.LiveAdmin.PageBuilder

  alias Beacon.LiveAdmin.Content

  def menu_link("/pages", :variants), do: {:submenu, "Pages"}
  def menu_link(_, _), do: :skip

  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  # For switching between selected variants, first load has already happened
  def handle_params(params, _url, %{assigns: %{page: %{}}} = socket) do
    {:noreply, assign_selected(socket, params["variant"])}
  end

  # For the first page load
  def handle_params(params, _url, socket) do
    page = Content.get_page(socket.assigns.beacon_page.site, params["page"], [:variants])

    socket =
      socket
      |> assign(page: page)
      |> assign(language: language(page.format))
      |> assign(page_title: "Variants")
      |> assign_selected(params["variant"])
      |> assign_form()

    {:noreply, socket}
  end

  def handle_event("select-" <> variant_id, _, socket) do
    %{page: page} = socket.assigns
    path = beacon_live_admin_path(socket, page.site, "/pages/#{page.id}/variants/#{variant_id}")

    {:noreply, push_redirect(socket, to: path)}
  end

  def handle_event("variant_editor_lost_focus", %{"value" => template}, socket) do
    {:noreply, assign(socket, changed_template: template)}
  end

  def handle_event("validate", %{"page_variant" => params}, socket) do
    %{selected: selected, beacon_page: %{site: site}} = socket.assigns

    form =
      site
      |> Content.change_page_variant(selected, params)
      |> Map.put(:action, :insert)
      |> to_form()

    {:noreply, assign(socket, form: form)}
  end

  def handle_event("save_changes", %{"page_variant" => params}, socket) do
    %{page: page, selected: selected, beacon_page: %{site: site}} = socket.assigns

    attrs = %{name: params["name"], weight: params["weight"], template: params["template"]}

    socket =
      case Content.update_variant_for_page(site, page, selected, attrs) do
        {:ok, updated_page} ->
          socket
          |> assign(page: updated_page)
          |> assign_selected(selected.id)
          |> assign_form()

        {:error, changeset} ->
          assign(socket, form: to_form(changeset))
      end

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
          <.form :let={f} for={@form} class="flex items-center" phx-change="validate" phx-submit="save_changes">
            <div class="text-4xl mr-4 w-max">
              Name
            </div>
            <div class="w-1/2">
              <.input field={f[:name]} type="text" />
            </div>
            <div class="text-4xl mx-4 w-max">
              Weight
            </div>
            <div class="w-1/12">
              <.input field={f[:weight]} type="number" min="0" max="100" />
            </div>
            <.input field={f[:template]} type="hidden" value={@changed_template} />

            <.button phx-disable-with="Saving..." class="ml-4 w-1/6 uppercase">Save Changes</.button>
          </.form>
          <%= template_error(@form[:template]) %>
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
      [] -> assign(socket, selected: %{name: "", weight: "", template: ""}, changed_template: "")
      [variant | _] -> assign(socket, selected: variant, changed_template: variant.template)
    end
  end

  defp assign_selected(socket, variant_id) do
    selected = Enum.find(socket.assigns.page.variants, &(&1.id == variant_id))
    assign(socket, selected: selected, changed_template: selected.template)
  end

  defp assign_form(socket) do
    %{selected: selected, beacon_page: %{site: site}} = socket.assigns

    form =
      site
      |> Content.change_page_variant(selected)
      |> to_form()

    assign(socket, form: form)
  end

  defp template_error(field) do
    {message, compilation_error} =
      case field.errors do
        [{message, [compilation_error: compilation_error]} | _] -> {message, compilation_error}
        [{message, _}] -> {message, nil}
        _ -> {nil, nil}
      end

    assigns = %{
      message: message,
      compilation_error: compilation_error
    }

    ~H"""
    <.error :if={@message}><%= @message %></.error>
    <code :if={@compilation_error} class="mt-3 text-sm text-rose-600 phx-no-feedback:hidden">
      <pre><%= @compilation_error %></pre>
    </code>
    """
  end

  defp language("heex" = _format), do: "html"
  defp language(:heex), do: "html"
  defp language(format), do: to_string(format)
end
