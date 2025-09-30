import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './', // <-- THIS MAKES VITE USE RELATIVE PATHS
  assetsInclude: ['**/*.pdf'], // Include PDF files as assets
  optimizeDeps: {
    include: ['pdfjs-dist'] // Include pdfjs-dist in pre-bundling
  },
  worker: {
    format: 'es'
  }
})
