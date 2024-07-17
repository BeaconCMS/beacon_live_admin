<script lang="ts">
  import { selectedDomElement, selectedElementMenu } from "$lib/stores/page"
  import { dragElementInfo } from "$lib/stores/dragAndDrop";
  import { updateSelectedElementMenu, getElementCoords, getDragDirection, type Coords, CoordsDiff } from "$lib/utils/drag-helpers"
    import { tick } from "svelte"

  let siblings: Element[] = [];
  let siblingsRectangles: DOMRect[] = [];
  $: selectedDomElementRect = $selectedDomElement?.getBoundingClientRect();
  $: {
    if ($selectedElementMenu?.mouseMovement && siblings.length > 0) {
      if ($selectedElementMenu.dragDirection === 'vertical') {
        let firstElementBeforeCursorIndex = siblingsRectangles.findIndex(({top, height}) => {
          return (top + height / 2) >= $selectedElementMenu.mouseMovement.current.y;
        });
        let firstElementBeforeCursor = siblings[firstElementBeforeCursorIndex];
        if (firstElementBeforeCursor && firstElementBeforeCursor !== $selectedDomElement) {
          let newCoords = getElementCoords(firstElementBeforeCursor);
          $selectedElementMenu = { 
            ...$selectedElementMenu, 
            insertBefore: firstElementBeforeCursorIndex,
            elementCoords: { ...$selectedElementMenu.elementCoords, current: newCoords } 
          }
        } else {
          $selectedElementMenu = { 
            ...$selectedElementMenu, 
            insertBefore: null,
            elementCoords: { ...$selectedElementMenu.elementCoords, current: $selectedElementMenu.elementCoords.start } 
          }           
        }
      } else {
        debugger;
      }
    }
  }

  // let dragHandleStyle: string = '';
  // $: {
  //   let styles = [];
  //   if ($selectedElementMenu?.top) {
  //     styles.push(`top: ${$selectedElementMenu.top}px`);
  //   }
  //   if ($selectedElementMenu?.left) {
  //     styles.push(`left: ${$selectedElementMenu.left}px`);
  //   }
  //   dragHandleStyle = styles.join(';');
  // }

  let dragHandleStyle: string = '';
  let currentHandleCoords: Coords;
  $: {
    if ($selectedDomElement) {
      let selectedEl;
      if ($dragElementInfo) {
        selectedEl = $dragElementInfo.parentElementClone.children.item($dragElementInfo.selectedIndex);
      }
      updateHandleCoords(selectedEl || $selectedDomElement)
      let styles = [];
      if (currentHandleCoords?.y) {
        if (currentHandleCoords.y === 701) debugger;
        styles.push(`top: ${currentHandleCoords.y}px`);
      }
      if (currentHandleCoords?.x) {
        styles.push(`left: ${currentHandleCoords.x}px`);
      }
      dragHandleStyle = styles.join(';');
    }
  }

  function snapshotSelectedElementSiblings() {
    let siblings = Array.from($selectedDomElement.parentElement.children);
    let selectedIndex = siblings.indexOf($selectedDomElement);
    let el = $selectedDomElement.parentElement.cloneNode(true) as Element;
    el.style['background-color'] = 'red';
    $dragElementInfo = {
      parentElementClone: el,
      selectedIndex,
      siblingRects: siblings.map(el => el.getBoundingClientRect())
    }
    $selectedDomElement.parentElement.parentElement.insertBefore(el, $selectedDomElement.parentElement);
  }

  let relativeWrapperRect: DOMRect; 

  function updateHandleCoords(selectedEl: Element, movement: Coords = { x: 0, y: 0 }) {
    if (!relativeWrapperRect) {
      relativeWrapperRect = document.getElementById('ui-builder-app-container').closest('.relative').getBoundingClientRect();
    }      
    let currentRect = selectedEl.getBoundingClientRect();
    // let top = elementCoords.current.y + currentRect.height + 5;
    // let left = elementCoords.current.x + (currentRect.width / 2) - 12;
    currentHandleCoords = {
      x: currentRect.x - relativeWrapperRect.x + movement.x + (currentRect.width / 2) - 5,
      y: currentRect.y - relativeWrapperRect.y + movement.y + currentRect.height + 5,
    };
    console.log('currentHandleCoords ', currentHandleCoords);    
  }

  let mouseDownEvent: MouseEvent;
  async function handleMousedown(e: MouseEvent) {
    mouseDownEvent = e;
    document.addEventListener('mousemove', handleMousemove);
    document.addEventListener('mouseup', handleMouseup);
    snapshotSelectedElementSiblings();
    await tick();
    let selectedEl = $dragElementInfo.parentElementClone.children.item($dragElementInfo.selectedIndex);
    updateHandleCoords(selectedEl)
    // siblings = Array.from($selectedDomElement.parentElement.children);
    // siblingsRectangles = Array.from(siblings).map(el => el.getBoundingClientRect());
    // updateSelectedElementMenu({ start: { x: e.clientX, y: e.clientY }, current: { x: e.clientX, y: e.clientY } });
    // console.log('siblingsRectangles', siblings, siblingsRectangles);
    // console.log('mousedown', e);
  }

  async function handleMouseup(e: MouseEvent) {
    document.removeEventListener('mousemove', handleMousemove);
    if ($dragElementInfo) {
      $dragElementInfo.parentElementClone.remove();
      $dragElementInfo = null;
    }
    mouseDownEvent = null;
    await tick();
    updateHandleCoords($selectedDomElement);
    // $selectedElementMenu = null;
    // tick().then(() => updateSelectedElementMenu());
    // siblings = [];
    // siblingsRectangles = [];
    // console.log('mouseup. Should commit changes', e);
  }

  function handleMousemove(e: MouseEvent) {
    // updateSelectedElementMenu({ ...$selectedElementMenu.mouseMovement, current: { x: e.clientX, y: e.clientY } });

    if (!relativeWrapperRect) {
      relativeWrapperRect = document.getElementById('ui-builder-app-container').closest('.relative').getBoundingClientRect();
    }  
    let selectedEl = $dragElementInfo.parentElementClone.children.item($dragElementInfo.selectedIndex);
    let initialRect = $dragElementInfo.siblingRects[$dragElementInfo.selectedIndex];
    let currentRect = selectedEl.getBoundingClientRect();
    let dragDirection = getDragDirection(selectedEl);
    let mouseDiff: Coords = {
      x: e.x - mouseDownEvent.x,
      y: e.y - mouseDownEvent.y,
    }
    // console.log('Drag direction ', dragDirection);
    // console.log('initial rect ', initialRect);
    // console.log('current rect ', currentRect);
    // console.log('mouseDiff ', mouseDiff);
    updateHandleCoords(selectedEl, mouseDiff);
    // console.log('currentCoords ', currentHandleCoords);  
    // let currentCoords = getElementCoords(selectedEl);;
  }
</script>

{#if $selectedElementMenu}
  {#if selectedDomElementRect && $selectedElementMenu.dragging}
    <div class="absolute" style="background-color:aqua; opacity: 0.5; top: {$selectedElementMenu.elementCoords.current.y}px; left: {$selectedElementMenu.elementCoords.current.x}px; height: {selectedDomElementRect.height}px; width: {selectedDomElementRect.width}px;"></div>
  {/if}
  <button 
    on:mousedown={handleMousedown}
    class="rounded-full w-[24px] h-[24px] flex justify-center items-center absolute bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 active:bg-blue-800"
    class:pointer-events-none={$selectedElementMenu.dragging}
    class:rotate-90={$selectedElementMenu.dragDirection === 'horizontal'}
    style={dragHandleStyle}>
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" ><path d="M 1 2.5 C 1 1.948 1.448 1.5 2 1.5 L 10 1.5 C 10.552 1.5 11 1.948 11 2.5 L 11 2.5 C 11 3.052 10.552 3.5 10 3.5 L 2 3.5 C 1.448 3.5 1 3.052 1 2.5 Z" fill="currentColor"></path><path d="M 1 6 C 1 5.448 1.448 5 2 5 L 10 5 C 10.552 5 11 5.448 11 6 L 11 6 C 11 6.552 10.552 7 10 7 L 2 7 C 1.448 7 1 6.552 1 6 Z" fill="currentColor"></path><path d="M 1 9.5 C 1 8.948 1.448 8.5 2 8.5 L 10 8.5 C 10.552 8.5 11 8.948 11 9.5 L 11 9.5 C 11 10.052 10.552 10.5 10 10.5 L 2 10.5 C 1.448 10.5 1 10.052 1 9.5 Z" fill="currentColor"></path></svg>        
  </button>
{/if}