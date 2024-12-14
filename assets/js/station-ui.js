// Tailwind CSS presets for Station UI
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  theme: {
    container: {
      center: true,
    },
    extend: {
      animation: {
        "spin-reverse": "spin-reverse 1s linear infinite",
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        mono: ["Roboto Mono", ...defaultTheme.fontFamily.mono],
      },
      boxShadow: {
        "inner-sm": "inset 0 1px 2px 0 rgb(0 0 0 / 0.05)", // shadow-sm
        "inner-md":
          "inset 0 4px 6px -1px rgb(0 0 0 / 0.1), inset 0 2px 4px -2px rgb(0 0 0 / 0.1)", // shadow-md
        "inner-lg":
          "inset 0 10px 15px -3px rgb(0 0 0 / 0.1), inset 0 4px 6px -4px rgb(0 0 0 / 0.1)", // shadow-lg
        "inner-xl":
          "inset 0 20px 25px -5px rgb(0 0 0 / 0.1), inset 0 8px 10px -6px rgb(0 0 0 / 0.1)", // shadow-xl
        "inner-2xl": "inset 0 25px 50px -12px rgb(0 0 0 / 0.25)", // shadow-2xl
      },
      keyframes: {
        "spin-reverse": {
          from: {
            transform: "rotate(360deg)",
          },
        },
      },
      spacing: {
        4.5: "1.125rem", //18px
      },
      transitionProperty: {
        "grid-rows": "grid-template-rows",
      },
    }
  },
  plugins: [
    require("@tailwindcss/container-queries"),
  ]
}
