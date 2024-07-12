<script lang="ts">
  import { selectedDomElement, selectedElementMenu } from "$lib/stores/page"
  import { updateSelectedElementMenu } from "$lib/utils/drag-helpers"
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

  function handleMousedown(e: MouseEvent) {
    document.addEventListener('mousemove', handleMousemove)
    document.addEventListener('mouseup', handleMouseup)
    siblings = Array.from($selectedDomElement.parentElement.children);
    siblingsRectangles = Array.from(siblings).map(el => el.getBoundingClientRect());
    updateSelectedElementMenu({ start: { x: e.clientX, y: e.clientY }, current: { x: e.clientX, y: e.clientY } });
    console.log('siblingsRectangles', siblings, siblingsRectangles);
    console.log('mousedown', e);
  }

  function handleMouseup(e: MouseEvent) {
    document.removeEventListener('mousemove', handleMousemove);
    $selectedElementMenu = null;
    tick().then(() => updateSelectedElementMenu());
    siblings = [];
    siblingsRectangles = [];
    console.log('mouseup. Should commit changes', e);
  }

  function handleMousemove(e: MouseEvent) {
    updateSelectedElementMenu({ ...$selectedElementMenu.mouseMovement, current: { x: e.clientX, y: e.clientY } });
  }
</script>

{#if $selectedElementMenu}
  {#if selectedDomElementRect && $selectedElementMenu.dragging}
    <div class="absolute" style="background-color:aqua; opacity: 0.5; top: {$selectedElementMenu.elementCoords.y}px; left: {$selectedElementMenu.elementCoords.x}px; height: {selectedDomElementRect.height}px; width: {selectedDomElementRect.width}px;"></div>
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