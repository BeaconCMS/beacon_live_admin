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

  export type LocationInfo = Omit<DOMRect, "toJSON">

  interface DragInfo {
    parentElementClone: Element
    selectedIndex: number
    siblingLocationInfos: LocationInfo[] // LocationInfo[]
  }

  let currentHandleCoords: Coords
  let relativeWrapperRect: DOMRect
  const dragHandleStyle: Writable<string> = writable("")
  export const isDragging: Writable<boolean> = writable(false)
  let dragElementInfo: DragInfo

  export function initSelectedElementDragMenuPosition(selectedDomEl, mouseDiff?: Coords) {
    let rect = dragElementInfo
      ? dragElementInfo.siblingLocationInfos[dragElementInfo.selectedIndex]
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

  function updateHandleCoords(currentRect: LocationInfo, movement: Coords = { x: 0, y: 0 }) {
    relativeWrapperRect = document
      .getElementById("ui-builder-app-container")
      .closest(".relative")
      .getBoundingClientRect()
    currentHandleCoords = {
      x: currentRect.x - relativeWrapperRect.x + movement.x + currentRect.width / 2 - 5,
      y: currentRect.y - relativeWrapperRect.y + movement.y + currentRect.height + 5,
    }
  }
</script>

<script lang="ts">
  import { tick } from "svelte"

  export let element: Element
  export let isParent = false // TODO: Not in use yet

  let originalSiblings: Element[];
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
      siblingLocationInfos: siblings.map((el, i) => {
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

  function findSwappedIndexes(
    dragDirection: DragDirection,
    mouseDiff: Coords,
    e: MouseEvent,
  ): { currentIndex: number; destinationIndex: number } {
    let hoveredElementIndex = findHoveredSiblingIndex(
      dragDirection,
      mouseDiff,
      dragElementInfo.siblingLocationInfos,
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

  function sortedLocationInfos(
    infos: LocationInfo[],
    draggedElementIndex: number,
    destinationIndex: number,
  ): LocationInfo[] {
    let newInfos = [...infos]
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
        // An element is being dragged earlier in the DOM
        newIndex = index < draggedElementIndex && index >= destinationIndex ? index + 1 : index
      } else {
        // An element is being dragged further down in the DOM
        newIndex = index > draggedElementIndex && index <= destinationIndex ? index - 1 : index
      }
    }
    let distance = 0
    let i = 0
    if (dragDirection === "vertical") {
      while (i < newInfos.length && i < newIndex) {
        let gap = 0
        if (i > 0) {
          gap = dragElementInfo.siblingLocationInfos[i].top - dragElementInfo.siblingLocationInfos[i - 1].bottom
        }
        distance += newInfos[i].height + gap
        i++
      }
      let gap = 0
      if (newIndex > 0) {
        dragElementInfo.siblingLocationInfos
        gap =
          dragElementInfo.siblingLocationInfos[newIndex].top - dragElementInfo.siblingLocationInfos[newIndex - 1].bottom
      }
      distance += gap + dragElementInfo.siblingLocationInfos[0].top
    } else {
      while (i < newInfos.length && i < newIndex) {
        let gap = 0
        if (i > 0) {
          gap = dragElementInfo.siblingLocationInfos[i].left - dragElementInfo.siblingLocationInfos[i - 1].right
        }
        distance += newInfos[i].width + gap
        i++
      }
      let gap = 0
      if (newIndex > 0) {
        dragElementInfo.siblingLocationInfos
        gap =
          dragElementInfo.siblingLocationInfos[newIndex].left - dragElementInfo.siblingLocationInfos[newIndex - 1].right
      }
      distance += gap + dragElementInfo.siblingLocationInfos[0].left
    }
    return distance
  }

  function repositionChildren(currentIndex: number, destinationIndex: number) {
    const newChildren = [...originalSiblings]
    const element = newChildren.splice(currentIndex, 1)[0]; // Remove the element at fromIndex
    newChildren.splice(destinationIndex, 0, element); // Insert the element at toIndex
    dragElementInfo.parentElementClone.replaceChildren(...newChildren);
  }

  function repositionGhosts(currentIndex: number, destinationIndex: number) {
    let parentElement = dragElementInfo.parentElementClone;
    // 1. First: Capture the initial positions (before DOM changes)
    const children = Array.from(parentElement.children);
    const firstRects = children.map(child => child.getBoundingClientRect());

    // 2. Modify the DOM (this can be any modification of your choice)
    repositionChildren(currentIndex, destinationIndex); // Assume this is your layout modification function

    // 3. Last: Capture the final positions (after DOM changes)
    const lastRects = children.map(child => child.getBoundingClientRect());

    // 4. Invert: Calculate the deltas and apply the transform to each element
    children.forEach((child, i) => {
        const firstRect = firstRects[i];
        const lastRect = lastRects[i];
        const deltaX = firstRect.left - lastRect.left;
        const deltaY = firstRect.top - lastRect.top;
        // Apply the transform to invert the movement
        child.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        child.style.transition = 'transform 0s'; // No transition yet
    });

    // 5. Play: Remove the transform, allowing the browser to animate to the final position
    requestAnimationFrame(() => {
        children.forEach(child => {
            child.style.transition = 'transform 0.15s'; // Add transition for smooth animation
            child.style.transform = ''; 
        });
    });
}

  function calculatePlaceholderPosition(
    dragDirection: DragDirection,
    currentIndex: number,
    destinationIndex: number,
    locationInfos: LocationInfo[],
    mouseDiff: Coords
  ) {
    // debugger;
    const currentRect = dragElementInfo.siblingLocationInfos[currentIndex]
    const destinationRect = dragElementInfo.siblingLocationInfos[destinationIndex]
    placeholderStyle = `top: ${destinationRect.top - relativeWrapperRect.top}px; left: ${destinationRect.left - relativeWrapperRect.left}px; height: ${currentRect.height}px; width: ${currentRect.width}px;`
    // let distance = calculateNewDistance(dragDirection, currentIndex, currentIndex, destinationIndex, locationInfos)
    // let draggedElementInfo = dragElementInfo.siblingLocationInfos[dragElementInfo.selectedIndex]
    // if (dragDirection === "vertical") {
    //   placeholderStyle = `top: ${distance - relativeWrapperRect.top}px; left: ${draggedElementInfo.left - relativeWrapperRect.left}px; height: ${draggedElementInfo.height}px; width: ${draggedElementInfo.width}px;`
    // } else {
    //   placeholderStyle = `left: ${distance - relativeWrapperRect.left}px; top: ${draggedElementInfo.top - relativeWrapperRect.top}px; height: ${draggedElementInfo.height}px; width: ${draggedElementInfo.width}px;`
    // }
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
    let { currentIndex, destinationIndex } = findSwappedIndexes(dragDirection, mouseDiff, e)
    if (newIndex !== destinationIndex) {
      repositionGhosts(currentIndex, destinationIndex)
      calculatePlaceholderPosition(
        dragDirection,
        currentIndex,
        destinationIndex,
        dragElementInfo.siblingLocationInfos,
        mouseDiff
      )
      newIndex = destinationIndex
    }
  }

  // function applyTranslate(el: Element, direction: "vertical" | "horizontal", amount: number) {
  //   if (window.getComputedStyle(el).display === "contents") {
  //     Array.from(el.children).forEach(
  //       (child) => (child.style.transform = `${direction === "vertical" ? "translateY" : "translateX"}(${amount}px)`),
  //     )
  //   } else {
  //     el.style.transform = `${direction === "vertical" ? "translateY" : "translateX"}(${amount}px)`
  //   }
  // }

  function handleMousemove(e: MouseEvent) {
    let ghostElement = getGhostElement()
    let dragDirection = getDragDirection(ghostElement)
    let mouseDiff: Coords = {
      x: e.x - mouseDownEvent.x,
      y: e.y - mouseDownEvent.y,
    }
    // arrayToObject(Array.from(dragElementInfo.parentElementClone.children))
    if (dragDirection === "vertical") {
      // Only the drag handle can use CSS variables because it has the `transform` tailwind class
      // CSS variables allow to control translate and rotate independently.
      dragHandleElement.style.setProperty("--tw-translate-y", `${mouseDiff.y}px`)
      // applyTranslate(ghostElement, "vertical", mouseDiff.y)
    } else {
      dragHandleElement.style.setProperty("--tw-translate-x", `${mouseDiff.x}px`)
      // applyTranslate(ghostElement, "horizontal", mouseDiff.x)
    }

    updateSiblingsPositioning(dragDirection, mouseDiff, e)
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
