import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist', // send build output to backend folder
    emptyOutDir: true,
  }
})
