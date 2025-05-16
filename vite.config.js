import { defineConfig } from 'vite'
import path from 'path'; 

export default defineConfig({
  build: {
    outDir: 'dist', // send build output to backend folder
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
