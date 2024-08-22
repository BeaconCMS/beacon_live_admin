<script lang="ts">
  import DragMenuOption from "./SelectedElementFloatingMenu/DragMenuOption.svelte"
  import { selectedAstElementId, selectedDomElement, selectedElementMenu, resetSelection } from "$lib/stores/page"
  import { deleteAstNode } from "$lib/utils/ast-manipulation"

  let menuDOMElement: HTMLElement
  let menuPosition: { x: number; y: number; width: number; height: number }

  $: menuPosition = (() => {
    if (!(document && menuDOMElement && $selectedDomElement)) {
      return { x: 0, y: 0, width: 0, height: 0 }
    }

    // Get the closest relative positioned parent to define absolute position
    let relativeWrapperRect = menuDOMElement.closest(".relative").getBoundingClientRect()
    let currentRect = $selectedDomElement.getBoundingClientRect()

    return {
      x: currentRect.x - relativeWrapperRect.x,
      y: currentRect.y - relativeWrapperRect.y,
      width: currentRect.width,
      height: currentRect.height,
    }
  })()

  async function deleteComponent() {
    if (!$selectedAstElementId) return

    if (confirm("Are you sure you want to delete this component?")) {
      deleteAstNode($selectedAstElementId)
      resetSelection()
    }
  }
</script>

<div
  bind:this={menuDOMElement}
  class="selected-element-menu absolute"
  style={`top: ${menuPosition.y}px; left: ${menuPosition.x}px;`}
>
  {#if $selectedElementMenu}
    <button
      on:click={deleteComponent}
      class="absolute top-0 -m-3 w-6 h-6 rounded-full flex justify-center items-center bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 active:bg-blue-800"
      style={`left: ${menuPosition.width}px;`}
    >
      <span class="hero-trash"></span>
    </button>
  {/if}
</div>

{#if $selectedElementMenu}
  <DragMenuOption />
{/if}
