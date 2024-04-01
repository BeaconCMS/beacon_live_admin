module.exports = {
  printWidth: 120,
  semi: false,
  plugins: ["prettier-plugin-svelte"],
  overrides: [{ files: "*.svelte", options: { parser: "svelte" } }],
}
