interface MouseCoords {
  x: number;
  y: number;
}

export interface MouseMovement {
  start: MouseCoords
  current: MouseCoords
}

export function elementCanBeDroppedInTarget(draggedObject) {
  // return draggedObject?.category === "basic";
  return true
}

export function mouseDiff(mouseMovement: MouseMovement): MouseCoords {
  return {
    x: mouseMovement.current.x - mouseMovement.start.x,
    y: mouseMovement.current.y - mouseMovement.start.y,
  }
}
