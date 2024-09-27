<script lang="ts" context="module">
  import { writable, type Writable } from "svelte/store"
  import { page, selectedAstElementId, parentOfSelectedAstElement } from "$lib/stores/page"
  import {
    findHoveredSiblingIndex,
    getBoundingRect,
    getDragDirection,
    type Coords,
    type DragDirection,
  } from "$lib/utils/drag-helpers"
  import { live } from "$lib/stores/live"

  export type LocationInfo = Omit<DOMRect, "toJSON"> | DOMRect

  interface DragInfo {
    parentElementClone: Element
    selectedIndex: number
    originalSiblingRects: LocationInfo[] // LocationInfo[]
    newSiblingRects: LocationInfo[] // LocationInfo[]
  }

  let currentHandleCoords: Coords
  let relativeWrapperRect: DOMRect
  const dragHandleStyle: Writable<string> = writable("")
  export const isDragging: Writable<boolean> = writable(false)
  let dragElementInfo: DragInfo

  export function initSelectedElementDragMenuPosition(selectedDomEl, mouseDiff?: Coords) {
    let rect = dragElementInfo
      ? dragElementInfo.originalSiblingRects[dragElementInfo.selectedIndex]
      : getBoundingRect(selectedDomEl)
    updateHandleCoords(rect, mouseDiff)
    let styles = []
    if (currentHandleCoords?.y) {
      styles.push(`top: ${currentHandleCoords.y}px`)
    }
    if (currentHandleCoords?.x) {
      styles.push(`left: ${currentHandleCoords.x}px`)
    }
    dragHandleStyle.set(styles.join(";"))
  }

  function calculateHandleXPosition(rect: LocationInfo) {
    return rect.x + rect.width / 2 - 5
  }
  function calculateHandleYPosition(rect: LocationInfo) {
    return rect.y + rect.height + 5
  }
  function updateHandleCoords(currentRect: LocationInfo, movement: Coords = { x: 0, y: 0 }) {
    relativeWrapperRect = document
      .getElementById("ui-builder-app-container")
      .closest(".relative")
      .getBoundingClientRect()
    currentHandleCoords = {
      x: calculateHandleXPosition(currentRect) - relativeWrapperRect.x + movement.x,
      y: calculateHandleYPosition(currentRect) - relativeWrapperRect.y + movement.y,
    }
  }
</script>

<script lang="ts">
  import { tick } from "svelte"

  export let element: Element
  export let isParent = false // TODO: Not in use yet

  let originalSiblings: Element[]
  let dragHandleElement: HTMLButtonElement
  $: canBeDragged = element?.parentElement?.children?.length > 1
  $: rotated = !!element && getDragDirection(element) === "horizontal"
  $: {
    // Update drag menu position when the element store changes
    !!element && initSelectedElementDragMenuPosition(element)
  }

  function snapshotSelectedElementSiblings() {
    let siblings = Array.from(element.parentElement.children)
    let selectedIndex = siblings.indexOf(element)
    let el = element.parentElement.cloneNode(true) as Element
    let elChildren = Array.from(el.children)
    for (let i = 0; i < elChildren.length; i++) {
      // Next line is only for debugging purposes. It helps find the cloned nodes
      elChildren[i].setAttribute("data-is-clone", "true")
    }
    dragElementInfo = {
      parentElementClone: el,
      selectedIndex,
      originalSiblingRects: siblings.map((el, i) => {
        let { x, y, width, height, top, right, bottom, left } = getBoundingRect(el)
        return {
          x,
          y,
          width,
          height,
          top,
          right,
          bottom,
          left,
        }
      }),
    }
    element.parentElement.style.display = "none"
    element.parentElement.parentNode.insertBefore(el, element.parentElement)
    originalSiblings = Array.from(dragElementInfo.parentElementClone.children)
  }

  let mouseDownEvent: MouseEvent
  async function handleMousedown(e: MouseEvent) {
    $isDragging = true
    mouseDownEvent = e
    document.addEventListener("mousemove", handleMousemove)
    document.addEventListener("mouseup", handleMouseup)
    snapshotSelectedElementSiblings()
  }

  function applyNewOrder() {
    if (newIndex !== dragElementInfo.selectedIndex) {
      // Reordering happened, apply new order
      let parent = $parentOfSelectedAstElement
      const selectedAstElement = parent.content.splice(dragElementInfo.selectedIndex, 1)[0]
      parent.content.splice(newIndex, 0, selectedAstElement)
      // Update the selectedAstElementId so the same item remains selected
      $page.ast = [...$page.ast]
      let parts = $selectedAstElementId.split(".")
      parts[parts.length - 1] = newIndex.toString()
      $selectedAstElementId = parts.join(".")
      // Update in the server
      $live.pushEvent("update_page_ast", { id: $page.id, ast: $page.ast })
    }
  }

  function resetDragElementHandle() {
    dragHandleElement.style.transform = null
    dragHandleElement.style.setProperty("--tw-translate-y", null)
    dragHandleElement.style.setProperty("--tw-translate-x", null)
  }

  async function handleMouseup(e: MouseEvent) {
    document.removeEventListener("mousemove", handleMousemove)
    document.removeEventListener("mouseup", handleMouseup)
    applyNewOrder()
    if (dragElementInfo) {
      element.parentElement.style.display = null
      dragElementInfo.parentElementClone.remove()
      dragElementInfo = null
    }
    mouseDownEvent = null
    await tick()
    $isDragging = false
    resetDragElementHandle()
    placeholderStyle = null
    originalSiblings = null
  }

  function getGhostElement() {
    return dragElementInfo.parentElementClone.children.item(dragElementInfo.selectedIndex)
  }

  function findSwappedIndexes(mouseDiff: Coords): { currentIndex: number; destinationIndex: number } {
    let hoveredElementIndex = findHoveredSiblingIndex(
      mouseDiff,
      dragElementInfo.originalSiblingRects,
      dragElementInfo.selectedIndex,
    )
    if (hoveredElementIndex === -1) {
      return {
        currentIndex: dragElementInfo.selectedIndex,
        destinationIndex: dragElementInfo.selectedIndex,
      }
    }
    return {
      currentIndex: dragElementInfo.selectedIndex,
      destinationIndex: hoveredElementIndex,
    }
  }

  function repositionSiblings(currentIndex: number, destinationIndex: number) {
    let parentElement = dragElementInfo.parentElementClone
    // 1. First: Capture the initial positions (before DOM changes)
    const children = Array.from(parentElement.children)
    const firstRects = children.map((child) => child.getBoundingClientRect())

    // 2. Modify the DOM
    const newChildren = [...originalSiblings]
    const element = newChildren.splice(currentIndex, 1)[0] // Remove the element at fromIndex
    newChildren.splice(destinationIndex, 0, element) // Insert the element at toIndex
    dragElementInfo.parentElementClone.replaceChildren(...newChildren)

    // 3. Last: Capture the final positions (after DOM changes)
    const lastRects = children.map((child) => child.getBoundingClientRect())

    // 4. Invert: Calculate the deltas and apply the transform to each element
    children.forEach((child, i) => {
      if (i !== newIndex) {
        const firstRect = firstRects[i]
        const lastRect = lastRects[i]
        const deltaX = firstRect.left - lastRect.left
        const deltaY = firstRect.top - lastRect.top
        // Apply the transform to invert the movement
        child.style.transform = `translate(${deltaX}px, ${deltaY}px)`
      } else {
        // The current element must have no transforms. It's position is animated
        // differently as it tracks the mouse movement
        child.style.transform = `none`
      }
      child.style.transition = "transform 0s"
    })

    // 5. Store the new positions for later use after all transforms have been added or removed
    dragElementInfo.newSiblingRects = Array.from(dragElementInfo.parentElementClone.children).map((e) =>
      e.getBoundingClientRect(),
    )

    // 6. Play: Remove the transform, allowing the browser to animate to the final position
    requestAnimationFrame(() => {
      children.forEach((child) => {
        child.style.transition = "transform 0.2s" // Add transition for smooth animation
        child.style.transform = ""
      })
    })
  }

  function repositionPlaceholder(destinationIndex: number) {
    // Calculate the position of the placeholder using the final positions
    const currentRect = dragElementInfo.newSiblingRects[destinationIndex]
    placeholderStyle = `top: ${currentRect.top - relativeWrapperRect.top}px; left: ${currentRect.left - relativeWrapperRect.left}px; height: ${currentRect.height}px; width: ${currentRect.width}px;`
  }

  function repositionGhostElement(currentIndex: number, destinationIndex: number, mouseDiff: Coords) {
    const ghostElement = dragElementInfo.parentElementClone.children.item(destinationIndex)
    let xDistance = 0
    let yDistance = 0
    if (currentIndex === destinationIndex) {
      xDistance = mouseDiff.x
      yDistance = mouseDiff.y
    } else {
      const oldRect = dragElementInfo.originalSiblingRects[currentIndex]
      const newRect = dragElementInfo.newSiblingRects[destinationIndex]
      xDistance = -(newRect.x - oldRect.x - mouseDiff.x)
      yDistance = -(newRect.y - oldRect.y - mouseDiff.y)
    }
    ghostElement.style.transition = "none"
    ghostElement.style.transform = `translate(${xDistance}px,${yDistance}px)`
  }

  function repositionDragHandle(mouseDiff: Coords) {
    dragHandleElement.style.setProperty("--tw-translate-x", `${mouseDiff.x}px`)
    dragHandleElement.style.setProperty("--tw-translate-y", `${mouseDiff.y}px`)
  }

  let placeholderStyle: string = null
  let newIndex: number = null
  function updateSiblingsPositioning(mouseDiff) {
    if (!relativeWrapperRect) {
      relativeWrapperRect = document
        .getElementById("ui-builder-app-container")
        .closest(".relative")
        .getBoundingClientRect()
    }
    let { currentIndex, destinationIndex } = findSwappedIndexes(mouseDiff)
    if (newIndex !== destinationIndex) {
      repositionSiblings(currentIndex, destinationIndex)
      repositionPlaceholder(destinationIndex)
      newIndex = destinationIndex
    }
    repositionGhostElement(currentIndex, destinationIndex, mouseDiff)
  }

  function handleMousemove(e: MouseEvent) {
    let ghostElement = getGhostElement()
    let dragDirection = getDragDirection(ghostElement)
    let mouseDiff: Coords = {
      x: dragDirection === "vertical" ? 0 : e.x - mouseDownEvent.x,
      y: dragDirection === "horizontal" ? 0 : e.y - mouseDownEvent.y,
    }

    updateSiblingsPositioning(mouseDiff)
    repositionDragHandle(mouseDiff)
  }
</script>

{#if canBeDragged}
  {#if placeholderStyle}
    <div class="absolute transition-all" style="background-color:aqua; opacity: 0.5; {placeholderStyle}"></div>
  {/if}
  <button
    bind:this={dragHandleElement}
    on:mousedown={handleMousedown}
    class="rounded-full w-6 h-6 flex justify-center items-center absolute bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 active:bg-blue-800 transform"
    class:rotate-90={rotated}
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
{/if}
