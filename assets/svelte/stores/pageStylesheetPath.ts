import { writable } from "svelte/store"
import type { Writable } from "svelte/store"

export const pageStylesheetPath: Writable<string> = writable(null)
