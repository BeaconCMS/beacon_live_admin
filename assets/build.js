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
  outfile: deploy ? "../priv/static/beacon_live_admin.min.js" : "../priv/static/beacon_live_admin.js",
  logLevel: "info",
  sourcemap: "external",
  tsconfig: "./tsconfig.json",
  plugins: [
    importGlobPlugin(),
    sveltePlugin({
      preprocess: sveltePreprocess(),
      compilerOptions: {
        dev: !deploy,
        hydratable: true,
        css: "injected",
        customElement: true,
      },
    }),
  ],
}

let optsServer = {
  entryPoints: ["js/server.js"],
  platform: "node",
  bundle: true,
  minify: deploy,
  target: "node19.6.1",
  conditions: ["svelte"],
  outdir: "../priv/svelte",
  logLevel: "info",
  sourcemap: "external",
  tsconfig: "./tsconfig.json",
  plugins: [
    importGlobPlugin(),
    sveltePlugin({
      preprocess: sveltePreprocess(),
      compilerOptions: {
        dev: !deploy,
        hydratable: true,
        generate: "ssr",
        customElement: true,
      },
    }),
  ],
}

esbuild.build(optsServer)

if (watch) {
  esbuild
    .context(optsClient)
    .then((ctx) => {
      ctx.watch()
    })
    .catch((error) => {
      console.log(error)
      process.exit(1)
    })
} else {
  esbuild.build(optsClient)
  console.log("deploy: " + deploy)
}

