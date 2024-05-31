<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import type { AstElement, AstNode } from "$lib/types"
  import { highlightedAstElement, findAstElementId, selectedAstElementId, isAstElement } from "$lib/stores/page"
  import CodeEditor from "./CodeEditor.svelte"

  const dispatch = createEventDispatcher()
  export let value: string | null = ""
  export let astNodes: AstNode[] | null = null
  export let clearOnUpdate = false
  export let expanded = true
  export let placeholder: string = ""
  export let large: boolean = false
  $: astElements = (astNodes || []).filter(isAstElement)

  function highlightAstElement(astElement: AstElement) {
    $highlightedAstElement = astElement
  }
  function unhighlightAstElement() {
    $highlightedAstElement = undefined
  }
  let internalValue: string | null = astElements ? null : value
  $: {
    if (astNodes?.length === 1) {
      let first = astNodes[0]
      if (!isAstElement(first)) {
        internalValue = first
      }
    } else if (astNodes) {
      internalValue = null
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!(e.target instanceof HTMLInputElement)) return
    let text = e.target.value
    if (e.key === "Enter" && text && text.length > 0 && text !== value) {
      dispatch("update", text)
      if (clearOnUpdate) {
        internalValue = null
        e.target.value = ""
      }
    }
  }
  function handleTextChange(e: Event) {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      dispatch("textChange", e.target.value)
    }
  }
  function select(astElement: AstElement) {
    let id = findAstElementId(astElement)
    $selectedAstElementId = id
  }
  function moveAstElement(movement: number, astElement: AstElement) {
    if (!astNodes) return
    let astNodesCopy = Array.from(astNodes)
    let index = astNodesCopy.indexOf(astElement)
    astNodesCopy.splice(index, 1)
    astNodesCopy.splice(index + movement, 0, astElement)
    dispatch("nodesChange", astNodesCopy)
  }

  function updateNodeContents(e: Event, idx: number) {
    let astNodesCopy = [...astNodes]
    astNodesCopy[idx] = (e.target as HTMLInputElement).value
    dispatch("nodesChange", astNodesCopy)
  }
</script>

<section class="p-4 border-b border-b-gray-100 border-solid">
  <header class="flex items-center text-sm mb-2 font-medium">
    <button
      type="button"
      class="w-full flex items-center justify-between gap-x-1 p-1 font-semibold hover:text-blue-700 active:text-blue-900 group"
      on:click={() => (expanded = !expanded)}
      aria-expanded={expanded}
    >
      <span><slot name="heading" /></span>
      <span class={expanded ? "" : " [&_path]:origin-center [&_path]:rotate-180"}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-5 h-5 stroke-slate-500 fill-slate-500 group-hover:stroke-current group-hover:fill-current"
        >
          <path
            fill-rule="evenodd"
            d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
    </button>
    <!-- Classes -->
  </header>
  {#if $$slots["value"]}
    <slot name="input">
      <input
        type="text"
        class="w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm"
        {placeholder}
        value={internalValue}
        on:keydown={handleKeydown}
        on:change={handleTextChange}
      />
    </slot>
    <div class="pt-3"><slot name="value" /></div>
  {:else if expanded}
    <slot name="input">
      {#if internalValue}
        {#if large}
          <!-- <CodeEditor value={internalValue} on:change={(e) => dispatch('textChange', e.detail)}/> -->
          <textarea
            class="w-full py-1 px-2 bg-slate-100 border-slate-100 rounded-md leading-6 text-sm"
            {placeholder}
            value={internalValue}
            on:keydown={handleKeydown}
            on:change={handleTextChange}
          ></textarea>
        {:else}
          <input
            type="text"
            class="w-full py-1 px-2 bg-slate-100 border-slate-100 rounded-md leading-6 text-sm"
            {placeholder}
            value={internalValue}
            on:keydown={handleKeydown}
            on:change={handleTextChange}
          />
        {/if}
        {#if $$slots["value"]}
          <div class="pt-3"><slot name="value" /></div>
        {/if}
      {:else if astNodes}
        {#each astNodes as astNode, idx}
          {#if isAstElement(astNode)}
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
              on:mouseenter={() => highlightAstElement(astNode)}
              on:mouseleave={() => unhighlightAstElement()}
              class="mt-5"
            >
              <div class="flex items-center justify-between">
                <span><code>&lt;{astNode.tag}&gt;</code></span>
                <button
                  class="flex items-center justify-center gap-x-0.5 px-2 py-1 bg-cyan-300 font-bold text-xs uppercase tracking-wide rounded transition-colors hover:bg-cyan-900 active:bg-cyan-700 hover:text-white"
                  on:click={() => select(astNode)}
                >
                  Edit <span class="sr-only">{astNode.tag} element</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3">
                    <path
                      d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z"
                    />
                    <path
                      d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z"
                    />
                  </svg>
                </button>
              </div>
              <div class="mt-2 grid grid-cols-2 gap-x-1">
                <button
                  class="flex items-center justify-center gap-x-0.5 px-1.5 py-1 bg-cyan-800 font-bold text-xs uppercase tracking-wide rounded hover:bg-cyan-950 active:bg-cyan-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white"
                  disabled={idx === 0}
                  on:click={() => moveAstElement(-1, astNode)}
                >
                  <span>Move <span class="sr-only">{astNode.tag} element</span> up</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3">
                    <path
                      fill-rule="evenodd"
                      d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  class="flex items-center justify-center gap-x-0.5 px-1.5 py-1 bg-cyan-800 font-bold text-xs uppercase tracking-wide rounded hover:bg-cyan-950 active:bg-cyan-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white"
                  disabled={idx === astNodes.length - 1}
                  on:click={() => moveAstElement(1, astNode)}
                >
                  <span>Move <span class="sr-only">{astNode.tag} element</span> down</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3">
                    <path
                      fill-rule="evenodd"
                      d="M12 2.25a.75.75 0 0 1 .75.75v16.19l6.22-6.22a.75.75 0 1 1 1.06 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 1 1 1.06-1.06l6.22 6.22V3a.75.75 0 0 1 .75-.75Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          {:else}
            {#if large}
              <textarea
                class="w-full py-1 px-2 bg-slate-100 border-slate-100 rounded-md leading-6 text-sm"
                {placeholder}
                value={astNode}
                on:keydown={handleKeydown}
                on:change={(e) => updateNodeContents(e, idx)}
              ></textarea>       
            {:else}
              <input
                type="text"
                class="w-full py-1 px-2 mt-5 bg-slate-100 border-slate-100 rounded-md leading-6 text-sm"
                {placeholder}
                value={astNode}
                on:keydown={handleKeydown}
                on:change={(e) => updateNodeContents(e, idx)}
              />
            {/if}
          {/if}
        {/each}
      {/if}
    </slot>
  {/if}
</section>
