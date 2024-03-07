<script lang="ts">
  import ComponentsSidebar from "./ComponentsSidebar.svelte"
  import Backdrop from "./Backdrop.svelte"
  import PagePreview from "./PagePreview.svelte"
  import PropertiesSidebar from "./PropertiesSidebar.svelte"
  import { page as pageStore } from "$lib/stores/page"
  import { siteStylesheetPath as siteStylesheetPathStore } from "$lib/stores/siteStylesheetPath"
  import { origPageStylesheetPath as origPageStylesheetPathStore } from "$lib/stores/origPageStylesheetPath"
  import { pageStylesheetPath as pageStylesheetPathStore } from "$lib/stores/pageStylesheetPath"
  import { prevPageStylesheetPath as prevPageStylesheetPathStore } from "$lib/stores/prevPageStylesheetPath"
  import type { ComponentDefinition, Page } from "$lib/types"

  export let components: ComponentDefinition[]
  export let page: Page
  export let siteStylesheetPath: string
  export let origPageStylesheetPath: string
  export let pageStylesheetPath: string
  export let prevPageStylesheetPath: string
  export let live
  $: $pageStore = page
  $: $siteStylesheetPathStore = siteStylesheetPath
  $: $origPageStylesheetPathStore = origPageStylesheetPath
  $: $pageStylesheetPathStore = pageStylesheetPath
  $: $prevPageStylesheetPathStore = prevPageStylesheetPath

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
