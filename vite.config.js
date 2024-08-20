import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {}
    }),
  ],
  server: {
    port: 5173
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false, // Ensure source maps are not enabled
    manifest: true,
    outDir: 'dist',
    rollupOptions: {
      input: ['./index.html', './src/main.jsx'],
    },
  },
})