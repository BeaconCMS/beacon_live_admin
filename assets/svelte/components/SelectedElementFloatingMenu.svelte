
<script lang="ts">
  import { selectedElementMenu } from "$lib/stores/page"
  import DragMenuOption from "./SelectedElementFloatingMenu/DragMenuOption.svelte"
</script>

{#if $selectedElementMenu}
  <DragMenuOption />
{/if}