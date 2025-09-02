import { readable, writable } from 'svelte/store'

export const currentDialogueIndex = writable(0)
export const dialogues = writable([])
export const isLoading = writable(true)
export const error = writable('')
export const defaultAssetsUrl = '/assets/';
// export const defaultAssetsUrl = '/svelte_novella/assets/';
