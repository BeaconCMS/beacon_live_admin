defmodule Beacon.LiveAdmin.PageEditorLive.Schema do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Client.Content

  @impl true
  def menu_link("/layouts", :schema), do: {:submenu, "Layouts"}
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(%{"id" => id}, _url, socket) do
    site = socket.assigns.beacon_page.site
    page = Content.get_page(site, id)
    changeset = Content.change_page(site, page)

    {:noreply,
     socket
     |> assign(:page, page)
     |> assign_form(changeset)
     |> assign(page_title: "Schema")
     |> assign(:raw_schema, Jason.encode!(page.raw_schema, pretty: true))}
  end

  @schema_templates %{
    "Article" => Jason.encode!([%{
      "@context" => "https://schema.org",
      "@type" => "Article",
      "headline" => "{{ page.title }}",
      "description" => "{{ page.description }}",
      "image" => "",
      "datePublished" => "",
      "dateModified" => "",
      "author" => %{"@type" => "Person", "name" => ""},
      "publisher" => %{"@type" => "Organization", "name" => ""}
    }], pretty: true),
    "FAQPage" => Jason.encode!([%{
      "@context" => "https://schema.org",
      "@type" => "FAQPage",
      "mainEntity" => [%{
        "@type" => "Question",
        "name" => "Question text here",
        "acceptedAnswer" => %{"@type" => "Answer", "text" => "Answer text here"}
      }]
    }], pretty: true),
    "Product" => Jason.encode!([%{
      "@context" => "https://schema.org",
      "@type" => "Product",
      "name" => "",
      "description" => "",
      "image" => "",
      "brand" => %{"@type" => "Brand", "name" => ""},
      "offers" => %{"@type" => "Offer", "price" => "", "priceCurrency" => "USD", "availability" => "https://schema.org/InStock"}
    }], pretty: true),
    "HowTo" => Jason.encode!([%{
      "@context" => "https://schema.org",
      "@type" => "HowTo",
      "name" => "How to...",
      "step" => [%{"@type" => "HowToStep", "name" => "Step 1", "text" => "Description of step 1"}]
    }], pretty: true)
  }

  @impl true
  def handle_event("set_raw_schema", %{"value" => value}, socket) do
    {:noreply, assign(socket, :raw_schema, value)}
  end

  def handle_event("insert_template", %{"type" => type}, socket) do
    template = Map.get(@schema_templates, type, "[]")
    {:noreply, assign(socket, :raw_schema, template)}
  end

  def handle_event("save", _, socket) do
    page = socket.assigns.page
    attrs = %{"raw_schema" => socket.assigns.raw_schema}

    case Content.update_page(page.site, page, attrs) do
      {:ok, page} ->
        changeset = Content.change_page(page.site, page)

        {:noreply,
         socket
         |> assign_form(changeset)
         |> put_flash(:info, "Page updated successfully")}

      {:error, changeset} ->
        {message, _} = Keyword.fetch!(changeset.errors, :raw_schema)

        changeset =
          page.site
          |> Content.change_page(page)
          |> Map.put(:action, :validate)
          |> Ecto.Changeset.add_error(:raw_schema, "invalid", compilation_error: message)

        {:noreply, assign_form(socket, changeset)}
    end
  end

  defp assign_form(socket, changeset) do
    assign(socket, :form, to_form(changeset))
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div>
      <Beacon.LiveAdmin.AdminComponents.page_header socket={@socket} flash={@flash} page={@page} live_action={@live_action} />

      <.header>
        <%= @page_title %>
        <:actions>
          <.button phx-disable-with="Saving..." phx-click="save" class="btn-primary">Save Changes</.button>
        </:actions>
      </.header>

      <div class="w-full mt-4 space-y-8">
        <div class="flex items-center gap-3">
          <label class="text-sm font-medium text-gray-500">Insert Template:</label>
          <button :for={type <- ["Article", "FAQPage", "Product", "HowTo"]} phx-click="insert_template" phx-value-type={type} class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors">
            <%= type %>
          </button>
        </div>
        <%= template_error(@form[:raw_schema]) %>
        <div class="py-6 rounded-[1.25rem] bg-[#0D1829] [&_.monaco-editor-background]:!bg-[#0D1829] [&_.margin]:!bg-[#0D1829]">
          <LiveMonacoEditor.code_editor
            path="raw_schema"
            class="col-span-full lg:col-span-2"
            value={@raw_schema}
            change="set_raw_schema"
            opts={Map.merge(LiveMonacoEditor.default_opts(), %{"language" => "json"})}
          />
        </div>
      </div>
    </div>
    """
  end
end
