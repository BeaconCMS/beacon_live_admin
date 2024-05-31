<script lang="ts">
  import Pill from "$lib/components/Pill.svelte"
  import SidebarSection from "$lib/components/SidebarSection.svelte"
  import { createEventDispatcher } from "svelte"
  import { draggedObject } from "$lib/stores/dragAndDrop"
  import { live } from "$lib/stores/live"
  import { updateNodeContent } from "$lib/utils/ast-manipulation"
  import { page, selectedAstElement, selectedAstElementId, findAstElement, isAstElement } from "$lib/stores/page"
  import type { AstNode } from "$lib/types"

  const dispatch = createEventDispatcher()

  let classList: string[]
  $: {
    let classAttr = $selectedAstElement?.attrs?.class
    classList = classAttr ? classAttr.split(" ").filter((e) => e.trim().length > 0) : []
  }
  $: editableAttrs = Object.entries($selectedAstElement?.attrs || {}).filter(
    ([k, _]) => k !== "class" && k !== "self_close" && !/data-/.test(k),
  )
  $: sidebarTitle = $selectedAstElement?.tag
  $: isRootNode = !!$selectedAstElementId && $selectedAstElementId === "root"
  $: attributesEditable = !["eex", "eex_block"].includes($selectedAstElement?.tag)

  async function addClasses({ detail: newClasses }: CustomEvent<string>) {
    let node = $selectedAstElement
    if (node) {
      let classes = newClasses.split(" ").map((c) => c.trim())
      // $live.pushEvent("classes_added", { id: $page.id, classes })
      node.attrs.class = node.attrs.class ? `${node.attrs.class} ${classes.join(" ")}` : classes.join(" ")
      $live.pushEvent("update_page_ast", { id: $page.id, ast: $page.ast })
    }
  }

  function parentNodeId() {
    if ($selectedAstElementId) {
      let parts = $selectedAstElementId.split(".")
      if (parts.length === 1) return "root"
      return parts.slice(0, -1).join(".")
    }
  }
  function selectParentNode() {
    let parentId = parentNodeId()
    if (parentId) {
      $selectedAstElementId = parentId
    }
  }

  async function deleteClass(className: string) {
    let node = $selectedAstElement
    if (node) {
      let newClass = node.attrs.class
        .split(" ")
        .filter((c) => c !== className)
        .join(" ")
      node.attrs.class = newClass
      $live.pushEvent("update_page_ast", { id: $page.id, ast: $page.ast })
    }
  }

  async function updateText(e: CustomEvent<string>) {
    updateNodeContent($selectedAstElement, e.detail)
  }

  async function updateArg(e: CustomEvent<string>) {
    let node = $selectedAstElement
    if (node && isAstElement(node)) {
      node.arg = e.detail
      $live.pushEvent("update_page_ast", { id: $page.id, ast: $page.ast })
    }
  }

  async function updateAttribute(attrName: string, e: CustomEvent<string>) {
    let node = $selectedAstElement
    if (node && isAstElement(node)) {
      node.attrs[attrName] = e.detail
      $live.pushEvent("update_page_ast", { id: $page.id, ast: $page.ast })
    }
  }

  async function deleteComponent() {
    let node = $selectedAstElement
    if (!node) return
    if (confirm("Are you sure you want to delete this component?")) {
      let parentId = parentNodeId()
      let content = parentId && parentId !== "root" ? findAstElement($page.ast, parentId)?.content : $page.ast
      if (content) {
        let targetIndex = (content as unknown[]).indexOf(node)
        content.splice(targetIndex, 1)
        $selectedAstElementId = undefined
        $live.pushEvent("update_page_ast", { id: $page.id, ast: $page.ast })
      }
    }
  }

  function dropInside() {
    dispatch("droppedIntoTarget", $selectedAstElement)
  }

  let isDraggingOver = false
  function dragOver(e: DragEvent) {
    e.preventDefault()
    isDraggingOver = true
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "move"
    }
  }

  async function changeNodes({ detail: nodes }: CustomEvent<AstNode[]>) {
    if ($selectedAstElementId === "root") {
      let selectedElement = $page
      selectedElement.ast = nodes
    } else {
      let selectedElement = $selectedAstElement
      if (!selectedElement) return
      selectedElement.content = nodes
    }
    $live.pushEvent("update_page_ast", { id: $page.id, ast: $page.ast })
  }
</script>

<div class="w-64 bg-white" data-test-id="right-sidebar">
  <div class="sticky top-0 overflow-y-auto h-screen">
    {#if $selectedAstElement}
      <div class="border-b text-lg font-medium leading-5 p-4 relative">
        {sidebarTitle}
        {#if !isRootNode}
          <button type="button" class="absolute p-2 top-2 right-9 group" on:click={selectParentNode}>
            <span class="sr-only">Up one level</span>
            <span
              class="absolute opacity-0 invisible right-9 min-w-[100px] bg-amber-100 py-1 px-1.5 rounded text-xs text-medium transition group-hover:opacity-100 group-hover:visible"
              >Up one level</span
            >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 hover:text-blue-700 active:text-blue-900"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12"
              />
            </svg>
          </button>
        {/if}
        <button type="button" class="absolute p-2 top-2 right-1" on:click={() => ($selectedAstElementId = undefined)}>
          <span class="sr-only">Close</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-6 h-6 hover:text-blue-700 active:text-blue-900"
          >
            <path
              fill-rule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
      {#if attributesEditable}
        <SidebarSection clearOnUpdate={true} on:update={addClasses} placeholder="Add new class">
          <svelte:fragment slot="heading">Classes</svelte:fragment>
          <svelte:fragment slot="value">
            {#each classList as className}
              <Pill on:delete={() => deleteClass(className)}>{className}</Pill>
            {/each}
          </svelte:fragment>
        </SidebarSection>
        {#each editableAttrs as entry (entry)}
          {@const [name, value] = entry}
          <SidebarSection
            clearOnUpdate={true}
            {value}
            on:textChange={(e) => updateAttribute(name, e)}
            placeholder="Set {name}"
          >
            <svelte:fragment slot="heading">{name}</svelte:fragment>
          </SidebarSection>
        {/each}
      {/if}
      {#if $selectedAstElement.tag === "eex_block"}
        <SidebarSection on:update={updateArg} value={$selectedAstElement.arg} large={true}>
          <svelte:fragment slot="heading">Block argument</svelte:fragment>
          <svelte:fragment slot="input"></svelte:fragment>
        </SidebarSection>
        <SidebarSection>
          <svelte:fragment slot="heading">Block content</svelte:fragment>
          <svelte:fragment slot="input">
            <p>The content of eex blocks can't be edited from the visual editor yet. Please use the code editor.</p>
          </svelte:fragment>
        </SidebarSection>
      {/if}

      <div class="relative">
        {#if $draggedObject && $draggedObject.category === "basic"}
          <div
            class="absolute bg-white opacity-70 w-full h-full p-4"
            class:opacity-90={isDraggingOver}
            role="list"
            on:drop|preventDefault={dropInside}
            on:dragover={dragOver}
            on:dragleave={() => (isDraggingOver = false)}
          >
            <div class="flex rounded-lg outline-dashed outline-2 h-full text-center justify-center items-center">
              Drop components here
            </div>
          </div>
        {/if}
        {#if $selectedAstElement.content?.length > 0}
          <SidebarSection
            astNodes={$selectedAstElement.content}
            large={true}
            on:textChange={(e) => updateText(e)}
            on:nodesChange={changeNodes}
          >
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
            class="bg-red-500 hover:bg-red-700 active:bg-red-800 text-white font-bold py-2 px-4 rounded outline-2 w-full"
          >
            Delete <span class="sr-only">current {sidebarTitle} element</span>
          </button>
        </svelte:fragment>
      </SidebarSection>
    {:else}
      <div class="p-4 pt-8 font-medium text-lg text-center">Select a component to edit its properties</div>
    {/if}
  </div>
</div>
