import loader from "@monaco-editor/loader"
import { theme } from "../../../deps/live_monaco_editor/assets/js/live_monaco_editor/editor/themes"
import { BEACON_LANGUAGE_ID, registerBeaconTemplateLanguage } from "./beacon_template_language"

class CodeEditor {
  constructor(el, path, value, opts, { autosize = true } = {}) {
    this.el = el
    this.path = path
    this.value = value
    this.opts = opts
    this.autosize = autosize
    this.standalone_code_editor = null
    this._onMount = []
    this._resizeObserver = null
    this._contentSizeListener = null
    this._windowResizeListener = null
  }

  isMounted() {
    return !!this.standalone_code_editor
  }

  mount() {
    if (this.isMounted()) {
      throw new Error("The monaco editor is already mounted")
    }

    this._mountEditor()
  }

  onMount(callback) {
    this._onMount.push(callback)
  }

  formatDocument() {
    if (!this.isMounted()) {
      return Promise.resolve()
    }

    const action = this.standalone_code_editor.getAction("editor.action.formatDocument")
    return action ? action.run() : Promise.resolve()
  }

  dispose() {
    if (this._contentSizeListener) {
      this._contentSizeListener.dispose()
    }

    if (this._resizeObserver) {
      this._resizeObserver.disconnect()
    }

    if (this._windowResizeListener) {
      window.removeEventListener("resize", this._windowResizeListener)
    }

    if (this.isMounted()) {
      const model = this.standalone_code_editor.getModel()

      if (model) {
        model.dispose()
      }

      this.standalone_code_editor.dispose()
    }
  }

  _mountEditor() {
    this.opts.value = this.value

    loader.config({
      paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs" },
    })

    loader.init().then((monaco) => {
      monaco.editor.defineTheme("default", theme)
      registerBeaconTemplateLanguage(monaco)

      const modelUri = monaco.Uri.parse(this.path)
      const language = this.opts.language
      const model = monaco.editor.createModel(this.value, language, modelUri)

      this.opts.language = undefined
      this.opts.model = model
      this.standalone_code_editor = monaco.editor.create(this.el, this.opts)

      this._onMount.forEach((callback) => callback(monaco))

      this._setScreenDependantEditorOptions()

      this.standalone_code_editor.addAction({
        contextMenuGroupId: "navigation",
        contextMenuOrder: 1,
        id: "format-beacon-template",
        label: "Format Beacon Template",
        precondition: `editorLangId == '${BEACON_LANGUAGE_ID}'`,
        keybindings: [monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF],
        run: (editor) => editor.getAction("editor.action.formatDocument").run(),
      })

      this.standalone_code_editor.addAction({
        contextMenuGroupId: "word-wrapping",
        id: "enable-word-wrapping",
        label: "Enable word wrapping",
        precondition: "config.editor.wordWrap == off",
        keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.KeyZ],
        run: (editor) => editor.updateOptions({ wordWrap: "on" }),
      })

      this.standalone_code_editor.addAction({
        contextMenuGroupId: "word-wrapping",
        id: "disable-word-wrapping",
        label: "Disable word wrapping",
        precondition: "config.editor.wordWrap == on",
        keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.KeyZ],
        run: (editor) => editor.updateOptions({ wordWrap: "off" }),
      })

      this._resizeObserver = new ResizeObserver(() => this._layoutEditor())

      this._resizeObserver.observe(this.el)

      if (!this.autosize && this.el.parentElement) {
        this._resizeObserver.observe(this.el.parentElement)
      }

      if (this.autosize) {
        this._contentSizeListener = this.standalone_code_editor.onDidContentSizeChange(() => {
          const contentHeight = this.standalone_code_editor.getContentHeight()
          this.el.style.height = `${contentHeight}px`
        })
      } else {
        this._windowResizeListener = () => {
          this._layoutEditor()
        }

        window.addEventListener("resize", this._windowResizeListener)

        requestAnimationFrame(() => {
          this._layoutEditor()
        })
      }
    })
  }

  _layoutEditor() {
    if (!this.isMounted()) {
      return
    }

    const width = this.el.clientWidth
    const height = this.el.clientHeight

    if (width > 0 && height > 0) {
      this._setScreenDependantEditorOptions()
      this.standalone_code_editor.layout({ width, height })
    }
  }

  _setScreenDependantEditorOptions() {
    if (window.screen.width < 768) {
      this.standalone_code_editor.updateOptions({
        folding: false,
        lineDecorationsWidth: 16,
        lineNumbersMinChars: Math.floor(Math.log10(this.standalone_code_editor.getModel().getLineCount())) + 3,
      })
    } else {
      this.standalone_code_editor.updateOptions({
        folding: true,
        lineDecorationsWidth: 10,
        lineNumbersMinChars: 5,
      })
    }
  }
}

const CodeEditorHook = {
  mounted() {
    const opts = JSON.parse(this.el.dataset.opts)

    this.codeEditor = new CodeEditor(this.el, this.el.dataset.path, this.el.dataset.value, opts, {
      autosize: !this.el.classList.contains("beacon-page-code-editor"),
    })

    this.codeEditor.onMount((monaco) => {
      if (this.el.dataset.changeEvent && this.el.dataset.changeEvent !== "") {
        this.codeEditor.standalone_code_editor.onDidChangeModelContent(() => {
          if (this.el.dataset.target && this.el.dataset.target !== "") {
            this.pushEventTo(this.el.dataset.target, this.el.dataset.changeEvent, {
              value: this.codeEditor.standalone_code_editor.getValue(),
            })
          } else {
            this.pushEvent(this.el.dataset.changeEvent, {
              value: this.codeEditor.standalone_code_editor.getValue(),
            })
          }
        })
      }

      this.handleEvent("lme:change_language:" + this.el.dataset.path, (data) => {
        const model = this.codeEditor.standalone_code_editor.getModel()

        if (model.getLanguageId() !== data.mimeTypeOrLanguageId) {
          monaco.editor.setModelLanguage(model, data.mimeTypeOrLanguageId)

          if (data.mimeTypeOrLanguageId === BEACON_LANGUAGE_ID && this.el.dataset.formatOnMount === "true") {
            requestAnimationFrame(() => this.codeEditor.formatDocument())
          }
        }
      })

      this.handleEvent("lme:set_value:" + this.el.dataset.path, (data) => {
        this.codeEditor.standalone_code_editor.setValue(data.value)

        if (
          this.el.dataset.formatOnMount === "true" &&
          this.codeEditor.standalone_code_editor.getModel().getLanguageId() === BEACON_LANGUAGE_ID
        ) {
          requestAnimationFrame(() => this.codeEditor.formatDocument())
        }
      })

      this.el.querySelectorAll("textarea").forEach((textarea) => {
        textarea.setAttribute("name", "live_monaco_editor[" + this.el.dataset.path + "]")
      })

      this.el.removeAttribute("data-value")
      this.el.removeAttribute("data-opts")

      this.el.dispatchEvent(
        new CustomEvent("lme:editor_mounted", {
          detail: { hook: this, editor: this.codeEditor },
          bubbles: true,
        }),
      )

      if (
        this.el.dataset.formatOnMount === "true" &&
        this.codeEditor.standalone_code_editor.getModel().getLanguageId() === BEACON_LANGUAGE_ID
      ) {
        requestAnimationFrame(() => this.codeEditor.formatDocument())
      }
    })

    if (!this.codeEditor.isMounted()) {
      this.codeEditor.mount()
    }
  },

  destroyed() {
    if (this.codeEditor) {
      this.codeEditor.dispose()
    }
  },
}

export { CodeEditorHook }
