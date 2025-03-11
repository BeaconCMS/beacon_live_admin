/* BeaconLiveAdmin JS build script
 * Bundle assets/js/beacon_live_admin.js (LiveView client) and assets/js/server.js (Svelte SSR)
 *
 * It works in 2 modes: watch and deploy
 * On watch mode, it constantly builds the Client JS (beacon_live_admin.js) and the Svlete SSR (server.js) without minification and in dev mode.
 * On deploy mode, it bundles beacon_live_admin Client JS into both beacon_live_admin.js and beacon_live_admin.min.js
 */

const esbuild = require("esbuild")
const sveltePlugin = require("esbuild-svelte")
const importGlobPlugin = require("esbuild-plugin-import-glob").default
const sveltePreprocess = require("svelte-preprocess")

const args = process.argv.slice(2)
const watch = args.includes("--watch")

let clientOpts = {
  entryPoints: ["js/beacon_live_admin.js"],
  globalName: "BeaconLiveAdmin",
  bundle: true,
  conditions: ["svelte", "browser", "development"],
  alias: { svelte: "svelte" },
  format: "iife",
  loader: {
    ".ttf": "dataurl",
    ".woff": "dataurl",
    ".woff2": "dataurl",
  },
  target: "es2020",
  sourcemap: "inline",
  outfile: "../priv/static/beacon_live_admin.js",
  logLevel: "info",
  tsconfig: "./tsconfig.json",
  plugins: [
    importGlobPlugin(),
    sveltePlugin({
      preprocess: sveltePreprocess(),
      compilerOptions: {
        dev: true,
        hydratable: true,
        css: "injected",
        customElement: true,
        generate: "client",
      },
    }),
  ],
}

let prodClientOpts = {
  ...clientOpts,
  minify: true,
  conditions: ["svelte", "browser"],
  sourcemap: false,
  outfile: "../priv/static/beacon_live_admin.min.js",
  plugins: [
    importGlobPlugin(),
    sveltePlugin({
      preprocess: sveltePreprocess(),
      compilerOptions: {
        dev: false,
        hydratable: true,
        css: "injected",
        customElement: true,
        generate: "client",
      },
    }),
  ],
}

// priv/svelte/server.js is not distributed
let serverOpts = {
  entryPoints: ["js/server.js"],
  platform: "node",
  bundle: true,
  minify: false,
  target: "node19.6.1",
  conditions: ["svelte", "development"],
  conditions: ["svelte"],
  alias: { svelte: "svelte" },
  outdir: "../priv/svelte",
  logLevel: "info",
  sourcemap: "inline",
  tsconfig: "./tsconfig.json",
  plugins: [
    importGlobPlugin(),
    sveltePlugin({
      preprocess: sveltePreprocess(),
      compilerOptions: {
        dev: true,
        hydratable: true,
        generate: "ssr",
        customElement: true,
      },
    }),
  ],
}

if (watch) {
  esbuild
    .context(clientOpts)
    .then((ctx) => {
      ctx.watch()
    })
    .catch((error) => {
      console.log(error)
      process.exit(1)
    })
} else {
  esbuild.build(clientOpts)
  esbuild.build(prodClientOpts)
  esbuild.build(serverOpts)
}
