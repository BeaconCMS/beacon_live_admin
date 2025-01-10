<script lang="ts">
  import { onDestroy } from "svelte"
  import ComponentsSidebar from "./ComponentsSidebar.svelte"
  import Backdrop from "./Backdrop.svelte"
  import PagePreview from "./PagePreview.svelte"
  import SelectedElementFloatingMenu from "./SelectedElementFloatingMenu.svelte"
  import { pageAst as pageAstStore, pageInfo as pageInfoStore, resetStores } from "$lib/stores/page"
  import { live as liveStore } from "$lib/stores/live"
  import { tailwindConfig as tailwindConfigStore } from "$lib/stores/tailwindConfig"
  import { tailwindInput as tailwindInputStore } from "$lib/stores/tailwindInput"
  import type { AstNode, ComponentDefinition, PageInfo } from "$lib/types"

  export let components: ComponentDefinition[]
  export let pageInfo: PageInfo
  export let pageAst: AstNode[]
  export let tailwindConfig: string
  export let tailwindInput: string
  export let live

  $: $pageAstStore = pageAst
  $: $pageInfoStore = pageInfo
  $: $tailwindConfigStore = tailwindConfig
  $: $tailwindInputStore = tailwindInput
  $: $liveStore = live

  onDestroy(() => {
    resetStores()
  })
</script>

<div class="flex min-h-screen bg-gray-100" id="ui-builder-app-container" data-testid="app-container">
  <Backdrop />
  <!-- Left sidebar -->
  <ComponentsSidebar {components} />

  <!-- Main -->
  <PagePreview />

  <SelectedElementFloatingMenu />
</div>
