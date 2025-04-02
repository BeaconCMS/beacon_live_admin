import { pageAst, isAstElement, findAstElement } from "$lib/stores/page"
import { live as liveStore } from "$lib/stores/live"
import { get } from "svelte/store"
import type { AstNode, Page } from "$lib/types"
import { getParentNodeId } from "./ast-helpers"

export function updateNodeContent(node, text) {
  if (node && isAstElement(node)) {
    node.content = [text]
    updateAst()
  }
}

export function updateAst() {
  let ast: AstNode[] = get(pageAst)
  let live = get(liveStore)
  live.pushEventTo("#heex-visual-editor", "update_page_ast", { ast })
}

export function deleteAstNode(astElementId: string) {
  let ast: AstNode[] = get(pageAst)

  let astElement = findAstElement(ast, astElementId)
  let parentId = getParentNodeId(astElementId)
  let content = parentId && parentId !== "root" ? findAstElement(ast, parentId)?.content : ast
  if (content) {
    let targetIndex = (content as unknown[]).indexOf(astElement)
    content.splice(targetIndex, 1)
    updateAst()
  }
}
