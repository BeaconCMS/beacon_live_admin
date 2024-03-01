<svelte:options customElement={{ tag: "page-wrapper", shadow: "open", customElement: true }} />

<script lang="ts">
  import LayoutAstNode from "./LayoutAstNode.svelte"
  import PageAstNode from "./PageAstNode.svelte"
  import { selectedAstElementId } from "$lib/stores/page"
  import { page } from "$lib/stores/page"
  import { siteStylesheetPath as siteStylesheetPathStore } from "$lib/stores/siteStylesheetPath"
  import { pageStylesheetPath as pageStylesheetPathStore } from "$lib/stores/pageStylesheetPath"
  let siteStylesheetLink: HTMLLinkElement
  let pageStylesheetLink: HTMLLinkElement
  $: {
    if (siteStylesheetLink) {
      siteStylesheetLink.rel = "stylesheet"
      siteStylesheetLink.href = $siteStylesheetPathStore
    }

    if (pageStylesheetLink) {
      pageStylesheetLink.rel = "stylesheet"
      pageStylesheetLink.href = $pageStylesheetPathStore
    }
  }
</script>

<link id="site-stylesheet-target" bind:this={siteStylesheetLink} />
<link id="page-stylesheet-target" bind:this={pageStylesheetLink} />

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
</style>
