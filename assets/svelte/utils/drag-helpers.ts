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
function detectFlow(rects) {
  let horizontal = false;
  let vertical = false;

  const threshold = 5;
  for (let i = 1; i < rects.length; i++) {
      let prevRect = rects[i - 1];
      let currentRect = rects[i];

      let xChange = Math.abs(currentRect.x - prevRect.x);
      let yChange = Math.abs(currentRect.y - prevRect.y);

      // Check for horizontal flow: significant x change with minimal y change
      if (xChange > threshold && yChange < threshold) {
          horizontal = true;
      }
      if (yChange > threshold) {
          vertical = true;
      }
  }

  if (horizontal && vertical) {
    return 'both'
  } else if (horizontal) {
    return 'horizontal'
  } else {
    return 'vertical';
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

  if (parentEl === null) {
    return "vertical"
  }

  let rects = Array.from(parentEl.children).map((child) => child.getBoundingClientRect())
  return detectFlow(rects);
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
