import { page, isAstElement } from "$lib/stores/page"
import { live as liveStore } from "$lib/stores/live"
import { get } from "svelte/store";
import type { Page } from "$lib/types";

export function updateNodeContent(node, text) {
  let currentPage: Page = get(page);
  let live = get(liveStore);
  if (node && isAstElement(node)) {
    node.content = [text];
    live.pushEvent("update_page_ast", { id: currentPage.id, ast: currentPage.ast })
  }
}