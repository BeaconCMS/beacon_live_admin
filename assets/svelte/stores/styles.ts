import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';


export const styles: Writable<string> = writable(null)
