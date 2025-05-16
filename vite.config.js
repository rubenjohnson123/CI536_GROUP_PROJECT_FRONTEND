import { defineConfig } from 'vite'
import path from 'path'; 

export default defineConfig({
  build: {
    outDir: 'dist', // send build output to backend folder
    emptyOutDir: true,
    add_item: path.resolve(__dirname, 'src/add_item_page/add_item.html'),
    profi: path.resolve(__dirname, 'src/profi_page/prof.html'),
    messages: path.resolve(__dirname, 'src/messages_page/messages.html'),
    about: path.resolve(__dirname, 'src/about_page/about.html'),
    contact: path.resolve(__dirname, 'src/contact_page/contact.html'),
    help: path.resolve(__dirname, 'src/help_page/help.html'),
    item_details: path.resolve(__dirname, 'src/item_details_page/item_details.html'),
    login_page: path.resolve(__dirname, 'src/login_page/login.html'),
    TandC: path.resolve(__dirname, 'src/TandC_page/termsandconditions.html'),
  }
})
