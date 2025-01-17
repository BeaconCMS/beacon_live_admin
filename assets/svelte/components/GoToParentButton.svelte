<script lang="ts">
  import { setSelection, selectedAstElementId } from "$lib/stores/page"
  import { getParentNodeId } from "$lib/utils/ast-helpers"

  function selectParentNode() {
    let parentId = getParentNodeId($selectedAstElementId)
    setSelection(parentId)
  }
</script>

<button type="button" class="absolute p-2 top-2 right-9 group" on:click={selectParentNode}>
  <span class="sr-only">Up one level</span>
  <span
    class="absolute opacity-0 invisible right-9 min-w-[100px] bg-amber-100 py-1 px-1.5 rounded text-xs text-medium transition group-hover:opacity-100 group-hover:visible"
    >Up one level</span
  >
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="w-6 h-6 hover:text-blue-700 active:text-blue-900"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12"
    />
  </svg>
</button>
