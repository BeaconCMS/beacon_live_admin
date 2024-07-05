<script lang="ts">
  import { selectedDomElement, selectedElementMenu } from "$lib/stores/page"
  import type { MouseMovement } from "$lib/utils/drag-helpers"

  let mouseMovement: MouseMovement = null;
  let relativeWrapperRect: DOMRect; 
  let siblings: Element[] = [];
  let siblingsRectangles: DOMRect[] = [];
  $: {
    if ($selectedDomElement) {
      if (!relativeWrapperRect) {
        relativeWrapperRect = document.getElementById('ui-builder-app-container').closest('.relative').getBoundingClientRect();
      }
      let dragDirection = getDragDirection($selectedDomElement);
      let selectedElRect = $selectedDomElement.getBoundingClientRect();
      let top = selectedElRect.y - relativeWrapperRect.y + selectedElRect.height + 5;
      let left = selectedElRect.x - relativeWrapperRect.x + (selectedElRect.width / 2) - 12;
      if (mouseMovement) {   
        top = dragDirection === 'horizontal' ? top : mouseMovement.current.y - relativeWrapperRect.y - 12; 
        left = dragDirection === 'vertical' ?  left :  mouseMovement.current.x - relativeWrapperRect.x - 12;
      }
      $selectedElementMenu = { top, left, dragDirection, dragging: !!mouseMovement, mouseMovement }
    }
  }

  $: {
    if ($selectedElementMenu && mouseMovement && siblings.length > 0) {
      if ($selectedElementMenu.dragDirection === 'vertical') {
        let firstElementBeforeCursorIndex = siblingsRectangles.findIndex(({top, height}) => (top + height / 2) >= $selectedElementMenu.mouseMovement.y);
        let firstElementBeforeCursor = siblings[firstElementBeforeCursorIndex];
        if (firstElementBeforeCursor && firstElementBeforeCursor !== $selectedDomElement) {
          debugger;
        }
      } else {
        debugger;
      }
    }
  }

  let dragHandleStyle: string = '';
  $: {
    let styles = [];
    if ($selectedElementMenu?.top) {
      styles.push(`top: ${$selectedElementMenu.top}px`);
    }
    if ($selectedElementMenu?.left) {
      styles.push(`left: ${$selectedElementMenu.left}px`);
    }
    dragHandleStyle = styles.join(';');
  }

  function getDragDirection(element: Element): 'horizontal' | 'vertical' {
    let parentEl = element.parentElement;
    let flexDirection = window.getComputedStyle(parentEl).flexDirection;
    return ['row', 'row-reverse'].includes(flexDirection) ? 'horizontal' : 'vertical';
  }

  function handleMousedown(e: MouseEvent) {
    document.addEventListener('mousemove', handleMousemove)
    document.addEventListener('mouseup', handleMouseup)
    siblings = Array.from($selectedDomElement.parentElement.children);
    siblingsRectangles = Array.from(siblings).map(el => el.getBoundingClientRect());
    mouseMovement = { start: { x: e.clientX, y: e.clientY }, current: { x: e.clientX, y: e.clientY } };
    console.log('siblingsRectangles', siblings, siblingsRectangles);
    console.log('mousedown', e);
  }

  function handleMouseup(e: MouseEvent) {
    document.removeEventListener('mousemove', handleMousemove);
    mouseMovement = null;
    siblings = [];
    siblingsRectangles = [];
    mouseMovement = null;
    console.log('mouseup', e);
  }

  function handleMousemove(e: MouseEvent) {
    mouseMovement = { start: mouseMovement.start, current: { x: e.clientX, y: e.clientY } };
  }
</script>

{#if $selectedElementMenu}
  <button 
    on:mousedown={handleMousedown}
    class="rounded-full w-[24px] h-[24px] flex justify-center items-center absolute bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 active:bg-blue-800"
    class:pointer-events-none={$selectedElementMenu.dragging}
    class:rotate-90={$selectedElementMenu.dragDirection === 'horizontal'}
    style={dragHandleStyle}>
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" ><path d="M 1 2.5 C 1 1.948 1.448 1.5 2 1.5 L 10 1.5 C 10.552 1.5 11 1.948 11 2.5 L 11 2.5 C 11 3.052 10.552 3.5 10 3.5 L 2 3.5 C 1.448 3.5 1 3.052 1 2.5 Z" fill="currentColor"></path><path d="M 1 6 C 1 5.448 1.448 5 2 5 L 10 5 C 10.552 5 11 5.448 11 6 L 11 6 C 11 6.552 10.552 7 10 7 L 2 7 C 1.448 7 1 6.552 1 6 Z" fill="currentColor"></path><path d="M 1 9.5 C 1 8.948 1.448 8.5 2 8.5 L 10 8.5 C 10.552 8.5 11 8.948 11 9.5 L 11 9.5 C 11 10.052 10.552 10.5 10 10.5 L 2 10.5 C 1.448 10.5 1 10.052 1 9.5 Z" fill="currentColor"></path></svg>        
  </button>
{/if}