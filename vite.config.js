import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: '../backend/dist', // send build output to backend folder
    emptyOutDir: true,
  }
})
