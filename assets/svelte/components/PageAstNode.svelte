<script lang="ts">
  import { selectedAstElement, slotTargetElement, selectedAstElementId, highlightedAstElement, isAstElement } from '$lib/stores/page';
  import type { AstNode } from '$lib/types';
  export let node: AstNode;
  export let nodeId: string;
  import { draggedObject } from '$lib/stores/dragAndDrop';

  function handleDragEnter() {
    if (isAstElement(node) && $draggedObject?.category === 'basic') {
      $slotTargetElement = node;
    }
  }

  function handleDragLeave() {
    if (isAstElement(node) && $draggedObject?.category === 'basic' && $slotTargetElement === node) {
      $slotTargetElement = undefined;
    }
  }

  function handleMouseOver() {
    isAstElement(node) && ($highlightedAstElement = node);
  }
  function handleMouseOut() {
    $highlightedAstElement = undefined
  }

  function handleClick() {
    $selectedAstElementId = nodeId
  }

  // When rendering raw html, we can't add the usual classes to the wrapper.
  function highlightContent(wrapperDiv: HTMLElement, { selected, highlighted }: { selected: boolean, highlighted: boolean }) {
    let startsWithOneChildren = wrapperDiv.children.length === 1;
    if (startsWithOneChildren) {
      let child = wrapperDiv.children[0];
      child.setAttribute('data-selected', String(selected));
      child.setAttribute('data-highlighted', String(highlighted));
    }
    return {
      update({ selected, highlighted }: { selected: boolean, highlighted: boolean }) {
        if (wrapperDiv.children.length === 1) {
          let child = wrapperDiv.children[0];
          child.setAttribute('data-selected', String(selected));
          child.setAttribute('data-highlighted', String(highlighted));
        } else if (wrapperDiv.children.length === 0 && wrapperDiv.childNodes.length === 1) {
          wrapperDiv.setAttribute('data-nochildren', "true");
          wrapperDiv.setAttribute('data-selected', String(selected));
          wrapperDiv.setAttribute('data-highlighted', String(highlighted));
        } else if (startsWithOneChildren) {
          Array.from(wrapperDiv.children).forEach(child => {
            child.removeAttribute('data-selected');
            child.removeAttribute('data-highlighted');
          });
        }
      },
      destroy() {
        // noop
      }
    }
  }
</script>

{#if isAstElement(node)}
  {#if node.tag === 'html_comment'}
    {@html "<!--" + node.content + "-->"}
  {:else if node.tag === 'eex_comment'}
    {@html "<!--" + node.content + "-->"}
  {:else if node.tag === 'eex' && node.content[0] === '@inner_content'}
    <slot/>
  {:else if node.rendered_html}
    <div
      class="contents"
      on:mouseover|stopPropagation={handleMouseOver}
      on:mouseout|stopPropagation={handleMouseOut}
      on:click|preventDefault|stopPropagation={() => $selectedAstElementId = nodeId}
      use:highlightContent={{selected: $selectedAstElement === node, highlighted: $highlightedAstElement === node}}
    >{@html node.rendered_html}</div>
  {:else if node.attrs.selfClose}
    <svelte:element
      this={node.tag}
      {...node.attrs}
      data-selected={$selectedAstElement === node}
      data-highlighted={$highlightedAstElement === node}
      data-slot-target={$slotTargetElement === node && !$slotTargetElement.attrs.selfClose}
      on:dragenter|stopPropagation={handleDragEnter}
      on:dragleave|stopPropagation={handleDragLeave}
      on:mouseover|stopPropagation={handleMouseOver}
      on:mouseout|stopPropagation={handleMouseOut}
      on:click|preventDefault|stopPropagation={handleClick} />
  {:else}
    <svelte:element
      this={node.tag}
      {...node.attrs}
      data-selected={$selectedAstElement === node}
      data-highlighted={$highlightedAstElement === node}
      data-slot-target={$slotTargetElement === node}
      on:dragenter|stopPropagation={handleDragEnter}
      on:dragleave|stopPropagation={handleDragLeave}
      on:mouseover|stopPropagation={handleMouseOver}
      on:mouseout|stopPropagation={handleMouseOut}
      on:click|preventDefault|stopPropagation={() => $selectedAstElementId = nodeId}>
      {#each node.content as subnode, index}
        <svelte:self node={subnode} nodeId="{nodeId}.{index}"/>
      {/each}
    </svelte:element>
  {/if}
{:else}
  {node}
{/if}
