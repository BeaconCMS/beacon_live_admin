const esbuild = require("esbuild")
const sveltePlugin = require("esbuild-svelte")
const importGlobPlugin = require("esbuild-plugin-import-glob").default
const sveltePreprocess = require("svelte-preprocess")

const args = process.argv.slice(2)
const watch = args.includes("--watch")
const deploy = args.includes("--deploy")

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
  minify: deploy,
  target: "es2020",
  conditions: ["svelte", "browser"],
  outdir: "../priv/static/",
  logLevel: "info",
  sourcemap: watch ? "inline" : false,
  watch,
  tsconfig: "./tsconfig.json",
  plugins: [
    importGlobPlugin(),
    sveltePlugin({
      preprocess: sveltePreprocess(),
      compilerOptions: { dev: !deploy, hydratable: true, css: "injected" },
    }),
  ],
}

let optsServer = {
  entryPoints: ["js/server.js"],
  platform: "node",
  bundle: true,
  minify: false,
  target: "node19.6.1",
  conditions: ["svelte"],
  outdir: "../priv/svelte",
  logLevel: "info",
  sourcemap: watch ? "inline" : false,
  watch,
  tsconfig: "./tsconfig.json",
  plugins: [
    importGlobPlugin(),
    sveltePlugin({
      preprocess: sveltePreprocess(),
      compilerOptions: { dev: !deploy, hydratable: true, generate: "ssr" },
    }),
  ],
}

const client = esbuild.build(optsClient)
const server = esbuild.build(optsServer)

if (watch) {
  client.then((_result) => {
    process.stdin.on("close", () => process.exit(0))
    process.stdin.resume()
  })

  server.then((_result) => {
    process.stdin.on("close", () => process.exit(0))
    process.stdin.resume()
  })
}
