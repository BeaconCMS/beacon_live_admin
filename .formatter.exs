locals_without_parens = [
  beacon_live_admin: 1,
  beacon_live_admin: 2
]

[
  import_deps: [:phoenix, :phoenix_live_view, :ecto, :beacon],
  plugins: [Phoenix.LiveView.HTMLFormatter],
  migrate_eex_to_curly_interpolation: false,
  inputs: ["*.{heex,ex,exs}", "{config,lib,test}/**/*.{heex,ex,exs}"],
  line_length: 150,
  heex_line_length: 200,
  export: [locals_without_parens: locals_without_parens]
]
