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
  let b64moduleData = "data:text/javascript;base64," + btoa(twConfig.replace("module.exports = ", "export default "))
  let configPromise = import(b64moduleData)
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
  page.subscribe(async ({ ast }) => {
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
  :global([data-selected="true"], [data-highlighted="true"]) {
    outline-color: #06b6d4;
    outline-width: 2px;
    outline-style: dashed;
  }

  :global(:before, :after) {
    pointer-events: none;
  }
</style>
