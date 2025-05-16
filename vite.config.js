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
        about: path.resolve(__dirname, 'src/about_page/about.html'),
        contact: path.resolve(__dirname, 'src/contact_page/contact.html'),
        item_details: path.resolve(__dirname, 'src/item_details_page/item_detail.html'),
        TandC: path.resolve(__dirname, 'src/TandC/termsandconditions.html'),
        login: path.resolve(__dirname, 'src/login_page/login.html'),
      }
    }
  }
})
