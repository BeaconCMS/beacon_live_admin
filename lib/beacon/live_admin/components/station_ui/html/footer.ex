defmodule Beacon.LiveAdmin.StationUI.HTML.Footer do
  use Phoenix.Component

  @moduledoc """
  The Footer component includes "simple" (default), and "columns" variant.
  The default variant will list any footer_link slotted in horizontally, while
  the columns variant will loop over a grouped list of links under a heading.

  ## Default Footer example
    <.footer logo_src={~p"/images/my_logo.png"} logo_alt_text="[Organization name] logo">
      <:footer_link>
        <.link patch={~p"/"}>
          Home
        </.link>
      </:footer_link>
      <:footer_link>
        <.link href="https://www.foo.com/blog">
          Blog
        </.link>
      </:footer_link>
    </.footer>

  ## columns variant
    <.footer variant="columns" logo_src={~p"/images/my_logo.png"}>
      <:column heading="One">
        <.column_items>
          <:footer_link>
            <.link patch={~p"/"}>
              Home
            </.link>
          </:footer_link>
          <:footer_link >
            <.link href="https://www.foo.com/blog">
              Blog
            </.link>
          </:footer_link>
        </.column_items>
      </:column>
      <:column heading="Two">
        <.column_items>
          <:footer_link>
            <.link patch={~p"/"}>
              Home
            </.link>
          </:footer_link>
          <:footer_link>
            <.link href="https://www.foo.com/blog">
              Blog
            </.link>
          </:footer_link>
        </.column_items>
      </:column>
    </.footer>

  ## Both variants accept social links and icons
    <.footer>
      <:social_icon url="https://www.instagram.com" title="Instagram">
        <svg>
          ...
        </svg>
      </:social_icon>
      <:social_icon url="https://www.facebook.com" title="Facebook" class="text-[#1877F2]">
        <svg>
          ...
        </svg>
      </:social_icon>
    </.footer>
  """

  slot :inner_block

  slot :footer_link do
    attr :class, :string
  end

  slot :column do
    attr :heading, :string, required: true
  end

  slot :social_icon do
    attr :url, :string, required: true
    attr :title, :string, required: true
    attr :class, :string
  end

  attr :variant, :string, default: "simple", values: ~w[simple columns]
  attr :logo_src, :string, default: nil
  attr :logo_alt_text, :string, default: ""
  attr :legal_text, :string, default: "© #{DateTime.utc_now().year} Your Company, Inc. All rights reserved."

  def footer(%{variant: "simple"} = assigns) do
    ~H"""
    <footer class="bg-[--sui-brand-secondary-bg] p-16">
      <div class="flex flex-wrap gap-y-10">
        <%= if @logo_src  do %>
          <div class="flex grow flex-col justify-center">
            <div class="max-w-[242px] max-h-[72px] pr-4">
              <img src={@logo_src} alt={@logo_alt_text} />
            </div>
          </div>
        <% end %>
        <%= if !Enum.empty?(@footer_link) do %>
          <ul class="flex flex-wrap items-center gap-x-12 gap-y-6">
            <%= for footer_link <- @footer_link do %>
              <li class={[footer_link_base_classes(), "#{Map.get(footer_link, :class, "text-slate-600")}"]}>
                <%= render_slot(footer_link) %>
              </li>
            <% end %>
          </ul>
        <% end %>
      </div>
      <hr class="border-[--sui-brand-primary-border] my-10 border-t-2" />
      <%= render_slot(@inner_block) %>
      <div class="flex flex-wrap items-center gap-x-4 gap-y-10">
        <div class={["grow", Enum.empty?(@social_icon) && "text-center"]}>
          <span class="text-[--sui-brand-secondary-text] text-3xl">
            <%= @legal_text %>
          </span>
        </div>
        <%= if !Enum.empty?(@social_icon) do %>
          <ul class="flex flex-wrap items-center gap-x-14 gap-y-6">
            <%= for social_icon <- @social_icon do %>
              <li class={[social_icons_base_classes(), "#{Map.get(social_icon, :class, "text-[--sui-brand-primary-icon]")}"]}>
                <.link href={social_icon[:url]} aria-label={social_icon[:title]} target="_blank">
                  <%= render_slot(social_icon) %>
                </.link>
              </li>
            <% end %>
          </ul>
        <% end %>
      </div>
    </footer>
    """
  end

  def footer(%{variant: "columns"} = assigns) do
    ~H"""
    <footer class="bg-[--sui-brand-secondary-bg] p-16">
      <div class="flex flex-wrap gap-y-10">
        <%= if @logo_src  do %>
          <div class="flex grow flex-col items-start">
            <div class="max-w-[242px] max-h-[72px] pr-4">
              <img src={@logo_src} alt={@logo_alt_text} />
            </div>
          </div>
        <% end %>
        <div class="flex flex-wrap gap-10">
          <%= for column <- @column do %>
            <div class="px-3">
              <h6 class="mb-[30px] text-[--sui-brand-secondary-text-muted] text-4xl font-bold">
                <%= column[:heading] %>
              </h6>
              <%= render_slot(column) %>
            </div>
          <% end %>
        </div>
      </div>
      <hr class="border-[--sui-brand-primary-border] my-10 border-t-2" />
      <%= render_slot(@inner_block) %>
      <div class="flex flex-wrap items-center gap-x-4 gap-y-10">
        <div class={["grow", Enum.empty?(@social_icon) && "text-center"]}>
          <span class="text-[--sui-brand-secondary-text] text-3xl">
            <%= @legal_text %>
          </span>
        </div>
        <%= if !Enum.empty?(@social_icon) do %>
          <ul class="flex flex-wrap items-center gap-x-14 gap-y-6">
            <%= for social_icon <- @social_icon do %>
              <li class={[social_icons_base_classes(), "#{Map.get(social_icon, :class, "text-[--sui-brand-primary-icon]")}"]}>
                <.link href={social_icon[:url]} aria-label={social_icon[:title]} target="_blank">
                  <%= render_slot(social_icon) %>
                </.link>
              </li>
            <% end %>
          </ul>
        <% end %>
      </div>
    </footer>
    """
  end

  slot :footer_link do
    attr :class, :string
  end

  def column_items(assigns) do
    ~H"""
    <ul class="space-y-10">
      <%= for footer_link <- @footer_link do %>
        <li class={[footer_link_base_classes(), "#{Map.get(footer_link, :class, "text-slate-600")}", "px-2.5"]}>
          <%= render_slot(footer_link) %>
        </li>
      <% end %>
    </ul>
    """
  end

  defp footer_link_base_classes do
    ~w"
      font-bold
      text-4xl
      [&_a]:rounded-lg
      [&_a:hover]:underline
      [&_a:hover]:underline-offset-8
      [&_a:focus-visible]:outline-none
      [&_a:focus-visible]:ring-4
      [&_a:focus-visible]:ring-purple-500
      [&_a:focus-visible]:ring-offset-4
      [&_a:focus-visible]:ring-offset-[--sui-brand-secondary-bg]
    "
  end

  defp social_icons_base_classes do
    ~w"
      [&_a]:block
      [&_a]:rounded-lg
      [&_a:focus-visible]:outline-none
      [&_a:focus-visible]:ring-4
      [&_a:focus-visible]:ring-purple-500
      [&_a:focus-visible]:ring-offset-4
      [&_a:focus-visible]:ring-offset-[--sui-brand-secondary-bg]
    "
  end
end
