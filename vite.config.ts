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
  },
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  },
  optimizeDeps: {
    exclude: ['rive-js'] // Исключаем из предварительного бандлинга
  }

})
