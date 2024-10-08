<script context="module" lang="ts">
  function filterWhile<T>(array: T[], condition: (T) => boolean) {
    return array.filter((el, i) => !array.slice(0, i).some(condition))
  }
</script>

<script lang="ts">
  import { isAstElement } from "$lib/stores/page"
  import type { AstNode } from "$lib/types"
  export let nodes: AstNode[]
  type LayoutArea = "preamble" | "epilogue"

  export let currentArea: LayoutArea

  $: preambleNodes = filterWhile(nodes, function (node: AstNode) {
    if (isAstElement(node)) {
      return node.tag !== "eex" || node.content.length !== 1 || node.content[0] !== "@inner_content"
    }
  })

  $: epilogueNodes = nodes.slice(preambleNodes.length + 1, nodes.length)

  function handleDragDrop(e: Event, zone?: LayoutArea) {
    e.dataTransfer.layoutZone = currentArea || zone
  }
</script>

<div class="contents" on:drop={(e) => handleDragDrop(e, "preamble")}>
  {#each preambleNodes as node}
    {#if isAstElement(node)}
      {#if node.tag === "html_comment"}
        {@html "<!--" + node.content + "-->"}
      {:else if node.tag === "eex_comment"}
        {@html "<!--" + node.content + "-->"}
      {:else if node.rendered_html}
        {@html node.rendered_html}
      {:else if node.attrs?.selfClose}
        <svelte:element this={node.tag} {...node.attrs} />
      {:else}
        <svelte:element this={node.tag} {...node.attrs}>
          {#if node.content}
            <svelte:self nodes={node.content} currentArea={currentArea || "preamble"} />
          {/if}
        </svelte:element>
      {/if}
    {:else}
      {node}
    {/if}
  {/each}
</div>
<slot />
<div class="contents" on:drop={(e) => handleDragDrop(e, "epilogue")}>
  {#each epilogueNodes as node}
    {#if isAstElement(node)}
      {#if node.tag === "html_comment"}
        {@html "<!--" + node.content + "-->"}
      {:else if node.tag === "eex_comment"}
        {@html "<!--" + node.content + "-->"}
      {:else if node.rendered_html}
        {@html node.rendered_html}
      {:else if node.attrs?.selfClose}
        <svelte:element this={node.tag} {...node.attrs} />
      {:else}
        <svelte:element this={node.tag} {...node.attrs}>
          {#if node.content}
            <svelte:self nodes={node.content} currentArea={currentArea || "epilogue"} />
          {/if}
        </svelte:element>
      {/if}
    {:else}
      {node}
    {/if}
  {/each}
</div>
