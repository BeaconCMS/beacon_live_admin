<script lang="ts">
  import type { Page } from "$lib/types"

  export let page: Page

  function getPageName(page: Page): string {
    return !page.path || page.path === "" ? "index" : page.path
  }
</script>

<div class="flex-1 flex flex-col" data-test-id="fake-browser">
  <div
    class="bg-gray-50 border-b border-gray-200 border-solid rounded-t-xl h-12 px-3.5 flex"
    data-test-id="address-bar"
  >
    <div class="py-2">
      <span class="inline-block h-2 w-2 ml-2 rounded-full bg-red-800"></span>
      <span class="inline-block h-2 w-2 ml-2 rounded-full bg-amber-400"></span>
      <span class="inline-block h-2 w-2 ml-2 rounded-full bg-lime-600"></span>
    </div>
    <div class="flex-1 py-2.5 overflow-visible">
      <div class="rounded bg-gray-50 border-b border-gray-200 shadow max-w-xs mx-auto text-center py-0.5 relative">
        <span data-test-id="url-box">{getPageName(page)}</span>
      </div>
    </div>
    <div class="py-3">
      <!-- D | T | P or some selector to choose desktop, tablet or phone viewport size-->
    </div>
  </div>
  <slot />
</div>
