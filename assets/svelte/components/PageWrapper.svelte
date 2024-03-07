<svelte:options customElement={{ tag: "page-wrapper", shadow: "open", customElement: true }} />

<script lang="ts">
  import LayoutAstNode from "./LayoutAstNode.svelte"
  import PageAstNode from "./PageAstNode.svelte"
  import { page } from "$lib/stores/page"
  import { siteStylesheetPath as siteStylesheetPathStore } from "$lib/stores/siteStylesheetPath"
  import { origPageStylesheetPath as origPageStylesheetPathStore } from "$lib/stores/origPageStylesheetPath"
  import { pageStylesheetPath as pageStylesheetPathStore } from "$lib/stores/pageStylesheetPath"
  import { prevPageStylesheetPath as prevPageStylesheetPathStore } from "$lib/stores/prevPageStylesheetPath"
</script>

<link id="site-stylesheet-target" rel="stylesheet" href={$siteStylesheetPathStore} />
<link id="orig-page-stylesheet-target" rel="stylesheet" href={$origPageStylesheetPathStore} />
<link id="page-stylesheet-target" rel="stylesheet" href={$pageStylesheetPathStore} />
<link id="prev-page-stylesheet-target" rel="stylesheet" href={$prevPageStylesheetPathStore} />

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
