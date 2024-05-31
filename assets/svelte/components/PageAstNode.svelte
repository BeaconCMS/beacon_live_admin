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
  import type { AstNode } from "$lib/types"
  export let node: AstNode
  export let nodeId: string

  $: isDragTarget = $slotTargetElement === node
  $: isSelectedNode = $selectedAstElement === node
  $: isHighlightedNode = $highlightedAstElement === node
  $: isEditable = isSelectedNode && isAstElement(node) && node.content.filter((e) => typeof e === "string").length === 1

  function handleDragEnter() {
    if (isAstElement(node) && $draggedObject?.category === "basic") {
      $slotTargetElement = node
    }
  }

  function handleDragLeave() {
    if (isAstElement(node) && $draggedObject?.category === "basic" && $slotTargetElement === node) {
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
  {:else if node.attrs?.selfClose}
    <svelte:element
      this={node.tag}
      {...node.attrs}
      data-selected={isSelectedNode}
      data-highlighted={isHighlightedNode}
      data-slot-target={isDragTarget && !$slotTargetElement.attrs.selfClose}
      on:dragenter|stopPropagation={handleDragEnter}
      on:dragleave|stopPropagation={handleDragLeave}
      on:mouseover|stopPropagation={handleMouseOver}
      on:mouseout|stopPropagation={handleMouseOut}
      on:click|preventDefault|stopPropagation={handleClick}
    />
  {:else}
    <svelte:element
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
      on:click|preventDefault|stopPropagation={() => ($selectedAstElementId = nodeId)}
    >
      {#each node.content as subnode, index}
        <svelte:self node={subnode} nodeId="{nodeId}.{index}" />
      {/each}
      {#if isDragTarget && $draggedObject}
        <div class="dragged-element-placeholder">{@html $draggedObject.template}</div>
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
