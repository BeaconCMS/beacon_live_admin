<script lang="ts">
  import { fade } from "svelte/transition"
  import { translate } from "$lib/utils/animations"
  import { currentComponentCategory } from "$lib/stores/currentComponentCategory"
  import { draggedObject } from "$lib/stores/dragAndDrop"
  import type { ComponentCategory, ComponentDefinition, MenuCategory } from "$lib/types"
  export let components: ComponentDefinition[]

  let menuCategories: MenuCategory[] = []
  $: menuCategories = [
    {
      name: "Base",
      items: Array.from(new Set(componentDefinitions.map((d) => d.category))).map((id) => ({ id, name: id })),
    },
  ]

  $: componentDefinitions = components
  $: componentDefinitionsByCategory = (componentDefinitions || []).reduce(
    (acc: { [key: string]: ComponentDefinition[] }, comp: ComponentDefinition) => {
      acc[comp.category] ||= []
      acc[comp.category].push(comp)
      return acc
    },
    {},
  )
  $: currentDefinitions = $currentComponentCategory ? componentDefinitionsByCategory[$currentComponentCategory.id] : []

  const sectionTitles: Record<string, string> = {
    nav: "Navs",
    header: "Headers",
    sign_in: "Sign ins",
    sign_up: "Sign ups",
    stats: "Stats",
    footer: "Footers",
    basic: "Basics",
    other: "Other",
  }

  let showExamples = false
  let hideComponentTimer

  function collapseCategoryMenu() {
    hideComponentTimer = setTimeout(() => {
      showExamples = false
    }, 400)
  }
  function abortCollapseCategoryMenu() {
    clearTimeout(hideComponentTimer)
  }

  function expandCategoryMenu(componentCategory: ComponentCategory) {
    if ($draggedObject) return
    clearTimeout(hideComponentTimer)
    $currentComponentCategory = componentCategory
    showExamples = true
  }

  function dragStart(componentDefinition: ComponentDefinition, e: DragEvent) {
    setTimeout(() => {
      $draggedObject = componentDefinition
      showExamples = false
    }, 100)
  }

  function dragEnd() {
    $draggedObject = null
  }
</script>

<!-- Left sidebar -->
<div class="w-64 bg-white border-slate-100 border-solid border-r" id="left-sidebar" data-test-id="left-sidebar">
  <div class="sticky top-0">
    <div class="border-b border-slate-100 border-solid py-4 px-4" data-test-id="logo">
      <h2 class="text-lg font-bold">Components</h2>
    </div>
    <ul class="py-4 h-[calc(100vh_-_61px)] overflow-y-auto" data-test-id="component-tree">
      {#each menuCategories as category}
        {#if menuCategories.length > 1}
          <li class="mb-1 px-4" data-test-id="nav-item">
            <h3 class="text-xs font-bold uppercase">{category.name}</h3>
          </li>
        {/if}
        {#each category.items as item}
          <li
            class="p-2 pl-6 hover:bg-slate-50 hover:cursor-pointer"
            data-test-id="nav-item"
            on:mouseenter={() => expandCategoryMenu(item)}
            on:mouseleave={collapseCategoryMenu}
          >
            <div>{sectionTitles[item.name]}</div>
          </li>
        {/each}
      {/each}
    </ul>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="absolute w-96 left-0 bg-slate-50 inset-y-0 shadow-sm z-50 pt-3 pb-4 px-5 transition-transform duration-500 opacity-0 invisible overflow-y-auto min-h-screen"
      class:translate-x-[255px]={showExamples}
      class:!opacity-100={showExamples}
      class:!visible={showExamples}
      id="component-previews"
      data-test-id="component-previews"
      transition:translate={{ x: 384 }}
      on:mouseenter={abortCollapseCategoryMenu}
      on:mouseleave={collapseCategoryMenu}
    >
      <h4 class="mb-4 font-bold text-2xl">{sectionTitles[$currentComponentCategory?.name]}</h4>
      <p class="font-medium">Select a component 👇 and drag it to the canvas 👉</p>
      {#if currentDefinitions}
        {#each currentDefinitions as example}
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div
            draggable="true"
            on:dragstart={(e) => dragStart(example, e)}
            on:dragend={dragEnd}
            class="pt-6"
            data-test-id="component-preview-card"
          >
            <p class="mb-1 text-xs font-bold uppercase tracking-wider">{example.name}</p>
            <!-- TODO: replace image src with local placeholder image-->
            <img
              class="w-full h-auto rounded ring-offset-2 ring-blue-500 transition hover:cursor-grab hover:ring-2"
              src={example.thumbnail ? example.thumbnail : `https://placehold.co/400x75?text=${example.name}`}
              alt={example.name}
            />
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>

{#if showExamples}
  <div
    class="bg-black/50 absolute inset-0 z-50"
    transition:fade={{ duration: 300 }}
    id="backdrop"
    data-test-id="backdrop"
  ></div>
{/if}

<style>
  #left-sidebar {
    z-index: 1000;
  }
  #backdrop {
    z-index: 999;
  }
</style>
