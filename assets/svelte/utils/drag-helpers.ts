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

export function getDragDirection(element: Element): DragDirection {
  let parentEl = element.parentElement
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
