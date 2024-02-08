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
      <div class="border-b text-lg font-medium leading-5 pt-7 pr-7 pb-5 pl-4 relative">
        {sidebarTitle}
        {#if !isRootNode}
          <button
          type="button" 
          class="absolute py-3 top-3 right-5" 
          on:click={selectParentNode}>↰</button>      
        {/if}
        <button
          type="button" 
          class="absolute py-3 top-3 right-1" 
          on:click={() => $selectedAstElementId = undefined}>×</button>
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
            class="absolute h-8 bg-white opacity-70 w-full h-full p-4" 
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
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded outline-dashed outline-2 w-full">
            Delete
          </button>
        </svelte:fragment>
      </SidebarSection>
    {:else}
      <div class="pt-8">
        Select a component to edit its properties
      </div>
    {/if}
  </div>
</div>    