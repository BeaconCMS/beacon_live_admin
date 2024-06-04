<script lang="ts">
  import { AstElement, AstNode } from "$lib/types"
  import BrowserFrame from "./BrowserFrame.svelte"
  import { selectedAstElementId } from "$lib/stores/page"
  import { currentComponentCategory } from "$lib/stores/currentComponentCategory"
  import { page, slotTargetElement } from "$lib/stores/page"
  import { draggedObject } from "$lib/stores/dragAndDrop"
  import { live } from "$lib/stores/live"

  let isDraggingOver = false

  async function handleDragDrop(e: DragEvent) {
    let { target } = e
    $currentComponentCategory = null
    if (!$draggedObject) return;
    let draggedObj = $draggedObject;
    $draggedObject = null;
    if (draggedObj.category === "basic") {
      if (!(target instanceof HTMLElement)) return
      if (target.id === "fake-browser-content") return
      if (!$slotTargetElement) return
      if ($slotTargetElement.attrs.selfClose) return
      addBasicComponentToTarget($slotTargetElement)
    } else {
      $live.pushEvent(
        "render_component_in_page",
        { component_id: draggedObj.id, page_id: $page.id },
        ({ ast }: { ast: AstNode[] }) => {
          // This appends at the end. We might want at the beginning, or in a specific position
          $live.pushEvent("update_page_ast", { id: $page.id, ast: [...$page.ast, ...ast] })
        },
      )
    }
    isDraggingOver = false
  }

  async function addBasicComponentToTarget(astElement: AstElement) {
    if (!$draggedObject) return
    let componentDefinition = $draggedObject
    $draggedObject = null
    let targetNode = astElement
    $live.pushEvent(
      "render_component_in_page",
      { component_id: componentDefinition.id, page_id: $page.id },
      ({ ast }: { ast: AstNode[] }) => {
        targetNode?.content.push(...ast)
        $slotTargetElement = undefined
        $live.pushEvent("update_page_ast", { id: $page.id, ast: $page.ast })
      },
    )
  }

  function dragOver() {
    isDraggingOver = true
  }
</script>

<div class="flex-1 px-8 pb-4 flex max-h-full" data-test-id="main">
  {#if $page}
    <BrowserFrame page={$page}>
      <div
        on:drop|preventDefault={handleDragDrop}
        on:dragover|preventDefault={dragOver}
        role="document"
        style="--outlined-id: title-1"
        id="fake-browser-content"
        class="bg-white rounded-b-xl relative overflow-hidden flex-1 {isDraggingOver &&
          'border-dashed border-blue-500 border-2'}"
        data-test-id="browser-content"
      >
        <div id="page-wrapper" class="p-1 m-1" data-selected={$selectedAstElementId === "root"}>
          <page-wrapper></page-wrapper>
        </div>
      </div>
    </BrowserFrame>
  {/if}
</div>

<style>
  /* :global([data-selected="true"], [data-highlighted="true"]) {
    outline-color: #06b6d4; 
    outline-width: 2px;
    outline-style: dashed;    
  } */
  :global(.contents[data-nochildren="true"], .contents[data-nochildren="true"]) {
    /* In the specific case of an element containing only an EEX expression that generates no children (only a text node),
    there is no child node to which apply the styles, so we have to apply them to the wrapper, so we have to overwrite the
    display: contents for the styles to apply */
    display: inline;
  }
  :global([data-slot-target="true"]) {
    outline-color: red;
    outline-width: 2px;
    outline-style: dashed;
  }
</style>
