import { writable, derived, get } from "svelte/store"
import type { Writable, Readable } from "svelte/store"
import type { AstElement, AstNode, Page } from "$lib/types"
import type { CoordsDiff } from "$lib/utils/drag-helpers"

export const page: Writable<Page> = writable()
export const selectedAstElementId: Writable<string | undefined> = writable()
export const highlightedAstElement: Writable<AstElement | undefined> = writable()
export const slotTargetElement: Writable<AstElement | undefined> = writable()

export const rootAstElement: Readable<AstElement | undefined> = derived([page], ([$page]) => {
  // This is a virtual AstElement intended to simulate the page itself to reorder the components at the first level.
  if ($page) {
    return { tag: "root", attrs: {}, content: $page.ast }
  }
})
export const selectedAstElement: Readable<AstElement | undefined> = derived(
  [page, selectedAstElementId],
  ([$page, $selectedAstElementId]) => {
    if ($page && $selectedAstElementId) {
      if ($selectedAstElementId === "root") return get(rootAstElement)
      return findAstElement($page.ast, $selectedAstElementId)
    }
  },
)

export const parentOfSelectedAstElement: Readable<AstElement | undefined> = derived(
  [page, selectedAstElementId],
  ([$page, $selectedAstElementId]) => {
    if ($page && $selectedAstElementId) {
      if ($selectedAstElementId === "root") return null
      let levels = $selectedAstElementId.split(".")
      if (levels.length === 1) return get(rootAstElement)
      levels.pop()
      return findAstElement($page.ast, levels.join("."))
    }
  },
)

export const selectedDomElement: Writable<Element | null> = writable(null)
export interface SelectedElementMenu {
  top: number
  left: number
  dragging: boolean
  dragDirection: "horizontal" | "vertical"
  elementCoords: CoordsDiff
  insertBefore: number | null
  mouseMovement: CoordsDiff
}
export const selectedElementMenu: Writable<SelectedElementMenu | null> = writable(null)

export function setSelection(selectedId: string) {
  selectedAstElementId.update(() => selectedId)
}

export function setSelectedDom(selectedDom: Element) {
  selectedDomElement.update(() => selectedDom)
}

export function resetSelection() {
  selectedAstElementId.update(() => null)
  selectedDomElement.update(() => null)
  selectedElementMenu.update(() => null)
}

export function isAstElement(maybeNode: AstNode): maybeNode is AstElement {
  return typeof maybeNode !== "string"
}

export function findAstElement(ast: AstNode[], id: string): AstElement {
  let indexes = id.split(".").map((s) => parseInt(s, 10))
  let node: AstNode = ast[indexes[0]] as AstElement
  ast = node.content
  for (let i = 1; i < indexes.length; i++) {
    node = ast[indexes[i]] as AstElement
    ast = node.content
  }
  return node
}
export function findAstElementId(astNode: AstNode): string | undefined {
  let $page = get(page)
  return _findAstElementId($page.ast, astNode, "")
}

export function _findAstElementId(ast: AstNode[], astNode: AstNode, id: string): string | undefined {
  for (let i = 0; i < ast.length; i++) {
    let currentNode = ast[i]
    if (currentNode === astNode) {
      return id + i
    } else if (isAstElement(currentNode)) {
      let result = currentNode.content && _findAstElementId(currentNode.content, astNode, id + i + ".")
      if (result) {
        return result
      }
    }
  }
}

export function resetStores() {
  page.set(null)
  selectedAstElementId.set(null)
  highlightedAstElement.set(null)
  slotTargetElement.set(null)
  selectedDomElement.set(null)
  selectedElementMenu.set(null)
}