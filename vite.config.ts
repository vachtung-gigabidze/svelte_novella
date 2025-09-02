import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from "@tailwindcss/vite";


// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),svelte()],
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
