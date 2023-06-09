import topbar from "../vendor/topbar"
import { CodeEditorHook } from "../../deps/live_monaco_editor/priv/static/live_monaco_editor.esm"

let Hooks = {}
Hooks.CodeEditorHook = CodeEditorHook

topbar.config({barColors: {0: "#29d"}, shadowColor: "rgba(0, 0, 0, .3)"})
window.addEventListener("phx:page-loading-start", _info => topbar.show(300))
window.addEventListener("phx:page-loading-stop", _info => topbar.hide())

window.addEventListener("lme:editor_mounted", (ev) => {
  const hook = ev.detail.hook
  const editor = ev.detail.editor.standalone_code_editor
  const eventName = ev.detail.editor.path + "_editor_lost_focus"

  editor.onDidBlurEditorWidget(() => {
    hook.pushEvent(eventName, { value: editor.getValue() })
  })
})

let socketPath = document.querySelector("html").getAttribute("phx-socket") || "/live"
let csrfToken = document .querySelector("meta[name='csrf-token']") .getAttribute("content")
let liveSocket = new LiveView.LiveSocket(socketPath, Phoenix.Socket, {
  hooks: Hooks,
  params: { _csrf_token: csrfToken },
})
liveSocket.connect()
window.liveSocket = liveSocket
