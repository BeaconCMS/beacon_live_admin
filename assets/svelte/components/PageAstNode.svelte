<script lang="ts">
  import {
    selectedAstElement,
    slotTargetElement,
    selectedAstElementId,
    highlightedAstElement,
    isAstElement,
  } from "$lib/stores/page"
  import { draggedObject } from "$lib/stores/dragAndDrop"
  import { updateNodeContent, updateAst } from "$lib/utils/ast-manipulation"
  import { elementCanBeDroppedInTarget } from "$lib/utils/drag-helpers"
  import type { AstNode } from "$lib/types"
  export let node: AstNode
  export let nodeId: string

  $: isDragTarget = $slotTargetElement === node
  $: isSelectedNode = $selectedAstElement === node
  $: isHighlightedNode = $highlightedAstElement === node
  $: isEditable = isSelectedNode && isAstElement(node) && node.content.filter((e) => typeof e === "string").length === 1 && !node.attrs?.selfClose;

  function handleDragEnter() {
    if (isAstElement(node) && elementCanBeDroppedInTarget($draggedObject)) {
      $slotTargetElement = node
    }
  }

  function handleDragLeave() {
    if (isAstElement(node) && elementCanBeDroppedInTarget($draggedObject) && $slotTargetElement === node) {
      $slotTargetElement = undefined
    }
  }

  function handleMouseOver() {
    isAstElement(node) && ($highlightedAstElement = node)
  }
  function handleMouseOut() {
    $highlightedAstElement = undefined
  }

  function handleClick() {
    $selectedAstElementId = nodeId
  }

  function handleContentEdited({ target }: Event) {
    let children = target.children
    if (!isAstElement(node)) {
      return
    }
    if (children.length === 0) {
      if (target.innerText !== node.content) {
        updateNodeContent(node, target.innerText)
      }
    } else {
      let tmpClone = target.cloneNode(true)
      Array.from(tmpClone.children).forEach((c) => tmpClone.removeChild(c))
      let stringChildIndex = node.content.findIndex((e) => typeof e === "string")
      let newText = tmpClone.textContent.trim()
      if (node.content[stringChildIndex] !== newText) {
        node.content[stringChildIndex] = newText
        updateAst()
      }
    }
    // There isn't a way (for now) of editing an element that has more than one text node
    // because there's no easy way ot telling which one was edited.
  }

  // When rendering raw html, we can't add the usual classes to the wrapper.
  function highlightContent(
    wrapperDiv: HTMLElement,
    { selected, highlighted }: { selected: boolean; highlighted: boolean },
  ) {
    let startsWithOneChildren = wrapperDiv.children.length === 1
    if (startsWithOneChildren) {
      let child = wrapperDiv.children[0]
      child.setAttribute("data-selected", String(selected))
      child.setAttribute("data-highlighted", String(highlighted))
    }
    return {
      update({ selected, highlighted }: { selected: boolean; highlighted: boolean }) {
        if (wrapperDiv.children.length === 1) {
          let child = wrapperDiv.children[0]
          child.setAttribute("data-selected", String(selected))
          child.setAttribute("data-highlighted", String(highlighted))
        } else if (wrapperDiv.children.length === 0 && wrapperDiv.childNodes.length === 1) {
          wrapperDiv.setAttribute("data-nochildren", "true")
          wrapperDiv.setAttribute("data-selected", String(selected))
          wrapperDiv.setAttribute("data-highlighted", String(highlighted))
        } else if (startsWithOneChildren) {
          Array.from(wrapperDiv.children).forEach((child) => {
            child.removeAttribute("data-selected")
            child.removeAttribute("data-highlighted")
          })
        }
      },
      destroy() {
        // noop
      },
    }
  }
</script>

{#if isAstElement(node)}
  {#if node.tag === "html_comment"}
    {@html "<!--" + node.content + "-->"}
  {:else if node.tag === "eex_comment"}
    {@html "<!--" + node.content + "-->"}
  {:else if node.tag === "eex" && node.content[0] === "@inner_content"}
    <slot />
  {:else if node.rendered_html}
    <div
      class="contents"
      on:mouseover|stopPropagation={handleMouseOver}
      on:mouseout|stopPropagation={handleMouseOut}
      on:click|preventDefault|stopPropagation={() => ($selectedAstElementId = nodeId)}
      use:highlightContent={{ selected: isSelectedNode, highlighted: isHighlightedNode }}
    >
      {@html node.rendered_html}
    </div>
  {:else}
    <svelte:element
      class="relative"
      this={node.tag}
      {...node.attrs}
      data-selected={isSelectedNode}
      data-highlighted={isHighlightedNode}
      data-slot-target={isDragTarget}
      contenteditable={isEditable}
      on:blur={handleContentEdited}
      on:dragenter|stopPropagation={handleDragEnter}
      on:dragleave|stopPropagation={handleDragLeave}
      on:mouseover|stopPropagation={handleMouseOver}
      on:mouseout|stopPropagation={handleMouseOut}
      on:click|preventDefault|stopPropagation={handleClick}
    >
      {#if !node.attrs?.selfClose}
        {#each node.content as subnode, index}
          <svelte:self node={subnode} nodeId="{nodeId}.{index}" />
        {/each}
        {#if isDragTarget && $draggedObject}
          <div class="dragged-element-placeholder">{@html $draggedObject.example}</div>
        {/if}
      {/if}
      {#if isSelectedNode}
        <span class="rounded w-1 h-1 absolute mt-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" style="transform: rotate(90deg);"><path d="M 1 2.5 C 1 1.948 1.448 1.5 2 1.5 L 10 1.5 C 10.552 1.5 11 1.948 11 2.5 L 11 2.5 C 11 3.052 10.552 3.5 10 3.5 L 2 3.5 C 1.448 3.5 1 3.052 1 2.5 Z" fill="currentColor"></path><path d="M 1 6 C 1 5.448 1.448 5 2 5 L 10 5 C 10.552 5 11 5.448 11 6 L 11 6 C 11 6.552 10.552 7 10 7 L 2 7 C 1.448 7 1 6.552 1 6 Z" fill="currentColor"></path><path d="M 1 9.5 C 1 8.948 1.448 8.5 2 8.5 L 10 8.5 C 10.552 8.5 11 8.948 11 9.5 L 11 9.5 C 11 10.052 10.552 10.5 10 10.5 L 2 10.5 C 1.448 10.5 1 10.052 1 9.5 Z" fill="currentColor"></path></svg>        
        </span>
      {/if}
    </svelte:element>
  {/if}
{:else}
  {node}
{/if}

<style>
  .dragged-element-placeholder {
    outline: 2px dashed red;
  }
</style>
