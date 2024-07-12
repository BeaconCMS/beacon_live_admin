import { get } from "svelte/store";
import { selectedDomElement, selectedElementMenu } from "$lib/stores/page"

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

function getDragDirection(element: Element): 'horizontal' | 'vertical' {
  let parentEl = element.parentElement;
  let flexDirection = window.getComputedStyle(parentEl).flexDirection;
  return ['row', 'row-reverse'].includes(flexDirection) ? 'horizontal' : 'vertical';
}


let relativeWrapperRect: DOMRect; 

export function updateSelectedElementMenu(mouseMovement = null) {
  if (!relativeWrapperRect) {
    relativeWrapperRect = document.getElementById('ui-builder-app-container').closest('.relative').getBoundingClientRect();
  }
  let selectedEl = get(selectedDomElement);
  let dragDirection = getDragDirection(selectedEl);
  let selectedElRect = selectedEl.getBoundingClientRect();
  let currentElementCoords = {
    x: selectedElRect.x - relativeWrapperRect.x,
    y: selectedElRect.y - relativeWrapperRect.y
  }
  let elementCoords = mouseMovement ? get(selectedElementMenu)?.elementCoords : currentElementCoords;
  let top = currentElementCoords.y + selectedElRect.height + 5;
  let left = currentElementCoords.x + (selectedElRect.width / 2) - 12;
  if (mouseMovement) {   
    top = dragDirection === 'horizontal' ? top : mouseMovement.current.y - relativeWrapperRect.y - 12; 
    left = dragDirection === 'vertical' ?  left :  mouseMovement.current.x - relativeWrapperRect.x - 12;
  }
  if (!mouseMovement) {
    console.log('setting selectedElementMenu to ', { top, left, elementCoords, dragDirection, dragging: !!mouseMovement, mouseMovement });
  }
  selectedElementMenu.set({ top, left, elementCoords, dragDirection, dragging: !!mouseMovement, mouseMovement });
}
