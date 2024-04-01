defmodule MyApp.ErrorView do
  def render(template, _assigns) do
    Phoenix.Controller.status_message_from_template(template)
  end
end

defmodule MyApp.Router do
  use Phoenix.Router
  use Beacon.Router

  pipeline :browser do
    plug :fetch_session
  end

  scope "/" do
    pipe_through :browser
    beacon_site "/my_site", site: :my_site
  end
end

defmodule MyApp.Endpoint do
  use Phoenix.Endpoint, otp_app: :my_app

  plug Plug.Session,
    store: :cookie,
    key: "_live_view_key",
    signing_salt: "/VEDsdfsffMnp5"

  plug MyApp.Router
end

defmodule MyApp.AuthorizationSource do
  @behaviour Beacon.Authorization.Policy

  @impl true
  def get_agent(%{"session_id" => "admin_session_123"}) do
    %{role: :admin, session_id: "admin_session_123"}
  end

  def get_agent(%{"session_id" => "editor_session_123"}) do
    %{role: :editor, session_id: "editor_session_123"}
  end

  def get_agent(%{"session_id" => "other_session_123"}) do
    %{role: :other, session_id: "other_session_123"}
  end

  def get_agent(_), do: %{}

  @impl true
  def authorized?(_agent, _operation, _context), do: true
end

defmodule MyApp.PageField.Type do
  @moduledoc false
  @behaviour Beacon.Content.PageField

  use Phoenix.Component

  import BeaconWeb.CoreComponents
  import Ecto.Changeset

  @impl true
  def name, do: :type

  @impl true
  def type, do: :string

  @impl true
  def default, do: "page"

  @impl true
  def render(assigns) do
    ~H"""
    <.input type="text" label="Type" readonly disabled="true" field={@field} />
    """
  end

  @impl true
  def changeset(data, _attrs, %{page_changeset: page_changeset}) do
    path = Ecto.Changeset.get_field(page_changeset, :path)

    type =
      if String.starts_with?(path, "/blog") do
        "blog_post"
      else
        "page"
      end

    attrs = %{"type" => type}

    data
    |> cast(attrs, [:type])
    |> validate_inclusion(:type, ~w(page blog_post), message: "invalid page type")
  end
end
