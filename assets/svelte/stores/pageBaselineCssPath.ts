import { writable } from "svelte/store"
import type { Writable } from "svelte/store"

export const pageBaselineCssPath: Writable<string> = writable(null)
