<script lang="ts">
  import {
    selectedAstElement,
    slotTargetElement,
    highlightedAstElement,
    isAstElement,
    setSelection,
    setSelectedDom,
  } from "$lib/stores/page"
  import { draggedComponentDefinition } from "$lib/stores/dragAndDrop"
  import { updateNodeContent, updateAst } from "$lib/utils/ast-manipulation"
  import { elementCanBeDroppedInTarget } from "$lib/utils/drag-helpers"
  import type { AstNode } from "$lib/types"
  export let node: AstNode
  export let nodeId: string

  let htmlWrapper: HTMLElement
  let domElement: Element
  let previewDropInside: boolean
  $: isDragTarget = $slotTargetElement === node
  $: isSelectedNode = $selectedAstElement === node
  $: isHighlightedNode = $highlightedAstElement === node
  $: isEditable =
    isSelectedNode &&
    isAstElement(node) &&
    Array.isArray(node.content) &&
    node.content.filter((e) => typeof e === "string").length === 1 &&
    !node.attrs?.selfClose
  $: isParentOfSelectedNode =
    isAstElement(node) && Array.isArray(node.content) ? node.content.includes($selectedAstElement) : false

  let children
  $: {
    if (isAstElement(node)) {
      children = node.content
    }
  }

  $: htmlWrapperHasMultipleElements = ((): Boolean => {
    return !!htmlWrapper && htmlWrapper.childElementCount > 1
  })()
  $: htmlWrapperHasIframe = ((): Boolean => {
    return !!htmlWrapper && htmlWrapper.getElementsByTagName("iframe").length > 0
  })()

  $: {
    if (isSelectedNode) {
      setSelectedDom(domElement || htmlWrapper)
    }
  }

  function handleDragEnter() {
    if ($draggedComponentDefinition) {
      if (isAstElement(node) && elementCanBeDroppedInTarget($draggedComponentDefinition)) {
        $slotTargetElement = node
      }
    }
  }

  function handleDragLeave() {
    if (isAstElement(node) && elementCanBeDroppedInTarget($draggedComponentDefinition) && $slotTargetElement === node) {
      $slotTargetElement = undefined
    }
  }

  function handleMouseOver() {
    if (!$selectedAstElement) {
      isAstElement(node) && ($highlightedAstElement = node)
    }
  }
  function handleMouseOut() {
    $highlightedAstElement = undefined
  }

  function handleClick({ currentTarget }: Event) {
    if (currentTarget instanceof Element) {
      setSelection(nodeId)
      setSelectedDom(currentTarget)
    }
  }

  function handleContentEdited({ target }: Event) {
    if (!(target instanceof HTMLElement)) return

    let children = target.children
    if (!isAstElement(node)) {
      return
    }
    if (children.length === 0) {
      if (target.innerText !== node.content) {
        updateNodeContent(node, target.innerText)
      }
    } else {
      let tmpClone = target.cloneNode(true) as HTMLElement
      Array.from(tmpClone.children).forEach((c) => tmpClone.removeChild(c))
      let stringChildIndex = node.content.findIndex((e) => typeof e === "string")
      let newText = tmpClone.textContent?.trim() || ""
      if (node.content[stringChildIndex] !== newText) {
        node.content[stringChildIndex] = newText
        updateAst()
      }
    }
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
      bind:this={htmlWrapper}
      class:contents={htmlWrapperHasMultipleElements}
      class:embedded-iframe={htmlWrapperHasIframe}
      data-selected={isSelectedNode}
      on:mouseover|stopPropagation={handleMouseOver}
      on:mouseout|stopPropagation={handleMouseOut}
      on:click|preventDefault|stopPropagation={handleClick}
      use:highlightContent={{ selected: isSelectedNode, highlighted: isHighlightedNode }}
    >
      {@html node.rendered_html}
    </div>
  {:else}
    <svelte:element
      this={node.tag}
      class="relative"
      bind:this={domElement}
      {...node.attrs}
      data-selected={isSelectedNode}
      data-selected-parent={isParentOfSelectedNode}
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
        {#each children as child, childIndex}
          <svelte:self node={child} nodeId="{nodeId}.{childIndex}" />
        {/each}
        <!-- Using the component definition's example is actually visually confusing. Disabled for now -->
        {#if isDragTarget && $draggedComponentDefinition}
          <div class="dragged-element-placeholder">Preview</div>
        {/if}
        <!-- {#if isDragTarget && $draggedComponentDefinition}
          <div class="dragged-element-placeholder">{@html $draggedComponentDefinition.example}</div>
        {:else if previewDropInside}
          <div class="dragged-element-placeholder">Preview</div>
        {/if} -->
      {/if}
    </svelte:element>
  {/if}
{:else}
  {node}
{/if}

<style>
  .dragged-element-placeholder {
    outline: 2px dashed red;

    /* Disable pointer events to block out any dragOver event triggers on the placeholder while dragging */
    pointer-events: none;
  }

  :global(.embedded-iframe) {
    display: inline;
  }

  :global(.embedded-iframe > iframe) {
    pointer-events: none;
  }
</style>
