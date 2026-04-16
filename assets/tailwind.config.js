const defaultTheme = require("tailwindcss/defaultTheme")
const plugin = require("tailwindcss/plugin")
const fs = require("fs")
const path = require("path")

module.exports = {
  content: ["./js/**/*.js", "../lib/beacon/live_admin/**/*.*ex", "./svelte/**/*.svelte"],
  theme: {
    extend: {
      colors: {
        brand: "#FD4F00",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries"),
    // Allows prefixing tailwind classes with LiveView classes to add rules
    // only when LiveView classes are applied, for example:
    //
    //     <div class="phx-click-loading:animate-ping">
    //
    plugin(({ addVariant }) => addVariant("phx-click-loading", [".phx-click-loading&", ".phx-click-loading &"])),
    plugin(({ addVariant }) => addVariant("phx-submit-loading", [".phx-submit-loading&", ".phx-submit-loading &"])),
    plugin(({ addVariant }) => addVariant("phx-change-loading", [".phx-change-loading&", ".phx-change-loading &"])),

    // Embeds Hero Icons (https://heroicons.com) into your app.css bundle
    // See your `CoreComponents.icon/1` for more information.
    plugin(function ({ matchComponents, theme }) {
      let iconsDir = path.join(__dirname, "../assets/node_modules/heroicons")
      let values = {}
      let icons = [
        ["", "/24/outline"],
        ["-solid", "/24/solid"],
        ["-mini", "/20/solid"],
        ["-micro", "/16/solid"],
      ]
      icons.forEach(([suffix, dir]) => {
        fs.readdirSync(path.join(iconsDir, dir)).forEach((file) => {
          let name = path.basename(file, ".svg") + suffix
          values[name] = { name, fullPath: path.join(iconsDir, dir, file) }
        })
      })
      matchComponents(
        {
          hero: ({ name, fullPath }) => {
            let content = fs
              .readFileSync(fullPath)
              .toString()
              .replace(/\r?\n|\r/g, "")
            let size = theme("spacing.6")
            if (name.endsWith("-mini")) {
              size = theme("spacing.5")
            } else if (name.endsWith("-micro")) {
              size = theme("spacing.4")
            }
            return {
              [`--hero-${name}`]: `url('data:image/svg+xml;utf8,${content}')`,
              "-webkit-mask": `var(--hero-${name})`,
              mask: `var(--hero-${name})`,
              "mask-repeat": "no-repeat",
              "background-color": "currentColor",
              "vertical-align": "middle",
              display: "inline-block",
              width: size,
              height: size,
            }
          },
        },
        { values },
      )
    }),

    require("daisyui"),
  ],

  daisyui: {
    themes: [
      {
        beacon: {
          "primary": "#4f46e5",
          "primary-content": "#ffffff",
          "secondary": "#6366f1",
          "secondary-content": "#ffffff",
          "accent": "#8b5cf6",
          "accent-content": "#ffffff",
          "neutral": "#1e293b",
          "neutral-content": "#e2e8f0",
          "base-100": "#ffffff",
          "base-200": "#f8fafc",
          "base-300": "#f1f5f9",
          "base-content": "#0f172a",
          "info": "#3b82f6",
          "info-content": "#ffffff",
          "success": "#10b981",
          "success-content": "#ffffff",
          "warning": "#f59e0b",
          "warning-content": "#ffffff",
          "error": "#ef4444",
          "error-content": "#ffffff",
        },
      },
      {
        "beacon-dark": {
          "primary": "#6366f1",
          "primary-content": "#ffffff",
          "secondary": "#818cf8",
          "secondary-content": "#ffffff",
          "accent": "#a78bfa",
          "accent-content": "#ffffff",
          "neutral": "#334155",
          "neutral-content": "#e2e8f0",
          "base-100": "#0f172a",
          "base-200": "#020617",
          "base-300": "#1e293b",
          "base-content": "#e2e8f0",
          "info": "#60a5fa",
          "info-content": "#0f172a",
          "success": "#34d399",
          "success-content": "#0f172a",
          "warning": "#fbbf24",
          "warning-content": "#0f172a",
          "error": "#f87171",
          "error-content": "#0f172a",
        },
      },
    ],
    darkTheme: "beacon-dark",
  },
}
