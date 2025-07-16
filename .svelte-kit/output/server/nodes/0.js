

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.k3p63bf_.js","_app/immutable/chunks/NZTpNUN0.js","_app/immutable/chunks/C9XM0pXT.js"];
export const stylesheets = [];
export const fonts = [];
