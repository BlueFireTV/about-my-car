import { defineConfig } from 'vite'
import dotenv from 'dotenv'
import react from '@vitejs/plugin-react'

dotenv.config()

const backendUrl = process.env.AMC_BACKEND_URL != undefined ? process.env.AMC_BACKEND_URL : 'http://localhost:3133' // Default to local backend

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': backendUrl,
    },
  },
  esbuild: {
    loader: 'tsx',
    include: /\.(tsx|ts)$/,
  },
})
