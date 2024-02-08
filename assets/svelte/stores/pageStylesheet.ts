import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export const pageStylesheet: Writable<string> = writable(null)
