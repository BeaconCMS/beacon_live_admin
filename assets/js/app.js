import topbar from "../vendor/topbar"

topbar.config({barColors: {0: "#29d"}, shadowColor: "rgba(0, 0, 0, .3)"})
window.addEventListener("phx:page-loading-start", _info => topbar.show(300))
window.addEventListener("phx:page-loading-stop", _info => topbar.hide())

let Hooks = {}

let socketPath = document.querySelector("html").getAttribute("phx-socket") || "/live"
let csrfToken = document .querySelector("meta[name='csrf-token']") .getAttribute("content")
let liveSocket = new LiveView.LiveSocket(socketPath, Phoenix.Socket, {
  hooks: Hooks,
  params: { _csrf_token: csrfToken },
})
liveSocket.connect()
window.liveSocket = liveSocket
