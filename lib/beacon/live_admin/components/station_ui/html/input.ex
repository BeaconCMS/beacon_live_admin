defmodule Beacon.LiveAdmin.StationUI.HTML.Input do
  use Phoenix.Component

  import Beacon.LiveAdmin.StationUI.HTML.Icon, only: [icon: 1]

  alias Phoenix.HTML.Form
  alias Phoenix.LiveView.JS

  @custom_css_props """
    [--slider-range:calc(var(--max)-var(--min))]
    [--slider-ratio:calc((var(--value)-var(--min))/var(--slider-range))]
    [--slider-x:calc(0.5*var(--slider-thumb-width)+var(--slider-ratio)*(100%-var(--slider-thumb-width)))]
    [--slider-thumb-border-width:2px]
    [--slider-thumb-focus-ring-width:2px]
    [--slider-track-radius:5px]
  """

  @range_input_styles """
    appearance-none
    cursor-pointer
    disabled:cursor-default
    outline-none
  """

  @firefox_progress """
    [&::-moz-range-progress]:bg-[--sui-form-bg-slider-progress]
    [&::-moz-range-progress]:disabled:bg-[--sui-form-bg-slider-progress-disabled]
    [&::-moz-range-progress]:h-[var(--slider-track-height)]
    [&::-moz-range-progress]:rounded-[var(--slider-track-radius)]
  """

  @firefox_track """
    [&::-moz-range-track]:bg-[-sui-form-bg-slider-track]
    [&::-moz-range-track]:shadow-[inset_0_0_0_1px_var(--sui-form-border-slider-track)]
    [&::-moz-range-track]:disabled:shadow-[inset_0_0_0_1px_var(--sui-form-border-slider-track-disabled)]
    [&::-moz-range-track]:h-[var(--slider-track-height)]
    [&::-moz-range-track]:rounded-[var(--slider-track-radius)]
  """

  @firefox_thumb """
    [&::-moz-range-thumb]:bg-[--sui-form-bg-slider-thumb]
    [&::-moz-range-thumb]:[border-width:var(--slider-thumb-border-width)]
    [&::-moz-range-thumb]:border-solid
    [&::-moz-range-thumb]:border-[--sui-form-border-slider-thumb]
    [&::-moz-range-thumb]:active:bg-[--sui-form-bg-slider-thumb-active]
    [&::-moz-range-thumb]:active:border-[--sui-form-border-slider-thumb-active]
    [&::-moz-range-thumb]:box-border
    [&::-moz-range-thumb]:disabled:bg-[--sui-form-bg-slider-thumb-disabled]
    [&::-moz-range-thumb]:disabled:border-[--sui-form-border-slider-thumb-disabled]
    [&::-moz-range-thumb]:focus-visible:outline
    [&::-moz-range-thumb]:focus-visible:[outline-width:var(--slider-thumb-focus-ring-width)]
    [&::-moz-range-thumb]:focus-visible:outline-offset-2
    [&::-moz-range-thumb]:focus-visible:outline-purple-500
    [&::-moz-range-thumb]:hover:bg-[--sui-form-bg-slider-thumb-hover]
    [&::-moz-range-thumb]:hover:border-[--sui-form-border-slider-thumb-hover]
    [&::-moz-range-thumb]:rounded-full
    [&::-moz-range-thumb]:h-[var(--slider-thumb-height)]
    [&::-moz-range-thumb]:w-[var(--slider-thumb-width)]
  """

  @webkit_track """
    [&::-webkit-slider-runnable-track]:appearance-none
    [&::-webkit-slider-runnable-track]:[background:linear-gradient(var(--sui-form-bg-slider-progress),var(--sui-form-bg-slider-progress))_0/var(--slider-x)_100%_no-repeat,var(--sui-form-bg-slider-track)]
    [&::-webkit-slider-runnable-track]:disabled:[background:linear-gradient(var(--sui-form-bg-slider-progress-disabled),var(--sui-form-bg-slider-progress-disabled))_0/var(--slider-x)_100%_no-repeat,var(--sui-form-bg-slider-track)]
    [&::-webkit-slider-runnable-track]:disabled:bg-[--sui-form-bg-slider-track-disabled]
    [&::-webkit-slider-runnable-track]:h-[var(--slider-track-height)]
    [&::-webkit-slider-runnable-track]:rounded-[var(--slider-track-radius)]
    [&::-webkit-slider-runnable-track]:shadow-[inset_0_0_0_1px_var(--sui-form-border-slider-track)]
    [&::-webkit-slider-runnable-track]:disabled:shadow-[inset_0_0_0_1px_var(--sui-form-border-slider-track-disabled)]
  """

  @webkit_thumb """
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:bg-[--sui-form-bg-slider-thumb]
    [&::-webkit-slider-thumb]:[border-width:var(--slider-thumb-border-width)]
    [&::-webkit-slider-thumb]:border-solid
    [&::-webkit-slider-thumb]:border-[--sui-form-border-slider-thumb]
    [&::-webkit-slider-thumb]:active:bg-[--sui-form-bg-slider-thumb-active]
    [&::-webkit-slider-thumb]:active:border-[--sui-form-border-slider-thumb-active]
    [&::-webkit-slider-thumb]:disabled:bg-[--sui-form-bg-slider-thumb-disabled]
    [&::-webkit-slider-thumb]:disabled:border-[--sui-form-border-slider-thumb-disabled]
    [&::-webkit-slider-thumb]:focus-visible:outline
    [&::-webkit-slider-thumb]:focus-visible:[outline-width:var(--slider-thumb-focus-ring-width)]
    [&::-webkit-slider-thumb]:focus-visible:outline-offset-2
    [&::-webkit-slider-thumb]:focus-visible:outline-purple-500
    [&::-webkit-slider-thumb]:hover:bg-[--sui-form-bg-slider-thumb-hover]
    [&::-webkit-slider-thumb]:hover:border-[--sui-form-border-slider-thumb-hover]
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:[transform:translateY(calc(-50%+var(--slider-thumb-border-width)))]
    [&::-webkit-slider-thumb]:h-[var(--slider-thumb-height)]
    [&::-webkit-slider-thumb]:w-[var(--slider-thumb-width)]
  """

  @slider_input_base [
    @custom_css_props,
    @range_input_styles,
    @firefox_progress,
    @firefox_track,
    @firefox_thumb,
    @webkit_track,
    @webkit_thumb
  ]
  defp slider_input_base, do: @slider_input_base

  @caption_default_classes "mt-1.5 text-sm"
  defp caption_default_classes, do: @caption_default_classes

  @error_default_classes "mt-0.5 first-of-type:mt-1.5 text-sm"

  @input_base_classes ~w"
    min-w-[150px]
    w-full
    max-w-full
    rounded
    bg-white
    font-medium
    outline-none
    transition
    placeholder:text-zinc-300
    focus:border-transparent
    focus:ring-indigo-600
    disabled:bg-slate-50
    disabled:text-gray-500
  "
  defp input_base_classes, do: @input_base_classes

  @input_default_classes "text-lg p-2.5 placeholder:text-base focus:ring-2"

  @interaction_label_default_classes "gap-x-2.5 text-lg"
  defp interaction_label_default_classes, do: @interaction_label_default_classes

  @label_default_classes "mb-1.5 text-sm"
  defp label_default_classes, do: @label_default_classes

  @select_option_default_classes "px-4 py-3.5"
  defp select_option_default_classes, do: @select_option_default_classes

  @doc """
  A checkbox input component.

  Suggested classes for various sizes:
    - XS
      - class="h-[22px] w-[22px]"
      - error_class="mt-0 first-of-type:mt-1 text-xs"
      - <:label class="gap-x-1.5 text-sm">
      - <:caption class="mt-1 text-xs">
    - SM
      - class="h-[26px] w-[26px]"
      - error_class="mt-0 first-of-type:mt-1 text-xs"
      - <:label class="gap-x-2 text-base">
      - <:caption class="mt-1 text-xs">
    - MD (default)
      - class="h-8 w-8"
      - error_class="mt-0.5 first-of-type:mt-1.5 text-sm"
      - <:label class="gap-x-2.5 text-lg">
      - <:caption class="mt-1.5 text-sm">
    - LG
      - class="h-10 w-10"
      - error_class="mt-0.5 first-of-type:mt-2 text-base"
      - <:label class="gap-x-3 text-xl">
      - <:caption class="mt-2 text-base">
    - XL
      - class="h-[46px] w-[46px] focus:!ring-4 focus-visible:!ring-offset-4 data-[errors=true]:!border-4"
      - error_class="mt-0.5 first-of-type:mt-2.5 text-lg"
      - <:label class="gap-x-3.5 text-2xl">
      - <:caption class="mt-2.5 text-lg">

  """

  attr :class, :string, default: "h-8 w-8"
  attr :checked, :boolean
  attr :disabled, :boolean, default: false
  attr :error_class, :string, default: @error_default_classes
  attr :errors, :list, default: []
  attr :id, :string, required: true
  attr :name, :string, required: true
  attr :value, :any

  attr :rest, :global, include: ~w[disabled form required]

  slot :caption do
    attr :class, :string, doc: @caption_default_classes
  end

  slot :label do
    attr :class, :string, doc: @interaction_label_default_classes
  end

  def checkbox(assigns) do
    assigns =
      assign_new(assigns, :checked, fn ->
        Form.normalize_value("checkbox", assigns[:value])
      end)

    ~H"""
    <.input_wrapper disabled={@disabled} error_class={@error_class} errors={@errors} name={@name}>
      <label :for={label <- @label} class={[label[:class] || interaction_label_default_classes(), "relative flex items-center font-medium"]}>
        <input type="hidden" name={@name} value="false" disabled={@disabled} />
        <input
          type="checkbox"
          id={@id}
          name={@name}
          disabled={@disabled}
          value="true"
          checked={@checked}
          class={[
            @class,
            @errors == [] && "border border-gray-400",
            @errors != [] && "border-2 phx-no-feedback:border-gray-400 border-rose-500",
            "rounded border-2 bg-white text-indigo-600 outline-none checked:border-4 checked:border-indigo-600 checked:bg-indigo-600 focus:ring-2 focus:ring-transparent focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:bg-slate-50"
          ]}
          data-errors={to_string(@errors != [])}
          {@rest}
        />
        <span class="cursor-pointer before:absolute before:inset-0"><%= render_slot(label) %></span>
      </label>

      <:caption :for={caption <- @caption} class={caption[:class]}>
        <%= render_slot(caption) %>
      </:caption>
    </.input_wrapper>
    """
  end

  @doc """
  A radio input component.

  Suggested classes for various sizes:
    - XS
      - class="h-[22px] w-[22px] p-[2px]"
      - error_class="mt-0 first-of-type:mt-1 text-xs"
      - <:label class="gap-x-1.5 text-sm">
      - <:caption class="mt-1 text-xs">
    - SM
      - class="h-[26px] w-[26px] p-[3px]"
      - error_class="mt-0 first-of-type:mt-1 text-xs"
      - <:label class="gap-x-2 text-base">
      - <:caption class="mt-1 text-xs">
    - MD (default)
      - class="h-8 w-8 p-[3px]"
      - error_class="mt-0.5 first-of-type:mt-1.5 text-sm"
      - <:label class="gap-x-2.5 text-lg">
      - <:caption class="mt-1.5 text-sm">
    - LG
      - class="h-10 w-10 p-1"
      - error_class="mt-0.5 first-of-type:mt-2 text-base"
      - <:label class="gap-x-3 text-xl">
      - <:caption class="mt-2 text-base">
    - XL
      - class="h-[46px] w-[46px] p-1 focus:!ring-4 focus-visible:!ring-offset-4 data-[errors=true]:!border-4"
      - error_class="mt-0.5 first-of-type:mt-2.5 text-lg"
      - <:label class="gap-x-3.5 text-2xl">
      - <:caption class="mt-2.5 text-lg">

  """

  attr :class, :string, default: "h-8 w-8 p-[3px]"
  attr :checked, :boolean
  attr :disabled, :boolean, default: false
  attr :error_class, :string, default: @error_default_classes
  attr :errors, :list, default: []
  attr :id, :string, required: true
  attr :name, :string, required: true
  attr :value, :any

  attr :rest, :global, include: ~w[disabled form required]

  slot :caption do
    attr :class, :string, doc: @caption_default_classes
  end

  slot :label do
    attr :class, :string, doc: @interaction_label_default_classes
  end

  def radio(assigns) do
    assigns = assign_new(assigns, :value, fn -> "on" end)

    ~H"""
    <.input_wrapper disabled={@disabled} error_class={@error_class} errors={@errors} name={@name}>
      <label :for={label <- @label} class={[label[:class] || interaction_label_default_classes(), "relative flex items-center font-medium"]}>
        <input
          type="radio"
          id={@id}
          name={@name}
          disabled={@disabled}
          value={@value}
          checked={@checked}
          class={[
            @class,
            @errors == [] && "border border-gray-400",
            @errors != [] && "border-2 phx-no-feedback:border-gray-400 border-rose-500",
            "border-2 bg-white text-indigo-600 outline-none checked:border-4 checked:border-indigo-600 checked:bg-indigo-600 checked:bg-none checked:bg-clip-content hover:checked:border-current focus:ring-2 focus:ring-transparent focus:checked:border-current focus-visible:ring-offset-2 focus-visible:ring-purple-500 disabled:bg-slate-50"
          ]}
          data-errors={to_string(@errors != [])}
          {@rest}
        />
        <span class="cursor-pointer before:absolute before:inset-0"><%= render_slot(label) %></span>
      </label>

      <:caption :for={caption <- @caption} class={caption[:class]}>
        <%= render_slot(caption) %>
      </:caption>
    </.input_wrapper>
    """
  end

  @doc """
  A simple select input component using an HTML Select element.

  Suggested classes for various sizes:
    - XS
      - chevron_class="right-2 h-4 w-4"
      - class="text-sm p-2 pr-[30px] focus:ring-2"
      - error_class="mt-0 first-of-type:mt-1 text-xs"
      - <:caption class="mt-1 text-xs">
      - <:label class="mb-1 text-xs">
    - SM
      - chevron_class="right-2 h-4.5 w-4.5"
      - class="text-base p-2 pr-8 focus:ring-2"
      - error_class="mt-0 first-of-type:mt-1 text-xs"
      - <:caption class="mt-1 text-xs">
      - <:label class="mb-1 text-sm">
    - MD (default)
      - chevron_class="right-3 h-4.5 w-4.5"
      - class="text-lg p-2.5 pr-[34px] focus:ring-2"
      - error_class="mt-0.5 first-of-type:mt-1.5 text-sm"
      - <:caption class="mt-1.5 text-sm">
      - <:label class="mb-1.5 text-sm">
    - LG
      - chevron_class="right-3 h-6 w-6"
      - class="text-xl p-3 pr-11 focus:ring-2"
      - error_class="mt-0.5 first-of-type:mt-2 text-base"
      - <:caption class="mt-2 text-base">
      - <:label class="mb-2 text-base">
    - XL
      - chevron_class="right-3.5 h-7 w-7"
      - class="text-2xl px-3.5 py-3 pr-[52px] focus:ring-4 data-[errors=true]:!border-4"
      - error_class="mt-0.5 first-of-type:mt-2.5 text-lg"
      - <:caption class="mt-2.5 text-lg">
      - <:label class="mb-2.5 text-lg">

  """

  attr :chevron_class, :string, default: "right-3 h-4.5 w-4.5"
  attr :class, :string, default: "text-lg p-2.5 pr-[34px] focus:ring-2"
  attr :disabled, :boolean, default: false
  attr :error_class, :string, default: @error_default_classes
  attr :errors, :list, default: []
  attr :id, :string, required: true
  attr :multiple, :boolean, default: false
  attr :name, :string, required: true
  attr :options, :list, required: true, doc: "the options to pass to Phoenix.HTML.Form.options_for_select/2"
  attr :prompt, :string, default: nil
  attr :value, :any, required: true

  attr :rest, :global, include: ~w[autocomplete form required size]

  slot :caption do
    attr :class, :string, doc: @caption_default_classes
  end

  slot :label do
    attr :class, :string, doc: @label_default_classes
  end

  def simple_select(assigns) do
    ~H"""
    <.input_wrapper disabled={@disabled} error_class={@error_class} errors={@errors} name={@name}>
      <.label :for={label <- @label} class={label[:class] || label_default_classes()} for={@id}>
        <%= render_slot(label) %>
      </.label>

      <div class="relative">
        <select
          id={@id}
          name={@name}
          class={[
            @class,
            @errors == [] && "border border-gray-400",
            @errors != [] && "border-2 phx-no-feedback:border-gray-400 border-rose-500",
            "peer min-w-[150px] w-full max-w-full appearance-none overflow-hidden whitespace-nowrap rounded border bg-white bg-none font-medium outline-none transition focus:border-transparent focus:ring-indigo-600 disabled:bg-slate-50 disabled:text-gray-500"
          ]}
          multiple={@multiple}
          disabled={@disabled}
          data-errors={to_string(@errors != [])}
          {@rest}
        >
          <option :if={@prompt} value=""><%= @prompt %></option>
          <%= Form.options_for_select(@options, @value) %>
        </select>

        <.icon
          name="hero-chevron-down"
          class={[
            @chevron_class,
            "pointer-events-none absolute inset-y-0 my-auto peer-disabled:text-gray-500"
          ]}
        />
      </div>

      <:caption :for={caption <- @caption} class={caption[:class]}>
        <%= render_slot(caption) %>
      </:caption>
    </.input_wrapper>
    """
  end

  @doc """
  A single select input component using a `combobox` text input and a `listbox` of select options.

  Suggested classes for various sizes:
    - XS
      - chevron_class="right-2 h-4 w-4"
      - class="text-sm p-2 pr-[30px] focus:ring-2"
      - error_class="mt-0 first-of-type:mt-1 text-xs"
      - option_list_class="text-xs"
      - <:caption class="mt-1 text-xs">
      - <:label class="mb-1 text-xs">
      - <:option class="px-3 py-2">
    - SM
      - chevron_class="right-2 h-4.5 w-4.5"
      - class="text-base p-2 pr-8 focus:ring-2"
      - error_class="mt-0.5 first-of-type:mt-1 text-xs"
      - option_list_class="text-base"
      - <:label class="mb-1 text-sm">
      - <:caption class="mt-1 text-xs">
      - <:option class="px-3 py-2">
    - MD (default)
      - chevron_class="right-3 h-4.5 w-4.5"
      - class="text-lg p-2.5 pr-[34px] focus:ring-2"
      - error_class="mt-0.5 first-of-type:mt-1.5 text-sm"
      - option_list_class="text-lg"
      - <:label class="mb-1.5 text-sm">
      - <:caption class="mt-1.5 text-sm">
      - <:option class="px-4 py-3.5">
    - LG
      - chevron_class="right-3 h-6 w-6"
      - class="text-xl p-3 pr-11 focus:ring-2"
      - error_class="mt-0.5 first-of-type:mt-2 text-base"
      - option_list_class="text-xl"
      - <:label class="mb-2 text-base">
      - <:caption class="mt-2 text-base">
      - <:option class="px-5 py-4">
    - XL
      - chevron_class="right-3.5 h-7 w-7"
      - class="text-2xl px-3.5 py-3 pr-[52px] focus:ring-4 data-[errors=true]:!border-4"
      - error_class="mt-0.5 first-of-type:mt-2.5 text-lg"
      - option_list_class="text-2xl"
      - <:label class="mb-2.5 text-lg">
      - <:caption class="mt-2.5 text-lg">
      - <:option class="px-8 py-5">

  """

  attr :chevron_class, :string, default: "right-3 h-4.5 w-4.5"
  attr :class, :string, default: "text-lg p-2.5 pr-[34px] focus:ring-2"
  attr :disabled, :boolean, default: false
  attr :error_class, :string, default: @error_default_classes
  attr :errors, :list, default: []
  attr :id, :string, required: true
  attr :name, :string, required: true
  attr :option_list_class, :string, default: "text-lg"
  attr :option_list_id, :string, required: true
  attr :value, :any, required: true
  attr :wrapper_id, :string

  attr :rest, :global, include: ~w[
    autocapitalize
    autocomplete
    autocorrect
    dirname
    form
    list
    maxlength
    minlength
    pattern
    placeholder
    readonly
    required
    size
    spellcheck
  ]

  slot :caption do
    attr :class, :string, doc: @caption_default_classes
  end

  slot :label do
    attr :class, :string, doc: @label_default_classes
    attr :id, :string, required: true
  end

  slot :option, required: true do
    attr :class, :string, doc: @select_option_default_classes
    attr :disabled, :boolean
    attr :value, :string, required: true
  end

  def single_select(assigns) do
    assigns = assign_new(assigns, :wrapper_id, fn -> "#{assigns.id}-wrapper" end)

    ~H"""
    <.input_wrapper
      disabled={@disabled}
      error_class={@error_class}
      errors={@errors}
      name={@name}
      id={@wrapper_id}
      data-state="closed"
      data-close-select={
        JS.add_class("hidden", to: "##{@wrapper_id}[data-state=open] ##{@option_list_id}")
        |> JS.set_attribute({"aria-expanded", "false"}, to: "##{@wrapper_id}[data-state=open] ##{@id}")
        |> JS.set_attribute({"aria-hidden", "true"}, to: "##{@wrapper_id}[data-state=open] ##{@option_list_id}")
        |> JS.set_attribute({"data-state", "closed"}, to: "##{@wrapper_id}")
      }
      data-toggle-select={
        JS.add_class("hidden", to: "##{@wrapper_id}[data-state=open] ##{@option_list_id}")
        |> JS.remove_class("hidden", to: "##{@wrapper_id}[data-state=closed] ##{@option_list_id}")
        |> JS.toggle_attribute({"aria-expanded", "true", "false"}, to: "##{@id}")
        |> JS.set_attribute({"aria-hidden", "true"}, to: "##{@wrapper_id}[data-state=open] ##{@option_list_id}")
        |> JS.remove_attribute("aria-hidden", to: "##{@wrapper_id}[data-state=closed] ##{@option_list_id}")
        |> JS.toggle_attribute({"data-state", "open", "closed"}, to: "##{@wrapper_id}")
        |> JS.focus_first(to: "##{@wrapper_id}[data-state=open] ##{@option_list_id}")
      }
      phx-click-away={JS.exec("data-close-select")}
    >
      <%= for label <- @label do %>
        <.label id={label[:id]} class={[label[:class] || label_default_classes(), "font-semibold"]} for={@id}>
          <%= render_slot(label) %>
        </.label>

        <div class="relative" phx-click={if !@disabled, do: JS.exec("data-toggle-select", to: "##{@wrapper_id}")}>
          <input
            readonly
            name={@name}
            value={@value}
            aria-haspopup="listbox"
            aria-expanded="false"
            role="combobox"
            aria-controls={@option_list_id}
            class={[
              @class,
              @errors == [] && "border border-gray-400",
              @errors != [] && "border-2 phx-no-feedback:border-gray-400 border-rose-500",
              "min-w-[150px] w-full max-w-full appearance-none cursor-default overflow-hidden whitespace-nowrap rounded bg-white font-medium outline-none transition placeholder:text-zinc-300 focus:border-transparent focus:ring-indigo-600 disabled:bg-slate-50 disabled:text-zinc-300"
            ]}
            id={@id}
            disabled={@disabled}
            data-errors={to_string(@errors != [])}
            {@rest}
          />

          <.icon
            name="hero-chevron-down"
            class={[
              @chevron_class,
              "pointer-events-none absolute inset-y-0 my-auto peer-disabled:text-gray-500"
            ]}
            role="presentation"
          />
        </div>

        <.focus_wrap class="relative z-10 pt-0.5" id={"#{@option_list_id}-wrapper"} phx-key="escape" phx-window-keydown={JS.exec("data-close-select", to: "##{@wrapper_id}")}>
          <ul
            id={@option_list_id}
            aria-hidden="true"
            aria-labelledby={label[:id]}
            role="listbox"
            class={[
              @option_list_class,
              "hidden absolute inset-x-0 font-sans overflow-hidden rounded-b-lg bg-white font-medium text-slate-800 shadow-lg focus-within:overflow-visible space-y-0.5"
            ]}
          >
            <li :for={option <- @option} role="option">
              <button
                type="button"
                class={[
                  option[:class] || select_option_default_classes(),
                  "flex w-full rounded px-3 py-2 outline-none hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-indigo-600 disabled:bg-slate-50 disabled:text-zinc-300"
                ]}
                disabled={option[:disabled]}
                phx-click={
                  JS.set_attribute({"value", option[:value]}, to: "##{@id}")
                  |> JS.exec("data-close-select", to: "##{@wrapper_id}")
                }
              >
                <%= option[:value] %>
              </button>
            </li>
          </ul>
        </.focus_wrap>
      <% end %>

      <:caption :for={caption <- @caption} class={caption[:class]}>
        <%= render_slot(caption) %>
      </:caption>
    </.input_wrapper>
    """
  end

  @doc """
  A slider range input component.

  Suggested classes for various sizes:
    - XS
      - class="[--slider-thumb-height:22px] [--slider-thumb-width:30px] [--slider-track-height:6px]"
      - error_class="mt-0 first-of-type:mt-1 text-xs"
      - <:label class="gap-x-1.5 text-sm">
      - <:caption class="mt-1 text-xs">
    - SM
      - class="[--slider-thumb-height:28px] [--slider-thumb-width:38px] [--slider-track-height:8px]"
      - error_class="mt-0 first-of-type:mt-1 text-xs"
      - <:label class="gap-x-2 text-base">
      - <:caption class="mt-1 text-xs">
    - MD (default)
      - class="[--slider-thumb-height:36px] [--slider-thumb-width:48px] [--slider-track-height:10px]"
      - error_class="mt-0.5 first-of-type:mt-1.5 text-sm"
      - <:label class="gap-x-2.5 text-lg">
      - <:caption class="mt-1.5 text-sm">
    - LG
      - class="[--slider-thumb-height:42px] [--slider-thumb-width:56px] [--slider-track-height:12px]"
      - error_class="mt-0.5 first-of-type:mt-2 text-base"
      - <:label class="gap-x-3 text-xl">
      - <:caption class="mt-2 text-base">
    - XL
      - class="[--slider-thumb-height:50px] [--slider-thumb-width:68px] [--slider-track-height:14px] [--slider-thumb-focus-ring-width:4px]"
      - error_class="mt-0.5 first-of-type:mt-2.5 text-lg"
      - <:label class="gap-x-3.5 text-2xl">
      - <:caption class="mt-2.5 text-lg">

  """

  attr :class, :string, default: "[--slider-thumb-height:36px] [--slider-thumb-width:48px] [--slider-track-height:10px]"
  attr :disabled, :boolean, default: false
  attr :error_class, :string, default: @error_default_classes
  attr :errors, :list, default: []
  attr :id, :string, required: true
  attr :name, :string, required: true
  attr :value, :any

  attr :rest, :global, include: ~w[
    form
    disabled
    list
    max
    min
    orient
    step
  ]

  slot :caption do
    attr :class, :string, doc: @caption_default_classes
  end

  slot :label do
    attr :class, :string, doc: @interaction_label_default_classes
  end

  def slider(assigns) do
    ~H"""
    <.input_wrapper disabled={@disabled} error_class={@error_class} errors={@errors} name={@name}>
      <label
        :for={label <- @label}
        class={[
          label[:class] || interaction_label_default_classes(),
          "relative flex flex-wrap gap-4 items-center font-medium hover:cursor-pointer"
        ]}
      >
        <input
          type="range"
          id={@id}
          name={@name}
          disabled={@disabled}
          class={[
            @class,
            slider_input_base()
          ]}
          value={@value}
          data-errors={to_string(@errors != [])}
          {@rest}
        />
        <%= render_slot(label) %>
      </label>

      <:caption :for={caption <- @caption} class={caption[:class]}>
        <%= render_slot(caption) %>
      </:caption>
    </.input_wrapper>
    """
  end

  @doc """
  A textarea input component.

  Suggested classes for various sizes:
    - XS
      - class="text-sm p-2 placeholder:text-xs focus:ring-2"
      - error_class="mt-0 first-of-type:mt-1 text-xs"
      - <:label class="mb-1 text-xs">
      - <:caption class="mt-1 text-xs">
    - SM
      - class="text-base p-2 placeholder:text-sm focus:ring-2"
      - error_class="mt-0 first-of-type:mt-1 text-xs"
      - <:label class="mb-1 text-sm">
      - <:caption class="mt-1 text-xs">
    - MD (default)
      - class="text-lg p-2.5 placeholder:text-base focus:ring-2"
      - error_class="mt-0.5 first-of-type:mt-1.5 text-sm"
      - <:label class="mb-1.5 text-sm">
      - <:caption class="mt-1.5 text-sm">
    - LG
      - class="text-xl p-3 placeholder:text-lg focus:ring-2"
      - error_class="mt-0.5 first-of-type:mt-2 text-base"
      - <:label class="mb-2 text-base">
      - <:caption class="mt-2 text-base">
    - XL
      - class="text-2xl px-3.5 py-3 placeholder:text-2xl focus:ring-4 data-[errors=true]:!border-4"
      - error_class="mt-0.5 first-of-type:mt-2.5 text-lg"
      - <:label class="mb-2.5 text-lg">
      - <:caption class="mt-2.5 text-lg">

  """

  attr :class, :string, default: @input_default_classes
  attr :disabled, :boolean, default: false
  attr :error_class, :string, default: @error_default_classes
  attr :errors, :list, default: []
  attr :id, :string, required: true
  attr :name, :string, required: true
  attr :value, :string, required: true

  attr :rest, :global, include: ~w[
    autocapitalize
    autocomplete
    autocorrect
    cols
    dirname
    disabled
    form
    maxlength
    minlength
    placeholder
    readonly
    required
    rows
    spellcheck
    wrap
  ]

  slot :caption do
    attr :class, :string, doc: @caption_default_classes
  end

  slot :label do
    attr :class, :string, doc: @label_default_classes
  end

  def textarea(assigns) do
    ~H"""
    <.input_wrapper disabled={@disabled} error_class={@error_class} errors={@errors} name={@name}>
      <.label :for={label <- @label} class={label[:class] || label_default_classes()} for={@id}>
        <%= render_slot(label) %>
      </.label>

      <textarea
        id={@id}
        name={@name}
        disabled={@disabled}
        class={[
          @class,
          @errors == [] && "border border-gray-400",
          @errors != [] && "border-2 phx-no-feedback:border-gray-400 border-rose-500",
          input_base_classes()
        ]}
        data-errors={to_string(@errors != [])}
        {@rest}
      ><%= Form.normalize_value("textarea", @value) %></textarea>

      <:caption :for={caption <- @caption} class={caption[:class]}>
        <%= render_slot(caption) %>
      </:caption>
    </.input_wrapper>
    """
  end

  @doc """
  A text input component.

  Suggested classes for various sizes:
    - XS
      - class="text-sm p-2 placeholder:text-xs focus:ring-2"
      - error_class="mt-0 first-of-type:mt-1 text-xs"
      - <:label class="mb-1 text-xs">
      - <:caption class="mt-1 text-xs">
    - SM
      - class="text-base p-2 placeholder:text-sm focus:ring-2"
      - error_class="mt-0 first-of-type:mt-1 text-xs"
      - <:label class="mb-1 text-sm">
      - <:caption class="mt-1 text-xs">
    - MD (default)
      - class="text-lg p-2.5 placeholder:text-base focus:ring-2"
      - error_class="mt-0.5 first-of-type:mt-1.5 text-sm"
      - <:label class="mb-1.5 text-sm">
      - <:caption class="mt-1.5 text-sm">
    - LG
      - class="text-xl p-3 placeholder:text-lg focus:ring-2"
      - error_class="mt-0.5 first-of-type:mt-2 text-base"
      - <:label class="mb-2 text-base">
      - <:caption class="mt-2 text-base">
    - XL
      - class="text-2xl px-3.5 py-3 placeholder:text-2xl focus:ring-4 data-[errors=true]:!border-4"
      - error_class="mt-0.5 first-of-type:mt-2.5 text-lg"
      - <:label class="mb-2.5 text-lg">
      - <:caption class="mt-2.5 text-lg">

  """

  attr :class, :string, default: @input_default_classes
  attr :disabled, :boolean, default: false
  attr :error_class, :string, default: @error_default_classes
  attr :errors, :list, default: []
  attr :id, :string, required: true
  attr :name, :string, required: true
  attr :value, :string, required: true

  attr :rest, :global, include: ~w[
    autocapitalize
    autocomplete
    autocorrect
    dirname
    disabled
    form
    list
    maxlength
    minlength
    pattern
    placeholder
    readonly
    required
    size
    spellcheck
  ]

  slot :caption do
    attr :class, :string, doc: @caption_default_classes
  end

  slot :label do
    attr :class, :string, doc: @label_default_classes
  end

  slot :prefix
  slot :suffix

  def textfield(assigns) do
    assigns
    |> assign(:type, "text")
    |> generic_input()
  end

  attr :class, :string, default: @input_default_classes
  attr :disabled, :boolean, default: false
  attr :error_class, :string, default: @error_default_classes
  attr :errors, :list, default: []
  attr :id, :string, required: true
  attr :name, :string, required: true
  attr :value, :any, required: true

  attr :type, :string, required: true, values: ~w[
    color
    date
    datetime-local
    email
    file
    hidden
    month
    number
    password
    range
    search
    tel
    text
    time
    url
    week
  ]

  attr :rest, :global, include: ~w[
    accept
    autocapitalize
    autocomplete
    autocorrect
    capture
    dirname
    disabled
    form
    list
    max
    maxlength
    min
    minlength
    multiple
    pattern
    placeholder
    readonly
    required
    size
    spellcheck
    step
  ]

  slot :caption do
    attr :class, :string, doc: @caption_default_classes
  end

  slot :label do
    attr :class, :string, doc: @label_default_classes
  end

  slot :prefix
  slot :suffix

  def generic_input(assigns) do
    ~H"""
    <.input_wrapper disabled={@disabled} error_class={@error_class} errors={@errors} name={@name}>
      <.label :for={label <- @label} class={label[:class] || label_default_classes()} for={@id}>
        <%= render_slot(label) %>
      </.label>

      <div class="relative">
        <%= render_slot(@prefix) %>

        <input
          id={@id}
          type={@type}
          name={@name}
          value={Form.normalize_value(@type, @value)}
          disabled={@disabled}
          class={[
            @class,
            @errors == [] && "border border-gray-400",
            @errors != [] && "border-2 phx-no-feedback:border-gray-400 border-rose-500",
            input_base_classes()
          ]}
          data-errors={to_string(@errors != [])}
          {@rest}
        />

        <%= render_slot(@suffix) %>
      </div>

      <:caption :for={caption <- @caption} class={caption[:class]}>
        <%= render_slot(caption) %>
      </:caption>
    </.input_wrapper>
    """
  end

  attr :class, :any, default: @label_default_classes
  attr :for, :string, default: nil
  attr :id, :string, default: nil

  slot :inner_block, required: true

  def label(assigns) do
    ~H"""
    <label for={@for} id={@id} class={[@class || label_default_classes(), "font-semibold"]}>
      <%= render_slot(@inner_block) %>
    </label>
    """
  end

  attr :class, :string, default: @error_default_classes

  slot :inner_block, required: true

  def error(assigns) do
    ~H"""
    <p class={[@class, "font-sans text-[--sui-form-text-error] font-medium phx-no-feedback:hidden"]}>
      <%= render_slot(@inner_block) %>
    </p>
    """
  end

  attr :disabled, :boolean, default: false
  attr :error_class, :string, default: @error_default_classes
  attr :errors, :list, default: []
  attr :name, :string, required: true

  attr :rest, :global

  slot :caption do
    attr :class, :string, doc: @caption_default_classes
  end

  slot :inner_block, required: true

  defp input_wrapper(assigns) do
    ~H"""
    <div
      phx-feedback-for={@name}
      class={[
        "font-sans flex flex-col",
        if(@disabled, do: "text-[--sui-form-text-disabled]", else: "text-[--sui-form-text]")
      ]}
      {@rest}
    >
      <%= render_slot(@inner_block) %>

      <p :for={caption <- @caption} class={[caption[:class] || caption_default_classes(), "font-sans font-medium"]}>
        <%= render_slot(caption) %>
      </p>

      <.error :for={msg <- @errors} class={@error_class}>
        <%= msg %>
      </.error>
    </div>
    """
  end
end
