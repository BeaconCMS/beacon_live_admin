defmodule Beacon.LiveAdmin.Auth.LoginLive do
  @moduledoc false

  use Phoenix.LiveView, layout: {Beacon.LiveAdmin.Auth.LoginLayout, :render}

  @impl true
  def mount(_params, _session, socket) do
    dev_mode? = dev_mode?()
    providers = providers()

    {:ok,
     socket
     |> assign(:dev_mode?, dev_mode?)
     |> assign(:providers, providers)
     |> assign(:form_data, %{"email" => "", "password" => ""})}
  end

  @impl true
  def handle_event("validate", %{"login" => params}, socket) do
    {:noreply, assign(socket, :form_data, params)}
  end

  def handle_event("dev_login", %{"login" => params}, socket) do
    email = params["email"]
    password = params["password"]

    case dev_login(email, password) do
      {:ok, token} ->
        {:noreply,
         socket
         |> put_flash(:info, "Login successful")
         |> redirect(to: admin_path(socket) <> "?token=" <> Base.url_encode64(token))}

      {:error, reason} ->
        {:noreply, put_flash(socket, :error, reason)}
    end
  end

  defp dev_login(email, _password) do
    with true <- dev_mode?(),
         user when not is_nil(user) <- Beacon.LiveAdmin.Auth.get_user_by_email(email),
         token when is_binary(token) <- Beacon.LiveAdmin.Auth.create_session(user) do
      {:ok, token}
    else
      false -> {:error, "Dev mode is not enabled"}
      nil -> {:error, "No user found with that email"}
      _ -> {:error, "Login failed"}
    end
  end

  defp dev_mode? do
    Code.ensure_loaded?(Beacon.LiveAdmin.Auth.Config) and Beacon.LiveAdmin.Auth.Config.dev_mode?()
  end

  defp providers do
    if Code.ensure_loaded?(Beacon.LiveAdmin.Auth.Config) do
      Beacon.LiveAdmin.Auth.Config.providers()
    else
      []
    end
  end

  defp admin_path(socket) do
    router = socket.router
    prefix = router.__beacon_live_admin_prefix__()
    prefix || "/admin"
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="login-card">
      <div class="login-header">
        <div class="login-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.07-7.07l-2.83 2.83M9.76 14.24l-2.83 2.83m11.14 0l-2.83-2.83M9.76 9.76L6.93 6.93" />
          </svg>
        </div>
        <h1 class="login-title">Beacon Admin</h1>
        <p class="login-subtitle">Sign in to manage your sites</p>
      </div>

      <%= if Phoenix.Flash.get(@flash, :error) do %>
        <div class="flash-error"><%= Phoenix.Flash.get(@flash, :error) %></div>
      <% end %>

      <%= if Phoenix.Flash.get(@flash, :info) do %>
        <div class="flash-info"><%= Phoenix.Flash.get(@flash, :info) %></div>
      <% end %>

      <%= if @providers != [] do %>
        <%= for provider <- @providers do %>
          <a href={admin_path(@socket) <> "/auth/#{provider.id}"} class="provider-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Sign in with <%= provider.name || provider.id %>
          </a>
        <% end %>
      <% end %>

      <%= if @dev_mode? do %>
        <%= if @providers != [] do %>
          <div class="divider">or</div>
        <% end %>

        <form phx-submit="dev_login" phx-change="validate">
          <div class="form-group">
            <label class="form-label" for="login_email">Email</label>
            <input
              type="email"
              id="login_email"
              name="login[email]"
              value={@form_data["email"]}
              placeholder="admin@example.com"
              class="form-input"
              required
            />
          </div>
          <div class="form-group">
            <label class="form-label" for="login_password">Password</label>
            <input
              type="password"
              id="login_password"
              name="login[password]"
              value={@form_data["password"]}
              placeholder="password"
              class="form-input"
            />
          </div>
          <button type="submit" class="submit-btn">
            Sign in (Dev Mode)
          </button>
        </form>
      <% end %>

      <%= if @providers == [] and not @dev_mode? do %>
        <p style="text-align: center; color: #6b7280; font-size: 0.875rem;">
          No authentication providers configured.
          Please configure OIDC providers or enable dev mode.
        </p>
      <% end %>
    </div>
    """
  end
end
