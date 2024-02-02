<script lang="ts">
	import { fade } from 'svelte/transition';
  import { translate } from '$lib/utils/animations';
  import { currentComponentCategory } from '$lib/stores/currentComponentCategory';
  import { draggedObject } from '$lib/stores/dragAndDrop';
  import type { ComponentCategory, ComponentDefinition, MenuCategory } from '$lib/types';
  export let components: ComponentDefinition[];

  let menuCategories: MenuCategory[] = [];
  $: menuCategories = [{
    name: 'Base',
    items: Array.from(new Set(componentDefinitions.map(d => d.category))).map(id => ({ id, name: id }))
  }];

  $: componentDefinitions = components;
	$: componentDefinitionsByCategory = (componentDefinitions || []).reduce((acc: { [key: string]: ComponentDefinition[] }, comp: ComponentDefinition) => {
      acc[comp.category] ||= [];
      acc[comp.category].push(comp);
      return acc;
    }, {});
  $: currentDefinitions = $currentComponentCategory ? componentDefinitionsByCategory[$currentComponentCategory.id] : [];

	const sectionTitles: Record<string, string> = {
		nav: 'Navs',
		header: 'Headers',
		sign_in: 'Sign ins',
		sign_up: 'Sign ups',
		stats: 'Stats',
		footer: 'Footers',
		basic: 'Basics',
		other: 'Other'
	}

  let showExamples = false;
  let hideComponentTimer;

	function collapseCategoryMenu() {
		hideComponentTimer = setTimeout(() => {
			showExamples = false;
    }, 400);
	}
	function abortCollapseCategoryMenu() {
		clearTimeout(hideComponentTimer);
	}	  

	function expandCategoryMenu(componentCategory: ComponentCategory) {
		if ($draggedObject) return;
		clearTimeout(hideComponentTimer);
		$currentComponentCategory = componentCategory;
		showExamples = true;
	}

	function dragStart(componentDefinition: ComponentDefinition, e: DragEvent) {
		setTimeout(() => {
			$draggedObject = componentDefinition
			showExamples = false;
		}, 100)
	}

	function dragEnd() {
		$draggedObject = null;
	}
</script>

<!-- Left sidebar -->
<div class="w-64 bg-white border-gray-100 border-solid border-r" id="left-sidebar" data-test-id="left-sidebar">
  <div class="sticky top-0">
    <div class="border-b border-gray-100 border-solid py-4 px-4" data-test-id="logo">
      <span class="text-lg">Components</span>
    </div>
    <ul class="px-4" data-test-id="component-tree">
      {#each menuCategories as category}
        <li class="pb-1" data-test-id="nav-item">
          <h5 class="uppercase">{category.name}</h5>
        </li>
        {#each category.items as item}
          <li class="pb-1" data-test-id="nav-item" on:mouseenter={() => expandCategoryMenu(item)} on:mouseleave={collapseCategoryMenu}>
            <div class="pl-2">{sectionTitles[item.name]}</div>	
          </li>
        {/each}
      {/each}
    </ul>
  </div>
</div>

{#if showExamples}
  <div class="bg-black/50 absolute inset-0 z-50" transition:fade={{duration: 300}} id="backdrop" data-test-id="backdrop"></div>
{/if}	
<div 
  class="absolute w-96 -left-32 bg-white inset-y-0 shadow-sm z-50 pt-3 pb-4 px-5 transition-transform duration-300" 
  class:translate-x-96={showExamples}
  id="component-previews"
  data-test-id="component-previews" 
  transition:translate={{x: 384}}
  on:mouseenter={abortCollapseCategoryMenu}
  on:mouseleave={collapseCategoryMenu}>
  <h4 class="text-2xl">{sectionTitles[$currentComponentCategory?.name]}</h4>
  <p>Select a component 👇  and drag it to the canvas 👉</p>
  {#if currentDefinitions}
    {#each currentDefinitions as example}
      <div 
        draggable
        on:dragstart={e => dragStart(example, e)}
        on:dragend={dragEnd}
        class="pt-6" 
        data-test-id="component-preview-card">
        <img class="rounded outline-offset-2 outline-blue-500 hover:outline hover:outline-2" src={example.thumbnail} alt={example.name} />
      </div>
    {/each}
  {/if}
</div>

<style>
	#left-sidebar {
		z-index: 1000;
	}
	#component-previews, #backdrop {
		z-index: 999;
	}
</style>