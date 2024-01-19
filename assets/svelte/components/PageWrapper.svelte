<svelte:options customElement={{ tag: 'page-wrapper', shadow: 'open', customElement: true }} />

<script lang="ts">
  import LayoutAstNode from './LayoutAstNode.svelte';
  import PageAstNode from './PageAstNode.svelte';
  import { selectedAstElementId } from "$lib/stores/page";
  import { page } from "$lib/stores/page";
</script>


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