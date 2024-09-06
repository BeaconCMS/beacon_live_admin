<svelte:options customElement={{ tag: "page-wrapper", shadow: "open", customElement: true }} />

<script lang="ts">
  import LayoutAstNode from "./LayoutAstNode.svelte"
  import PageAstNode from "./PageAstNode.svelte"
  import { page } from "$lib/stores/page"
  import { tailwindConfig } from "$lib/stores/tailwindConfig"
  import { tailwindInput } from "$lib/stores/tailwindInput"
  import { createTailwindcss } from "@mhsdesign/jit-browser-tailwindcss"
  import { onMount, tick } from "svelte"

  let wrapper: HTMLElement
  let styleWrapper: HTMLElement
  let twConfig = $tailwindConfig
  let configPromise = import(twConfig)
  onMount(async () => {
    const { default: tailwindConfig } = await configPromise
    const tailwind = createTailwindcss({ tailwindConfig })

    const reloadStylesheet = async () => {
      if (!wrapper) return
      const content = wrapper.outerHTML
      const css = await tailwind.generateStylesFromContent($tailwindInput, [content])
      let styleEl = document.createElement("style")
      styleEl.textContent = css
      styleWrapper.appendChild(styleEl)
    }

    window.reloadStylesheet = reloadStylesheet
    reloadStylesheet()
  })
  page.subscribe(async () => {
    await tick()
    window.reloadStylesheet && window.reloadStylesheet()
  })

  function preventLinkNavigation(event: MouseEvent) {
    if (event.target instanceof HTMLAnchorElement) {
      event.preventDefault()
    }
  }
</script>

<span bind:this={styleWrapper}></span>
<div bind:this={wrapper} on:click={preventLinkNavigation}>
  {#each $page.layout.ast as layoutAstNode}
    <LayoutAstNode node={layoutAstNode}>
      {#each $page.ast as astNode, index}
        <PageAstNode node={astNode} nodeId={String(index)} />
      {/each}
    </LayoutAstNode>
  {/each}
</div>

<style>
  :global([data-selected="true"]) {
    outline-color: #06b6d4;
    outline-width: 1px;
    outline-style: solid;
  }
  /* TODO: Apply this styles to [data-selected-parent="true"] once dragging of the parent element is allowed */
  :global([data-highlighted="true"]) {
    outline-color: #06b6d4;
    outline-width: 2px;
    outline-style: dashed;
  }

  :global(:before, :after) {
    pointer-events: none;
  }
</style>
