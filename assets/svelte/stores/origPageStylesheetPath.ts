import { writable } from "svelte/store"
import type { Writable } from "svelte/store"

export const origPageStylesheetPath: Writable<string> = writable(null)
