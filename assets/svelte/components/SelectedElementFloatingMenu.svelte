<script lang="ts">
  import { selectedAstElement } from "$lib/stores/page"
  import DragMenuOption from "./SelectedElementFloatingMenu/DragMenuOption.svelte"
  import { selectedAstElementId, selectedDomElement, resetSelection } from "$lib/stores/page"
  import { deleteAstNode } from "$lib/utils/ast-manipulation"

  let menuDOMElement: HTMLElement
  let menuPosition: { x: number; y: number; width: number; height: number }

  // Only show menu when visible (it gets hidden while dragging)
  $: showMenu = !!$selectedDomElement && $selectedDomElement.checkVisibility()

  $: menuPosition = (() => {
    if (!(showMenu && document && menuDOMElement && $selectedDomElement)) {
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

{#if $selectedAstElement}
  <div
    bind:this={menuDOMElement}
    class="selected-element-menu absolute"
    style={`top: ${menuPosition.y}px; left: ${menuPosition.x}px;`}
  >
    {#if showMenu}
      <button
        on:click={deleteComponent}
        class="absolute top-0 -m-3 w-6 h-6 rounded-full flex justify-center items-center bg-red-500 text-white hover:bg-red-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 active:bg-red-800"
        style={`left: ${menuPosition.width}px;`}
        aria-label="Delete component"
      >
        <span class="hero-trash"></span>
      </button>
    {/if}
  </div>

  <DragMenuOption element={$selectedDomElement}/>
{/if}
