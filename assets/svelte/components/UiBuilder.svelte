<script lang="ts">
  import { onDestroy } from "svelte"
  import ComponentsSidebar from "./ComponentsSidebar.svelte"
  import Backdrop from "./Backdrop.svelte"
  import PagePreview from "./PagePreview.svelte"
  import PropertiesSidebar from "./PropertiesSidebar.svelte"
  import SelectedElementFloatingMenu from "./SelectedElementFloatingMenu.svelte"
  import { page as pageStore, resetStores } from "$lib/stores/page"
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

  onDestroy(() => {
    resetStores()
  })

  function addBasicComponentToTarget(e: CustomEvent) {
    // This method is in PagePreview.
  }
</script>

<div class="flex min-h-screen bg-gray-100" id="ui-builder-app-container" data-testid="app-container">
  <Backdrop />
  <!-- Left sidebar -->
  <ComponentsSidebar {components} />

  <!-- Main -->
  <PagePreview />

  <!-- Right sidebar -->  
  <!-- <PropertiesSidebar on:droppedIntoTarget={(e) => addBasicComponentToTarget(e.detail)} /> -->

  <SelectedElementFloatingMenu />
</div>
