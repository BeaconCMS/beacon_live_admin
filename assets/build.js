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
const deploy = args.includes("--deploy")

let clientConditions = ["svelte", "browser"]
let serverConditions = ["svelte"]

if (!deploy) {
  clientConditions.push("development")
  serverConditions.push("development")
}

let optsClient = {
  entryPoints: ["js/beacon_live_admin.js"],
  globalName: "BeaconLiveAdmin",
  format: "iife",
  loader: {
    ".ttf": "dataurl",
    ".woff": "dataurl",
    ".woff2": "dataurl",
  },
  bundle: true,
  target: "es2020",
  minify: deploy,
  conditions: clientConditions,
  alias: { svelte: "svelte" },
  outfile: "../priv/static/beacon_live_admin.js",
  logLevel: "info",
  sourcemap: watch ? "inline" : false,
  tsconfig: "./tsconfig.json",
  plugins: [
    importGlobPlugin(),
    sveltePlugin({
      preprocess: sveltePreprocess(),
      compilerOptions: {
        dev: !deploy,
        css: "injected",
        generate: "client",
        customElement: true,
      },
    }),
  ],
}

let optsServer = {
  entryPoints: ["js/server.js"],
  platform: "node",
  bundle: true,
  minify: false,
  target: "node22",
  conditions: serverConditions,
  alias: { svelte: "svelte" },
  outdir: "../priv/svelte",
  logLevel: "info",
  sourcemap: watch ? "inline" : false,
  tsconfig: "./tsconfig.json",
  plugins: [
    importGlobPlugin(),
    sveltePlugin({
      preprocess: sveltePreprocess(),
      compilerOptions: {
        dev: !deploy,
        css: "injected",
        generate: "server",
        customElement: true,
      },
    }),
  ],
}

if (watch) {
  esbuild
    .context(optsClient)
    .then((ctx) => ctx.watch())
    .catch((_error) => process.exit(1))

  esbuild
    .context(optsServer)
    .then((ctx) => ctx.watch())
    .catch((_error) => process.exit(1))
} else {
  esbuild.build(optsClient)
  esbuild.build(optsServer)
}
