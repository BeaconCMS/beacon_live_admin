defmodule Beacon.LiveAdmin.AuthorManagerLive do
  @moduledoc false

  use Beacon.LiveAdmin.PageBuilder
  alias Beacon.LiveAdmin.Client.Content

  @impl true
  def menu_link("/authors", action) when action in [:index, :edit], do: {:root, "Authors"}
  def menu_link(_, _), do: :skip

  @impl true
  def handle_params(params, _url, socket) do
    site = socket.assigns.beacon_page.site
    authors = Content.list_authors(site)

    {:noreply,
     socket
     |> assign(:authors, authors)
     |> assign(:show_form, false)
     |> assign(:editing, nil)
     |> assign(:form_data, default_form())
     |> assign(page_title: "Authors")}
  end

  defp default_form do
    %{"name" => "", "slug" => "", "bio" => "", "job_title" => "", "avatar_url" => "", "credentials" => "", "same_as" => ""}
  end

  @impl true
  def handle_event("new", _, socket) do
    {:noreply, assign(socket, show_form: true, editing: nil, form_data: default_form())}
  end

  def handle_event("cancel", _, socket) do
    {:noreply, assign(socket, show_form: false, editing: nil)}
  end

  def handle_event("edit", %{"id" => id}, socket) do
    site = socket.assigns.beacon_page.site
    author = Content.get_author(site, id)

    {:noreply,
     assign(socket,
       show_form: true,
       editing: author,
       form_data: %{
         "name" => author.name || "",
         "slug" => author.slug || "",
         "bio" => author.bio || "",
         "job_title" => author.job_title || "",
         "avatar_url" => author.avatar_url || "",
         "credentials" => author.credentials || "",
         "same_as" => Enum.join(author.same_as || [], "\n")
       }
     )}
  end

  def handle_event("validate", %{"author" => params}, socket) do
    {:noreply, assign(socket, :form_data, params)}
  end

  def handle_event("save", %{"author" => params}, socket) do
    site = socket.assigns.beacon_page.site

    same_as = params["same_as"] |> String.split("\n") |> Enum.map(&String.trim/1) |> Enum.reject(&(&1 == ""))

    attrs = %{
      "site" => site,
      "name" => params["name"],
      "slug" => params["slug"],
      "bio" => params["bio"],
      "job_title" => params["job_title"],
      "avatar_url" => params["avatar_url"],
      "credentials" => params["credentials"],
      "same_as" => same_as
    }

    result =
      case socket.assigns.editing do
        nil -> Content.create_author(site, attrs)
        author -> Content.update_author(site, author, attrs)
      end

    case result do
      {:ok, _} ->
        authors = Content.list_authors(site)
        {:noreply, socket |> assign(authors: authors, show_form: false, editing: nil) |> put_flash(:info, "Author saved")}

      {:error, _} ->
        {:noreply, put_flash(socket, :error, "Failed to save author")}
    end
  end

  def handle_event("delete", %{"id" => id}, socket) do
    site = socket.assigns.beacon_page.site
    author = Content.get_author(site, id)

    case Content.delete_author(site, author) do
      {:ok, _} ->
        authors = Content.list_authors(site)
        {:noreply, socket |> assign(authors: authors) |> put_flash(:info, "Author deleted")}

      {:error, _} ->
        {:noreply, put_flash(socket, :error, "Failed to delete author")}
    end
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="mx-auto max-w-6xl py-6 px-4">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Authors</h1>
        <button phx-click="new" class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">
          New Author
        </button>
      </div>

      <%= if @show_form do %>
        <div class="bg-white border rounded-lg p-6 mb-6">
          <h2 class="text-lg font-medium mb-4"><%= if @editing, do: "Edit Author", else: "New Author" %></h2>
          <form phx-submit="save" phx-change="validate" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" name="author[name]" value={@form_data["name"]} class="w-full rounded-md border-gray-300 text-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input type="text" name="author[slug]" value={@form_data["slug"]} placeholder="jane-doe" class="w-full rounded-md border-gray-300 text-sm" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <input type="text" name="author[job_title]" value={@form_data["job_title"]} class="w-full rounded-md border-gray-300 text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea name="author[bio]" rows="3" class="w-full rounded-md border-gray-300 text-sm"><%= @form_data["bio"] %></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
              <input type="text" name="author[avatar_url]" value={@form_data["avatar_url"]} class="w-full rounded-md border-gray-300 text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Credentials</label>
              <textarea name="author[credentials]" rows="2" class="w-full rounded-md border-gray-300 text-sm"><%= @form_data["credentials"] %></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">External Profiles (one URL per line)</label>
              <textarea name="author[same_as]" rows="3" placeholder="https://linkedin.com/in/jane-doe&#10;https://twitter.com/janedoe" class="w-full rounded-md border-gray-300 text-sm"><%= @form_data["same_as"] %></textarea>
            </div>
            <div class="flex gap-2 pt-2">
              <button type="submit" class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700">Save</button>
              <button type="button" phx-click="cancel" class="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200">Cancel</button>
            </div>
          </form>
        </div>
      <% end %>

      <div class="bg-white rounded-lg border overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <%= for author <- @authors do %>
              <tr>
                <td class="px-4 py-3 text-sm font-medium text-gray-900"><%= author.name %></td>
                <td class="px-4 py-3 text-sm font-mono text-gray-600"><%= author.slug %></td>
                <td class="px-4 py-3 text-sm text-gray-600"><%= author.job_title %></td>
                <td class="px-4 py-3 text-right space-x-2">
                  <button phx-click="edit" phx-value-id={author.id} class="text-indigo-600 hover:text-indigo-900 text-sm">Edit</button>
                  <button phx-click="delete" phx-value-id={author.id} data-confirm="Delete this author?" class="text-red-600 hover:text-red-900 text-sm">Delete</button>
                </td>
              </tr>
            <% end %>
            <%= if @authors == [] do %>
              <tr>
                <td colspan="4" class="px-4 py-8 text-center text-sm text-gray-500">No authors created yet</td>
              </tr>
            <% end %>
          </tbody>
        </table>
      </div>
    </div>
    """
  end
end
