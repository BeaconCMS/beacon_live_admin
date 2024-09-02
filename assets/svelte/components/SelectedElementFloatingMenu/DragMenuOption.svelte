<script lang="ts" context="module">
  import { get, writable, type Writable } from "svelte/store"
  import { page, selectedDomElement, selectedAstElementId, selectedElementMenu, parentOfSelectedAstElement } from "$lib/stores/page"
  import { dragElementInfo, type LocationInfo } from "$lib/stores/dragAndDrop"
  import { getDragDirection, updateSelectedElementMenu, type Coords, type DragDirection } from "$lib/utils/drag-helpers"
  import { live } from "$lib/stores/live"

  let currentHandleCoords: Coords
  let relativeWrapperRect: DOMRect
  let dragHandleStyle: Writable<string> = writable("")

  export function initSelectedElementDragMenuPosition(selectedDomEl, mouseDiff?: Coords) {
    let selectedEl
    let dragInfo = get(dragElementInfo)
    if (dragInfo) {
      selectedEl = dragInfo.parentElementClone.children.item(dragInfo.selectedIndex)
    }
    updateHandleCoords(selectedEl || selectedDomEl, mouseDiff)
    let styles = []
    if (currentHandleCoords?.y) {
      styles.push(`top: ${currentHandleCoords.y}px`)
    }
    if (currentHandleCoords?.x) {
      styles.push(`left: ${currentHandleCoords.x}px`)
    }
    dragHandleStyle.set(styles.join(";"))
  }

  function updateHandleCoords(selectedEl: Element, movement: Coords = { x: 0, y: 0 }) {
    relativeWrapperRect = document
      .getElementById("ui-builder-app-container")
      .closest(".relative")
      .getBoundingClientRect()
    let currentRect = selectedEl.getBoundingClientRect()
    let menu = get(selectedElementMenu)
    let movX = menu?.dragDirection === "vertical" ? 0 : movement.x
    let movY = menu?.dragDirection === "vertical" ? movement.y : 0
    currentHandleCoords = {
      x: currentRect.x - relativeWrapperRect.x + movX + currentRect.width / 2 - 5,
      y: currentRect.y - relativeWrapperRect.y + movY + currentRect.height + 5,
    }
  }
</script>

<script lang="ts">
  import { tick } from "svelte"

  selectedAstElementId.subscribe(() => updateSelectedElementMenu());

  let dragHandleElement: HTMLButtonElement

  function snapshotSelectedElementSiblings() {
    let siblings = Array.from($selectedDomElement.parentElement.children)
    let selectedIndex = siblings.indexOf($selectedDomElement)
    let el = $selectedDomElement.parentElement.cloneNode(true) as Element
    let elChildren = Array.from(el.children)
    for (let i = 0; i < elChildren.length; i++) {
      if (i !== selectedIndex) {
        elChildren[i].style.transition = "transform 0.15s"
      }
    }
    $dragElementInfo = {
      parentElementClone: el,
      selectedIndex,
      siblingLocationInfos: siblings.map((el, i) => {
        let { x, y, width, height, top, right, bottom, left } = el.getBoundingClientRect()
        let computedStyles = window.getComputedStyle(el)
        return {
          x,
          y,
          width,
          height,
          top,
          right,
          bottom,
          left,
          marginTop: parseFloat(computedStyles.marginTop),
          marginBottom: parseFloat(computedStyles.marginBottom),
          marginLeft: parseFloat(computedStyles.marginLeft),
          marginRight: parseFloat(computedStyles.marginRight),
        }
      }),
    }
    $selectedDomElement.parentElement.style.display = "none"
    $selectedDomElement.parentElement.parentElement.insertBefore(el, $selectedDomElement.parentElement)
  }

  let mouseDownEvent: MouseEvent
  async function handleMousedown(e: MouseEvent) {
    mouseDownEvent = e
    document.addEventListener("mousemove", handleMousemove)
    document.addEventListener("mouseup", handleMouseup)
    snapshotSelectedElementSiblings()
  }

  function applyNewOrder() {
    if (newIndex !== null) {
      // Reordering happened, apply new order
      let parent = $parentOfSelectedAstElement
      const selectedAstElement = parent.content.splice($dragElementInfo.selectedIndex, 1)[0]
      parent.content.splice(newIndex, 0, selectedAstElement)
      // Update the selectedAstElementId so the same item remains selected
      $page.ast = [...$page.ast]
      let parts = $selectedAstElementId.split('.');
      parts[parts.length - 1] = newIndex.toString();
      $selectedAstElementId = parts.join('.')
      // Update in the server
      $live.pushEvent("update_page_ast", { id: $page.id, ast: $page.ast })
    }
  }
  async function handleMouseup(e: MouseEvent) {
    document.removeEventListener("mousemove", handleMousemove)
    document.removeEventListener("mouseup", handleMouseup)
    applyNewOrder()
    if ($dragElementInfo) {
      $selectedDomElement.parentElement.style.display = null
      $dragElementInfo.parentElementClone.remove()
      $dragElementInfo = null
    }
    mouseDownEvent = null
    await tick()
    dragHandleElement.style.transform = null
    placeholderStyle = null
  }

  function getGhostElement() {
    return $dragElementInfo.parentElementClone.children.item($dragElementInfo.selectedIndex)
  }

  function findHoveredSiblingIndex(dragDirection: DragDirection, e: MouseEvent) {
    // TODO: This detection is not very intuitive. We should detect some % of element overlap (30% maybe) instead.
    if (dragDirection === "vertical") {
      return $dragElementInfo.siblingLocationInfos.findIndex(
        (rect) => rect.top < e.y && rect.bottom + rect.marginBottom > e.y,
      )
    } else {
      return $dragElementInfo.siblingLocationInfos.findIndex(
        (rect) => rect.left < e.x && rect.right + rect.marginLeft > e.x,
      )
    }
  }

  function findSwappedIndexes(
    dragDirection: DragDirection,
    e: MouseEvent,
  ): { currentIndex: number; destinationIndex: number } {
    let hoveredElementIndex = findHoveredSiblingIndex(dragDirection, e)
    if (hoveredElementIndex === -1) {
      return {
        currentIndex: $dragElementInfo.selectedIndex,
        destinationIndex: $dragElementInfo.selectedIndex,
      }
    }
    return {
      currentIndex: $dragElementInfo.selectedIndex,
      destinationIndex: hoveredElementIndex,
    }
  }

  function sortedLocationInfos(
    infos: LocationInfo[],
    draggedElementIndex: number,
    destinationIndex: number,
  ): LocationInfo[] {
    let newInfos = [...$dragElementInfo.siblingLocationInfos]
    let info = newInfos.splice(draggedElementIndex, 1)[0]
    newInfos.splice(destinationIndex, 0, info)
    return newInfos
  }

  function calculateNewDistance(
    dragDirection: DragDirection,
    index: number,
    draggedElementIndex: number,
    destinationIndex: number,
    newInfos: LocationInfo[],
  ): number | undefined {
    if (
      (index < destinationIndex && index < draggedElementIndex) ||
      (index > destinationIndex && index > draggedElementIndex)
    )
      return
    let newIndex: number
    if (index === draggedElementIndex) {
      newIndex = destinationIndex
    } else {
      if (draggedElementIndex > destinationIndex) {
        newIndex = index < draggedElementIndex && index >= destinationIndex ? index + 1 : index
      } else {
        newIndex = index > draggedElementIndex && index <= destinationIndex ? index - 1 : index
      }
    }
    let distance = 0
    let i = 0
    if (dragDirection === "vertical") {
      while (i < newInfos.length && i < newIndex) {
        distance += newInfos[i].height + newInfos[i].marginTop + newInfos[i].marginBottom
        i++
      }
      distance = distance + newInfos[newIndex].marginTop + $dragElementInfo.siblingLocationInfos[0].top
    } else {
      while (i < newInfos.length && i < newIndex) {
        distance += newInfos[i].width + newInfos[i].marginLeft + newInfos[i].marginRight
        i++
      }
      distance = distance + newInfos[newIndex].marginLeft + $dragElementInfo.siblingLocationInfos[0].left
    }
    return distance
  }

  function repositionGhosts(
    dragDirection: DragDirection,
    currentIndex: number,
    destinationIndex: number,
    locationInfos: LocationInfo[],
  ) {
    Array.from($dragElementInfo.parentElementClone.children).forEach((el, i) => {
      if (i !== $dragElementInfo.selectedIndex) {
        const distance = calculateNewDistance(dragDirection, i, currentIndex, destinationIndex, locationInfos)
        if (distance) {
          if (dragDirection === "vertical") {
            el.style.transform = `translateY(${distance - $dragElementInfo.siblingLocationInfos[i].top}px)`
          } else {
            el.style.transform = `translateX(${distance - $dragElementInfo.siblingLocationInfos[i].left}px)`
          }
        } else {
          el.style.transform = null
        }
      }
    })
  }

  function calculatePlaceholderPosition(
    dragDirection: DragDirection,
    currentIndex: number,
    destinationIndex: number,
    locationInfos: LocationInfo[],
  ) {
    let distance = calculateNewDistance(dragDirection, currentIndex, currentIndex, destinationIndex, locationInfos)
    let draggedElementInfo = $dragElementInfo.siblingLocationInfos[$dragElementInfo.selectedIndex]
    if (dragDirection === "vertical") {
      placeholderStyle = `top: ${distance - relativeWrapperRect.top + draggedElementInfo.marginTop}px; left: ${draggedElementInfo.left - relativeWrapperRect.left}px; height: ${draggedElementInfo.height}px; width: ${draggedElementInfo.width}px;`
    } else {
      placeholderStyle = `left: ${distance - relativeWrapperRect.left + draggedElementInfo.marginLeft}px; top: ${draggedElementInfo.top - relativeWrapperRect.top}px; height: ${draggedElementInfo.height}px; width: ${draggedElementInfo.width}px;`
    }
  }

  let placeholderStyle: string = null
  let newIndex: number = null

  function updateSiblingsPositioning(dragDirection: DragDirection, mouseDiff, e) {
    if (!relativeWrapperRect) {
      relativeWrapperRect = document
        .getElementById("ui-builder-app-container")
        .closest(".relative")
        .getBoundingClientRect()
    }
    if (mouseDiff[dragDirection === "vertical" ? "y" : "x"] !== 0) {
      let { currentIndex, destinationIndex } = findSwappedIndexes(dragDirection, e)
      if (currentIndex === destinationIndex) {
        // No drag, reset effect.
        if (newIndex !== null) {
          // Reset the transforms on all elements but the one being dragged, which must keep following the cursor.
          Array.from($dragElementInfo.parentElementClone.children).forEach(
            (el, i) => i !== destinationIndex && (el.style.transform = null),
          )
        }
        newIndex = null
        calculatePlaceholderPosition(
          dragDirection,
          currentIndex,
          destinationIndex,
          $dragElementInfo.siblingLocationInfos,
        )
      } else {
        let rearrangedInfos = sortedLocationInfos($dragElementInfo.siblingLocationInfos, currentIndex, destinationIndex)
        repositionGhosts(dragDirection, currentIndex, destinationIndex, rearrangedInfos)
        calculatePlaceholderPosition(dragDirection, currentIndex, destinationIndex, rearrangedInfos)
        newIndex = destinationIndex
      }
    }
  }

  function handleMousemove(e: MouseEvent) {
    let ghostElement = getGhostElement()
    let dragDirection = getDragDirection(ghostElement)
    let mouseDiff: Coords = {
      x: e.x - mouseDownEvent.x,
      y: e.y - mouseDownEvent.y,
    }
    if (dragDirection === "vertical") {
      dragHandleElement.style.transform = `translateY(${mouseDiff.y}px)`
      ghostElement.style.transform = `translateY(${mouseDiff.y}px)`
    } else {
      dragHandleElement.style.transform = `translateX(${mouseDiff.x}px)`
      ghostElement.style.transform = `translateX(${mouseDiff.x}px)`
    }

    updateSiblingsPositioning(dragDirection, mouseDiff, e)
  }
</script>

{#if placeholderStyle}
  <div class="absolute transition-all" style="background-color:aqua; opacity: 0.5; {placeholderStyle}"></div>
{/if}
<button
  bind:this={dragHandleElement}
  on:mousedown={handleMousedown}
  class="rounded-full w-6 h-6 flex justify-center items-center absolute bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 active:bg-blue-800"
  class:pointer-events-none={$selectedElementMenu?.dragging}
  class:rotate-90={$selectedElementMenu?.dragDirection === "horizontal"}
  style={$dragHandleStyle}
>
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
    ><path
      d="M 1 2.5 C 1 1.948 1.448 1.5 2 1.5 L 10 1.5 C 10.552 1.5 11 1.948 11 2.5 L 11 2.5 C 11 3.052 10.552 3.5 10 3.5 L 2 3.5 C 1.448 3.5 1 3.052 1 2.5 Z"
      fill="currentColor"
    ></path><path
      d="M 1 6 C 1 5.448 1.448 5 2 5 L 10 5 C 10.552 5 11 5.448 11 6 L 11 6 C 11 6.552 10.552 7 10 7 L 2 7 C 1.448 7 1 6.552 1 6 Z"
      fill="currentColor"
    ></path><path
      d="M 1 9.5 C 1 8.948 1.448 8.5 2 8.5 L 10 8.5 C 10.552 8.5 11 8.948 11 9.5 L 11 9.5 C 11 10.052 10.552 10.5 10 10.5 L 2 10.5 C 1.448 10.5 1 10.052 1 9.5 Z"
      fill="currentColor"
    ></path></svg
  >
</button>
