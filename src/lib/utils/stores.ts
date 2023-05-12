import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store'

export const user: Writable<Object | null> = writable(null);
