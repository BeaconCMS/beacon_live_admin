<script lang="ts">
  import { selectedAstElement } from "$lib/stores/page"
  import DragMenuOption, { isDragging } from "./SelectedElementFloatingMenu/DragMenuOption.svelte"
  import { selectedAstElementId, selectedDomElement, resetSelection } from "$lib/stores/page"
  import { deleteAstNode } from "$lib/utils/ast-manipulation"
  import { getBoundingRect } from "$lib/utils/drag-helpers"

  let menuDOMElement: HTMLElement
  let menuPosition: { x: number; y: number; width: number; height: number }

  // Only show menu when visible (it gets hidden while dragging)
  $: showMenu = !!$selectedDomElement && !$isDragging
  $: menuPosition = (() => {
    if (!(showMenu && document && menuDOMElement && $selectedDomElement)) {
      return { x: 0, y: 0, width: 0, height: 0 }
    }

    // Get the closest relative positioned parent to define absolute position
    let relativeWrapperRect = getBoundingRect(menuDOMElement.closest(".relative"))
    let currentRect = getBoundingRect($selectedDomElement)
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
        data-testid="element-delete-button"
      >
        <span class="hero-trash"></span>
      </button>
    {/if}
  </div>

  <DragMenuOption element={$selectedDomElement} />
  {#if $selectedDomElement?.parentElement}
    <DragMenuOption element={$selectedDomElement.parentElement} isParent={true} />
  {/if}
{/if}
