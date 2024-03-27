import { writable } from "svelte/store"
import type { Writable } from "svelte/store"
import type { ComponentCategory } from "../types"

export const currentComponentCategory: Writable<ComponentCategory | null> = writable(null)
