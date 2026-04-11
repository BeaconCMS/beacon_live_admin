import topbar from "../vendor/topbar"
import { CodeEditorHook } from "../../deps/live_monaco_editor/priv/static/live_monaco_editor.esm"
import visualEditorHooks from "../../lib/beacon/live_admin/components/visual_editor/hooks"
import { getHooks } from "live_svelte"
import * as Components from "../svelte/**/*.svelte"

let Hooks = {}

Hooks.CodeEditorHook = CodeEditorHook

Hooks.ThemeToggle = {
  mounted() {
    this.el.addEventListener("click", () => {
      const html = document.documentElement
      const current = localStorage.getItem("beacon_admin_theme") || "system"
      let next
      if (current === "light") next = "dark"
      else if (current === "dark") next = "system"
      else next = "light"

      localStorage.setItem("beacon_admin_theme", next)
      this.applyTheme(next)
      this.updateIcon(next)
    })

    const saved = localStorage.getItem("beacon_admin_theme") || "system"
    this.applyTheme(saved)
    this.updateIcon(saved)
  },

  applyTheme(theme) {
    const html = document.documentElement
    if (theme === "dark") {
      html.classList.add("dark")
    } else if (theme === "light") {
      html.classList.remove("dark")
    } else {
      // system
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        html.classList.add("dark")
      } else {
        html.classList.remove("dark")
      }
    }
  },

  updateIcon(theme) {
    const sunIcon = this.el.querySelector("[data-icon=sun]")
    const moonIcon = this.el.querySelector("[data-icon=moon]")
    const systemIcon = this.el.querySelector("[data-icon=system]")
    if (sunIcon) sunIcon.classList.toggle("hidden", theme !== "light")
    if (moonIcon) moonIcon.classList.toggle("hidden", theme !== "dark")
    if (systemIcon) systemIcon.classList.toggle("hidden", theme !== "system")
  }
}

topbar.config({ barColors: { 0: "#29d" }, shadowColor: "rgba(0, 0, 0, .3)" })
window.addEventListener("phx:page-loading-start", (_info) => topbar.show(300))
window.addEventListener("phx:page-loading-stop", (_info) => topbar.hide())

window.addEventListener("beacon_admin:clipcopy", (event) => {
  const result_id = `${event.target.id}-copy-to-clipboard-result`
  const el = document.getElementById(result_id)

  if ("clipboard" in navigator) {
    if (event.target.tagName === "INPUT") {
      txt = event.target.value
    } else {
      txt = event.target.textContent
    }

    navigator.clipboard
      .writeText(txt)
      .then(() => {
        el.innerText = "Copied to clipboard"
        // Make it visible
        el.classList.remove("invisible", "text-red-500", "opacity-0")
        // Fade in and translate upwards
        el.classList.add("text-green-500", "opacity-100", "-translate-y-2")

        setTimeout(function () {
          el.classList.remove("text-green-500", "opacity-100", "-translate-y-2")
          el.classList.add("invisible", "text-red-500", "opacity-0")
        }, 2000)
      })
      .catch(() => {
        el.innerText = "Could not copy"
        // Make it visible
        el.classList.remove("invisible", "text-green-500", "opacity-0")
        // Fade in and translate upwards
        el.classList.add("text-red-500", "opacity-100", "-translate-y-2")
      })
  } else {
    alert("Sorry, your browser does not support clipboard copy.")
  }
})

let socketPath = document.querySelector("html").getAttribute("phx-socket") || "/live"
let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let liveSocket = new LiveView.LiveSocket(socketPath, Phoenix.Socket, {
  hooks: { ...getHooks(Components), ...visualEditorHooks, ...Hooks },
  params: { _csrf_token: csrfToken },
})
liveSocket.connect()
window.liveSocket = liveSocket
