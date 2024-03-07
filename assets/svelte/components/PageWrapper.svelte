<svelte:options customElement={{ tag: "page-wrapper", shadow: "open", customElement: true }} />

<script lang="ts">
  import LayoutAstNode from "./LayoutAstNode.svelte"
  import PageAstNode from "./PageAstNode.svelte"
  import { page } from "$lib/stores/page"
  import { origPageStylesheetPath as origPageStylesheetPathStore } from "$lib/stores/origPageStylesheetPath"
  import { prevPageStylesheetPath as prevPageStylesheetPathStore } from "$lib/stores/prevPageStylesheetPath"
  import { pageStylesheetPath as pageStylesheetPathStore } from "$lib/stores/pageStylesheetPath"
</script>

<link id="orig-page-stylesheet-target" rel="stylesheet" href={$origPageStylesheetPathStore} />
<link id="prev-page-stylesheet-target" rel="stylesheet" href={$prevPageStylesheetPathStore} />
<link id="page-stylesheet-target" rel="stylesheet" href={$pageStylesheetPathStore} />

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
