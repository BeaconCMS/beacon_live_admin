defmodule Beacon.LiveAdmin.Fixtures do
  import Beacon.LiveAdminTest.Cluster, only: [rpc: 4]

  defp get_lazy(attrs, key, fun) when is_map(attrs), do: Map.get_lazy(attrs, key, fun)
  defp get_lazy(attrs, key, fun) when is_list(attrs), do: Keyword.get_lazy(attrs, key, fun)

  def node1, do: :"node1@127.0.0.1"

  def layout_fixture(node \\ node1(), attrs \\ %{}) do
    attrs =
      Enum.into(attrs, %{
        site: "site_a",
        title: "Site A - Main Layout",
        meta_tags: [],
        stylesheet_urls: [],
        template: """
        <header>site_a_header</header>
        <%= @inner_content %>
        """
      })

    rpc(node, Beacon.Content, :create_layout!, [attrs])
  end

  def page_fixture(node \\ node1(), attrs \\ %{}) do
    layout_id = get_lazy(attrs, :layout_id, fn -> layout_fixture().id end)

    attrs =
      Enum.into(attrs, %{
        path: "/home",
        site: "site_a",
        title: "site_a_home_page",
        description: "site_a_home_page_desc",
        layout_id: layout_id,
        template: """
        <main>
          <h1>site_a home page</h1>
        </main>
        """
      })

    rpc(node, Beacon.Content, :create_page!, [attrs])
  end

  def error_page_fixture(node \\ node1(), attrs \\ %{}) do
    layout_id = get_lazy(attrs, :layout_id, fn -> layout_fixture().id end)

    attrs =
      Enum.into(attrs, %{
        site: "site_a",
        status: Enum.random(111..999),
        layout_id: layout_id,
        template: "Oops"
      })

    rpc(node, Beacon.Content, :create_error_page!, [attrs])
  end

  def media_library_asset_fixture(node \\ node1(), attrs \\ %{}) do
    file_metadata = file_metadata_fixture(node, attrs)
    rpc(node, Beacon.MediaLibrary, :upload, [file_metadata])
  end

  def file_metadata_fixture(node \\ node1(), attrs \\ %{}) do
    attrs =
      Enum.into(attrs, %{
        site: :site_a,
        file_size: 100_000,
        file_name: "image.jpg"
      })

    attrs = Map.put_new(attrs, :file_path, path_for(attrs.file_name))

    rpc(node, Beacon.MediaLibrary.UploadMetadata, :new, [
      attrs.site,
      attrs.file_path,
      [name: attrs.file_name, size: attrs.file_size]
    ])
  end

  defp path_for(file_name) do
    ext = Path.extname(file_name)
    file_name = "image#{ext}"

    Path.join(["test", "support", "fixtures", file_name])
  end

  def live_data_fixture(node \\ node1(), attrs \\ %{}) do
    attrs =
      Enum.into(attrs, %{
        site: "site_a",
        path: "/foo/:id",
        format: :elixir
      })

    rpc(node, Beacon.Content, :create_live_data!, [attrs])
  end

  def live_data_assign_fixture(node \\ node1(), attrs \\ %{}) do
    live_data = get_lazy(attrs, :live_data, fn -> live_data_fixture(node) end)

    attrs =
      Enum.into(attrs, %{
        format: "elixir",
        key: "sum",
        value: "1 + 1"
      })

    {:ok, live_data} = rpc(node, Beacon.Content, :create_assign_for_live_data, [live_data, attrs])

    Enum.find(live_data.assigns, &(&1.key == attrs.key))
  end
end
