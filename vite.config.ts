import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'


// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: './',
  resolve: {
    alias: {
      $lib: '/src/lib'
    }
  }  ,
  server: {
    port: 5173,
    host: true
  }
  // ,

  // optimizeDeps: {
  //   exclude: ['@rive-app/canvas'] // Исключаем из предварительного бандлинга
  // }

})
