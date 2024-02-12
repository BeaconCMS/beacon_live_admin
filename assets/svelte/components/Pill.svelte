<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
</script>

<div class="inline-flex items-center rounded-full bg-slate-700 text-white text-xs px-3 pr-0 m-1 leading-4">
  <slot></slot>
  <button 
    class="p-2 rounded-full inline-block bg-slate-700 text-white hover:text-blue-400 active:text-blue-500" 
    type="button"
    on:click|preventDefault={() => dispatch('delete')}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3">
        <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
      </svg>
    </button>
</div>