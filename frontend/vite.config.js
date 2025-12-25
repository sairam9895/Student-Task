import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Default backend port now aligned with Express server (defaults to 5001)
const apiTarget = process.env.VITE_API_URL || 'http://localhost:5001';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
      }
    }
  }
})
