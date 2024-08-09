<script lang="ts" context="module">
  import { get, writable, type Writable } from "svelte/store";
  import { page, selectedDomElement, selectedElementMenu, parentOfSelectedAstElement } from "$lib/stores/page"
  import { dragElementInfo, type LocationInfo } from "$lib/stores/dragAndDrop";
  import { getDragDirection, type Coords, type DragDirection } from "$lib/utils/drag-helpers"
  import { live } from "$lib/stores/live"

  let currentHandleCoords: Coords;
  let relativeWrapperRect: DOMRect; 
  let dragHandleStyle: Writable<string> = writable('');

  export function initSelectedElementMenuPosition(selectedDomEl, mouseDiff?: Coords) {
    let selectedEl;
    let dragInfo = get(dragElementInfo);
    if (dragInfo) {
      selectedEl = dragInfo.parentElementClone.children.item(dragInfo.selectedIndex);
    }
    updateHandleCoords(selectedEl || selectedDomEl, mouseDiff)
    let styles = [];
    if (currentHandleCoords?.y) {
      styles.push(`top: ${currentHandleCoords.y}px`);
    }
    if (currentHandleCoords?.x) {
      styles.push(`left: ${currentHandleCoords.x}px`);
    }
    dragHandleStyle.set(styles.join(';'));
  }

  function updateHandleCoords(selectedEl: Element, movement: Coords = { x: 0, y: 0 }) {
    if (!relativeWrapperRect) {
      relativeWrapperRect = document.getElementById('ui-builder-app-container').closest('.relative').getBoundingClientRect();
    }      
    let currentRect = selectedEl.getBoundingClientRect();
    let menu = get(selectedElementMenu);
    let movX = menu?.dragDirection === 'vertical' ? 0 : movement.x;
    let movY = menu?.dragDirection === 'vertical' ? movement.y : 0;
    currentHandleCoords = {
      x: currentRect.x - relativeWrapperRect.x + movX + (currentRect.width / 2) - 5,
      y: currentRect.y - relativeWrapperRect.y + movY + currentRect.height + 5,
    };
  }  
</script>
<script lang="ts">
  import { tick } from "svelte"
  let dragHandleElement: HTMLButtonElement;

  function snapshotSelectedElementSiblings() {
    let siblings = Array.from($selectedDomElement.parentElement.children);
    let selectedIndex = siblings.indexOf($selectedDomElement);
    let el = $selectedDomElement.parentElement.cloneNode(true) as Element;
    $dragElementInfo = {
      parentElementClone: el,
      selectedIndex,
      siblingLocationInfos: siblings.map(el => {
        let { x, y, width, height, top, right, bottom, left } = el.getBoundingClientRect();
        let computedStyles = window.getComputedStyle(el);
        return {
          x, y, width, height, top, right, bottom, left,
          marginTop: parseFloat(computedStyles.marginTop),
          marginBottom: parseFloat(computedStyles.marginBottom),
        };        
      })
    }
    $selectedDomElement.parentElement.style.display = 'none';
    $selectedDomElement.parentElement.parentElement.insertBefore(el, $selectedDomElement.parentElement);
  }

  let mouseDownEvent: MouseEvent;
  async function handleMousedown(e: MouseEvent) {
    mouseDownEvent = e;
    document.addEventListener('mousemove', handleMousemove);
    document.addEventListener('mouseup', handleMouseup);
    snapshotSelectedElementSiblings();
  }

  function applyNewOrder() {
    if (newIndex !== null) {
      // Reordering happened, apply new order
      let parent = $parentOfSelectedAstElement;
      const selectedAstElement = parent.content.splice($dragElementInfo.selectedIndex, 1)[0];
      parent.content.splice(newIndex, 0, selectedAstElement);
      $page.ast = [...$page.ast];
      $live.pushEvent("update_page_ast", { id: $page.id, ast: $page.ast });
    }   
  }
  async function handleMouseup(e: MouseEvent) {
    document.removeEventListener('mousemove', handleMousemove); 
    applyNewOrder();
    if ($dragElementInfo) {
      $selectedDomElement.parentElement.style.display = null;
      $dragElementInfo.parentElementClone.remove();
      $dragElementInfo = null;
    }
    mouseDownEvent = null;
    await tick();
    dragHandleElement.style.transform = null;
    placeholderStyle = null;
  }

  function getGhostElement() {
    return $dragElementInfo.parentElementClone.children.item($dragElementInfo.selectedIndex);
  }

  function findHoveredSiblingIndex(dragDirection: DragDirection, e: MouseEvent) {
    // TODO: This detection is not very intuitive. We should detect some % of element overlap (30% maybe) instead.
    if (dragDirection === 'vertical') {
      return $dragElementInfo.siblingLocationInfos.findIndex(rect => rect.top < e.y && rect.bottom > e.y);
    } else {
      return $dragElementInfo.siblingLocationInfos.findIndex(rect => {
        return rect.left < e.x && rect.right > e.x
      });
    }
  }

  function findSwappedIndexes(dragDirection: DragDirection, e: MouseEvent): { currentIndex: number, destinationIndex: number } {
    let hoveredElementIndex = findHoveredSiblingIndex(dragDirection, e);
    if (hoveredElementIndex === -1) {
      return {
        currentIndex: $dragElementInfo.selectedIndex,
        destinationIndex: $dragElementInfo.selectedIndex,
      };
    }
    return {
      currentIndex: $dragElementInfo.selectedIndex,
      destinationIndex: hoveredElementIndex,      
    }
  }

  function sortedLocationInfos(infos: LocationInfo[], draggedElementIndex: number, destinationIndex: number): LocationInfo[] {
    let newInfos = [...$dragElementInfo.siblingLocationInfos];
    let info = newInfos.splice(draggedElementIndex, 1)[0];
    newInfos.splice(destinationIndex, 0, info);
    return newInfos;
  }
  
  function calculateNewTop(index: number, draggedElementIndex: number, destinationIndex: number, newInfos: LocationInfo[]): number | undefined {
    if (index < destinationIndex && index < draggedElementIndex || index > destinationIndex && index > draggedElementIndex) return;
    let displacement = destinationIndex < draggedElementIndex ? 1 : -1;
    let newIndex = index === draggedElementIndex ? destinationIndex : (index >= destinationIndex ? index + displacement : index);
    let top = 0;
    let i = 0;
    while (i < newInfos.length && i < newIndex) {
      top += newInfos[i].height + newInfos[i].marginTop + newInfos[i].marginBottom;
      i++;
    }
    console.log('-------------------------------------------------');
    console.log('originalInfos', $dragElementInfo.siblingLocationInfos);
    console.log('newInfos', newInfos);
    console.log(`top for element that was in index ${index} (now in index ${newIndex})`, top);
    top = top + newInfos[newIndex].marginTop + $dragElementInfo.siblingLocationInfos[0].top;
    console.log(`top for element that was in index ${index} (now in index ${newIndex}) (including margin)`, top);
    return top;
  }

  function repositionGhosts(currentIndex: number, destinationIndex: number, locationInfos: LocationInfo[]) {
    Array.from($dragElementInfo.parentElementClone.children).forEach((el, i) => {
      if (i !== $dragElementInfo.selectedIndex) {
        const top = calculateNewTop(i, currentIndex, destinationIndex, locationInfos);
        if (top) {
          el.style.transform = `translateY(${top - $dragElementInfo.siblingLocationInfos[i].top}px)`;
        }
      }
    });
  }

  function calculatePlaceholderPosition(currentIndex: number, destinationIndex: number, locationInfos: LocationInfo[]) {
    let top = calculateNewTop(currentIndex, currentIndex, destinationIndex, locationInfos);
    let draggedElementInfo = $dragElementInfo.siblingLocationInfos[$dragElementInfo.selectedIndex];
    placeholderStyle = `top: ${top - relativeWrapperRect.top + draggedElementInfo.marginTop}px; left: ${draggedElementInfo.left - relativeWrapperRect.left}px; height: ${draggedElementInfo.height}px; width: ${draggedElementInfo.width}px;`;
  }

  let placeholderStyle: string = null;
  let newIndex: number = null;
  
  function updateSiblingsPositioning(dragDirection: DragDirection, mouseDiff, e) {
    if (!relativeWrapperRect) {
      relativeWrapperRect = document.getElementById('ui-builder-app-container').closest('.relative').getBoundingClientRect();
    }     
    let selectedElementRect = $dragElementInfo.siblingLocationInfos[$dragElementInfo.selectedIndex];
    if (dragDirection === 'vertical') {
      if (mouseDiff.y !== 0) {
        let {currentIndex, destinationIndex} = findSwappedIndexes(dragDirection, e);
        if (currentIndex === destinationIndex) {
          // No drag, reset effect.
          if (newIndex !== null) {
            // Reset the transforms on all elements but the one being dragged, which must keep following the cursor.
            Array.from($dragElementInfo.parentElementClone.children).forEach((el, i) => i !== destinationIndex && (el.style.transform = null));    
          }
          newIndex = null;
          placeholderStyle = `top: ${selectedElementRect.top - relativeWrapperRect.top}px; left: ${selectedElementRect.left - relativeWrapperRect.left}px; height: ${selectedElementRect.height}px; width: ${selectedElementRect.width}px;`;
        } else {
          let rearrangedInfos = sortedLocationInfos($dragElementInfo.siblingLocationInfos, currentIndex, destinationIndex);
          newIndex = destinationIndex;
          repositionGhosts(currentIndex, destinationIndex, rearrangedInfos);
          calculatePlaceholderPosition(currentIndex, destinationIndex, rearrangedInfos);
        }
      }      
    } else {
      alert('Not implemented!!'); 
    }
  }

  function handleMousemove(e: MouseEvent) {
    let ghostElement = getGhostElement();
    let dragDirection = getDragDirection(ghostElement);
    let mouseDiff: Coords = {
      x: e.x - mouseDownEvent.x,
      y: e.y - mouseDownEvent.y,
    }
    if (dragDirection === 'vertical') {
      dragHandleElement.style.transform = `translateY(${mouseDiff.y}px)`;

      ghostElement.style.transform = `translateY(${mouseDiff.y}px)`;
    } else {
      dragHandleElement.style.transform = `translateX(${mouseDiff.x}px)`;
      ghostElement.style.transform = `translateX(${mouseDiff.x}px)`;      
    }

    updateSiblingsPositioning(dragDirection, mouseDiff, e);
  }
</script>

{#if $selectedElementMenu}
  {#if placeholderStyle}
    <div 
      class="absolute" 
      style="background-color:aqua; opacity: 0.5; {placeholderStyle}"></div>
  {/if}
  <button 
    bind:this={dragHandleElement}
    on:mousedown={handleMousedown}
    class="rounded-full w-6 h-6 flex justify-center items-center absolute bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 active:bg-blue-800"
    class:pointer-events-none={$selectedElementMenu.dragging}
    class:rotate-90={$selectedElementMenu.dragDirection === 'horizontal'}
    style={$dragHandleStyle}>
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" ><path d="M 1 2.5 C 1 1.948 1.448 1.5 2 1.5 L 10 1.5 C 10.552 1.5 11 1.948 11 2.5 L 11 2.5 C 11 3.052 10.552 3.5 10 3.5 L 2 3.5 C 1.448 3.5 1 3.052 1 2.5 Z" fill="currentColor"></path><path d="M 1 6 C 1 5.448 1.448 5 2 5 L 10 5 C 10.552 5 11 5.448 11 6 L 11 6 C 11 6.552 10.552 7 10 7 L 2 7 C 1.448 7 1 6.552 1 6 Z" fill="currentColor"></path><path d="M 1 9.5 C 1 8.948 1.448 8.5 2 8.5 L 10 8.5 C 10.552 8.5 11 8.948 11 9.5 L 11 9.5 C 11 10.052 10.552 10.5 10 10.5 L 2 10.5 C 1.448 10.5 1 10.052 1 9.5 Z" fill="currentColor"></path></svg>        
  </button>
{/if}