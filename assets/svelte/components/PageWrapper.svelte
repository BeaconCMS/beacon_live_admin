<svelte:options customElement={{ tag: 'page-wrapper', shadow: 'open', customElement: true }} />

<script lang="ts">
  import LayoutAstNode from './LayoutAstNode.svelte';
  import PageAstNode from './PageAstNode.svelte';
  import { selectedAstElementId } from "$lib/stores/page";
  import { page } from "$lib/stores/page";
  import { styles as stylesStore } from "$lib/stores/styles";
  let span: HTMLSpanElement;
  $: {
    if (span) {
      span.innerHTML = '';
      let styleEl = document.createElement('style');
      styleEl.innerHTML = $stylesStore;
      span.append(styleEl);
    }
  }
</script>

<span id="style-target" bind:this={span}></span>

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