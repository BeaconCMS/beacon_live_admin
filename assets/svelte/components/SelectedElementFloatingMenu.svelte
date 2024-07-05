<script lang="ts">
  import { selectedDomElement, selectedElementMenu } from "$lib/stores/page"

  let relativeWrapperRect; 
  $: {
    if ($selectedDomElement) {
      if (!relativeWrapperRect) {
        relativeWrapperRect = document.getElementById('ui-builder-app-container').closest('.relative').getBoundingClientRect();
      }
      let dragDirection = getDragDirection($selectedDomElement);
      let selectedElRect = $selectedDomElement.getBoundingClientRect();
      let defaultTop = selectedElRect.y - relativeWrapperRect.y + selectedElRect.height + 5;
      let defaultLeft = selectedElRect.x - relativeWrapperRect.x + (selectedElRect.width / 2) - 12;
      if (mousePosition) {    
        let top = mousePosition.clientY - relativeWrapperRect.y - 12;
        let left = mousePosition.clientX - relativeWrapperRect.x - 12;
        $selectedElementMenu = {
          top: dragDirection === 'horizontal' ? defaultTop : top,
          left: dragDirection === 'vertical' ?  defaultLeft : left,
          dragDirection,
          dragging: true
        }
      } else {
        let selectedElRect = $selectedDomElement.getBoundingClientRect();
        $selectedElementMenu = {
          top: defaultTop,
          left: defaultLeft,
          dragDirection,
          dragging: false
        }
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

  // let ghostImage;
  // function startDraggingElementHandle(e: DragEvent) {
  //   let draggedEl = e.target as HTMLElement;
  //   ghostImage = draggedEl.cloneNode(true) as HTMLElement;
  //   ghostImage.style.opacity = '0';
  //   ghostImage.style.position = 'absolute';
  //   ghostImage.style.top = '-9999px';
  //   document.body.appendChild(ghostImage);    
  //   e.dataTransfer.effectAllowed = 'move';
  //   e.dataTransfer.setDragImage(ghostImage, draggedEl.offsetHeight, draggedEl.offsetWidth);
  // }
  // function finishDraggingElementHandle(e: DragEvent) {
  //   ghostImage.remove();
  //   currentDragCoordinates = null
  // }

  function handleMousedown(e: MouseEvent) {
    document.addEventListener('mousemove', handleMousemove)
    document.addEventListener('mouseup', handleMouseup)
    console.log('mousedown', e);
  }
  let mousePosition: { clientX: number, clientY: number } = null;
  function handleMouseup(e: MouseEvent) {
    document.removeEventListener('mousemove', handleMousemove);
    mousePosition = null;
    console.log('mouseup', e);
  }
  function handleMousemove(e: MouseEvent) {
    mousePosition = { clientX: e.clientX, clientY: e.clientY };
    // console.log('mousemove', e);
  }
</script>

{#if $selectedElementMenu}
<!-- on:dragstart={startDraggingElementHandle}
on:dragend={finishDraggingElementHandle}
on:drag={(e) => currentDragCoordinates = { x: e.clientX, y: e.clientY }} -->
<!-- draggable="true" -->
  <button 
    on:mousedown={handleMousedown}
    class="rounded-full w-[24px] h-[24px] flex justify-center items-center absolute bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 active:bg-blue-800"
    class:pointer-events-none={$selectedElementMenu.dragging}
    class:rotate-90={$selectedElementMenu.dragDirection === 'horizontal'}
    style={dragHandleStyle}>
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" ><path d="M 1 2.5 C 1 1.948 1.448 1.5 2 1.5 L 10 1.5 C 10.552 1.5 11 1.948 11 2.5 L 11 2.5 C 11 3.052 10.552 3.5 10 3.5 L 2 3.5 C 1.448 3.5 1 3.052 1 2.5 Z" fill="currentColor"></path><path d="M 1 6 C 1 5.448 1.448 5 2 5 L 10 5 C 10.552 5 11 5.448 11 6 L 11 6 C 11 6.552 10.552 7 10 7 L 2 7 C 1.448 7 1 6.552 1 6 Z" fill="currentColor"></path><path d="M 1 9.5 C 1 8.948 1.448 8.5 2 8.5 L 10 8.5 C 10.552 8.5 11 8.948 11 9.5 L 11 9.5 C 11 10.052 10.552 10.5 10 10.5 L 2 10.5 C 1.448 10.5 1 10.052 1 9.5 Z" fill="currentColor"></path></svg>        
  </button>
{/if}