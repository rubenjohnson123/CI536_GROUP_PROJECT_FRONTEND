import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: './src',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/index.html'),
        help: path.resolve(__dirname, 'src/help_page/help.html'),
        add_item: path.resolve(__dirname, 'src/add_item_page/add_item.html'),
        profi: path.resolve(__dirname, 'src/profi_page/prof.html'),
        messages: path.resolve(__dirname, 'src/messages_page/messages.html'),
        // Add other HTML pages similarly here
      }
    }
  }
})
