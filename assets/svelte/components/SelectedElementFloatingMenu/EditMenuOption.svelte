<script lang="ts">
  import { selectedDomElement } from "$lib/stores/page"
  import { getBoundingRect } from "$lib/utils/drag-helpers"

  export let element: Element

  let editButtonElement: HTMLButtonElement
  let editButtonStyle = ""

  $: {
    // Update edit button position when the element store changes
    !!element && initEditButtonPosition(element)
  }

  function initEditButtonPosition(selectedDomEl: Element) {
    let appContainer = document.getElementById("ui-builder-app-container")
    if (!appContainer) return
    let relativeWrapperRect = appContainer.closest(".relative").getBoundingClientRect()
    let currentRect = getBoundingRect(selectedDomEl)
    
    // Position in top right corner
    let styles = [
      `top: ${currentRect.y - relativeWrapperRect.y - 12}px`,
      `left: ${currentRect.x - relativeWrapperRect.x + currentRect.width - 12}px`
    ]
    editButtonStyle = styles.join(";")
  }

  function handleClick() {
    // TODO: Implement edit functionality
  }
</script>

<button
  bind:this={editButtonElement}
  on:click={handleClick}
  class="rounded-full w-6 h-6 flex justify-center items-center absolute bg-purple-500 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 active:bg-blue-800"
  style={editButtonStyle}
  data-testid="edit-button"
  aria-label="Edit component"
>
  <span class="hero-pencil-square"></span>
</button>