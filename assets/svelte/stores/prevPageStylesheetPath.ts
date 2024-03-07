import { writable } from "svelte/store"
import type { Writable } from "svelte/store"

export const prevPageStylesheetPath: Writable<string> = writable(null)
