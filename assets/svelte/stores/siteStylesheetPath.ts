import { writable } from "svelte/store"
import type { Writable } from "svelte/store"

export const siteStylesheetPath: Writable<string> = writable(null)
