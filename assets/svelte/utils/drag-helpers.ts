import { LocationInfo } from "$lib/components/SelectedElementFloatingMenu/DragMenuOption.svelte"

export interface Coords {
  x: number
  y: number
}

export interface CoordsDiff {
  start: Coords
  current: Coords
}

export type DragDirection = "horizontal" | "vertical" | "both"

export function elementCanBeDroppedInTarget(draggedComponentDefinition) {
  // return draggedComponentDefinition?.category === "basic";
  return true
}

export function mouseDiff(mouseMovement: CoordsDiff): Coords {
  return {
    x: mouseMovement.current.x - mouseMovement.start.x,
    y: mouseMovement.current.y - mouseMovement.start.y,
  }
}

// Detects if elements flow generally in an horizontal direction, a vertical one or
// both (e.g. they form a grid or overflow to the the next line)
function detectFlow(rects: DOMRect[]) {
  // Sort elements by their left position (to analyze horizontal arrangement)
  const sortedByLeft = [...rects].sort((a, b) => a.left - b.left);
  // Sort elements by their top position (to analyze vertical arrangement)
  const sortedByTop = [...rects].sort((a, b) => a.top - b.top);

  // Calculate the average horizontal and vertical spacing between elements
  const avgHorizontalDiff = getAverageDifference(sortedByLeft, 'left');
  const avgVerticalDiff = getAverageDifference(sortedByTop, 'top');

  // Determine the dominant flow
  if (avgHorizontalDiff > avgVerticalDiff) {
      // Check if all elements are roughly centered vertically
      const isCenteredHorizontally = checkVerticalCenterAlignment(sortedByLeft);
      return isCenteredHorizontally ? 'horizontal' : 'both';
  } else if (avgVerticalDiff > avgHorizontalDiff) {
      return 'vertical';
  }
  return 'both';
}

// Helper to calculate average difference for a given property (top or left)
function getAverageDifference(rects, property) {
  let totalDiff = 0;
  for (let i = 1; i < rects.length; i++) {
      totalDiff += Math.abs(rects[i][property] - rects[i - 1][property]);
  }
  return totalDiff / (rects.length - 1);
}

// Helper to check if elements are centered vertically relative to each other
function checkVerticalCenterAlignment(rects) {
  const centers = rects.map(rect => (rect.top + rect.bottom) / 2);
  const minCenter = Math.min(...centers);
  const maxCenter = Math.max(...centers);
  return (maxCenter - minCenter) < 17; // tolerance for alignment, adjust as needed
}




// Determines if the drag of the current element should vertical or horizontal based on the
// flow of its siblings
// If prefers a practical approach, checking if the last element is further down (or right)
// than the first one.
// I'm not sure if there's any imaginative layout in which is not good enough, but just in case
// there's a second logic to check if the parent element uses a horizontal flexbox layout.
export function getDragDirection(element: Element): DragDirection {
  let parentEl = element?.parentElement

  if (!parentEl) {
    return "vertical"
  }

  const siblings = Array.from(parentEl.children)
  const rects = siblings.map((el) => el.getBoundingClientRect())

  return detectFlow(rects)
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

export function getBoundingRect(el: Element): LocationInfo {
  if (window.getComputedStyle(el).display === "contents") {
    if (el.children.length === 1) {
      return el.children[0].getBoundingClientRect()
    }
    const rects = Array.from(el.children).map((e) => e.getBoundingClientRect())
    let top = Math.min(...rects.map((r) => r.top))
    let bottom = Math.max(...rects.map((r) => r.bottom))
    let left = Math.min(...rects.map((r) => r.left))
    let right = Math.max(...rects.map((r) => r.right))
    return {
      x: Math.min(...rects.map((r) => r.x)),
      y: Math.min(...rects.map((r) => r.y)),
      top,
      right,
      bottom,
      left,
      width: right - left,
      height: bottom - top,
    }
  }
  return el.getBoundingClientRect()
}

// Finds the hovered element using a very common algorithm for this:
// First, it checks that element has the most overlap with the element being dragged. That one wins
// If there is a tie (which can happen when the element being dragged is bigger and completely overlaps
// more than one element), this picks the one whose center is closest to the center of the dragged element.
export function findHoveredSiblingIndex(
  mouseDiff: Coords,
  siblingRects: LocationInfo[],
  selectedIndex: number,
): number {
  const currentRect = offsetRect(siblingRects[selectedIndex], mouseDiff)
  let bestMatchIndex = selectedIndex
  let bestOverlapScore = 0
  for (let i = 0; i < siblingRects.length; i++) {
    if (i !== selectedIndex) {
      const rect = siblingRects[i]
      const overlap = calculateOverlap(rect, currentRect)
      if (overlap === 0) {
        continue
      }
      // The item with the biggest overlap wins
      if (overlap > bestOverlapScore) {
        bestOverlapScore = overlap
        bestMatchIndex = i
        continue
      }
      // In case there's a tie, the one whose center is closest to the center of the dragged element
      if (overlap === bestOverlapScore) {
        let currentMatch = siblingRects[bestMatchIndex]
        if (calculateCenterDistance(rect, currentMatch) < calculateCenterDistance(currentRect, currentMatch)) {
          bestMatchIndex = i
        }
      }
    }
  }
  return bestMatchIndex
}

function calculateOverlap(rect: LocationInfo, draggedRect: LocationInfo): number {
  const xOverlap = Math.max(0, Math.min(rect.right, draggedRect.right) - Math.max(rect.left, draggedRect.left))
  const yOverlap = Math.max(0, Math.min(rect.bottom, draggedRect.bottom) - Math.max(rect.top, draggedRect.top))

  const overlapArea = xOverlap * yOverlap
  const rectArea = rect.width * rect.height
  const draggedRectArea = draggedRect.width * draggedRect.height

  const minArea = Math.min(rectArea, draggedRectArea)

  return (100 * overlapArea) / minArea
}

function calculateCenterDistance(rect1: LocationInfo, rect2: LocationInfo): number {
  return calculateDistance(calculateCenter(rect1), calculateCenter(rect2))
}

function calculateCenter(rect: LocationInfo): Coords {
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  }
}

function calculateDistance(point1: Coords, point2: Coords): number {
  return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2))
}

function offsetRect(rect: LocationInfo, mouseDiff: Coords): LocationInfo {
  const newRect = { ...rect }
  newRect.x += mouseDiff.x
  newRect.left += mouseDiff.x
  newRect.right += mouseDiff.x
  newRect.y += mouseDiff.y
  newRect.top += mouseDiff.y
  newRect.bottom += mouseDiff.y
  return newRect
}
