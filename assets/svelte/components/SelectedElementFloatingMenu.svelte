<script lang="ts">
  import { selectedAstElement } from "$lib/stores/page"
  import DragMenuOption from "./SelectedElementFloatingMenu/DragMenuOption.svelte"
</script>

{#if $selectedAstElement}
  <DragMenuOption />
{/if}
