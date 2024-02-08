import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export const siteStylesheet: Writable<string> = writable(null)
