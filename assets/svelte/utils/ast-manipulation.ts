import { pageInfo, pageAst, isAstElement, findAstElement } from "$lib/stores/page"
import { live as liveStore } from "$lib/stores/live"
import { get } from "svelte/store"
import type { AstNode, Page, PageInfo } from "$lib/types"
import { getParentNodeId } from "./ast-helpers"

export function updateNodeContent(path, node, text) {
  if (node && isAstElement(node)) {
    node.content = [text]
    updateNode(path, node)
  }
}

export function updateAst() {
  let info: PageInfo = get(pageInfo)
  let ast: AstNode[] = get(pageAst)
  let live = get(liveStore)
  live.pushEvent("update_page_ast", { id: info.id, ast })
}
export function updateNode(path, node) {
  let live = get(liveStore)
  let info: PageInfo = get(pageInfo)
  live.pushEvent("update_page_node", { id: info.id, node_id: path, node: node })
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
