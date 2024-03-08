<svelte:options customElement={{ tag: "page-wrapper", shadow: "open", customElement: true }} />

<script lang="ts">
  import LayoutAstNode from "./LayoutAstNode.svelte"
  import PageAstNode from "./PageAstNode.svelte"
  import { page } from "$lib/stores/page"
  import { pageBaselineCssPath as pageBaselineCssPathStore } from "$lib/stores/pageBaselineCssPath"
  import { pageChunksCssPath as pageChunksCssPathStore } from "$lib/stores/pageChunksCssPath"
</script>

<link id="page-baseline-css-target" rel="stylesheet" href={$pageBaselineCssPathStore} />
<link id="page-chunks-css-target" rel="stylesheet" href={$pageChunksCssPathStore} />

{#each $page.layout.ast as layoutAstNode}
  <LayoutAstNode node={layoutAstNode}>
    {#each $page.ast as astNode, index}
      <PageAstNode node={astNode} nodeId={String(index)} />
    {/each}
  </LayoutAstNode>
{/each}

<style>
  :global([data-selected="true"], [data-highlighted="true"]) {
    outline-color: #06b6d4;
    outline-width: 2px;
    outline-style: dashed;
  }

  :global(:before, :after) {
    pointer-events: none;
  }
</style>
