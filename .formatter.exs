locals_without_parens = [
  beacon_live_admin: 1,
  beacon_live_admin: 2
]

[
  import_deps: [:phoenix, :beacon],
  plugins: [Phoenix.LiveView.HTMLFormatter],
  inputs: ["*.{heex,ex,exs}", "{config,lib,test}/**/*.{heex,ex,exs}"],
  line_length: 150,
  heex_line_length: 200,
  export: [locals_without_parens: locals_without_parens]
]
