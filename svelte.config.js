import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
// import adapter from '@sveltejs/adapter-static';

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  // kit: {
  //   adapter: adapter({
  //     fallback: 'index.html' // may differ from host to host
  //   })
  // },
}
