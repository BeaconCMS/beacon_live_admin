<script lang="ts">
  import ComponentsSidebar from "./ComponentsSidebar.svelte"
  import Backdrop from "./Backdrop.svelte"
  import PagePreview from "./PagePreview.svelte"
  import PropertiesSidebar from "./PropertiesSidebar.svelte"
  import { page as pageStore } from "$lib/stores/page"
  import { live as liveStore } from "$lib/stores/live"
  import { tailwindConfig as tailwindConfigStore } from "$lib/stores/tailwindConfig"
  import { tailwindInput as tailwindInputStore } from "$lib/stores/tailwindInput"
  import type { ComponentDefinition, Page } from "$lib/types"

  export let components: ComponentDefinition[]
  export let page: Page
  export let tailwindConfig: string
  export let tailwindInput: string
  export let live
  $: $pageStore = page
  $: $tailwindConfigStore = tailwindConfig
  $: $tailwindInputStore = tailwindInput
  $: $liveStore = live

  function addBasicComponentToTarget(e: CustomEvent) {
    // This method is in PagePreview.
  }
</script>

<Backdrop />
<div class="flex min-h-screen bg-gray-100" data-test-id="app-container">
  <!-- Left sidebar -->
  <ComponentsSidebar {components} />

  <!-- Main -->
  <PagePreview />

  <!-- Right sidebar -->
  <PropertiesSidebar on:droppedIntoTarget={(e) => addBasicComponentToTarget(e.detail)} />
</div>
