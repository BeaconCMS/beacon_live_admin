<script lang="ts" context="module">
  import { get, writable, type Writable } from "svelte/store";
  import { page, selectedDomElement, selectedElementMenu, parentOfSelectedAstElement } from "$lib/stores/page"
  import { dragElementInfo } from "$lib/stores/dragAndDrop";
  import { getDragDirection, type Coords } from "$lib/utils/drag-helpers"
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
    // let top = elementCoords.current.y + currentRect.height + 5;
    // let left = elementCoords.current.x + (currentRect.width / 2) - 12;]
    let menu = get(selectedElementMenu);
    // console.log('currentRect.y', currentRect.y);
    // console.log('relativeWrapperRect.y', relativeWrapperRect.y);
    // console.log('movement.y', movement.y);
    // console.log('$selectedElementMenu', get(selectedElementMenu));
    // console.log('currentRect.height', currentRect.height);
    let movX = menu?.dragDirection === 'vertical' ? 0 : movement.x;
    let movY = menu?.dragDirection === 'vertical' ? movement.y : 0;
    currentHandleCoords = {
      x: currentRect.x - relativeWrapperRect.x + movX + (currentRect.width / 2) - 5,
      y: currentRect.y - relativeWrapperRect.y + movY + currentRect.height + 5,
    };
    // console.log('currentHandleCoords ', currentHandleCoords);  
    // console.log('---------------------------------------------------');  
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
      siblingRects: siblings.map(el => el.getBoundingClientRect())
    }
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

  let placeholderStyle: string = null;
  let newIndex: number = null;
  function updatePlaceholder(dragDirection, mouseDiff, e) {
    if (!relativeWrapperRect) {
      relativeWrapperRect = document.getElementById('ui-builder-app-container').closest('.relative').getBoundingClientRect();
    }     
    let initialRect = $dragElementInfo.siblingRects[$dragElementInfo.selectedIndex];
    if (dragDirection === 'vertical') {
      if (mouseDiff.y !== 0) {
        let index = $dragElementInfo.siblingRects.findIndex(rect => {
          return rect.bottom > e.y;
        });
        if (index > -1 && index !== $dragElementInfo.selectedIndex) {
          newIndex = index;
          let subsequentSiblings = Array.from($dragElementInfo.parentElementClone.children).filter((_, i) => i >= index && i < $dragElementInfo.selectedIndex);
          let newRect = $dragElementInfo.siblingRects[index];
          subsequentSiblings.forEach(el => el.style.transform = `translateY(${initialRect.height}px)`);
          placeholderStyle = `top: ${newRect.top - relativeWrapperRect.top}px; left: ${newRect.left - relativeWrapperRect.left}px; height: ${initialRect.height}px; width: ${initialRect.width}px;`;
        } else {
          newIndex = null;
          placeholderStyle = `top: ${initialRect.top - relativeWrapperRect.top}px; left: ${initialRect.left - relativeWrapperRect.left}px; height: ${initialRect.height}px; width: ${initialRect.width}px;`;
        }
      }      
    } else {
      alert('not implemented');
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
    updatePlaceholder(dragDirection, mouseDiff, e);
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