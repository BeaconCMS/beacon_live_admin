import { get } from "svelte/store"
import { selectedDomElement, selectedElementMenu } from "$lib/stores/page"

export interface Coords {
  x: number
  y: number
}

export interface CoordsDiff {
  start: Coords
  current: Coords
}

export type DragDirection = "horizontal" | "vertical"

export function elementCanBeDroppedInTarget(draggedObject) {
  // return draggedObject?.category === "basic";
  return true
}

export function mouseDiff(mouseMovement: CoordsDiff): Coords {
  return {
    x: mouseMovement.current.x - mouseMovement.start.x,
    y: mouseMovement.current.y - mouseMovement.start.y,
  }
}

// Determines if the drag of the current element should vertical or horizontal based on the
// flow of its siblings
// If prefers a practical approach, checking if the last element is further down (or right)
// than the first one.
// I'm not sure if there's any imaginative layout in which is not good enough, but just in case
// there's a second logic to check if the parent element uses a horizontal flexbox layout.
export function getDragDirection(element: Element): DragDirection {
  let parentEl = element.parentElement
  let rects = Array.from(parentEl.children).map((child) => child.getBoundingClientRect())
  if (rects.length > 1) {
    if (rects[rects.length - 1].y - rects[0].y) {
      return "vertical"
    }
    if (rects[rects.length - 1].x - rects[0].x) {
      return "horizontal"
    }
  }
  let flexDirection = window.getComputedStyle(parentEl).flexDirection
  return ["row", "row-reverse"].includes(flexDirection) ? "horizontal" : "vertical"
}

let relativeWrapperRect: DOMRect

export function getElementCoords(element: Element): Coords {
  if (!relativeWrapperRect) {
    relativeWrapperRect = document
      .getElementById("ui-builder-app-container")
      .closest(".relative")
      .getBoundingClientRect()
  }
  let elementRect = element.getBoundingClientRect()
  let currentCoords = {
    x: elementRect.x - relativeWrapperRect.x,
    y: elementRect.y - relativeWrapperRect.y,
  }
  return currentCoords
}

export function updateSelectedElementMenu(mouseMovement = null) {
  let selectedEl = get(selectedDomElement)

  if (!selectedEl) {
    selectedElementMenu.set(null)
    return
  }

  let dragDirection = getDragDirection(selectedEl)
  let currentCoords = getElementCoords(selectedEl)
  let selectedElRect = selectedEl.getBoundingClientRect()
  let menu = get(selectedElementMenu)
  let elementCoords: CoordsDiff =
    menu && mouseMovement ? menu.elementCoords : { start: currentCoords, current: currentCoords }
  let insertBefore = menu?.insertBefore || null
  let top = elementCoords.current.y + selectedElRect.height + 5
  let left = elementCoords.current.x + selectedElRect.width / 2 - 12
  if (mouseMovement) {
    top = dragDirection === "horizontal" ? top : mouseMovement.current.y - relativeWrapperRect.y - 12
    left = dragDirection === "vertical" ? left : mouseMovement.current.x - relativeWrapperRect.x - 12
  }
  if (!mouseMovement) {
    // console.log('setting selectedElementMenu to ', { top, left, elementCoords, dragDirection, dragging: !!mouseMovement, mouseMovement });
  }
  selectedElementMenu.set({
    top,
    left,
    elementCoords,
    dragDirection,
    dragging: !!mouseMovement,
    mouseMovement,
    insertBefore,
  })
}
