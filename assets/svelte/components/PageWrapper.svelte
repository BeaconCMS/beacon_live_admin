<svelte:options customElement={{ tag: "page-wrapper", shadow: "open", customElement: true }} />

<script lang="ts">
  import LayoutAstNode from "./LayoutAstNode.svelte"
  import PageAstNode from "./PageAstNode.svelte"
  import { page } from "$lib/stores/page"
  import { pageBaselineCssPath as pageBaselineCssPathStore } from "$lib/stores/pageBaselineCssPath"
  import { pageChunksCssPath as pageChunksCssPathStore } from "$lib/stores/pageChunksCssPath"
  import { onMount } from "svelte"

  let wrapper: HTMLElement;
  onMount(() => {
    console.log(wrapper)
  })

  const reloadStylesheet = async () => {
    await import("https://unpkg.com/@mhsdesign/jit-browser-tailwindcss@0.4.0/dist/cdn.min.js")

    // TODO: fetch content from page nodes
    const content = `<div class="bg-red-500">el</div>`

    const css = await window.jitBrowserTailwindcss(
      `
      @tailwind components;
      @tailwind utilities;
      `,
      content,
    )

    // TODO: apply style to page
    console.log(css)
  }

  window.reloadStylesheet = reloadStylesheet
</script>

<div id="page-wrapper-content" bind:this={wrapper}>
  {#each $page.layout.ast as layoutAstNode}
    <LayoutAstNode node={layoutAstNode}>
      {#each $page.ast as astNode, index}
        <PageAstNode node={astNode} nodeId={String(index)} />
      {/each}
    </LayoutAstNode>
  {/each}
</div>

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
