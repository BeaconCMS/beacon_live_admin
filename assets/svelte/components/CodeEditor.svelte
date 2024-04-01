<script lang="ts">
  import loader from "@monaco-editor/loader"
  import { onDestroy, onMount } from "svelte"
  import type * as Monaco from "monaco-editor/esm/vs/editor/editor.api"
  export let value: string
  import { createEventDispatcher } from "svelte"
  let dispatch = createEventDispatcher()

  let editor: Monaco.editor.IStandaloneCodeEditor
  let monaco: typeof Monaco
  let editorContainer: HTMLElement
  $: {
    if (editor) {
      editor.setValue(value)
    }
  }
  onMount(async () => {
    loader.config({ paths: { vs: "/node_modules/monaco-editor/min/vs" } })

    monaco = await loader.init()

    const editor = monaco.editor.create(editorContainer, {
      value,
      language: "elixir",
      minimap: { enabled: false },
      lineNumbers: "off",
      automaticLayout: true,
    })
    editor.onDidBlurEditorWidget((e) => {
      let content = editor.getValue()
      dispatch("change", content)
    })
  })

  onDestroy(() => {
    monaco?.editor.getModels().forEach((model) => model.dispose())
  })
</script>

<div bind:this={editorContainer} class="w-52 h-24 py-0.5 px-0.5 bg-gray-100"></div>
