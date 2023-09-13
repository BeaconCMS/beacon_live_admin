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
  @behaviour Beacon.Authorization.Behaviour

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
