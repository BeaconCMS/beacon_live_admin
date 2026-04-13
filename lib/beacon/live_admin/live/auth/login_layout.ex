defmodule Beacon.LiveAdmin.Auth.LoginLayout do
  @moduledoc false

  use Phoenix.Component

  import Phoenix.HTML, only: [raw: 1]

  def render(assigns) do
    ~H"""
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="csrf-token" content={Phoenix.Controller.get_csrf_token()} />
        <title>Beacon Admin Login</title>
        <style>
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif; background-color: #f3f4f6; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
          .login-card { background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1); padding: 2.5rem; width: 100%; max-width: 400px; }
          .login-header { text-align: center; margin-bottom: 2rem; }
          .login-logo { display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; background-color: #4f46e5; border-radius: 12px; margin-bottom: 1rem; }
          .login-logo svg { width: 28px; height: 28px; color: white; }
          .login-title { font-size: 1.5rem; font-weight: 700; color: #111827; }
          .login-subtitle { font-size: 0.875rem; color: #6b7280; margin-top: 0.25rem; }
          .provider-btn { display: flex; align-items: center; justify-content: center; gap: 0.5rem; width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 8px; background: white; font-size: 0.875rem; font-weight: 500; color: #374151; cursor: pointer; transition: all 0.15s; text-decoration: none; margin-bottom: 0.75rem; }
          .provider-btn:hover { background-color: #f9fafb; border-color: #9ca3af; }
          .divider { display: flex; align-items: center; gap: 1rem; margin: 1.5rem 0; color: #9ca3af; font-size: 0.75rem; }
          .divider::before, .divider::after { content: ""; flex: 1; height: 1px; background: #e5e7eb; }
          .form-group { margin-bottom: 1rem; }
          .form-label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.375rem; }
          .form-input { width: 100%; padding: 0.625rem 0.75rem; border: 1px solid #d1d5db; border-radius: 8px; font-size: 0.875rem; outline: none; transition: border-color 0.15s; }
          .form-input:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.1); }
          .submit-btn { width: 100%; padding: 0.75rem 1rem; background-color: #4f46e5; color: white; border: none; border-radius: 8px; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: background-color 0.15s; }
          .submit-btn:hover { background-color: #4338ca; }
          .flash-error { background-color: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.875rem; margin-bottom: 1.5rem; }
          .flash-info { background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.875rem; margin-bottom: 1.5rem; }
        </style>
      </head>
      <body>
        <%= @inner_content %>
      </body>
    </html>
    """
  end
end
