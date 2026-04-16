defmodule Beacon.LiveAdmin.Preview do
  @moduledoc """
  Page/layout/error page preview component.

  Renders an iframe with the preview content, completely isolated
  from the admin UI styles. Supports draft and published views.
  """

  use Phoenix.Component

  attr :site, :atom, required: true
  attr :type, :string, required: true, values: ~w(page error_page layout)
  attr :id, :string, required: true
  attr :live_url, :string, default: nil, doc: "The published page URL for live preview"
  attr :tab, :string, default: "draft"
  attr :class, :string, default: ""

  def preview(assigns) do
    preview_url = "/__beacon_live_admin__/preview/#{assigns.site}/#{assigns.type}/#{assigns.id}"
    assigns = assign(assigns, :preview_url, preview_url)

    ~H"""
    <div class={["w-full", @class]}>
      <div class="flex items-center gap-1 mb-2">
        <button
          phx-click="preview_tab"
          phx-value-tab="draft"
          class={["btn btn-xs", if(@tab == "draft", do: "btn-primary", else: "btn-ghost")]}
        >
          Draft
        </button>
        <button
          :if={@live_url}
          phx-click="preview_tab"
          phx-value-tab="published"
          class={["btn btn-xs", if(@tab == "published", do: "btn-primary", else: "btn-ghost")]}
        >
          Published
        </button>
        <div class="flex-1"></div>
        <a
          href={if(@tab == "published" && @live_url, do: @live_url, else: @preview_url)}
          target="_blank"
          class="btn btn-xs btn-ghost gap-1"
        >
          Open in new tab
          <span class="hero-arrow-top-right-on-square w-3 h-3"></span>
        </a>
      </div>
      <div class="border border-base-300 rounded-lg overflow-hidden bg-white">
        <iframe
          src={if(@tab == "published" && @live_url, do: @live_url, else: @preview_url)}
          class="w-full border-0"
          style="min-height: 500px; height: 70vh;"
          title={"#{@type} preview"}
        >
        </iframe>
      </div>
    </div>
    """
  end
end
