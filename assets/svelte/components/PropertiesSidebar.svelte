<script lang="ts">
	import Pill from '$lib/components/Pill.svelte';
	import SidebarSection from '$lib/components/SidebarSection.svelte';
  import { createEventDispatcher } from 'svelte';
	import { draggedObject } from '$lib/stores/dragAndDrop';
  import { page, selectedAstElement, selectedAstElementId, findAstElement, isAstElement } from '$lib/stores/page';
  import type { AstNode } from '$lib/types';
  export let live;

  const dispatch = createEventDispatcher();

  let classList: string[];
  $: {
    let classAttr = $selectedAstElement?.attrs?.class;
    classList = classAttr ? classAttr.split(" ").filter(e => e.trim().length > 0) : []
  }
  $: editableAttrs = Object.entries($selectedAstElement?.attrs || {})
                    .filter(([k, _]) => k !== 'class' && k !== 'selfClose' && !/data-/.test(k))
  $: sidebarTitle = $selectedAstElement?.tag;
  $: isRootNode = !!$selectedAstElementId && $selectedAstElementId === 'root';
  $: attributesEditable = $selectedAstElement?.tag !== 'eex';

  async function addClass({ detail: newClass }: CustomEvent<string>) {
    let node = $selectedAstElement;
    if (node) {
      node.attrs.class = node.attrs.class ? `${node.attrs.class} ${newClass}` : newClass;
      live.pushEvent("update_page_ast", { id: $page.id, ast: $page.ast });
    }
  }

  function parentNodeId() {
    if ($selectedAstElementId) {
      let parts = $selectedAstElementId.split(".");
      if (parts.length === 1) return 'root';
      return parts.slice(0, -1).join(".")
    }
  }
  function selectParentNode() {
    let parentId = parentNodeId();
    if (parentId) {
      $selectedAstElementId = parentId;
    }
  }

  async function deleteClass(className: string) {
    let node = $selectedAstElement;
    if (node) {
      let newClass = node.attrs.class.split(" ").filter(c => c !== className).join(" ");
      node.attrs.class = newClass;
      live.pushEvent("update_page_ast", { id: $page.id, ast: $page.ast });
    }
  }  

  async function updateText(e: CustomEvent<string>) {
    let node = $selectedAstElement;
    if (node && isAstElement(node)) {
      node.content = [e.detail]
      live.pushEvent("update_page_ast", { id: $page.id, ast: $page.ast });
    }
  }

  async function updateAttribute(attrName: string, e: CustomEvent<string>) {
    let node = $selectedAstElement;
    if (node && isAstElement(node)) {
      node.attrs[attrName] = e.detail;
      live.pushEvent("update_page_ast", { id: $page.id, ast: $page.ast });     
    }    
  }

  async function deleteComponent() {
    let node = $selectedAstElement;
    if (!node) return;
    if (confirm('Are you sure you want to delete this component?')) {
      let parentId = parentNodeId();
      let content = (parentId && parentId !== 'root') ? findAstElement($page.ast, parentId)?.content : $page.ast;
      if (content) {
        let targetIndex = (content as unknown[]).indexOf(node);
        content.splice(targetIndex, 1);
        $selectedAstElementId = undefined;
        live.pushEvent("update_page_ast", { id: $page.id, ast: $page.ast });
      } 
    }
  }

  function dropInside() {
    dispatch('droppedIntoTarget', $selectedAstElement);
  }

  let isDraggingOver = false;
  function dragOver(e: DragEvent){
    e.preventDefault();
    isDraggingOver = true;
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "move";
    }
  }

  async function changeNodes({ detail: nodes }: CustomEvent<AstNode[]>) {
    if ($selectedAstElementId === 'root') {
      let selectedElement = $page;
      selectedElement.ast = nodes;
    } else {
      let selectedElement = $selectedAstElement;
      if (!selectedElement) return;
      selectedElement.content = nodes;
    }
    live.pushEvent("update_page_ast", { id: $page.id, ast: $page.ast });
  }  
</script>

<div class="w-64 bg-white" data-test-id="right-sidebar">
  <div class="sticky top-0">
    {#if $selectedAstElement}
      <div class="border-b text-lg font-medium leading-5 p-4 relative">
        {sidebarTitle}
        {#if !isRootNode}
          <button
          type="button" 
          class="absolute p-2 top-2 right-9 group" 
          on:click={selectParentNode}>
            <span class="sr-only">Up one level</span>
            <span class="absolute opacity-0 invisible right-9 min-w-[100px] bg-amber-100 py-1 px-1.5 rounded text-xs text-medium transition group-hover:opacity-100 group-hover:visible">Up one level</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 hover:text-blue-700 active:text-blue-900">
              <path fill-rule="evenodd" d="M9.53 2.47a.75.75 0 0 1 0 1.06L4.81 8.25H15a6.75 6.75 0 0 1 0 13.5h-3a.75.75 0 0 1 0-1.5h3a5.25 5.25 0 1 0 0-10.5H4.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
            </svg>
          </button>      
        {/if}
        <button
          type="button" 
          class="absolute p-2 top-2 right-1" 
          on:click={() => $selectedAstElementId = undefined}>
            <span class="sr-only">Close</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 hover:text-blue-700 active:text-blue-900">
              <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clip-rule="evenodd" />
            </svg>
          </button>
      </div>
      {#if attributesEditable}
        <SidebarSection clearOnUpdate={true} on:update={addClass} placeholder="Add new class" >
          <svelte:fragment slot="heading">Classes</svelte:fragment>
          <svelte:fragment slot="value">
            {#each classList as className}
              <Pill on:delete={() => deleteClass(className)}>{className}</Pill>
            {/each}
          </svelte:fragment>
        </SidebarSection>
        {#each editableAttrs as entry (entry)}
          {@const [name, value] = entry}
          <SidebarSection clearOnUpdate={true} value={value} on:textChange={(e) => updateAttribute(name, e)} placeholder="Set {name}">
            <svelte:fragment slot="heading">{name}</svelte:fragment>
          </SidebarSection>
        {/each}
      {/if}

      <div class="relative">
        {#if $draggedObject && $draggedObject.category === "basic"}
          <div 
            class="absolute bg-white opacity-70 w-full h-full p-4" 
            class:opacity-90={isDraggingOver}
            role="list"
            on:drop|preventDefault={dropInside} 
            on:dragover={dragOver}
            on:dragleave={() => isDraggingOver = false}
            >
            <div class="flex rounded-lg outline-dashed outline-2 h-full text-center justify-center items-center">
              Drop components here
            </div>
          </div>
        {/if}
        {#if $selectedAstElement.content.length > 0}
          <SidebarSection 
            astNodes={$selectedAstElement.content}
            large={$selectedAstElement.tag === 'eex'}
            on:textChange={(e) => updateText(e)} 
            on:nodesChange={changeNodes}>
            <svelte:fragment slot="heading">Content</svelte:fragment>
          </SidebarSection>
        {/if}
      </div>
      
      <SidebarSection expanded={false}>
        <svelte:fragment slot="heading">Delete</svelte:fragment>
        <svelte:fragment slot="input">
          <button 
            on:click={deleteComponent}
            type="button" 
            class="bg-red-500 hover:bg-red-700 active:bg-red-800 text-white font-bold py-2 px-4 rounded outline-2 w-full">
            Delete <span class="sr-only">current {sidebarTitle} element</span>
          </button>
        </svelte:fragment>
      </SidebarSection>
    {:else}
      <div class="p-4 pt-8 font-medium text-lg text-center">
        Select a component to edit its properties
      </div>
    {/if}
  </div>
</div>    