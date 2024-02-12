<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { AstElement, AstNode } from '$lib/types';
  import { highlightedAstElement, findAstElementId, selectedAstElementId, isAstElement } from '$lib/stores/page';
  import CodeEditor from './CodeEditor.svelte';

  const dispatch = createEventDispatcher();
  export let value: string | null = '';
  export let astNodes: AstNode[] | null = null;
  export let clearOnUpdate = false;
  export let expanded = true;
  export let placeholder: string = '';
  export let large: boolean = false;
  $: astElements = (astNodes || []).filter(isAstElement)

  function highlightAstElement(astElement: AstElement) {
    $highlightedAstElement = astElement;
  }
  function unhighlightAstElement() {
    $highlightedAstElement = undefined;
  }
  let internalValue: string | null = astElements ? null : value;
  $: {
    if (astNodes?.length === 1) {
      let first = astNodes[0];
      if (!isAstElement(first)) {
        internalValue = first;
      }
    } else if (astNodes) {
      internalValue = null;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if(!(e.target instanceof HTMLInputElement)) return;
    let text = e.target.value;
    if (e.key === 'Enter' && text && text.length > 0 && text !== value) {
      dispatch('update', text);
      if (clearOnUpdate) {
        internalValue = null;
        e.target.value = '';
      }       
    }
  }
  function handleTextChange(e: Event) {
    if ((e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
      dispatch('textChange', e.target.value);    
    }
  }
  function select(astElement: AstElement) {
    let id = findAstElementId(astElement);
    $selectedAstElementId = id;
  }
  function moveAstElement(movement: number, astElement: AstElement) {
    if (!astNodes) return;
    let astNodesCopy = Array.from(astNodes);
    let index = astNodesCopy.indexOf(astElement);
    astNodesCopy.splice(index, 1);
    astNodesCopy.splice(index + movement, 0, astElement);
    dispatch('nodesChange', astNodesCopy);
  }
</script>

<section class="p-4 border-b border-b-gray-100 border-solid">
  <header class="flex items-center text-sm mb-2 font-medium">
    <button type="button" class="w-full flex items-center justify-between gap-x-1 p-1 hover:text-blue-700 active:text-blue-900 group" on:click={() => expanded = !expanded}>
      <span><slot name="heading" /></span>
      <span class="{expanded ? '' : ' [&_path]:origin-center [&_path]:rotate-180'}">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 stroke-slate-500 fill-slate-500 group-hover:stroke-current group-hover:fill-current">
          <path fill-rule="evenodd" d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z" clip-rule="evenodd" />
        </svg>
      </span>
    </button>
    <!-- Classes -->
  </header>
  {#if $$slots['value']}
    <slot name="input">
      <input 
        type="text" 
        class="w-full py-1 px-2 bg-gray-100 border-gray-100 rounded-md leading-6 text-sm"
        {placeholder}
        value={internalValue} 
        on:keydown={handleKeydown}
        on:change={handleTextChange}>
    </slot>
    <div class="pt-3"><slot name="value"/></div>
  {:else}
    {#if expanded}
      <slot name="input">
        {#if internalValue}
          {#if large}
            <!-- <CodeEditor value={internalValue} on:change={(e) => dispatch('textChange', e.detail)}/> -->
            <textarea 
            class="w-full py-1 px-2 bg-slate-100 border-slate-100 rounded-md leading-6 text-sm"
            {placeholder}
            value={internalValue} 
            on:keydown={handleKeydown}
            on:change={handleTextChange}></textarea>
          {:else}
            <input 
              type="text" 
              class="w-full py-1 px-2 bg-slate-100 border-slate-100 rounded-md leading-6 text-sm"
              {placeholder}
              value={internalValue} 
              on:keydown={handleKeydown}
              on:change={handleTextChange}>
          {/if}
          {#if $$slots['value']}
            <div class="pt-3"><slot name="value"/></div>
          {/if}
        {:else if astElements}
          {#each astElements as astElement, idx}
            <p on:mouseenter={() => highlightAstElement(astElement)} on:mouseleave={() => unhighlightAstElement()}>
              &lt;{astElement.tag}&gt; Element 
              <button 
                class="bg-blue-500 hover:bg-blue-700 text-white inline h-5 w-5 align-middle"
                on:click={() => select(astElement)}>
                <span class="sr-only">Open element</span>
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M4,3H5V5H3V4A1,1 0 0,1 4,3M20,3A1,1 0 0,1 21,4V5H19V3H20M15,5V3H17V5H15M11,5V3H13V5H11M7,5V3H9V5H7M21,20A1,1 0 0,1 20,21H19V19H21V20M15,21V19H17V21H15M11,21V19H13V21H11M7,21V19H9V21H7M4,21A1,1 0 0,1 3,20V19H5V21H4M3,15H5V17H3V15M21,15V17H19V15H21M3,11H5V13H3V11M21,11V13H19V11H21M3,7H5V9H3V7M21,7V9H19V7H21Z"></path>
                </svg>
              </button>
              <button 
                class="bg-gray-500 hover:bg-gray-700 disabled:bg-gray-300 text-white inline h-5 w-5 align-middle"
                disabled={idx === 0}
                on:click={() => moveAstElement(-1, astElement)}>
                <span class="sr-only">Move element up</span>
                ↑
              </button>
              <button 
                class="bg-gray-500 hover:bg-gray-700 disabled:bg-gray-300 text-white inline h-5 w-5 align-middle"
                disabled={idx === astElements.length - 1}
                on:click={() => moveAstElement(1, astElement)}>
                <span class="sr-only">Move element down</span>
                ↓
              </button>
            </p>
          {/each}
        {/if}
      </slot>
    {/if}
  {/if}
</section>