<script lang="ts">
  import { isAstElement } from '$lib/stores/page';
  import type { AstNode } from '$lib/types';
  export let node: AstNode;
</script>

{#if isAstElement(node)}
  {#if node.tag === 'html_comment'}
    {@html "<!--" + node.content + "-->"}
  {:else if node.tag === 'eex_comment'}
    {@html "<!--" + node.content + "-->"}
  {:else if node.tag === 'eex' && node.content[0] === '@inner_content'}
    <slot/>
  {:else if node.rendered_html}
    {@html node.rendered_html}
  {:else if node.attrs.selfClose}
    <svelte:element this={node.tag} {...node.attrs}/>
  {:else}
    <svelte:element this={node.tag} {...node.attrs}>
      {#each node.content as subnode, index}
        <svelte:self node={subnode}/>
      {/each}
    </svelte:element>
  {/if}
{:else}
  {node}
{/if}
