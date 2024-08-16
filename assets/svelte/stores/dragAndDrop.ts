import { writable } from "svelte/store"
import type { Writable } from "svelte/store"
import type { ComponentDefinition } from "../types"

export const draggedObject: Writable<ComponentDefinition | null> = writable(null)
export type LocationInfo = {
  x: number
  y: number
  width: number
  height: number
  top: number
  right: number
  bottom: number
  left: number
  marginTop: number
  marginBottom: number
  marginLeft: number
  marginRight: number
}

interface DragInfo {
  parentElementClone: Element
  selectedIndex: number
  siblingLocationInfos: LocationInfo[]
}
export const dragElementInfo: Writable<DragInfo | null> = writable(null)
