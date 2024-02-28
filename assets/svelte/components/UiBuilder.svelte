<script lang="ts">
  import ComponentsSidebar from "./ComponentsSidebar.svelte"
  import Backdrop from "./Backdrop.svelte"
  import PagePreview from "./PagePreview.svelte"
  import PropertiesSidebar from "./PropertiesSidebar.svelte"
  import { page as pageStore } from "$lib/stores/page"
  import { pageStylesheet as pageStylesheetStore } from "$lib/stores/pageStylesheet"
  import { siteStylesheet as siteStylesheetStore } from "$lib/stores/siteStylesheet"
  import type { ComponentDefinition, Page } from "$lib/types"

  export let components: ComponentDefinition[]
  export let page: Page
  export let pageStylesheet: string
  export let siteStylesheet: string
  export let live
  $: $pageStore = page
  $: $pageStylesheetStore = pageStylesheet
  $: $siteStylesheetStore = siteStylesheet

  function addBasicComponentToTarget(e: CustomEvent) {
    // This method is in PagePreview.
  }
</script>

<Backdrop />
<div class="flex min-h-screen bg-gray-100" data-test-id="app-container">
  <!-- Left sidebar -->
  <ComponentsSidebar {components} />

  <!-- Main -->
  <PagePreview {live} />

  <!-- Right sidebar -->
  <PropertiesSidebar {live} on:droppedIntoTarget={(e) => addBasicComponentToTarget(e.detail)} />
</div>
