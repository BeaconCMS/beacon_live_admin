import { writable, derived, get } from "svelte/store"
import type { Writable, Readable } from "svelte/store"
import type { AstElement, AstNode, Page } from "$lib/types"
import { live } from "$lib/stores/live"

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
      const element = findAstElement($page.ast, $selectedAstElementId)
      get(live).pushEvent("select_element", { path: $selectedAstElementId })
      return element
    }
  },
)

function getParentId(id: string | null) {
  if (id === null || id === "root") return null
  let levels = id.split(".")
  if (levels.length === 1) return "root"
  levels.pop()
  return levels.join(".")
}

export const parentSelectedAstElementId: Readable<string> = derived(
  [selectedAstElementId],
  ([$selectedAstElementId]) => {
    return getParentId($selectedAstElementId)
  },
)

export const grandParentSelectedAstElementId: Readable<string> = derived(
  [parentSelectedAstElementId],
  ([$parentSelectedAstElementId]) => {
    return getParentId($parentSelectedAstElementId)
  },
)

export const parentOfSelectedAstElement: Readable<AstElement | undefined> = derived(
  [page, parentSelectedAstElementId],
  ([$page, $parentSelectedAstElementId]) => findAstElement($page.ast, $parentSelectedAstElementId),
)

export const grandParentOfSelectedAstElement: Readable<AstElement | undefined> = derived(
  [page, grandParentSelectedAstElementId],
  ([$page, $grandParentSelectedAstElementId]) => findAstElement($page.ast, $grandParentSelectedAstElementId),
)

export const selectedDomElement: Writable<Element | null> = writable(null)

export function setSelection(selectedId: string) {
  selectedAstElementId.update(() => selectedId)
}

export function setSelectedDom(selectedDom: Element) {
  selectedDomElement.update(() => selectedDom)
}

export function resetSelection() {
  selectedAstElementId.update(() => null)
  selectedDomElement.update(() => null)
}

export function isAstElement(maybeNode: AstNode): maybeNode is AstElement {
  return typeof maybeNode !== "string"
}

export function findAstElement(ast: AstNode[], id: string): AstElement {
  if (id === "root") return get(rootAstElement)
  if (!id) return null
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
}
