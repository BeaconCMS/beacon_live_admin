<svelte:options customElement={{ tag: 'page-wrapper', shadow: 'open', customElement: true }} />

<script lang="ts">
  import LayoutAstNode from './LayoutAstNode.svelte';
  import PageAstNode from './PageAstNode.svelte';
  import { selectedAstElementId } from "$lib/stores/page";
  import { page } from "$lib/stores/page";
  import { pageStylesheet as pageStylesheetStore } from "$lib/stores/pageStylesheet";
  import { siteStylesheet as siteStylesheetStore } from "$lib/stores/siteStylesheet";
  let spanSiteStylesheet: HTMLSpanElement;
  let spanPageStylesheet: HTMLSpanElement;
  $: {
    if (spanSiteStylesheet) {
      spanSiteStylesheet.innerHTML = '';
      let styleEl = document.createElement('style');
      styleEl.innerHTML = $siteStylesheetStore;
      spanSiteStylesheet.append(styleEl);
    }

    if (spanPageStylesheet) {
      spanPageStylesheet.innerHTML = '';
      let styleEl = document.createElement('style');
      styleEl.innerHTML = $pageStylesheetStore;
      spanPageStylesheet.append(styleEl);
    }
  }
</script>

<span id="site-stylesheet-target" bind:this={spanSiteStylesheet}></span>
<span id="page-stylesheet-target" bind:this={spanPageStylesheet}></span>

{#each $page.layout.ast as layoutAstNode}
  <LayoutAstNode node={layoutAstNode}>
    {#each $page.ast as astNode, index}
      <PageAstNode node={astNode} nodeId={String(index)}/>
    {/each}
  </LayoutAstNode>
{/each}

<style>
    :global([data-selected="true"], [data-highlighted="true"]) {
      outline-color: #06b6d4;
      outline-width: 2px;
      outline-style: dashed;
    }
</style>
