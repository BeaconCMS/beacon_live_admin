<script lang="ts">
  import { selectedDomElement } from "$lib/stores/page"

  let relativeWrapperRect; 
  let selectedElementFloatingMenu;

  $: {
    if ($selectedDomElement) {
      if (!relativeWrapperRect) {
        relativeWrapperRect = document.getElementById('ui-builder-app-container').closest('.relative').getBoundingClientRect();
      }
      let selectedElRect = $selectedDomElement.getBoundingClientRect();
      selectedElementFloatingMenu = {
        top: selectedElRect.y - relativeWrapperRect.y + selectedElRect.height + 5,
        left: selectedElRect.x - relativeWrapperRect.x + (selectedElRect.width / 2) - 12
      }
      console.log('selectedElementFloatingMenu', selectedElementFloatingMenu);
    }
  }

  function logToConsole(el: Element) {
    console.log('menu-element', el);
  } 
</script>

{#if selectedElementFloatingMenu}
  <button 
    use:logToConsole 
    class="rounded-full w-[24px] h-[24px] flex justify-center items-center absolute bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 active:bg-blue-800"
    style="top: {selectedElementFloatingMenu.top}px; left: {selectedElementFloatingMenu.left}px">
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" style="transform: rotate(180deg);"><path d="M 1 2.5 C 1 1.948 1.448 1.5 2 1.5 L 10 1.5 C 10.552 1.5 11 1.948 11 2.5 L 11 2.5 C 11 3.052 10.552 3.5 10 3.5 L 2 3.5 C 1.448 3.5 1 3.052 1 2.5 Z" fill="currentColor"></path><path d="M 1 6 C 1 5.448 1.448 5 2 5 L 10 5 C 10.552 5 11 5.448 11 6 L 11 6 C 11 6.552 10.552 7 10 7 L 2 7 C 1.448 7 1 6.552 1 6 Z" fill="currentColor"></path><path d="M 1 9.5 C 1 8.948 1.448 8.5 2 8.5 L 10 8.5 C 10.552 8.5 11 8.948 11 9.5 L 11 9.5 C 11 10.052 10.552 10.5 10 10.5 L 2 10.5 C 1.448 10.5 1 10.052 1 9.5 Z" fill="currentColor"></path></svg>        
  </button>
{/if}