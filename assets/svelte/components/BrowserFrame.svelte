<script lang="ts">
  import type { AstNode, PageInfo } from "$lib/types"

  export let pageInfo: PageInfo
  export let pageAst: AstNode[]

  function getPageName(pageInfo: PageInfo): string {
    return !pageInfo.path || pageInfo.path === "" ? "index" : pageInfo.path
  }
</script>

<div class="flex-1 flex flex-col" data-testid="fake-browser">
  <div class="bg-gray-50 border-b border-gray-200 border-solid rounded-t-xl h-12 px-3.5 flex" data-testid="address-bar">
    <div class="py-2">
      <span class="inline-block h-2 w-2 ml-2 rounded-full bg-red-800"></span>
      <span class="inline-block h-2 w-2 ml-2 rounded-full bg-amber-400"></span>
      <span class="inline-block h-2 w-2 ml-2 rounded-full bg-lime-600"></span>
    </div>
    <div class="flex-1 py-2.5 overflow-visible">
      <div class="rounded bg-gray-50 border-b border-gray-200 shadow max-w-xs mx-auto text-center py-0.5 relative">
        <span data-testid="url-box">{getPageName(pageInfo)}</span>
      </div>
    </div>
    <div class="py-3">
      <!-- D | T | P or some selector to choose desktop, tablet or phone viewport size-->
    </div>
  </div>
  <slot />
</div>
