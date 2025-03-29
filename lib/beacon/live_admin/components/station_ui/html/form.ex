defmodule Beacon.LiveAdmin.StationUI.HTML.Form do
  @moduledoc false
  # This module exists to provide the same API as the Phoenix Core Components so as to support
  # generators that target the Core Components (`mix phx.gen.live`, `mix phx.gen.auth`, etc...)

  use Phoenix.Component
  alias Beacon.LiveAdmin.StationUI.HTML.Input

  attr :id, :any, default: nil
  attr :name, :any
  attr :label, :string, default: nil
  attr :value, :any

  attr :type, :string,
    default: "text",
    values: ~w(checkbox color date datetime-local email file hidden month number password
               range radio search select tel text textarea time url week)

  attr :field, Phoenix.HTML.FormField, doc: "a form field struct retrieved from the form, for example: @form[:email]"

  attr :errors, :list, default: []
  attr :checked, :boolean, doc: "the checked flag for checkbox inputs"
  attr :prompt, :string, default: nil, doc: "the prompt for select inputs"
  attr :options, :list, doc: "the options to pass to Phoenix.HTML.Form.options_for_select/2"
  attr :multiple, :boolean, default: false, doc: "the multiple flag for select inputs"

  attr :rest, :global, include: ~w(accept autocomplete capture cols disabled form list max maxlength min minlength
                multiple pattern placeholder readonly required rows size step)

  slot :inner_block

  def input(%{field: %Phoenix.HTML.FormField{} = field} = assigns) do
    assigns
    |> assign(field: nil, id: assigns.id || field.id)
    |> assign(:errors, Enum.map(field.errors, &translate_error(&1)))
    |> assign_new(:name, fn -> if assigns.multiple, do: field.name <> "[]", else: field.name end)
    |> assign_new(:value, fn -> field.value end)
    |> input()
  end

  def input(%{type: "checkbox"} = assigns) do
    ~H"""
    <Input.checkbox {Map.drop(assigns, [:field, :label, :multiple, :options, :prompt, :type])}>
      <:label :if={@label}><%= @label %></:label>
    </Input.checkbox>
    """
  end

  def input(%{type: "select"} = assigns) do
    ~H"""
    <Input.simple_select {Map.drop(assigns, [:checked, :field, :label, :type])}>
      <:label :if={@label}><%= @label %></:label>
    </Input.simple_select>
    """
  end

  def input(%{type: "textarea"} = assigns) do
    ~H"""
    <Input.textarea {Map.drop(assigns, [:checked, :field, :label, :multiple, :options, :prompt, :type])}>
      <:label :if={@label}><%= @label %></:label>
    </Input.textarea>
    """
  end

  def input(%{type: "hidden"} = assigns) do
    ~H"""
    <input type={@type} name={@name} id={@id} value={Phoenix.HTML.Form.normalize_value(@type, @value)} {@rest} />
    """
  end

  def input(assigns) do
    ~H"""
    <Input.generic_input {Map.drop(assigns, [:checked, :field, :label, :multiple, :options, :prompt])}>
      <:label :if={@label}><%= @label %></:label>
    </Input.generic_input>
    """
  end

  # FIXME: install StationUI to make use of StationUI.Gettext
  @doc """
  Translates an error message using gettext.
  """
  def translate_error({msg, _opts}) do
    msg
    # When using gettext, we typically pass the strings we want
    # to translate as a static argument:
    #
    #     # Translate the number of files with plural rules
    #     dngettext("errors", "1 file", "%{count} files", count)
    #
    # However the error messages in our forms and APIs are generated
    # dynamically, so we need to translate them by calling Gettext
    # with our gettext backend as first argument. Translations are
    # available in the errors.po file (as we use the "errors" domain).
    # if count = opts[:count] do
    #   Gettext.dngettext(StationUI.Gettext, "errors", msg, msg, count, opts)
    # else
    #   Gettext.dgettext(StationUI.Gettext, "errors", msg, opts)
    # end
  end

  @doc """
  Translates the errors for a field from a keyword list of errors.
  """
  def translate_errors(errors, field) when is_list(errors) do
    for {^field, {msg, opts}} <- errors, do: translate_error({msg, opts})
  end
end
