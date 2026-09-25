import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   proxy: {
  //     // Все запросы, начинающиеся с /api, будут перенаправляться на GREEN-API
  //     '/api': {
  //       target: 'https://3100.api.green-api.com', // Базовый URL GREEN-API
  //       changeOrigin: true,
  //       secure: false,
  //       rewrite: (path) => path.replace(/^\/api/, ''), // Убираем /api из пути
  //     },
  //   },
  // },
})
