<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
</script>

<span class="rounded-full bg-gray-700 text-white text-xs inline-block px-3 py-2 m-1 leading-4">
  <slot></slot>
  <button 
    class="rounded-full inline-block bg-gray-700 text-white ml-2" 
    type="button"
    on:click|preventDefault={() => dispatch('delete')}>✕</button>
</span>