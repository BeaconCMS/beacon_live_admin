<svelte:options customElement={{ tag: "page-wrapper", shadow: "open", customElement: true }} />

<script lang="ts">
  import LayoutAstNode from "./LayoutAstNode.svelte"
  import PageAstNode from "./PageAstNode.svelte"
  import { page } from "$lib/stores/page"
  import { tailwindConfig } from "$lib/stores/tailwindConfig"
  import { tailwindInput } from "$lib/stores/tailwindInput"
  import { onMount, tick } from "svelte"

  const tailwindJitPromise = import("https://unpkg.com/@mhsdesign/jit-browser-tailwindcss@0.4.0/dist/cdn.min.js")

  let wrapper: HTMLElement
  let styleWrapper: HTMLElement
  let twConfig = $tailwindConfig
  let b64moduleData = "data:text/javascript;base64," + btoa(twConfig.replace("module.exports = ", "export default "))
  let configPromise = import(b64moduleData)
  onMount(async () => {
    const [_, { default: tailwindConfig }] = await Promise.all([tailwindJitPromise, configPromise])

    const tailwind = window.createTailwindcss({
      tailwindConfig,
    })

    const reloadStylesheet = async () => {
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
</script>

<span bind:this={styleWrapper}></span>
<div bind:this={wrapper}>
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
