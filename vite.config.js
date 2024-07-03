import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr' 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({ 
      svgrOptions: {}
    }),
  ],
  resolve: {
  },
  build: {
    sourcemap: true, // Ensure source maps are enabled
    manifest: true,
    outDir: 'dist',
    rollupOptions: {
      input: ['./index.html'],
    },
  },
})