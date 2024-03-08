import { writable } from "svelte/store"
import type { Writable } from "svelte/store"

export const pageChunksCssPath: Writable<string> = writable(null)
