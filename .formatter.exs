locals_without_parens = [
  beacon_admin: 1,
  beacon_admin: 2
]

[
  import_deps: [:phoenix],
  plugins: [Phoenix.LiveView.HTMLFormatter],
  inputs: ["*.{heex,ex,exs}", "{config,lib,test}/**/*.{heex,ex,exs}"],
  export: [locals_without_parens: locals_without_parens]
]
