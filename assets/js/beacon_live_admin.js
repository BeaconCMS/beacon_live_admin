import topbar from "../vendor/topbar"
import { CodeEditorHook } from "../../deps/live_monaco_editor/priv/static/live_monaco_editor.esm"

let Hooks = {}
Hooks.CodeEditorHook = CodeEditorHook

topbar.config({barColors: {0: "#29d"}, shadowColor: "rgba(0, 0, 0, .3)"})

window.addEventListener("phx:page-loading-start", (_event) => {
  topbar.show(300)

  if (!localStorage.getItem("beacon:admin:sidebar-visibility")) {
    localStorage.setItem("beacon:admin:sidebar-visibility", "visible")
  }
})

window.addEventListener("phx:page-loading-stop", (_event) => {
  topbar.hide()

  const sidebarVisivility = localStorage.getItem("beacon:admin:sidebar-visibility")
  let sidebar = document.getElementById("sidebar")

  let sidebarShow = document.getElementById("sidebar-show")
  if (sidebarVisivility === "visible" && sidebar) { sidebar.style.display = "block" }
  if (sidebarVisivility === "hidden" && sidebar) { sidebar.style.display = "none" }
  if (sidebarVisivility === "hidden" && sidebarShow) { sidebarShow.style.display = "block" }
})

window.addEventListener("beacon_admin:clipcopy", (event) => {
  const result_id = `${event.target.id}-copy-to-clipboard-result`
  const el = document.getElementById(result_id);

  if ("clipboard" in navigator) {
    if (event.target.tagName === "INPUT") {
      txt = event.target.value;
    } else {
      txt = event.target.textContent;
    }

    navigator.clipboard.writeText(txt).then(() => {
      el.innerText = 'Copied to clipboard';
      // Make it visible
      el.classList.remove('invisible', 'text-red-500', 'opacity-0');
      // Fade in and translate upwards
      el.classList.add('text-green-500', 'opacity-100', '-translate-y-2');

      setTimeout(function() {
        el.classList.remove('text-green-500', 'opacity-100', '-translate-y-2');
        el.classList.add('invisible', 'text-red-500', 'opacity-0');
      }, 2000);

    }).catch(() => {
      el.innerText = 'Could not copy';
      // Make it visible
      el.classList.remove('invisible', 'text-green-500', 'opacity-0');
      // Fade in and translate upwards
      el.classList.add('text-red-500', 'opacity-100', '-translate-y-2');
    })
  } else {
    alert(
      "Sorry, your browser does not support clipboard copy."
    );
  }
});

window.addEventListener("beacon:admin:sidebar-visible", (_event) => {
  localStorage.setItem("beacon:admin:sidebar-visibility", "visible")
  let sidebarShow = document.getElementById("sidebar-show")
  if (sidebarShow) { sidebarShow.style.display = "none" }
})

window.addEventListener("beacon:admin:sidebar-hidden", (_event) => {
  localStorage.setItem("beacon:admin:sidebar-visibility", "hidden")
  let sidebarShow = document.getElementById("sidebar-show")
  if (sidebarShow) { sidebarShow.style.display = "block" }
})

let socketPath = document.querySelector("html").getAttribute("phx-socket") || "/live"
let csrfToken = document .querySelector("meta[name='csrf-token']") .getAttribute("content")
let liveSocket = new LiveView.LiveSocket(socketPath, Phoenix.Socket, {
  hooks: Hooks,
  params: { _csrf_token: csrfToken },
})
liveSocket.connect()
window.liveSocket = liveSocket
