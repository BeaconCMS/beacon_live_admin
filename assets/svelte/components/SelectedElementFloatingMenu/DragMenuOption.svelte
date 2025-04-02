<script lang="ts" context="module">
  import { writable, type Writable } from "svelte/store"
  import {
    pageAst,
    selectedAstElementId,
    parentOfSelectedAstElement,
    grandParentOfSelectedAstElement,
  } from "$lib/stores/page"
  import { findHoveredSiblingIndex, getBoundingRect, getDragDirection, type Coords } from "$lib/utils/drag-helpers"
  import { live } from "$lib/stores/live"

  export type LocationInfo = Omit<DOMRect, "toJSON"> | DOMRect

  interface DragInfo {
    parentElementClone: Element
    selectedIndex: number
    originalSiblingRects: LocationInfo[] // LocationInfo[]
    newSiblingRects: LocationInfo[] // LocationInfo[]
  }

  export const isDragging: Writable<boolean> = writable(false)

  function calculateHandleXPosition(rect: LocationInfo, position: "bottom" | "left") {
    if (position === "bottom") {
      return rect.x + rect.width / 2 - 5
    } else {
      return rect.x - 25
    }
  }
  function calculateHandleYPosition(rect: LocationInfo, position: "bottom" | "left") {
    if (position === "bottom") {
      return rect.y + rect.height + 5
    } else {
      return rect.y + rect.height / 2 - 5
    }
  }
</script>

<script lang="ts">
  import { tick } from "svelte"

  export let element: Element
  export let isParent = false // TODO: Not in use yet other than for testing purposes

  let originalSiblings: Element[]
  let dragHandleElement: HTMLButtonElement
  let dragHandleStyle = ""
  let currentHandleCoords: Coords
  let relativeWrapperRect: DOMRect
  let dragElementInfo: DragInfo

  $: canBeDragged = element?.parentElement?.children?.length > 1
  $: dragDirection = getDragDirection(element)
  $: {
    // Update drag menu position when the element store changes
    !!element && initSelectedElementDragMenuPosition(element, isParent)
  }

  function updateHandleCoords(currentRect: LocationInfo, isParent: boolean) {
    let appContainer = document.getElementById("ui-builder-app-container")
    if (!appContainer) return
    relativeWrapperRect = appContainer.closest(".relative").getBoundingClientRect()
    const handlePosition = isParent ? "left" : "bottom"
    currentHandleCoords = {
      x: calculateHandleXPosition(currentRect, handlePosition) - relativeWrapperRect.x,
      y: calculateHandleYPosition(currentRect, handlePosition) - relativeWrapperRect.y,
    }
  }
  function initSelectedElementDragMenuPosition(selectedDomEl: Element, isParent: boolean = false) {
    let rect = dragElementInfo
      ? dragElementInfo.originalSiblingRects[dragElementInfo.selectedIndex]
      : getBoundingRect(selectedDomEl)
    updateHandleCoords(rect, isParent)
    let styles = []
    if (currentHandleCoords?.y) {
      styles.push(`top: ${currentHandleCoords.y}px`)
    }
    if (currentHandleCoords?.x) {
      styles.push(`left: ${currentHandleCoords.x}px`)
    }
    dragHandleStyle = styles.join(";")
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
      newSiblingRects: null,
    }
    // If this is expressed as `element.parentElement.style.display = "none"` for some reason svelte
    // thinks it has to invalidate the `element` and recompute all state that observes it.
    const style = element.parentElement.style
    style.display = "none"
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

  function isComment(n: Node): n is Comment {
    return n.nodeType === Node.COMMENT_NODE
  }
  function isElement(n: Node): n is Comment {
    return n.nodeType === Node.ELEMENT_NODE
  }
  function isCommentOrElement(n: Node): n is Comment | Element {
    return isElement(n) || isComment(n)
  }

  // Indexes don't necessarily match indexes in the AST tree. The reason is that the drag and drop
  // works with Elements, and thus ignores non-renderable nodes like HTML comments.
  // Because of that, and because if we move elements without moving the comments directly before that element
  // those comments will very likely end up commenting the wrong element, we want precedent comments to behave in a
  // "sticky" way: When you drag an element, you are moving that element along with any html comment directly
  // preceding that element. This is not necessarily accurate 100% of the time, but it's a lot more accurate
  // than never moving the comments.
  function correctIndex(index: number): [number, number] {
    const nodes = Array.from(element.parentElement.childNodes).filter(isCommentOrElement)
    const elements = Array.from(element.parentElement.children)
    const targetElement = elements[index]
    let startIndex = -1
    let endIndex = -1
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      if (isComment(node) && startIndex < 0) {
        startIndex = i
        continue
      }
      if (node === targetElement) {
        endIndex = i
        if (startIndex < 0) {
          startIndex = i
        }
        break
      }
      startIndex = -1
    }
    return [startIndex, endIndex]
  }

  function applyNewOrder() {
    let parent = isParent ? $grandParentOfSelectedAstElement : $parentOfSelectedAstElement

    if (newIndex !== null && newIndex !== dragElementInfo.selectedIndex && !!parent) {
      // Reordering happened, apply new order
      const [startIndex, endIndex] = correctIndex(dragElementInfo.selectedIndex)
      const movedAstNodes = parent.content.splice(startIndex, endIndex - startIndex + 1)
      const [insertIndex] = correctIndex(newIndex)
      parent.content.splice(insertIndex, 0, ...movedAstNodes)
      // Update the selectedAstElementId so the same item remains selected
      if (isParent) {
        let newSelectedIndex = insertIndex + endIndex - startIndex
        let parts = $selectedAstElementId.split(".")
        parts[parts.length - 2] = newSelectedIndex.toString()
        $selectedAstElementId = parts.join(".")
      } else {
        let newSelectedIndex = insertIndex + endIndex - startIndex
        let parts = $selectedAstElementId.split(".")
        parts[parts.length - 1] = newSelectedIndex.toString()
        $selectedAstElementId = parts.join(".")
      }
      $pageAst = [...$pageAst]
      // Update in the server
      $live.pushEventTo("#heex-visual-editor", "update_page_ast", { ast: $pageAst })
    }
  }

  function resetDragElementHandle() {
    if (dragHandleElement) {
      dragHandleElement.style.transform = null
      dragHandleElement.style.setProperty("--tw-translate-y", null)
      dragHandleElement.style.setProperty("--tw-translate-x", null)
    }
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
    <div
      class="absolute transition-all"
      style="background-color:aqua; opacity: 0.5; {placeholderStyle}"
      data-testid="drag-placeholder"
    ></div>
  {/if}
  <button
    bind:this={dragHandleElement}
    on:mousedown={handleMousedown}
    class="rounded-full w-6 h-6 flex justify-center items-center absolute bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 active:bg-blue-800 transform"
    style={dragHandleStyle}
    data-testid="drag-button{isParent ? '-parent' : ''}"
  >
    <span
      class:hero-arrows-right-left={dragDirection === "horizontal"}
      class:hero-arrows-up-down={dragDirection === "vertical"}
      class:hero-arrows-pointing-out={dragDirection === "both"}
    ></span>
  </button>
{/if}
