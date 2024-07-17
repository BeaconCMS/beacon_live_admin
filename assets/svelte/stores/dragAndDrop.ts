import { writable } from "svelte/store"
import type { Writable } from "svelte/store"
import type { ComponentDefinition } from "../types"

export const draggedObject: Writable<ComponentDefinition | null> = writable(null)

interface DragInfo {
  parentElementClone: Element,
  selectedIndex: number
  siblingRects: DOMRect[]
}
export const dragElementInfo: Writable<DragInfo | null> = writable(null)
