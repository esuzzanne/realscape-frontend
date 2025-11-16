import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/add-xp': 'http://localhost:5000',
      '/update-name': 'http://localhost:5000',
      '/get-player': 'http://localhost:5000',
      '/log-quest': 'http://localhost:5000',
      '/get-quest-log': 'http://localhost:5000'
    }
  }
})