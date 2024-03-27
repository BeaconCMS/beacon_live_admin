<script lang="ts" context="module">
  import { writable, type Writable } from "svelte/store"
  import { fade } from "svelte/transition"

  export const backdropVisible: Writable<boolean> = writable(false)
</script>

{#if $backdropVisible}
  <div class="bg-black/50 absolute inset-0 z-30" transition:fade data-test-id="backdrop"></div>
{/if}
