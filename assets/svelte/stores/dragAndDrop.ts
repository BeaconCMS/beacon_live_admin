import { writable } from "svelte/store"
import type { Writable } from "svelte/store"
import type { ComponentDefinition } from "../types"

// The component definition (AKA, generic component from the list of available pre-defined component) 
// being dragged into the page
export const draggedComponentDefinition: Writable<ComponentDefinition | null> = writable(null)

export const resetDrag: () => void = () => {
  draggedComponentDefinition.update(() => null)
}
