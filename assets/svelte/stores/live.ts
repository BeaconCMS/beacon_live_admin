import { writable } from "svelte/store"
import type { Writable } from "svelte/store"

export const live: Writable<any> = writable()
