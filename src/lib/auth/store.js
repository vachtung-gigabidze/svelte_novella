import { writable } from 'svelte/store'

export const user = writable(null)
export const session = writable(null)
export const authLoading = writable(true)
export const authError = writable('')